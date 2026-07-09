"""Umumiy yordamchi funksiyalar."""
import logging

VEHICLE_CLASSES = {"car", "truck", "bus", "motorcycle", "bicycle", "train"}


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )
    return logging.getLogger("tracking")


def select_device(pref):
    """'auto' bo'lsa GPU bor-yo'qligiga qarab tanlaydi."""
    try:
        import torch
        if pref == "auto":
            return "cuda:0" if torch.cuda.is_available() else "cpu"
        return pref
    except Exception:
        return "cpu"


def auto_model_for_device(model_name, device):
    """CPU'da og'ir model tanlangan bo'lsa yengil 'n' variantiga tushiradi."""
    if device == "cpu" and any(model_name.endswith(s + ".pt") for s in ("m", "l", "x")):
        base = model_name.rsplit(".", 1)[0][:-1] + "n"
        return base + ".pt"
    return model_name


def class_color(cls_name, colors, alert=False):
    """Klass bo'yicha BGR rang (odam=yashil, transport=ko'k, alert=qizil)."""
    if alert:
        return tuple(colors["alert"])
    if cls_name in VEHICLE_CLASSES:
        return tuple(colors["vehicle"])
    return tuple(colors["person"])


def is_vehicle(cls_name):
    return cls_name in VEHICLE_CLASSES
