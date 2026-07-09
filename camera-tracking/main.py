"""Hikvision yozuvlari uchun Motion Tracking tizimi — asosiy ishga tushirish fayli.

Ishlatish:
  python main.py --source video.mp4 --config config.yaml
  python main.py --source papka/ --config config.yaml          # batch
  python main.py --source "rtsp://user:pass@IP:554/Streaming/Channels/101"
  python main.py --search odam.jpg --config config.yaml        # galereyadan qidirish
"""
import argparse
import glob
import os
import subprocess
import tempfile
import time

import cv2
from tqdm import tqdm

from src.config import load_config
from src.utils import setup_logging, select_device, auto_model_for_device, is_vehicle
from src.detector import Detector
from src.motion import MotionGate
from src.tracker import Tracker, TrackStore
from src.reid import ReID
from src.bev import BEV
from src.events import EventEngine
from src.visualizer import Visualizer
from src.outputs import OutputManager

VIDEO_EXT = (".mp4", ".avi", ".mov", ".mkv", ".dav")


def ts_str(frame_idx, fps):
    s = frame_idx / max(fps, 1e-6)
    h = int(s // 3600); m = int((s % 3600) // 60); sec = s % 60
    return "%02d:%02d:%06.3f" % (h, m, sec)


def convert_dav(path, log):
    """.dav -> .mp4 (ffmpeg)."""
    out = os.path.join(tempfile.gettempdir(), os.path.splitext(os.path.basename(path))[0] + ".mp4")
    log.info("DAV konvertatsiya: %s -> %s", path, out)
    try:
        subprocess.run(["ffmpeg", "-y", "-i", path, "-c", "copy", out],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return out
    except Exception as e:
        log.error("ffmpeg xato (%s) — bu faylni o'tkazib yuboraman", e)
        return None


def collect_sources(source, batch):
    if source.lower().startswith("rtsp://"):
        return [source]
    if os.path.isdir(source) or batch:
        files = []
        base = source if os.path.isdir(source) else os.path.dirname(source) or "."
        for e in VIDEO_EXT:
            files += glob.glob(os.path.join(base, "*" + e))
        return sorted(files)
    return [source]


def build_pipeline(cfg, device, log):
    return {
        "detector": Detector(cfg, device, log),
        "motion": MotionGate(cfg),
        "tracker": Tracker(cfg, log),
        "reid": ReID(cfg, device, log),
        "bev": BEV(cfg),
        "events": EventEngine(cfg),
        "viz": Visualizer(cfg),
    }


def process_video(path, cfg, pipe, log):
    is_rtsp = path.lower().startswith("rtsp://")
    if path.lower().endswith(".dav"):
        path = convert_dav(path, log)
        if path is None:
            return
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        log.error("Video ochilmadi: %s", path)
        return
    src_fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    fps = cfg["output"]["fps"] or src_fps
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) if not is_rtsp else 0
    stem = "live" if is_rtsp else os.path.splitext(os.path.basename(path))[0]
    log.info("Video: %s | %.1f FPS | %d kadr", stem, fps, total)

    # Har video uchun yangi tracker/store (ID lar aralashmasin)
    tracker = Tracker(cfg, log)
    store = TrackStore(cfg, fps)
    detector, motion, reid = pipe["detector"], pipe["motion"], pipe["reid"]
    bev, events, viz = pipe["bev"], pipe["events"], pipe["viz"]
    out = None

    reid_map = {}
    counts = {}
    frame_idx = 0
    t_prev = time.time()
    proc_fps = 0.0
    pbar = tqdm(total=total or None, desc=stem, unit="f")
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        moving, _ = motion.has_motion(frame)
        det = detector.detect(frame) if moving else _empty_like(detector)
        tracked = tracker.update(det, frame)

        view = []
        active = {}
        t = frame_idx / max(fps, 1e-6)
        for tid, xyxy, cls, conf in tracked:
            x1, y1, x2, y2 = [float(v) for v in xyxy]
            cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
            disp = tid
            if reid.enabled and not is_vehicle(cls):
                crop = frame[max(0, int(y1)):int(y2), max(0, int(x1)):int(x2)]
                gid = reid.assign(tid, crop, frame, conf)
                reid_map[tid] = gid
                disp = "R%d" % gid  # global (re-id) ID
            st = store.update(disp, cx, cy, t, cls, conf, frame_idx)
            if bev.enabled:
                w = bev.world_point(cx, y2)
                if w:
                    st.set_world(*w)
            view.append((disp, xyxy, cls, conf))
            active[disp] = st

        alerts, records, counts = events.update(active)

        cam_img = viz.draw_frame(frame, view, store, alerts, events,
                                 {"frame": frame_idx, "timestamp": ts_str(frame_idx, fps), "fps": proc_fps})
        bev_img = bev.render(active, alerts) if bev.enabled else None
        tele = bev.telemetry_line(next(iter(active.values()))) if (bev.enabled and active) else ""
        composed = viz.compose(cam_img, bev_img, tele)

        if out is None:
            h, w = composed.shape[:2]
            out = OutputManager(cfg, cfg["output_dir"], stem, fps, (w, h))
        out.write_frame(composed)
        out.log(frame_idx, ts_str(frame_idx, fps), view, store, records)

        # Alert skrinshotlari
        if records and cfg["output"]["video"]:
            _save_alert_shot(cfg["output_dir"], stem, frame_idx, composed)

        # Ishlash tezligi (rolling)
        now = time.time()
        inst = 1.0 / max(now - t_prev, 1e-6)
        proc_fps = 0.9 * proc_fps + 0.1 * inst if proc_fps else inst
        t_prev = now
        frame_idx += 1
        pbar.update(1)
    pbar.close()
    cap.release()
    if out is not None:
        stats = out.finalize(counts)
        log.info("Tugadi: %s | obyekt=%d odam=%d transport=%d alert=%d",
                 stem, stats["total"], stats["persons"], stats["vehicles"], stats["alerts"])
        log.info("Natijalar: %s/", cfg["output_dir"])


def _empty_like(detector):
    import supervision as sv
    d = sv.Detections.empty()
    d.data["class_name"] = __import__("numpy").array([])
    return d


def _save_alert_shot(out_dir, stem, frame_idx, img):
    d = os.path.join(out_dir, "alerts")
    os.makedirs(d, exist_ok=True)
    cv2.imwrite(os.path.join(d, "%s_%06d.jpg" % (stem, frame_idx)), img)


def main():
    ap = argparse.ArgumentParser(description="Hikvision Motion Tracking tizimi")
    ap.add_argument("--source", help="video fayl / papka / rtsp url (config'dagini qayta yozadi)")
    ap.add_argument("--config", default="config.yaml")
    ap.add_argument("--search", help="galereyadan berilgan odam rasmini qidirish")
    args = ap.parse_args()

    log = setup_logging()
    cfg = load_config(args.config)
    if args.source:
        cfg["source"] = args.source
    device = select_device(cfg["device"])
    cfg["detector"]["model"] = auto_model_for_device(cfg["detector"]["model"], device)
    log.info("Qurilma: %s | Model: %s", device, cfg["detector"]["model"])

    # ReID qidiruv rejimi
    if args.search:
        reid = ReID(cfg, device, log)
        res = reid.search(args.search)
        if not res:
            log.info("Mos shaxs topilmadi")
        for gid, sim in res:
            log.info("Shaxs #%d — o'xshashlik %.2f — %s/person_%d/", gid, sim, cfg["reid"]["gallery_dir"], gid)
        return

    pipe = build_pipeline(cfg, device, log)
    sources = collect_sources(cfg["source"], cfg["batch"])
    if not sources:
        log.error("Manba topilmadi: %s", cfg["source"])
        return
    log.info("Qayta ishlanadigan videolar: %d ta", len(sources))
    for src in sources:
        try:
            process_video(src, cfg, pipe, log)
        except Exception as e:
            log.exception("Xato (%s): %s", src, e)


if __name__ == "__main__":
    main()
