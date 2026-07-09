"""Hodisa/alert qoidalari — zona kirishi, chiziq kesish, loitering, tezlik chegarasi."""
import cv2
import numpy as np


def _side(p, a, b):
    """p nuqta (a-b) chizig'ining qaysi tomonida ekani (ishorasi)."""
    return (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])


class EventEngine:
    def __init__(self, cfg):
        e = cfg["events"]
        self.zones = []
        for z in e["zones"]:
            self.zones.append({
                "name": z["name"],
                "poly": np.array(z["polygon"], dtype=np.int32),
                "classes": set(z.get("classes", [])),
            })
        self.lines = []
        for ln in e["lines"]:
            self.lines.append({"name": ln["name"], "p1": tuple(ln["p1"]), "p2": tuple(ln["p2"]),
                               "in": 0, "out": 0})
        self.loiter = e["loitering"]
        self.speed = e["speed_limit"]
        self._line_side = {}   # (track_id, line_name) -> oldingi tomon ishorasi

    def update(self, states):
        """Har kadr: (alerts:set, events:list, line_counts:dict) qaytaradi."""
        alerts = set()
        records = []
        for st in states.values():
            cx, cy = st.center()
            foot = (cx, cy)
            # Zona kirishi
            for z in self.zones:
                if z["classes"] and st.cls not in z["classes"]:
                    continue
                inside = cv2.pointPolygonTest(z["poly"], foot, False) >= 0
                if inside:
                    if z["name"] not in st.zones:
                        st.zones.add(z["name"])
                        records.append({"type": "zone_enter", "zone": z["name"], "id": st.id, "cls": st.cls})
                    alerts.add(st.id)
                    # Loitering
                    if self.loiter["enabled"] and (self.loiter["zone"] in (None, z["name"])):
                        if st.dwell() >= self.loiter["seconds"]:
                            records.append({"type": "loitering", "zone": z["name"], "id": st.id,
                                            "dwell": round(st.dwell(), 1)})
            # Chiziq kesish
            if len(st.traj) >= 2:
                prev = st.traj[-2]
                for ln in self.lines:
                    s_prev = _side(prev, ln["p1"], ln["p2"])
                    s_cur = _side(foot, ln["p1"], ln["p2"])
                    key = (st.id, ln["name"])
                    if s_prev == 0:
                        s_prev = self._line_side.get(key, s_cur)
                    if s_prev * s_cur < 0:  # tomon o'zgardi -> kesib o'tdi
                        if s_cur > 0:
                            ln["in"] += 1
                            direction = "in"
                        else:
                            ln["out"] += 1
                            direction = "out"
                        records.append({"type": "line_cross", "line": ln["name"],
                                        "id": st.id, "dir": direction})
                    self._line_side[key] = s_cur
            # Tezlik chegarasi
            if self.speed["enabled"]:
                v = st.speed_mps()
                if v is not None and v > self.speed["max_mps"]:
                    alerts.add(st.id)
                    records.append({"type": "speeding", "id": st.id, "speed": round(v, 2)})
        counts = {ln["name"]: {"in": ln["in"], "out": ln["out"]} for ln in self.lines}
        return alerts, records, counts
