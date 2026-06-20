// FVV operativ xaritasi — Navbahor MFY (prototip, demo). IIB uslubidagi voronoi
// bloklar + ustidan ko'cha yo'llari. Har blok yong'in holatiga qarab bo'yaladi:
//   calm  = yashil (tinch)
//   alert = sariq  (xavf — gaz/tutun signali)
//   fire  = qizil  (faol yong'in)
// Yong'in nuqtalari (dots) + har blokda kameralar (yaqin atrofni kuzatish uchun).

export const MAP_PLACE_LABEL = "Navbahor MFY, Asaka tumani, Andijon";

export const FIRE_STATUS = {
  calm: { label: "Tinch", color: "#16a34a", dot: "#22c55e", tone: "done" },
  alert: { label: "Xavf", color: "#d97706", dot: "#f59e0b", tone: "progress" },
  fire: { label: "Yong'in", color: "#dc2626", dot: "#ef4444", tone: "danger" },
};

export const FIRE_TYPES = {
  yongin: { key: "yongin", label: "Yong'in", color: "#ef4444" },
  gaz: { key: "gaz", label: "Gaz sizishi", color: "#f97316" },
  tutun: { key: "tutun", label: "Tutun signali", color: "#eab308" },
  qutqaruv: { key: "qutqaruv", label: "Qutqaruv", color: "#06b6d4" },
};

const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── Voronoi blok geometriyasi (IIB xaritasi bilan bir xil dvigatel) ────────────
const GRID_COLS = 5;
const GRID_ROWS = 3;
const CELL_LAT = 0.0026;
const CELL_LNG = 0.0032;
const JITTER = 0.34;
const CENTER = { lat: 40.639, lng: 72.239 };
const ORIGIN = { lat: CENTER.lat + CELL_LAT * 1.0, lng: CENTER.lng - CELL_LNG * 2.0 };

const BBOX = {
  minLat: ORIGIN.lat - (GRID_ROWS - 1) * CELL_LAT - CELL_LAT * 0.6,
  maxLat: ORIGIN.lat + CELL_LAT * 0.6,
  minLng: ORIGIN.lng - CELL_LNG * 0.6,
  maxLng: ORIGIN.lng + (GRID_COLS - 1) * CELL_LNG + CELL_LNG * 0.6,
};

const CELL_META = [
  { status: "calm", name: "Markaziy ko'cha" },
  { status: "alert", name: "Bozor atrofi" },
  { status: "calm", name: "Maktab-7 hududi" },
  { status: "fire", name: "Sanoat zonasi" },
  { status: "calm", name: "Bog' mahalla" },
  { status: "alert", name: "Avtostansiya" },
  { status: "fire", name: "Eski shahar" },
  { status: "calm", name: "Yangi qurilish" },
  { status: "calm", name: "Tibbiyot punkti" },
  { status: "fire", name: "Gaz taqsimlagich" },
  { status: "calm", name: "Stadion atrofi" },
  { status: "alert", name: "Chekka daha" },
  { status: "alert", name: "Savdo markazi" },
  { status: "calm", name: "Park zonasi" },
  { status: "calm", name: "Sanoat darvozasi" },
];

const SEEDS = CELL_META.map((m, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  const s = i + 1;
  const jx = (rng(s * 2.9) - 0.5) * 2 * JITTER * CELL_LNG;
  const jy = (rng(s * 1.3) - 0.5) * 2 * JITTER * CELL_LAT;
  return { ...m, x: ORIGIN.lng + col * CELL_LNG + jx, y: ORIGIN.lat - row * CELL_LAT + jy };
});

const clipHalfPlane = (poly, a, b, c) => {
  const out = [];
  const inside = (p) => a * p.x + b * p.y <= c + 1e-12;
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn !== prevIn) {
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      const denom = a * dx + b * dy;
      const t = denom === 0 ? 0 : (c - (a * prev.x + b * prev.y)) / denom;
      out.push({ x: prev.x + t * dx, y: prev.y + t * dy });
    }
    if (curIn) out.push(cur);
  }
  return out;
};

const voronoiCell = (seed, all) => {
  let poly = [
    { x: BBOX.minLng, y: BBOX.minLat },
    { x: BBOX.maxLng, y: BBOX.minLat },
    { x: BBOX.maxLng, y: BBOX.maxLat },
    { x: BBOX.minLng, y: BBOX.maxLat },
  ];
  for (const other of all) {
    if (other === seed) continue;
    const a = other.x - seed.x;
    const b = other.y - seed.y;
    const c = (other.x * other.x - seed.x * seed.x + other.y * other.y - seed.y * seed.y) / 2;
    poly = clipHalfPlane(poly, a, b, c);
    if (poly.length === 0) break;
  }
  return poly;
};

const WARP = 0.00026;
const warp = (x, y) => {
  const dx = Math.sin(x * 9100 + y * 3700) * 0.6 + Math.sin(x * 21300 - y * 8700) * 0.4;
  const dy = Math.cos(x * 8300 - y * 4100) * 0.6 + Math.cos(x * 19700 + y * 9900) * 0.4;
  return { x: x + dx * WARP, y: y + dy * WARP };
};

