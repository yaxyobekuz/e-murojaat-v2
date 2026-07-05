// Kamera boshqaruv backend — Express.
// Vazifa: kamera qo'shilganda RTSP manzilni yig'ib go2rtc'ga stream qo'shadi,
// kamerani (paroli shifrlangan holda) PostgreSQL'ga saqlaydi va frontendga
// WebRTC/HLS stream manzillarini qaytaradi. Parol frontendga HECH QACHON qaytmaydi.
import express from "express";
import cors from "cors";
import net from "net";

import { pool, initDb } from "./db.js";
import { encrypt, decrypt } from "./crypto.js";
import { buildRtspUrl } from "./rtsp.js";
import * as go2rtc from "./go2rtc.js";
import { signToken, requireAuth } from "./auth.js";

const app = express();
app.use(cors({ origin: (process.env.FRONTEND_ORIGIN || "*").split(",") }));
app.use(express.json());

// Brauzer uchun ochiq (public) go2rtc manzili.
const GO2RTC_PUBLIC = process.env.GO2RTC_PUBLIC || "http://localhost:1984";
// Kamera id'sidan go2rtc stream nomi.
const streamName = (id) => `cam_${String(id).replace(/-/g, "")}`;

// Brauzer o'ynatishi uchun stream manzillari.
function streamUrls(name) {
  return {
    // Eng oson: iframe orqali qo'yiladigan go2rtc player (WebRTC -> MSE -> HLS avto-fallback).
    embed: `${GO2RTC_PUBLIC}/stream.html?src=${name}`,
    // WebRTC signaling (o'z playeringni yozsang).
    webrtc: `${GO2RTC_PUBLIC}/api/ws?src=${name}`,
    // HLS (kattaroq kechikish, lekin universal).
    hls: `${GO2RTC_PUBLIC}/api/stream.m3u8?src=${name}`,
    // Bitta kadr (snapshot).
    snapshot: `${GO2RTC_PUBLIC}/api/frame.jpeg?src=${name}`,
  };
}

// Kamerani frontendga XAVFSIZ (parolsiz) ko'rinishga o'tkazish.
function sanitize(row) {
  const name = streamName(row.id);
  return {
    id: row.id,
    name: row.name,
    ip: row.ip,
    port: row.port,
    username: row.username,
    channel: row.channel,
    location: row.location,
    createdAt: row.created_at,
    streamName: name,
    stream: streamUrls(name),
  };
}

// Kamera online/offline — RTSP portiga TCP ulanib ko'riladi (ishonchli va tez).
function probe(ip, port, timeout = 2500) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    const finish = (ok) => {
      sock.destroy();
      resolve(ok);
    };
    sock.setTimeout(timeout);
    sock.once("connect", () => finish(true));
    sock.once("timeout", () => finish(false));
    sock.once("error", () => finish(false));
    sock.connect(Number(port) || 554, ip);
  });
}

// ───────── AUTH ─────────
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return res.json({ token: signToken({ sub: username }) });
  }
  res.status(401).json({ error: "Login yoki parol noto'g'ri" });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Bundan keyingi barcha /api/cameras yo'llari JWT talab qiladi.
app.use("/api/cameras", requireAuth);

// ───────── YANGI KAMERA ─────────
app.post("/api/cameras", async (req, res) => {
  try {
    const { name, ip, port = 554, username, password, channel = "102", location = "Umumiy" } = req.body || {};
    if (!name || !ip || !username || !password) {
      return res.status(400).json({ error: "name, ip, username, password majburiy" });
    }
    const { rows } = await pool.query(
      `INSERT INTO cameras(name, ip, port, username, password_enc, channel, location)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, ip, Number(port), username, encrypt(password), channel, location],
    );
    const row = rows[0];
    // RTSP manzilni yig'ib go2rtc'ga qo'shamiz (dinamik).
    const rtsp = buildRtspUrl({ ip, port, username, password, channel });
    await go2rtc.addStream(streamName(row.id), rtsp);
    res.status(201).json(sanitize(row));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ───────── RO'YXAT ─────────
app.get("/api/cameras", async (_req, res) => {
  const { rows } = await pool.query(`SELECT * FROM cameras ORDER BY created_at DESC`);
  res.json(rows.map(sanitize));
});

// ───────── BITTA KAMERA ─────────
app.get("/api/cameras/:id", async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM cameras WHERE id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Kamera topilmadi" });
  res.json(sanitize(rows[0]));
});

// ───────── STATUS (online/offline) ─────────
app.get("/api/cameras/:id/status", async (req, res) => {
  const { rows } = await pool.query(`SELECT ip, port FROM cameras WHERE id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Kamera topilmadi" });
  const online = await probe(rows[0].ip, rows[0].port);
  res.json({ online });
});

// ───────── O'CHIRISH ─────────
app.delete("/api/cameras/:id", async (req, res) => {
  const { rows } = await pool.query(`DELETE FROM cameras WHERE id=$1 RETURNING id`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Kamera topilmadi" });
  await go2rtc.removeStream(streamName(req.params.id)); // go2rtc'dan ham olib tashlaymiz
  res.json({ ok: true });
});

// Server ishga tushganda saqlangan kameralarni go2rtc'ga qayta yuklaymiz.
async function reloadStreams() {
  const { rows } = await pool.query(`SELECT * FROM cameras`);
  for (const row of rows) {
    try {
      const rtsp = buildRtspUrl({
        ip: row.ip,
        port: row.port,
        username: row.username,
        password: decrypt(row.password_enc),
        channel: row.channel,
      });
      await go2rtc.addStream(streamName(row.id), rtsp);
    } catch (e) {
      console.error("[reload] xato:", row.id, e.message);
    }
  }
  console.log(`[go2rtc] ${rows.length} ta kamera qayta yuklandi`);
}

const PORT = process.env.PORT || 8083;
initDb()
  .then(async () => {
    await reloadStreams().catch((e) => console.error("[reloadStreams]", e.message));
    app.listen(PORT, () => console.log(`Kamera backend ishga tushdi: http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("DB init xato:", e.message);
    process.exit(1);
  });
