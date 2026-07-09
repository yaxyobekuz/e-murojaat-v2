"""Vizualizatsiya — yuqori panel (kamera) + pastki panel (BEV)."""
import math

import cv2
import numpy as np

from .utils import class_color, is_vehicle

FONT = cv2.FONT_HERSHEY_SIMPLEX


class Visualizer:
    def __init__(self, cfg):
        v = cfg["visualize"]
        self.colors = v["colors"]
        self.hud_on = v["hud"]
        self.box3d = v["box3d"]
        self.bev_on = v["bev_panel"]

    def _label(self, tid, cls, conf, st):
        spd = st.speed_mps()
        spd_txt = ("%.1fm/s" % spd) if spd is not None else ("%.0fpx/s" % st.speed_px())
        return "ID:%d %s %d%% %s" % (tid, cls, int(conf * 100), spd_txt)

    def _draw_box3d(self, img, x1, y1, x2, y2, col):
        # Soddalashtirilgan extruded kub (chuqurlik illyuziyasi)
        dx, dy = int((x2 - x1) * 0.18), int((y2 - y1) * 0.12)
        p = [(x1, y1), (x2, y1), (x2, y2), (x1, y2)]
        q = [(x + dx, y - dy) for (x, y) in p]
        cv2.polylines(img, [np.array(q, np.int32)], True, col, 1)
        for a, b in zip(p, q):
            cv2.line(img, a, b, col, 1)

    def draw_frame(self, frame, tracked, store, alerts, engine, hud):
        img = frame.copy()
        # Zonalar
        for z in engine.zones:
            cv2.polylines(img, [z["poly"]], True, (0, 200, 255), 2)
            cv2.putText(img, z["name"], tuple(z["poly"][0]), FONT, 0.6, (0, 200, 255), 2)
        # Chiziqlar + hisoblagich
        for ln in engine.lines:
            cv2.line(img, ln["p1"], ln["p2"], (255, 255, 255), 2)
            cv2.putText(img, "%s  IN:%d OUT:%d" % (ln["name"], ln["in"], ln["out"]),
                        (ln["p1"][0], ln["p1"][1] - 8), FONT, 0.55, (255, 255, 255), 2)

        for tid, xyxy, cls, conf in tracked:
            st = store.states.get(tid)
            if st is None:
                continue
            x1, y1, x2, y2 = [int(v) for v in xyxy]
            alert = tid in alerts
            col = class_color(cls, self.colors, alert=alert)
            cv2.rectangle(img, (x1, y1), (x2, y2), col, 2)
            if self.box3d:
                self._draw_box3d(img, x1, y1, x2, y2, col)
            # Yorliq foni
            label = self._label(tid, cls, conf, st)
            (tw, th), _ = cv2.getTextSize(label, FONT, 0.5, 1)
            cv2.rectangle(img, (x1, y1 - th - 8), (x1 + tw + 6, y1), col, -1)
            cv2.putText(img, label, (x1 + 3, y1 - 5), FONT, 0.5, (0, 0, 0), 1)
            # Traektoriya izi (so'nib boruvchi)
            pts = list(st.traj)
            for i in range(1, len(pts)):
                a = (int(pts[i - 1][0]), int(pts[i - 1][1]))
                b = (int(pts[i][0]), int(pts[i][1]))
                thick = max(1, int(3 * i / len(pts)))
                cv2.line(img, a, b, col, thick)
            # Tezlik vektori (strelka)
            d = st.direction_deg()
            if d is not None:
                cx, cy = st.center()
                L = min(60, 12 + st.speed_px() * 0.15)
                ex = int(cx + math.cos(math.radians(d)) * L)
                ey = int(cy + math.sin(math.radians(d)) * L)
                cv2.arrowedLine(img, (int(cx), int(cy)), (ex, ey), col, 2, tipLength=0.35)

        if self.hud_on:
            self._draw_hud(img, hud, len(tracked))
        return img

    def _draw_hud(self, img, hud, active):
        lines = [
            "Kadr: %d" % hud.get("frame", 0),
            "Vaqt: %s" % hud.get("timestamp", "--:--:--"),
            "FPS: %.1f" % hud.get("fps", 0.0),
            "Faol tracklar: %d" % active,
        ]
        x, y = 12, 26
        cv2.rectangle(img, (6, 6), (250, 6 + 22 * len(lines) + 6), (0, 0, 0), -1)
        for i, t in enumerate(lines):
            cv2.putText(img, t, (x, y + i * 22), FONT, 0.6, (0, 255, 200), 1)

    def compose(self, cam_img, bev_img, telemetry):
        """Yuqori (kamera) + pastki (BEV) panellarni birlashtiradi."""
        if not self.bev_on or bev_img is None:
            return cam_img
        H, W = cam_img.shape[:2]
        panel_h = min(bev_img.shape[0] + 40, H // 2)
        strip = np.full((panel_h, W, 3), 18, dtype=np.uint8)
        # BEV ni markazga joylash
        bh, bw = bev_img.shape[:2]
        scale = min((panel_h - 36) / bh, (W * 0.5) / bw, 1.5)
        nb = cv2.resize(bev_img, (int(bw * scale), int(bh * scale)))
        oy = 4
        ox = 20
        strip[oy:oy + nb.shape[0], ox:ox + nb.shape[1]] = nb
        cv2.putText(strip, "BEV — tepadan ko'rinish", (ox, panel_h - 12), FONT, 0.5, (150, 150, 150), 1)
        if telemetry:
            cv2.putText(strip, telemetry, (ox + nb.shape[1] + 30, 40), FONT, 0.6, (0, 255, 200), 1)
        return np.vstack([cam_img, strip])
