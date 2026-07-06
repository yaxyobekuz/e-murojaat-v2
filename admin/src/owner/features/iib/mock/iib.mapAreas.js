// IIB operativ xaritasi — Sarnovul MFY, Baliqchi tumani, Andijon (prototip, demo).
// Mahalla bloklarga bo'lingan. Har blok xavfsizlik holatiga qarab bo'yaladi:
//   calm     = yashil  (tinch)
//   alert    = sariq   (diqqat — kichik signal/qoidabuzarlik)
//   incident = qizil   (hodisa — faol chaqiruv)
// Har blokda hodisa "nuqtalari" (begona avto, 102 signali, ...) va kameralar bor.
// Koordinatalar Sarnovul markazi atrofida (taxminiy, demo uchun).

export const MAP_CENTER = { lat: 40.639, lng: 72.239 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Xavfsizlik holati ranglari — rules/02 holat rang xaritasi
export const SECURITY_STATUS = {
  calm: { label: "Tinch", color: "#16a34a", tone: "done", dot: "#22c55e" },
  alert: { label: "Diqqat", color: "#d97706", tone: "progress", dot: "#f59e0b" },
  incident: { label: "Hodisa", color: "#dc2626", tone: "danger", dot: "#ef4444" },
};

// Hodisa turlari (xaritadagi nuqtalar)
export const INCIDENT_TYPES = {
  begona_avto: { key: "begona_avto", label: "Begona avtomashina", color: "#ef4444" },
  signal: { key: "signal", label: "102 signali", color: "#f43f5e" },
  tartibsizlik: { key: "tartibsizlik", label: "Jamoat tartibi", color: "#f97316" },
  shubhali: { key: "shubhali", label: "Shubhali shaxs", color: "#eab308" },
  tezlik: { key: "tezlik", label: "Tezlik nazorati", color: "#06b6d4" },
};

// Deterministik "tasodifiy" — seed asosida (Math.random ishlatilmaydi)
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ── Voronoi blok geometriyasi (Soliq xaritasi dvigateli bilan bir xil) ──────────
const GRID_COLS = 5;
const GRID_ROWS = 3;
const CELL_LAT = 0.0026;
const CELL_LNG = 0.0032;
const JITTER = 0.34;
const ORIGIN = { lat: MAP_CENTER.lat + CELL_LAT * 1.0, lng: MAP_CENTER.lng - CELL_LNG * 2.0 };

const BBOX = {
  minLat: ORIGIN.lat - (GRID_ROWS - 1) * CELL_LAT - CELL_LAT * 0.6,
  maxLat: ORIGIN.lat + CELL_LAT * 0.6,
  minLng: ORIGIN.lng - CELL_LNG * 0.6,
  maxLng: ORIGIN.lng + (GRID_COLS - 1) * CELL_LNG + CELL_LNG * 0.6,
};

// 15 blok uchun holat + nomi
const CELL_META = [
  { status: "calm", name: "Maslahat ko'chasi" },
  { status: "alert", name: "Bozor atrofi" },
  { status: "calm", name: "Maktab-66 hududi" },
  { status: "incident", name: "Sanoat zonasi" },
  { status: "calm", name: "Ulug'vor ko'chasi" },
  { status: "alert", name: "Avtostansiya" },
  { status: "incident", name: "Eski guzar" },
  { status: "alert", name: "Yangi qurilish" },
  { status: "calm", name: "Tibbiyot punkti" },
  { status: "incident", name: "Kanal ko'prigi" },
  { status: "calm", name: "Stadion atrofi" },
  { status: "incident", name: "Chekka dahasi" },
  { status: "alert", name: "Savdo markazi" },
  { status: "calm", name: "Urganji ko'chasi" },
  { status: "alert", name: "Sanoat darvozasi" },
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
  c: [seed.y, seed.x], // [lat, lng]
  path: warpPoly(voronoiCell(seed, SEEDS)),
}));

// ── Hodisa nuqtalari va kameralar (deterministik) ──────────────────────────────
const PLATE_LETTERS = "ABCEHKMOPTXY".split("");
const PLATE_REGIONS = ["95", "30", "01", "60", "10", "40"]; // 95 = "begona" tuyg'usi
const plate = (s) => {
  const reg = PLATE_REGIONS[Math.floor(rng(s * 7.1) * PLATE_REGIONS.length)];
  const l1 = PLATE_LETTERS[Math.floor(rng(s * 3.3) * PLATE_LETTERS.length)];
  const num = String(100 + Math.floor(rng(s * 5.7) * 900));
  const l2 =
    PLATE_LETTERS[Math.floor(rng(s * 9.9) * PLATE_LETTERS.length)] +
    PLATE_LETTERS[Math.floor(rng(s * 11.3) * PLATE_LETTERS.length)];
  return `${reg} ${l1} ${num} ${l2}`;
};