const SUBDIV = 4;
const warpPoly = (poly) => {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    for (let k = 0; k < SUBDIV; k++) {
      const t = k / SUBDIV;
      const px = a.x + (b.x - a.x) * t;
      const py = a.y + (b.y - a.y) * t;
      const w = warp(px, py);
      out.push({ lat: w.y, lng: w.x });
    }
  }
  return out;
};

const BLOCKS = SEEDS.map((seed) => ({
  ...seed,
  c: [seed.y, seed.x],
  path: warpPoly(voronoiCell(seed, SEEDS)),
}));

// ── Yong'in nuqtalari + kameralar ──────────────────────────────────────────────
const FIRE_COUNT = { fire: 2, alert: 1, calm: 0 };
const TYPE_POOL = {
  fire: ["yongin", "gaz", "tutun"],
  alert: ["tutun", "gaz", "qutqaruv"],
  calm: [],
};
const TIMES = ["00:42", "01:15", "02:03", "02:51", "03:14", "21:36", "22:48", "23:27"];
const fireTitle = (type) => {
  switch (type) {
    case "yongin": return "Faol yong'in — bino";
    case "gaz": return "Gaz sizishi signali";
    case "tutun": return "Tutun datchigi ishga tushdi";
    case "qutqaruv": return "Qutqaruv chaqiruvi";
    default: return "Hodisa";
  }
};

const buildFires = (b, bi) => {
  const n = FIRE_COUNT[b.status];
  const pool = TYPE_POOL[b.status];
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = bi * 17.7 + i * 3.1 + 1;
    const type = pool[Math.floor(rng(s * 1.9) * pool.length)] || pool[0];
    out.push({
      id: `fire-${bi + 1}-${i + 1}`,
      type,
      title: fireTitle(type),
      time: TIMES[Math.floor(rng(s * 6.6) * TIMES.length)],
      pos: {
        lat: b.c[0] + (rng(s * 2.2) - 0.5) * CELL_LAT * 0.5,
        lng: b.c[1] + (rng(s * 4.4) - 0.5) * CELL_LNG * 0.5,
      },
    });
  }
  return out;
};

const CAM_ANGLES = ["Shimoliy kirish", "Markaziy ko'cha", "Bozor tarafi", "Hovli ichi", "Avtoturargoh", "Yon ko'cha"];
const buildCameras = (b, bi) => {
  const n = 2 + Math.floor(rng(bi * 8.1 + 2) * 3); // 2..4
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = bi * 13.3 + i * 2.7 + 1;
    const online = rng(s * 1.7) > 0.16;
    out.push({
      id: `cam-${bi + 1}-${i + 1}`,
      name: `CAM-${String(bi + 1).padStart(2, "0")}${i + 1}`,
      angle: CAM_ANGLES[Math.floor(rng(s * 3.9) * CAM_ANGLES.length)],
      online,
      lastEvent: online ? TIMES[Math.floor(rng(s * 5.2) * TIMES.length)] : "—",
      clips: online ? 4 + Math.floor(rng(s * 4.1) * 20) : 0,
    });
  }
  return out;
};

export const MAHALLA_AREAS = BLOCKS.map((b, i) => {
  const fires = buildFires(b, i);
  const cameras = buildCameras(b, i);
  return {
    id: `navbahor-blok-${i + 1}`,
    name: b.name,
    code: `${i + 1}-blok`,
    status: b.status,
    center: { lat: b.c[0], lng: b.c[1] },
    path: b.path,
    fires,
    cameras,
    info: {
      fires: fires.length,
      cameras: cameras.length,
      camerasOnline: cameras.filter((c) => c.online).length,
      brigades: b.status === "fire" ? 2 : b.status === "alert" ? 1 : 0,
    },
  };
});

// ── Ko'cha yo'llari (bloklar orasidan o'tadi) ──────────────────────────────────
export const ROADS = (() => {
  const roads = [];
  // vertikal ko'chalar — ustunlar orasida
  for (let c = 0; c < GRID_COLS - 1; c++) {
    const lng = ORIGIN.lng + (c + 0.5) * CELL_LNG;
    roads.push({ id: `v${c}`, pts: [{ lat: BBOX.maxLat, lng }, { lat: BBOX.minLat, lng }] });
  }
  // gorizontal ko'chalar — qatorlar orasida
  for (let r = 0; r < GRID_ROWS - 1; r++) {
    const lat = ORIGIN.lat - (r + 0.5) * CELL_LAT;
    roads.push({ id: `h${r}`, pts: [{ lat, lng: BBOX.minLng }, { lat, lng: BBOX.maxLng }] });
  }
  return roads;
})();

export const summarize = (zones) =>
  zones.reduce(
    (s, a) => {
      s.blocks += 1;
      s.fires += a.info.fires;
      s.cameras += a.info.cameras;
      s.camerasOnline += a.info.camerasOnline;
      s.brigades += a.info.brigades;
      if (a.status === "fire") s.fireBlocks += 1;
      return s;
    },
    { blocks: 0, fires: 0, cameras: 0, camerasOnline: 0, brigades: 0, fireBlocks: 0 },
  );

export const mahallaSummary = summarize(MAHALLA_AREAS);
