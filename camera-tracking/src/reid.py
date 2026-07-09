"""Odamni qayta identifikatsiya (Person Re-ID).

OSNet (torchreid) bo'lsa undan, aks holda torchvision ResNet embedding fallback.
Galereya SQLite'da: har shaxs uchun embedding + eng sifatli croplar. Bir odam
qayta kirsa (yoki boshqa videoda) cosine o'xshashlik orqali eski ID qaytariladi.
"""
import os
import sqlite3

import cv2
import numpy as np


class ReID:
    def __init__(self, cfg, device, log):
        self.log = log
        r = cfg["reid"]
        self.enabled = r["enabled"]
        self.sim_thresh = r["similarity"]
        self.gallery_dir = r["gallery_dir"]
        self.db_path = r["db"]
        self.device = device
        self.extractor = None
        self.transform = None
        self._track_gid = {}     # track_id -> global person id
        self._every = 12         # har N kadrda embedding yangilanadi
        self._counter = {}
        self.gallery = {}        # gid -> (mean_embedding, count)
        self._next_gid = 1
        if not self.enabled:
            return
        os.makedirs(self.gallery_dir, exist_ok=True)
        self._init_db()
        self._load_gallery()
        self._init_model(r["model"])

    # ── Model ──
    def _init_model(self, model_name):
        try:
            from torchreid.utils import FeatureExtractor
            self.extractor = FeatureExtractor(model_name=model_name, device=self.device)
            self._kind = "torchreid"
            self.log.info("ReID: torchreid %s", model_name)
            return
        except Exception as e:
            self.log.warning("torchreid yo'q (%s) — torchvision fallback", e)
        try:
            import torch
            import torchvision.transforms as T
            from torchvision.models import resnet18, ResNet18_Weights
            m = resnet18(weights=ResNet18_Weights.DEFAULT)
            m.fc = torch.nn.Identity()
            m.eval().to(self.device)
            self._torch = torch
            self.extractor = m
            self.transform = T.Compose([
                T.ToPILImage(), T.Resize((256, 128)), T.ToTensor(),
                T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
            ])
            self._kind = "torchvision"
            self.log.info("ReID: torchvision ResNet18 embedding")
        except Exception as e:
            self.log.warning("ReID modeli yuklanmadi (%s) — o'chirildi", e)
            self.enabled = False

    def _embed(self, crop):
        if crop is None or crop.size == 0:
            return None
        if self._kind == "torchreid":
            feat = self.extractor([crop])[0]
            v = np.asarray(feat, dtype=np.float32)
        else:
            with self._torch.no_grad():
                t = self.transform(cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)).unsqueeze(0).to(self.device)
                v = self.extractor(t).cpu().numpy()[0].astype(np.float32)
        n = np.linalg.norm(v)
        return v / n if n > 0 else v

    # ── Galereya / DB ──
    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path) or ".", exist_ok=True)
        self.conn = sqlite3.connect(self.db_path)
        self.conn.execute("CREATE TABLE IF NOT EXISTS persons (gid INTEGER PRIMARY KEY, emb BLOB, cnt INTEGER)")
        self.conn.commit()

    def _load_gallery(self):
        for gid, emb, cnt in self.conn.execute("SELECT gid, emb, cnt FROM persons"):
            self.gallery[gid] = (np.frombuffer(emb, dtype=np.float32), cnt)
            self._next_gid = max(self._next_gid, gid + 1)
        if self.gallery:
            self.log.info("Galereyada %d shaxs yuklandi", len(self.gallery))

    def _save_person(self, gid):
        emb, cnt = self.gallery[gid]
        self.conn.execute("INSERT OR REPLACE INTO persons(gid, emb, cnt) VALUES(?,?,?)",
                          (gid, emb.astype(np.float32).tobytes(), cnt))
        self.conn.commit()

    def _match(self, emb):
        best_gid, best_sim = None, -1.0
        for gid, (g, _c) in self.gallery.items():
            sim = float(np.dot(emb, g))
            if sim > best_sim:
                best_gid, best_sim = gid, sim
        return best_gid, best_sim

    def assign(self, track_id, crop, frame, gid_hint_conf=0.0):
        """track_id uchun barqaror global shaxs ID qaytaradi (ReID)."""
        if not self.enabled:
            return track_id
        # allaqachon berilgan bo'lsa — vaqti-vaqti bilan yangilaymiz
        c = self._counter.get(track_id, 0)
        self._counter[track_id] = c + 1
        if track_id in self._track_gid and c % self._every != 0:
            return self._track_gid[track_id]
        emb = self._embed(crop)
        if emb is None:
            return self._track_gid.get(track_id, track_id)
        gid, sim = self._match(emb)
        if gid is not None and sim >= self.sim_thresh:
            g, cnt = self.gallery[gid]
            self.gallery[gid] = ((g * cnt + emb) / (cnt + 1), cnt + 1)  # running mean
        else:
            gid = self._next_gid
            self._next_gid += 1
            self.gallery[gid] = (emb, 1)
        self._track_gid[track_id] = gid
        self._save_person(gid)
        self._save_crop(gid, crop, gid_hint_conf)
        return gid

    def _save_crop(self, gid, crop, conf):
        d = os.path.join(self.gallery_dir, "person_%d" % gid)
        os.makedirs(d, exist_ok=True)
        existing = [f for f in os.listdir(d) if f.endswith(".jpg")]
        if len(existing) >= 5:
            return
        path = os.path.join(d, "%03d_%.2f.jpg" % (len(existing), conf))
        cv2.imwrite(path, crop)

    def search(self, image_path):
        """Bitta odam rasmini berib, galereyadan mos shaxs(lar)ni topadi."""
        if not self.enabled:
            self.log.error("ReID o'chirilgan — qidiruv ishlamaydi")
            return []
        img = cv2.imread(image_path)
        emb = self._embed(img)
        if emb is None:
            return []
        res = [(gid, float(np.dot(emb, g))) for gid, (g, _c) in self.gallery.items()]
        res.sort(key=lambda x: x[1], reverse=True)
        return [(gid, sim) for gid, sim in res if sim >= self.sim_thresh]
