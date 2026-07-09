"""Chiqish: annotatsiyalangan video, JSON/MOT log, CSV xulosa, HTML hisobot."""
import csv
import json
import math
import os

import cv2

from .utils import is_vehicle


class OutputManager:
    def __init__(self, cfg, out_dir, stem, fps, frame_size):
        self.cfg = cfg["output"]
        self.out_dir = out_dir
        self.stem = stem
        self.fps = fps
        os.makedirs(out_dir, exist_ok=True)
        self.writer = None
        if self.cfg["video"]:
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            path = os.path.join(out_dir, stem + "_annotated.mp4")
            self.writer = cv2.VideoWriter(path, fourcc, fps, frame_size)
        self.json_records = []
        self.mot_lines = []
        self.summaries = {}   # track_id -> xulosa
        self.alerts = []      # hodisa yozuvlari

    def write_frame(self, frame):
        if self.writer is not None:
            self.writer.write(frame)

    def log(self, frame_idx, timestamp, tracked, store, records):
        frame_tracks = []
        for tid, xyxy, cls, conf in tracked:
            st = store.states.get(tid)
            x1, y1, x2, y2 = [float(v) for v in xyxy]
            w, h = x2 - x1, y2 - y1
            spd = st.speed_mps() if st else None
            world = list(st.world[-1]) if (st and st.world) else None
            rec = {"frame": frame_idx, "timestamp": timestamp, "track_id": tid, "class": cls,
                   "bbox": [round(x1, 1), round(y1, 1), round(w, 1), round(h, 1)],
                   "conf": round(conf, 3),
                   "speed": round(spd, 3) if spd is not None else None,
                   "world_xy": [round(world[0], 2), round(world[1], 2)] if world else None}
            frame_tracks.append(rec)
            self.mot_lines.append("%d,%d,%.1f,%.1f,%.1f,%.1f,%.3f,-1,-1,-1" %
                                  (frame_idx, tid, x1, y1, w, h, conf))
            self._update_summary(tid, cls, timestamp, frame_idx, st, spd)
        if frame_tracks:
            self.json_records.append({"frame": frame_idx, "timestamp": timestamp, "tracks": frame_tracks})
        for r in records:
            r2 = dict(r)
            r2["frame"] = frame_idx
            r2["timestamp"] = timestamp
            self.alerts.append(r2)

    def _update_summary(self, tid, cls, t, frame_idx, st, spd):
        s = self.summaries.get(tid)
        if s is None:
            s = {"class": cls, "first": t, "first_frame": frame_idx, "last": t, "last_frame": frame_idx,
                 "speeds": [], "dist_px": 0.0, "dist_m": 0.0, "zones": set()}
            self.summaries[tid] = s
        s["last"] = t
        s["last_frame"] = frame_idx
        s["class"] = cls
        if spd is not None:
            s["speeds"].append(spd)
        if st and len(st.traj) >= 2:
            (x0, y0), (x1, y1) = st.traj[-2], st.traj[-1]
            s["dist_px"] += math.hypot(x1 - x0, y1 - y0)
        if st and len(st.world) >= 2:
            (X0, Y0), (X1, Y1) = st.world[-2], st.world[-1]
            s["dist_m"] += math.hypot(X1 - X0, Y1 - Y0)
        if st:
            s["zones"] = set(st.zones)

    def finalize(self, line_counts):
        if self.writer is not None:
            self.writer.release()
        if self.cfg["json"]:
            with open(os.path.join(self.out_dir, self.stem + "_log.json"), "w", encoding="utf-8") as f:
                json.dump(self.json_records, f, ensure_ascii=False)
            with open(os.path.join(self.out_dir, self.stem + "_mot.txt"), "w") as f:
                f.write("\n".join(self.mot_lines))
        if self.cfg["csv"]:
            self._write_csv()
        if self.cfg["html"]:
            self._write_html(line_counts)
        return self._stats()

    def _write_csv(self):
        path = os.path.join(self.out_dir, self.stem + "_tracks.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["track_id", "class", "first_time", "last_time", "duration_s",
                        "avg_speed_mps", "distance_m", "distance_px", "zones"])
            for tid, s in sorted(self.summaries.items()):
                dur = round(s["last"] - s["first"], 2)
                avg = round(sum(s["speeds"]) / len(s["speeds"]), 2) if s["speeds"] else ""
                w.writerow([tid, s["class"], round(s["first"], 2), round(s["last"], 2), dur,
                            avg, round(s["dist_m"], 2), round(s["dist_px"], 1), "|".join(sorted(s["zones"]))])

    def _stats(self):
        persons = sum(1 for s in self.summaries.values() if not is_vehicle(s["class"]))
        vehicles = sum(1 for s in self.summaries.values() if is_vehicle(s["class"]))
        return {"total": len(self.summaries), "persons": persons, "vehicles": vehicles,
                "alerts": len(self.alerts)}

    def _write_html(self, line_counts):
        st = self._stats()
        rows = ""
        for tid, s in sorted(self.summaries.items()):
            dur = round(s["last"] - s["first"], 1)
            avg = round(sum(s["speeds"]) / len(s["speeds"]), 2) if s["speeds"] else "-"
            rows += "<tr><td>%d</td><td>%s</td><td>%.1fs</td><td>%s</td><td>%.1f m</td><td>%s</td></tr>" % (
                tid, s["class"], dur, avg, s["dist_m"], "|".join(sorted(s["zones"])) or "-")
        alerts = "".join("<li>[%s] %s — ID %s</li>" % (a.get("timestamp", ""), a["type"], a.get("id", "-"))
                         for a in self.alerts[:200])
        lc = "".join("<li>%s: IN %d / OUT %d</li>" % (k, v["in"], v["out"]) for k, v in line_counts.items())
        html = """<!doctype html><html lang="uz"><meta charset="utf-8">
<title>Tracking hisoboti — %s</title>
<style>body{font-family:system-ui;margin:24px;color:#111}h1{font-size:20px}
.k{display:inline-block;margin:6px 18px 6px 0}.k b{font-size:24px;display:block}
table{border-collapse:collapse;margin-top:12px;width:100%%}td,th{border:1px solid #ddd;padding:6px 10px;font-size:13px;text-align:left}
th{background:#f4f4f5}</style>
<h1>Motion Tracking hisoboti — %s</h1>
<div><span class="k"><b>%d</b>Jami obyekt</span><span class="k"><b>%d</b>Odam</span>
<span class="k"><b>%d</b>Transport</span><span class="k"><b>%d</b>Alert</span></div>
<h3>Chiziq hisoblagichlari</h3><ul>%s</ul>
<h3>Alertlar</h3><ul>%s</ul>
<h3>Tracklar</h3><table><tr><th>ID</th><th>Klass</th><th>Davomiylik</th><th>O'rtacha v (m/s)</th><th>Masofa</th><th>Zonalar</th></tr>%s</table>
</html>""" % (self.stem, self.stem, st["total"], st["persons"], st["vehicles"], st["alerts"],
              lc or "<li>—</li>", alerts or "<li>—</li>", rows)
        with open(os.path.join(self.out_dir, self.stem + "_report.html"), "w", encoding="utf-8") as f:
            f.write(html)
