// Obodonlashtirish loyihalari xaritasi — Baliqchi tumani, Andijon (prototip, demo).
// Har loyiha bir hudud-zona: yo'l, park, yoritish, ko'kalamzorlashtirish.
// Holat ranglari (rules/02): rejada=ko'k, jarayonda=amber, yakunlangan=yashil.

export const MAP_CENTER = { lat: 40.9034, lng: 71.8604 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Loyiha holati ranglari
export const PROJECT_STATUS = {
  planned: { label: "Rejada", color: "#2563eb", tone: "new" },
  ongoing: { label: "Jarayonda", color: "#d97706", tone: "progress" },
  done: { label: "Yakunlangan", color: "#16a34a", tone: "done" },
};

// Loyiha turlari
export const PROJECT_TYPE = {
  road: "Yo'l qurilishi",
  park: "Park / dam olish",
  lighting: "Ko'cha yoritish",
  greenery: "Ko'kalamzorlashtirish",
  water: "Suv ta'minoti",
};

// Deterministik "tasodifiy" — seed asosida (Math.random ishlatilmaydi)
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Voronoi grid (soliq bilan bir xil usul) — to'liq qoplama, overlap yo'q, burama
const GRID_COLS = 4;
const GRID_ROWS = 3;
const CELL_LAT = 0.0026;
const CELL_LNG = 0.0034;
const JITTER = 0.34;
const ORIGIN = { lat: 40.9058, lng: 71.8548 };

const BBOX = {
  minLat: ORIGIN.lat - (GRID_ROWS - 1) * CELL_LAT - CELL_LAT * 0.6,
  maxLat: ORIGIN.lat + CELL_LAT * 0.6,
  minLng: ORIGIN.lng - CELL_LNG * 0.6,
  maxLng: ORIGIN.lng + (GRID_COLS - 1) * CELL_LNG + CELL_LNG * 0.6,
};

// 12 loyiha (chapdan-o'ngga, yuqoridan-pastga) — mahalla masshtabi (mln so'm)
// trees — faqat ko'kalamzor/park loyihalarida (jami 910 tup — 1 850 mavsumiy ko'chatning bir qismi)
const META = [
  { name: "Maslahat ko'chasi yo'li", type: "road", status: "done", progress: 100, budget: 980_000_000 },
  { name: "Sarnovul mahalla parki", type: "park", status: "ongoing", progress: 64, budget: 680_000_000, trees: 140 },
  { name: "Urganji ko'chasi yoritish", type: "lighting", status: "planned", progress: 0, budget: 240_000_000 },
  { name: "Daryo bo'yi ko'kalamzori", type: "greenery", status: "ongoing", progress: 42, budget: 210_000_000, trees: 260 },
  { name: "Maktab oldi maydoni", type: "park", status: "done", progress: 100, budget: 320_000_000, trees: 90 },
  { name: "Ichki yo'llar ta'miri", type: "road", status: "ongoing", progress: 78, budget: 760_000_000 },
  { name: "Suv quvuri yangilash", type: "water", status: "planned", progress: 0, budget: 540_000_000 },
  { name: "Guzar atrofi yoritish", type: "lighting", status: "done", progress: 100, budget: 160_000_000 },
  { name: "Sport maydonchasi", type: "park", status: "ongoing", progress: 55, budget: 280_000_000, trees: 40 },
  { name: "Avtobus bekati zonasi", type: "road", status: "planned", progress: 0, budget: 120_000_000 },
  { name: "Ko'cha daraxtlari ekish", type: "greenery", status: "done", progress: 100, budget: 95_000_000, trees: 380 },
  { name: "Quduq va nasos stansiyasi", type: "water", status: "ongoing", progress: 33, budget: 430_000_000 },
];

// Yashil maydon turlari (daraxt soni bo'lgan loyihalar)
export const GREEN_TYPES = ["greenery", "park"];
export const isGreen = (p) => GREEN_TYPES.includes(p.type) && p.info.trees > 0;
export const isConstruction = (p) => p.status === "ongoing";

const SEEDS = META.map((m, i) => {
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

// Koordinataga bog'liq deterministik warp (burama chegara, qo'shnilar mos)
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
      const w = warp(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
      out.push({ lat: w.y, lng: w.x });
    }
  }
  return out;
};

export const OBOD_PROJECTS = SEEDS.map((seed, i) => ({
  id: `obod-loyiha-${i + 1}`,
  name: seed.name,
  type: seed.type,
  status: seed.status,
  // marker uchun markaz nuqtasi (seed o'rni)
  center: { lat: seed.y, lng: seed.x },
  info: {
    typeLabel: PROJECT_TYPE[seed.type],
    budgetUzs: seed.budget,
    progress: seed.progress,
    // bajarilgan summa progressga mos
    spentUzs: Math.round((seed.budget * seed.progress) / 100),
    trees: seed.trees || 0,
  },
  path: warpPoly(voronoiCell(seed, SEEDS)),
}));

// KPI yig'indi (filtrlangan ro'yxatga ham ishlaydi)
export const summarize = (projects) => {
  const acc = projects.reduce(
    (s, p) => {
      s.count += 1;
      s.budgetUzs += p.info.budgetUzs;
      s.spentUzs += p.info.spentUzs;
      if (p.status === "done") s.done += 1;
      if (p.status === "ongoing") s.ongoing += 1;
      return s;
    },
    { count: 0, budgetUzs: 0, spentUzs: 0, done: 0, ongoing: 0 },
  );
  acc.avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.info.progress, 0) / projects.length)
    : 0;
  return acc;
};

export const obodSummary = summarize(OBOD_PROJECTS);
