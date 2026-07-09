"""Multi-Object Tracking — ByteTrack (asosiy) / DeepSORT (muqobil) +
Kalman silliqlash, traektoriya, tezlik, yo'nalish, dwell time.

ByteTrack tanlandi: yengil, ID-switch kam, appearance modelisiz ham barqaror —
offline Hikvision yozuvlari uchun eng amaliy standart.
"""
import math
from collections import deque

import numpy as np
import supervision as sv


class TrackState:
    """Bitta obyekt (ID) uchun holat: traektoriya, tezlik, vaqt."""

    def __init__(self, tid, trail_len, fps):
        self.id = tid
        self.fps = max(fps, 1e-3)
        self.traj = deque(maxlen=trail_len)          # (cx, cy) piksel
        self.world = deque(maxlen=trail_len)         # (X, Y) metr (BEV bo'lsa)
        self.times = deque(maxlen=trail_len)         # t (soniya)
        self.cls = "object"
        self.conf = 0.0
        self.first_t = None
        self.last_t = None
        self.last_frame = -1
        self.zones = set()                           # kirgan zonalar
        self.kf = None

    def _init_kf(self, cx, cy):
        try:
            from filterpy.kalman import KalmanFilter
        except Exception:
            self.kf = False
            return
        dt = 1.0 / self.fps
        kf = KalmanFilter(dim_x=4, dim_z=2)
        kf.F = np.array([[1, 0, dt, 0], [0, 1, 0, dt], [0, 0, 1, 0], [0, 0, 0, 1]], dtype=float)
        kf.H = np.array([[1, 0, 0, 0], [0, 1, 0, 0]], dtype=float)
        kf.P *= 500.0
        kf.R *= 5.0
        kf.Q *= 0.05
        kf.x = np.array([cx, cy, 0, 0], dtype=float)
        self.kf = kf

    def update(self, cx, cy, t, cls, conf, frame_idx):
        if self.kf is None:
            self._init_kf(cx, cy)
        if self.kf:
            self.kf.predict()
            self.kf.update(np.array([cx, cy], dtype=float))
            cx, cy = float(self.kf.x[0]), float(self.kf.x[1])
        self.traj.append((cx, cy))
        self.times.append(t)
        self.cls = cls
        self.conf = conf
        if self.first_t is None:
            self.first_t = t
        self.last_t = t
        self.last_frame = frame_idx

    def set_world(self, X, Y):
        self.world.append((X, Y))

    def center(self):
        return self.traj[-1] if self.traj else (0, 0)

    def speed_px(self):
        if len(self.traj) < 2:
            return 0.0
        (x0, y0), (x1, y1) = self.traj[-2], self.traj[-1]
        dt = (self.times[-1] - self.times[-2]) or (1.0 / self.fps)
        return math.hypot(x1 - x0, y1 - y0) / max(dt, 1e-6)

    def speed_mps(self):
        if len(self.world) < 2:
            return None
        (X0, Y0), (X1, Y1) = self.world[-2], self.world[-1]
        dt = (self.times[-1] - self.times[-2]) or (1.0 / self.fps)
        return math.hypot(X1 - X0, Y1 - Y0) / max(dt, 1e-6)

    def direction_deg(self):
        if len(self.traj) < 2:
            return None
        (x0, y0), (x1, y1) = self.traj[-2], self.traj[-1]
        if abs(x1 - x0) < 0.5 and abs(y1 - y0) < 0.5:
            return None
        return (math.degrees(math.atan2(y1 - y0, x1 - x0)) + 360) % 360

    def dwell(self):
        if self.first_t is None:
            return 0.0
        return (self.last_t or self.first_t) - self.first_t


class TrackStore:
    def __init__(self, cfg, fps):
        self.trail = cfg["tracker"]["trail_len"]
        self.fps = fps
        self.states = {}

    def get(self, tid):
        if tid not in self.states:
            self.states[tid] = TrackState(tid, self.trail, self.fps)
        return self.states[tid]

    def update(self, tid, cx, cy, t, cls, conf, frame_idx):
        st = self.get(tid)
        st.update(cx, cy, t, cls, conf, frame_idx)
        return st


class Tracker:
    """ByteTrack / DeepSORT ustidan yagona interfeys."""

    def __init__(self, cfg, log):
        self.type = cfg["tracker"]["type"].lower()
        self.log = log
        b = cfg["tracker"]
        self.impl = None
        if self.type == "deepsort":
            try:
                from deep_sort_realtime.deepsort_tracker import DeepSort
                self.impl = DeepSort(max_age=b["track_buffer"], embedder="mobilenet")
                self._kind = "deepsort"
                log.info("Tracker: DeepSORT")
                return
            except Exception as e:
                log.warning("DeepSORT o'rnatilmagan (%s) — ByteTrack ishlatiladi", e)
        # ByteTrack (asosiy)
        try:
            self.impl = sv.ByteTrack(track_activation_threshold=0.25,
                                     lost_track_buffer=b["track_buffer"],
                                     minimum_matching_threshold=b["match_thresh"])
        except TypeError:
            # supervision eski versiyasi uchun
            self.impl = sv.ByteTrack()
        self._kind = "bytetrack"
        log.info("Tracker: ByteTrack")

    def update(self, det, frame):
        """(det, frame) -> [(track_id, xyxy(np4), class_name, conf), ...]."""
        if self._kind == "deepsort":
            return self._update_deepsort(det, frame)
        tracked = self.impl.update_with_detections(det)
        out = []
        names = tracked.data.get("class_name", None)
        for i in range(len(tracked)):
            tid = int(tracked.tracker_id[i])
            cls = str(names[i]) if names is not None else "object"
            conf = float(tracked.confidence[i]) if tracked.confidence is not None else 0.0
            out.append((tid, tracked.xyxy[i], cls, conf))
        return out

    def _update_deepsort(self, det, frame):
        raw = []
        names = det.data.get("class_name", None)
        for i in range(len(det)):
            x1, y1, x2, y2 = det.xyxy[i]
            conf = float(det.confidence[i]) if det.confidence is not None else 0.5
            cls = str(names[i]) if names is not None else "object"
            raw.append(([float(x1), float(y1), float(x2 - x1), float(y2 - y1)], conf, cls))
        tracks = self.impl.update_tracks(raw, frame=frame)
        out = []
        for t in tracks:
            if not t.is_confirmed():
                continue
            l, tp, r, b = t.to_ltrb()
            out.append((int(t.track_id), np.array([l, tp, r, b], dtype=float),
                        t.get_det_class() or "object", float(t.get_det_conf() or 0.0)))
        return out
