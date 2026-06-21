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

// ── Depo (yong'in mashinasi shu yerdan chiqadi) ────────────────────────────────
export const DEPOT = { lat: BBOX.minLat + CELL_LAT * 0.3, lng: BBOX.minLng + CELL_LNG * 0.3, name: "13-Yong'in qism" };

// ── Masofa (metr) — lat/lng ni real metrga aylantirish (truck real tezligi uchun) ──
const M_PER_DEG_LAT = 111320;
export const metersBetween = (a, b) => {
  const latMid = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dx = (b.lng - a.lng) * M_PER_DEG_LAT * Math.cos(latMid);
  const dy = (b.lat - a.lat) * M_PER_DEG_LAT;
  return Math.hypot(dx, dy);
};

// ── Bino turlari (marker rangi/harfi + kartochka) ──────────────────────────────
export const OBJECT_TYPES = {
  shifoxona: { label: "Shifoxona", color: "#ef4444", letter: "Sh" },
  maktab: { label: "Maktab", color: "#3b82f6", letter: "M" },
  bogcha: { label: "Bog'cha", color: "#22c55e", letter: "Bg" },
  apartment: { label: "Ko'p kvartirali uy", color: "#38bdf8", letter: "K" },
  house: { label: "Hovli", color: "#a78bfa", letter: "H" },
  savdo: { label: "Savdo markazi", color: "#f59e0b", letter: "S" },
  bozor: { label: "Bozor", color: "#f97316", letter: "Bz" },
  stadion: { label: "Stadion", color: "#10b981", letter: "St" },
  zavod: { label: "Zavod", color: "#9ca3af", letter: "Z" },
  avtostansiya: { label: "Avtostansiya", color: "#eab308", letter: "A" },
  benzin: { label: "Yoqilg'i / gaz", color: "#dc2626", letter: "G" },
  masjid: { label: "Masjid", color: "#14b8a6", letter: "Mj" },
};

