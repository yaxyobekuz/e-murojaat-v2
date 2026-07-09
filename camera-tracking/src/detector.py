"""Obyekt aniqlash — YOLOv8/YOLOv11 (Ultralytics) + ixtiyoriy SAHI + CLAHE."""
import cv2
import numpy as np
import supervision as sv


class Detector:
    def __init__(self, cfg, device, log):
        self.log = log
        self.device = device
        d = cfg["detector"]
        self.conf = d["conf"]
        self.iou = d["iou"]
        self.imgsz = d["imgsz"]
        self.clahe_on = d["preprocess"]["clahe"]
        self._clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)) if self.clahe_on else None

        from ultralytics import YOLO
        self.model = YOLO(d["model"])
        self.model.to(device)
        self.names = self.model.names  # {id: name}
        # Konfiguratsiyadagi klasslar -> model id lari
        wanted = set(d["classes"])
        self.class_ids = [i for i, n in self.names.items() if n in wanted]
        if not self.class_ids:
            log.warning("Model klasslari config bilan mos kelmadi — barcha klasslar ishlatiladi")
            self.class_ids = list(self.names.keys())

        # SAHI (bo'lakli aniqlash) — ixtiyoriy
        self.sahi = None
        s = d["sahi"]
        if s["enabled"]:
            try:
                from sahi import AutoDetectionModel
                from sahi.predict import get_sliced_prediction
                self._get_sliced = get_sliced_prediction
                self.sahi = AutoDetectionModel.from_pretrained(
                    model_type="ultralytics", model_path=d["model"],
                    confidence_threshold=self.conf, device=device,
                )
                self._slice = s["slice"]
                self._overlap = s["overlap"]
                log.info("SAHI yoqildi (bo'lakli aniqlash)")
            except Exception as e:
                log.warning("SAHI o'rnatilmagan yoki xato (%s) — oddiy YOLO ishlatiladi", e)
                self.sahi = None

    def _preprocess(self, frame):
        if self._clahe is None:
            return frame
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        l = self._clahe.apply(l)
        return cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

    def detect(self, frame):
        """frame(BGR) -> supervision.Detections (xyxy, confidence, class_id, data['class_name'])."""
        img = self._preprocess(frame)
        if self.sahi is not None:
            return self._detect_sahi(img)
        res = self.model.predict(
            img, conf=self.conf, iou=self.iou, imgsz=self.imgsz,
            classes=self.class_ids, device=self.device, verbose=False,
        )[0]
        det = sv.Detections.from_ultralytics(res)
        return self._attach_names(det)

    def _detect_sahi(self, img):
        result = self._get_sliced(
            image=img[:, :, ::-1],  # RGB
            detection_model=self.sahi,
            slice_height=self._slice[1], slice_width=self._slice[0],
            overlap_height_ratio=self._overlap, overlap_width_ratio=self._overlap,
        )
        boxes, confs, ids = [], [], []
        for op in result.object_prediction_list:
            if op.category.name not in [self.names[i] for i in self.class_ids]:
                continue
            b = op.bbox
            boxes.append([b.minx, b.miny, b.maxx, b.maxy])
            confs.append(op.score.value)
            ids.append(op.category.id)
        if not boxes:
            return self._attach_names(sv.Detections.empty())
        det = sv.Detections(
            xyxy=np.array(boxes, dtype=float),
            confidence=np.array(confs, dtype=float),
            class_id=np.array(ids, dtype=int),
        )
        return self._attach_names(det)

    def _attach_names(self, det):
        names = np.array([self.names.get(int(c), str(c)) for c in det.class_id]) if len(det) else np.array([])
        det.data["class_name"] = names
        return det
