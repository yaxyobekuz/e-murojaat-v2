# Hikvision yozuvlari uchun Motion Tracking tizimi

Hikvision NVR/DVR'dan eksport qilingan **offline video fayllar** (yoki RTSP jonli oqim)
asosida ishlaydigan **obyekt aniqlash + ko'p-obyektli kuzatuv (tracking)** tizimi.

- **Aniqlash:** YOLOv8/YOLOv11 (Ultralytics) — `person, car, truck, bus, motorcycle, bicycle` + ixtiyoriy **SAHI** (kichik/uzoq obyektlar) + **CLAHE** (kechasi).
- **Harakat gating:** background subtraction (MOG2/KNN) — harakatsiz kadrlarni o'tkazib yuboradi.
- **Kuzatuv:** **ByteTrack** (asosiy) yoki **DeepSORT** (muqobil) + **Kalman** silliqlash; traektoriya, tezlik (px/s va m/s), yo'nalish, dwell.
- **ReID:** OSNet (torchreid) yoki ResNet fallback — bir odam qayta kirsa/boshqa videoda ko'rinsa **eski ID qaytariladi**; galereya (SQLite) + qidiruv rejimi.
- **Vizual:** 2 panel — yuqorida kamera (box, ID, tezlik, traektoriya izi, strelka, HUD, ixtiyoriy 3D box), pastda **BEV** (tepadan ko'rinish, masofa halqalari, telemetriya).
- **Hodisalar:** zona kirishi, chiziq kesish (kirdi/chiqdi hisoblagichi), loitering, tezlik chegarasi → box qizil + skrinshot + JSON.
- **Chiqish:** annotatsiyalangan `.mp4`, JSON + MOT log, CSV xulosa, odamlar galereyasi, HTML hisobot.

## O'rnatish

```bash
cd camera-tracking
python -m venv .venv && source .venv/bin/activate   # ixtiyoriy
pip install -r requirements.txt

# Ixtiyoriy imkoniyatlar (kerak bo'lsa):
pip install sahi                 # SAHI bo'lakli aniqlash
pip install deep-sort-realtime   # DeepSORT tracker
pip install torchreid            # OSNet ReID (aks holda ResNet fallback ishlaydi)
```

> **GPU (CUDA):** tezlik uchun tavsiya etiladi. `ultralytics` torch'ni avtomatik o'rnatadi;
> CUDA versiyasi kerak bo'lsa PyTorch'ni [rasmiy yo'riqnoma](https://pytorch.org) bo'yicha o'rnating.
> GPU bo'lmasa tizim CPU'da (yolov8n bilan) ham ishlaydi.

## Ishga tushirish

```bash
# Bitta video
python main.py --source video.mp4 --config config.yaml

# Papkadagi barcha videolar (batch)
python main.py --source /path/to/videolar/ --config config.yaml

# RTSP jonli oqim
python main.py --source "rtsp://user:pass@192.168.1.64:554/Streaming/Channels/101"

# Galereyadan odam qidirish (ReID yoqilgan bo'lsa)
python main.py --search odam.jpg --config config.yaml
```

`.dav` fayllar avtomatik `ffmpeg` bilan `.mp4`ga o'giriladi (ffmpeg o'rnatilgan bo'lsin).

## Sozlash (`config.yaml`)

Butun tizim shu bitta fayldan boshqariladi. Muhim bo'limlar:

- `detector` — model, klasslar, `conf`/`iou`, SAHI, CLAHE.
- `motion` — MOG2/KNN gating (`enabled: false` qilsa har kadr aniqlanadi).
- `tracker` — `bytetrack`/`deepsort`, `track_buffer` (occlusion), `trail_len`.
- `reid` — `enabled`, similarity chegarasi, galereya.
- `calibration` — **BEV** uchun 4 nuqtali gomografiya (piksel + metr). O'chiq bo'lsa faqat piksel koordinatalar.
- `intrinsics.enabled` / `visualize.box3d` — soddalashtirilgan 3D kub.
- `events` — zonalar (polygon), chiziqlar, loitering, tezlik chegarasi.
- `visualize` / `output` — panellar, ranglar, chiqish formatlari.

### BEV (tepadan ko'rinish) uchun
`calibration.enabled: true` qiling va videoda yerda joylashgan **4 ta nuqtaning**
pikselini (`image_points`) hamda ularning real **metr** koordinatalarini (`world_points`)
o'lchab kiriting. Shundagina masofa/tezlik metrda va tepadan ko'rinish to'g'ri chiqadi.

## Chiqish fayllari (`outputs/`)

| Fayl | Tavsif |
|---|---|
| `<video>_annotated.mp4` | 2 panelli annotatsiyalangan video |
| `<video>_log.json` | har kadr: track_id, class, bbox, conf, speed, world_xy |
| `<video>_mot.txt` | MOT format (`frame,id,x,y,w,h,conf,-1,-1,-1`) |
| `<video>_tracks.csv` | har track: paydo/yo'qolish, o'rtacha tezlik, masofa, zonalar |
| `<video>_report.html` | statistika + alertlar |
| `alerts/*.jpg` | hodisa skrinshotlari |
| `gallery/person_<id>/` | ReID croplari |

## Modullar

| Fayl | Vazifa |
|---|---|
| `src/detector.py` | YOLO + SAHI + CLAHE |
| `src/motion.py` | background subtraction gating |
| `src/tracker.py` | ByteTrack/DeepSORT + Kalman + tezlik/yo'nalish/dwell |
| `src/reid.py` | OSNet/ResNet embedding + galereya + qidiruv |
| `src/bev.py` | gomografiya + tepadan ko'rinish |
| `src/events.py` | zona/chiziq/loitering/tezlik qoidalari |
| `src/visualizer.py` | 2 panelli chizish (kamera + BEV) |
| `src/outputs.py` | video/JSON/CSV/HTML |
| `main.py` | orkestratsiya (batch, dav, rtsp, qidiruv) |

## Nega ByteTrack (asosiy)?
ByteTrack yengil, past-ishonchli detektsiyalarni ham qo'shib ID-switch'ni kamaytiradi
va appearance model talab qilmaydi — offline yozuvlar uchun eng amaliy, tez va barqaror.
DeepSORT (ReID embedding bilan) og'irroq occlusion holatlari uchun `tracker.type: deepsort`
orqali yoqiladi.
