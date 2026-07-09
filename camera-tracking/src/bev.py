"""Bird's Eye View — 4 nuqtali gomografiya orqali tepadan ko'rinish.

Foydalanuvchi config'da videodagi 4 ta yer nuqtasini (piksel) va ularning real
koordinatalarini (metr) beradi. Shu asosda obyekt oyoq nuqtasi metrga o'giriladi.
"""
import cv2
import numpy as np

from .utils import class_color, is_vehicle


class BEV:
    def __init__(self, cfg):
        c = cfg["calibration"]
        self.enabled = c["enabled"] and len(c["image_points"]) == 4 and len(c["world_points"]) == 4
        self.colors = cfg["visualize"]["colors"]
        self.mpp = c["meters_per_px"]
        self.rings = c["rings"]
        self.h, self.w = c["bev_size"]
        self.H = None
        if not self.enabled:
            return
        img_pts = np.array(c["image_points"], dtype=np.float32)
        world_pts = np.array(c["world_points"], dtype=np.float32)
        self.H, _ = cv2.findHomography(img_pts, world_pts)
        # Dunyoni BEV kanvasiga joylash uchun offset (metr chegaralaridan)
        xs, ys = world_pts[:, 0], world_pts[:, 1]
        self.ox = -xs.min() + 1.0
        self.oy = -ys.min() + 1.0

    def world_point(self, px, py):
        """Rasm pikselini (oyoq nuqtasi) real metr koordinataga o'giradi."""
        if not self.enabled:
            return None
        pt = np.array([[[px, py]]], dtype=np.float32)
        w = cv2.perspectiveTransform(pt, self.H)[0][0]
        return float(w[0]), float(w[1])

    def _to_px(self, X, Y):
        px = int((X + self.ox) / self.mpp)
        py = self.h - int((Y + self.oy) / self.mpp)
        return px, py

    def render(self, states, alerts):
        """BEV panelni chizadi (states: {id: TrackState})."""
        canvas = np.full((self.h, self.w, 3), 24, dtype=np.uint8)
        if not self.enabled:
            cv2.putText(canvas, "BEV: kalibratsiya yo'q", (16, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (150, 150, 150), 1)
            return canvas
        # Grid
        step = int(5 / self.mpp)
        for x in range(0, self.w, step):
            cv2.line(canvas, (x, 0), (x, self.h), (40, 40, 40), 1)
        for y in range(0, self.h, step):
            cv2.line(canvas, (0, y), (self.w, y), (40, 40, 40), 1)
        # Masofa halqalari (origin = (0,0) metr)
        ox, oy = self._to_px(0, 0)
        for r in self.rings:
            cv2.circle(canvas, (ox, oy), int(r / self.mpp), (70, 70, 70), 1)
            cv2.putText(canvas, "%dm" % r, (ox + int(r / self.mpp) - 20, oy - 4),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (110, 110, 110), 1)
        # Obyektlar
        for st in states.values():
            if not st.world:
                continue
            X, Y = st.world[-1]
            px, py = self._to_px(X, Y)
            if not (0 <= px < self.w and 0 <= py < self.h):
                continue
            col = class_color(st.cls, self.colors, alert=(st.id in alerts))
            # traektoriya
            pts = [self._to_px(x, y) for (x, y) in st.world]
            for i in range(1, len(pts)):
                cv2.line(canvas, pts[i - 1], pts[i], col, 1)
            r = 7 if is_vehicle(st.cls) else 5
            cv2.circle(canvas, (px, py), r, col, -1)
            # tezlik strelkasi
            spd = st.speed_mps()
            d = st.direction_deg()
            if spd and d is not None:
                import math
                ex = px + int(math.cos(math.radians(d)) * 18)
                ey = py + int(math.sin(math.radians(d)) * 18)
                cv2.arrowedLine(canvas, (px, py), (ex, ey), col, 2, tipLength=0.4)
            cv2.putText(canvas, "#%d" % st.id, (px + 8, py - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.4, (230, 230, 230), 1)
        return canvas

    def telemetry_line(self, st):
        """Pastki telemetriya qatori uchun matn."""
        if st is None or not st.world:
            return ""
        X, Y = st.world[-1]
        spd = st.speed_mps() or 0.0
        d = st.direction_deg() or 0.0
        return "ID:%d  x=%.1fm y=%.1fm  yaw=%.0f  v=%.1fm/s" % (st.id, X, Y, d, spd)