const TIMES = ["00:42", "01:15", "02:03", "02:51", "03:14", "21:36", "22:48", "23:27"];

// Holatga qarab nechta hodisa bo'ladi
const INCIDENT_COUNT = { incident: 3, alert: 1, calm: 0 };
// Hodisa turlari prioriteti (qizilroq holatga jiddiyroq tur)
const TYPE_POOL = {
  incident: ["begona_avto", "signal", "tartibsizlik", "shubhali"],
  alert: ["tezlik", "shubhali", "begona_avto"],
  calm: [],
};

const incidentTitle = (type, p) => {
  switch (type) {
    case "begona_avto":
      return `Begona avtomashina kirdi — ${p}`;
    case "signal":
      return "102 ga chaqiruv — fuqaro signali";
    case "tartibsizlik":
      return "Jamoat tartibini buzish";
    case "shubhali":
      return "Shubhali shaxs aniqlandi";
    case "tezlik":
      return `Tezlik oshirish — ${p}`;
    default:
      return "Hodisa";
  }
};

const buildIncidents = (b, bi) => {
  const n = INCIDENT_COUNT[b.status];
  const pool = TYPE_POOL[b.status];
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = bi * 17.7 + i * 3.1 + 1;
    const type = pool[Math.floor(rng(s * 1.9) * pool.length)] || pool[0];
    const p = plate(s + 50);
    // blok markazidan kichik siljish bilan joylash
    const pos = {
      lat: b.c[0] + (rng(s * 2.2) - 0.5) * CELL_LAT * 0.5,
      lng: b.c[1] + (rng(s * 4.4) - 0.5) * CELL_LNG * 0.5,
    };
    out.push({
      id: `inc-${bi + 1}-${i + 1}`,
      type,
      title: incidentTitle(type, p),
      plate: type === "begona_avto" || type === "tezlik" ? p : null,
      time: TIMES[Math.floor(rng(s * 6.6) * TIMES.length)],
      pos,
    });
  }
  return out;
};

const CAM_ANGLES = ["Shimoliy kirish", "Maslahat ko'chasi", "Bozor tarafi", "Hovli ichi", "Avtoturargoh", "Yon ko'cha"];
const buildCameras = (b, bi) => {
  const n = 2 + Math.floor(rng(bi * 8.1 + 2) * 3); // 2..4
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = bi * 13.3 + i * 2.7 + 1;
    const online = rng(s * 1.7) > 0.18; // ~82% online
    out.push({
      id: `cam-${bi + 1}-${i + 1}`,
      name: `CAM-${String(bi + 1).padStart(2, "0")}${i + 1}`,
      angle: CAM_ANGLES[Math.floor(rng(s * 3.9) * CAM_ANGLES.length)],
      online,
      recording: online,
      lastEvent: online ? TIMES[Math.floor(rng(s * 5.2) * TIMES.length)] : "—",
      clips: online ? 4 + Math.floor(rng(s * 4.1) * 20) : 0,
    });
  }
  return out;
};

export const MAHALLA_AREAS = BLOCKS.map((b, i) => {
  const incidents = buildIncidents(b, i);
  const cameras = buildCameras(b, i);
  return {
    id: `navbahor-blok-${i + 1}`,
    name: `${b.name}`,
    code: `${i + 1}-blok`,
    status: b.status,
    center: { lat: b.c[0], lng: b.c[1] },
    path: b.path,
    incidents,
    cameras,
    info: {
      incidents: incidents.length,
      cameras: cameras.length,
      camerasOnline: cameras.filter((c) => c.online).length,
      patrols: b.status === "incident" ? 2 : b.status === "alert" ? 1 : 1,
    },
  };
});

// Barcha hodisalar (xaritaga nuqta sifatida) — blok ma'lumoti bilan
export const ALL_INCIDENTS = MAHALLA_AREAS.flatMap((a) =>
  a.incidents.map((inc) => ({ ...inc, blockId: a.id, blockName: a.name })),
);

// KPI yig'indisi (filtrlangan ro'yxatga ham ishlaydi)
export const summarize = (zones) => {
  const acc = zones.reduce(
    (s, a) => {
      s.blocks += 1;
      s.incidents += a.info.incidents;
      s.cameras += a.info.cameras;
      s.camerasOnline += a.info.camerasOnline;
      s.patrols += a.info.patrols;
      if (a.status === "incident") s.activeBlocks += 1;
      return s;
    },
    { blocks: 0, incidents: 0, cameras: 0, camerasOnline: 0, patrols: 0, activeBlocks: 0 },
  );
  return acc;
};

export const mahallaSummary = summarize(MAHALLA_AREAS);