// Har blokka bittadan obyekt (15 ta). people = xavf ostidagi odamlar (karta belgisi).
const OBJ_DEFS = [
  { blockIdx: 0, type: "apartment", name: "12-uy · 5 qavatli", people: 142, risk: "Yuqori", note: "Gaz tarmog'i eski.", stats: [["Qavatlar", 5], ["Kvartiralar", 40], ["Aholi", "142 (~4/kv.)"], ["Bolalar", 33], ["Keksalar", 15]] },
  { blockIdx: 1, type: "bozor", name: "Markaziy bozor", people: 1500, risk: "Yuqori", note: "Elektr simlari ortiqcha yuklangan.", stats: [["Rastalar", 540], ["Savdogarlar", 610], ["Kunlik tashrif", 8000]] },
  { blockIdx: 2, type: "maktab", name: "7-umumiy o'rta maktab", people: 1240, risk: "Yuqori", note: "2-smena 14:00 da boshlanadi.", stats: [["O'quvchilar", 1240], ["O'qituvchilar", 86], ["Sinflar", 44], ["Smenalar", 2]] },
  { blockIdx: 3, type: "zavod", name: "G'isht zavodi", people: 240, risk: "O'rta", note: "Yuqori harorat — yong'in xavfi.", stats: [["Xodimlar", 240], ["Smena", 3], ["Pechlar", 4]] },
  { blockIdx: 4, type: "bogcha", name: "12-bolalar bog'chasi", people: 210, risk: "Yuqori", note: "Evakuatsiya rejasi yangilangan.", stats: [["Bolalar", 210], ["Tarbiyachilar", 28], ["Guruhlar", 11]] },
  { blockIdx: 5, type: "avtostansiya", name: "Navbahor avtostansiyasi", people: 300, risk: "Past", note: "", stats: [["Yo'nalishlar", 24], ["Kunlik yo'lovchi", 3200], ["Peronlar", 8]] },
  { blockIdx: 6, type: "house", name: "Yusupovlar hovlisi", people: 6, risk: "Past", note: "Hovlida gaz balloni saqlanadi.", stats: [["Qavatlar", 1], ["Aholi", 6], ["Bolalar", 2], ["Keksalar", 1]] },
  { blockIdx: 7, type: "apartment", name: "9-qavatli yangi uy", people: 254, risk: "Yuqori", note: "Lift nosoz — qutqaruv qiyin.", stats: [["Qavatlar", 9], ["Kvartiralar", 72], ["Aholi", "254 (~3.5/kv.)"], ["Bolalar", 58], ["Keksalar", 27]] },
  { blockIdx: 8, type: "shifoxona", name: "Navbahor tuman shifoxonasi", people: 360, risk: "O'rta", note: "Kislorod balloni — yong'in xavfi.", stats: [["Koyka", 120], ["Bemorlar", 92], ["Shifokorlar", 38], ["Hamshira", 64], ["Bo'limlar", 9]] },
  { blockIdx: 9, type: "benzin", name: "Gaz taqsimlagich shoxobchasi", people: 14, risk: "Yuqori", note: "Portlash xavfi — birinchi navbatdagi obyekt.", stats: [["Kolonkalar", 6], ["Rezervuar", "20 m³"], ["Xodimlar", 8]] },
  { blockIdx: 10, type: "stadion", name: "Navbahor stadioni", people: 0, risk: "Past", note: "Tadbir paytida 8000 kishi yig'iladi.", stats: [["Sig'im", 8000], ["Sektorlar", 12]] },
  { blockIdx: 11, type: "house", name: "Aliyevlar hovlisi", people: 8, risk: "Past", note: "Xususiy 2 qavatli uy.", stats: [["Qavatlar", 2], ["Aholi", 8], ["Bolalar", 3], ["Keksalar", 1]] },
  { blockIdx: 12, type: "savdo", name: "Navbahor savdo markazi", people: 820, risk: "O'rta", note: "Yong'in signalizatsiyasi faol.", stats: [["Do'konlar", 64], ["Xodimlar", 320], ["Kunlik tashrif", 4500], ["Qavatlar", 3]] },
  { blockIdx: 13, type: "masjid", name: "Mahalla masjidi", people: 600, risk: "Past", note: "Juma kuni to'la bo'ladi.", stats: [["Sig'im", 600], ["Xodimlar", 6]] },
  { blockIdx: 14, type: "apartment", name: "5-uy · 7 qavatli", people: 196, risk: "Yuqori", note: "3-qavatda tutun datchigi ishga tushgan.", stats: [["Qavatlar", 7], ["Kvartiralar", 56], ["Aholi", "196 (~3.5/kv.)"], ["Bolalar", 45], ["Keksalar", 21]] },
];
const OFFS = [[0.0004, -0.0005], [-0.0003, 0.0006], [0.0005, 0.0003], [-0.0004, -0.0004], [0.0003, 0.0005], [0.0004, -0.0003], [-0.0004, 0.0004], [0.0005, -0.0004], [-0.0003, -0.0005], [0.0004, 0.0004], [-0.0005, 0.0003], [0.0003, -0.0004], [0.0004, 0.0005], [-0.0004, 0.0003], [0.0005, -0.0003]];
const PHONES = ["+998 90 123-45-67", "+998 91 222-33-44", "+998 93 444-55-66", "+998 94 555-66-77", "+998 99 888-77-66", "+998 97 777-88-99", "+998 98 333-22-11", "+998 95 666-77-88"];

export const HOUSEHOLDS = OBJ_DEFS.map((d, i) => {
  const area = MAHALLA_AREAS[d.blockIdx];
  const off = OFFS[i] || [0, 0];
  return {
    id: `obj-${i + 1}`,
    blockId: area.id,
    head: d.name,
    address: area.name,
    type: d.type,
    typeLabel: OBJECT_TYPES[d.type].label,
    pos: { lat: area.center.lat + off[0], lng: area.center.lng + off[1] },
    people: d.people,
    residents: d.people,
    risk: d.risk,
    phone: PHONES[i % PHONES.length],
    lastInspection: "12.03.2026",
    note: d.note,
    stats: d.stats,
  };
});
export const getHousehold = (id) => HOUSEHOLDS.find((h) => h.id === id) || null;

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
