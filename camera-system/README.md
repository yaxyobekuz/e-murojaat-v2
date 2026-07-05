# Kamera tizimi — Hikvision IP kameralar uchun live-tasvir paneli

Foydalanuvchi panelga kameraning **IP, port, login, parol** va **kanal**ini kiritadi —
kamera **avtomatik ulanadi** va uning **jonli (live)** tasviri panelda ko'rinadi.
Bir vaqtda 6+ kamera jonli ko'rsatiladi.

## Arxitektura

```
Brauzer (admin panel)  ──WebRTC/HLS──►  go2rtc  ──RTSP──►  Hikvision kamera(lar)
        │                                 ▲
        │ REST (JWT)                       │ REST API (stream qo'shish/o'chirish)
        ▼                                 │
   Node.js backend ──────────────────────┘
        │
        ▼
   PostgreSQL (kameralar, parol AES-256-GCM shifrlangan)
```

- **go2rtc** — media server: RTSP oqimini brauzer o'ynay oladigan **WebRTC** (kam
  kechikish) yoki **HLS**'ga aylantiradi. Brauzer RTSP'ni to'g'ridan-to'g'ri o'ynay olmaydi.
- **Backend (Express)** — go2rtc'ni REST API orqali boshqaradi (kamera qo'shilganda
  stream qo'shadi, o'chirilganda olib tashlaydi), kamerani bazaga saqlaydi.
- **PostgreSQL** — kameralar; parollar shifrlangan. Server restart bo'lganda kameralar
  go2rtc'ga avtomatik **qayta yuklanadi**.

## API (barchasi JWT talab qiladi, `/api/auth/login` dan tashqari)

| Metod | Yo'l | Vazifa |
|---|---|---|
| POST | `/api/auth/login` | `{username, password}` → `{token}` |
| POST | `/api/cameras` | Yangi kamera. Body: `{name, ip, port, username, password, channel, location}` |
| GET | `/api/cameras` | Barcha kameralar (**parolsiz**) + stream manzillari |
| GET | `/api/cameras/:id` | Bitta kamera + WebRTC/HLS manzillari |
| GET | `/api/cameras/:id/status` | `{online: true|false}` (RTSP portiga TCP probe) |
| DELETE | `/api/cameras/:id` | go2rtc'dan ham, bazadan ham o'chiradi |

### RTSP manzil (Hikvision)
```
rtsp://USERNAME:PAROL@IP:PORT/Streaming/Channels/CHANNEL
```
- `CHANNEL`: **101** = asosiy oqim (HD), **102** = sub oqim (panel/grid uchun tavsiya).
- Login/parol maxsus belgili bo'lsa avtomatik **URL-encode** qilinadi.

### Stream manzillari (backend qaytaradi)
- `stream.embed` — `.../stream.html?src=<name>` (iframe player, WebRTC→MSE→HLS avto-fallback)
- `stream.webrtc` — WebRTC signaling (o'z playering uchun)
- `stream.hls` — `.../api/stream.m3u8?src=<name>`

## Ishga tushirish (Docker)

```bash
cd camera-system
cp backend/.env.example backend/.env

# Parol shifrlash kalitini yarating (32 bayt) va backend/.env dagi CAMERA_ENC_KEY ga qo'ying:
openssl rand -hex 32

docker compose up -d
```

Portlar:
- go2rtc: `http://localhost:1984` (API + player)
- Backend: `http://localhost:8083`
- PostgreSQL: `localhost:5433`

> **WebRTC LAN/tashqi tarmoq uchun:** `go2rtc/go2rtc.yaml` dagi `webrtc.candidates`
> ga server host IP'sini qo'shing (masalan `192.168.1.50:8555`). Lokal (localhost)
> ko'rish uchun default sozlama yetarli.

## Xavfsizlik
- Parollar **frontendga hech qachon** qaytarilmaydi (`GET /api/cameras` parolsiz).
- Parollar bazada **AES-256-GCM** bilan shifrlangan.
- API JWT bilan himoyalangan.
- Kameralar internetga to'g'ridan-to'g'ri ochilmasin — backend lokal tarmoq / VPN
  orqali kamera IP'lariga kirsin (go2rtc kamera bilan gaplashadi, brauzer emas).

## Admin panel bilan bog'lanish
Admin panel (`e-murojaat-v2/admin`) `owner/kameralar` bo'limida:
- **Kamera qo'shish** formasi (ip/port/login/parol/kanal/joylashuv).
- Qo'shilgan kameralar **jonli grid** (WebRTC iframe) + online/offline + o'chirish.

Admin `.env`:
```
VITE_CAMERA_API=http://localhost:8083
VITE_CAMERA_USER=admin
VITE_CAMERA_PASS=admin123
```

Qo'shilgan kameralar **Boshqaruv markazi → Barcha kameralar** (va boshqa kamera
bo'limlari) ichida ham "Jonli (real)" sifatida paydo bo'ladi — umumiy
`useLiveCameras()` hook orqali.
