"""Konfiguratsiyani yuklash va standart qiymatlar bilan birlashtirish."""
import copy
import yaml

# Standart (default) sozlamalar — config.yaml da bo'lmagan kalitlar shulardan olinadi.
DEFAULTS = {
    "source": "input.mp4",
    "batch": False,
    "output_dir": "outputs",
    "device": "auto",
    "detector": {
        "model": "yolov8n.pt",
        "classes": ["person", "car", "truck", "bus", "motorcycle", "bicycle"],
        "conf": 0.45, "iou": 0.5, "imgsz": 640,
        "sahi": {"enabled": False, "slice": [640, 640], "overlap": 0.2},
        "preprocess": {"clahe": False},
    },
    "motion": {"enabled": True, "method": "MOG2", "min_area": 600},
    "tracker": {"type": "bytetrack", "track_buffer": 45, "match_thresh": 0.8, "trail_len": 50},
    "reid": {"enabled": False, "model": "osnet_x0_25", "similarity": 0.7,
             "gallery_dir": "gallery", "db": "gallery/reid.sqlite"},
    "calibration": {"enabled": False, "image_points": [], "world_points": [],
                    "bev_size": [480, 640], "meters_per_px": 0.05, "rings": [5, 10, 20]},
    "intrinsics": {"enabled": False},
    "events": {"zones": [], "lines": [],
               "loitering": {"enabled": False, "seconds": 10, "zone": None},
               "speed_limit": {"enabled": False, "max_mps": 3.0}},
    "visualize": {"bev_panel": True, "hud": True, "box3d": False,
                  "colors": {"person": [80, 220, 100], "vehicle": [255, 150, 40], "alert": [40, 40, 235]}},
    "output": {"video": True, "json": True, "csv": True, "gallery": True, "html": True, "fps": None},
}


def _deep_merge(base, over):
    out = copy.deepcopy(base)
    for k, v in (over or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def load_config(path):
    """config.yaml ni o'qib, standartlar bilan birlashtiradi."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            user = yaml.safe_load(f) or {}
    except FileNotFoundError:
        user = {}
    return _deep_merge(DEFAULTS, user)
