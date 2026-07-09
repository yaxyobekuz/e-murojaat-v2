"""Harakat gating — background subtraction (MOG2/KNN).

Harakat bo'lmagan kadrlarda YOLO ishlatilmaydi (tezlikni oshiradi).
"""
import cv2


class MotionGate:
    def __init__(self, cfg):
        m = cfg["motion"]
        self.enabled = m["enabled"]
        self.min_area = m["min_area"]
        if not self.enabled:
            self.bg = None
        elif m["method"].upper() == "KNN":
            self.bg = cv2.createBackgroundSubtractorKNN(detectShadows=False)
        else:
            self.bg = cv2.createBackgroundSubtractorMOG2(detectShadows=False)

    def has_motion(self, frame):
        """(harakat_bormi: bool, mask)."""
        if not self.enabled:
            return True, None
        mask = self.bg.apply(frame)
        mask = cv2.medianBlur(mask, 5)
        _, mask = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
        cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        moving = any(cv2.contourArea(c) >= self.min_area for c in cnts)
        return moving, mask
