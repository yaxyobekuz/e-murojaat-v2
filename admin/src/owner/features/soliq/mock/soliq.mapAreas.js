// Soliq xaritasi — Sarnovul MFY, Baliqchi tumani, Andijon (prototip, demo).
// Mahalla bir nechta blokga bo'lingan. Har blok soliq holatiga qarab bo'yaladi:
//   paid    = yashil  (to'liq to'lagan)
//   partial = sariq   (yarim to'lagan)
//   unpaid  = qizil   (qarzdor)
// Koordinatalar Baliqchi markazi atrofida (taxminiy, demo uchun).

// Grid markazi (5×3 katakning o'rtasi) — kamera shu nuqtaga qaraydi
export const MAP_CENTER = { lat: 40.9034, lng: 71.8604 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Soliq holati ranglari — rules/02 holat rang xaritasi
export const TAX_STATUS = {
  paid: { label: "To'liq to'lagan", color: "#16a34a", tone: "done" },
  partial: { label: "Yarim to'lagan", color: "#d97706", tone: "progress" },
  unpaid: { label: "Qarzdor", color: "#dc2626", tone: "danger" },
};

// Deterministik "tasodifiy" — seed asosida (Math.random ishlatilmaydi)
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Zonalar Voronoi diagrammasi sifatida quriladi: maydon to'liq yacheykalarga
// bo'linadi — ochiq joy QOLMAYDI va yacheykalar bir-biriga KIRMAYDI. Har yacheyka
// keyin biroz ichkariga siqiladi (inset), shunda qo'shnilar orasida nozik gap ko'rinadi.
const GRID_COLS = 5;
const GRID_ROWS = 3;
const CELL_LAT = 0.0026; // seed grid qadami (lat)
const CELL_LNG = 0.0032; // seed grid qadami (lng)
const JITTER = 0.34; // seed nuqta ±34% qadamga suriladi (notekis Voronoi)
const ORIGIN = { lat: 40.9060, lng: 71.8540 }; // chap-yuqori seed

// Voronoi maydoni — seed grididan biroz kengroq (chetdagi yacheykalar yopiq bo'lsin)
const BBOX = {
  minLat: ORIGIN.lat - (GRID_ROWS - 1) * CELL_LAT - CELL_LAT * 0.6,
  maxLat: ORIGIN.lat + CELL_LAT * 0.6,
  minLng: ORIGIN.lng - CELL_LNG * 0.6,
  maxLng: ORIGIN.lng + (GRID_COLS - 1) * CELL_LNG + CELL_LNG * 0.6,
};

// 15 yacheyka uchun holat + ko'rsatkichlar (chapdan-o'ngga, yuqoridan-pastga)
const CELL_META = [
  { status: "paid", rate: 100, hh: 142 },
  { status: "partial", rate: 68, hh: 168 },
  { status: "paid", rate: 95, hh: 110 },
  { status: "unpaid", rate: 24, hh: 121 },
  { status: "paid", rate: 98, hh: 154 },
  { status: "partial", rate: 55, hh: 132 },
  { status: "unpaid", rate: 18, hh: 97 },
  { status: "partial", rate: 61, hh: 88 },
  { status: "paid", rate: 92, hh: 173 },
  { status: "unpaid", rate: 31, hh: 105 },
  { status: "paid", rate: 96, hh: 76 },
  { status: "unpaid", rate: 12, hh: 119 },
  { status: "partial", rate: 49, hh: 94 },
  { status: "paid", rate: 100, hh: 138 },
  { status: "partial", rate: 72, hh: 81 },
];

// Seed nuqtalar — grid + jitter (lng=x, lat=y bilan ishlaymiz)
const SEEDS = CELL_META.map((m, i) => {
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  const s = i + 1;
  const jx = (rng(s * 2.9) - 0.5) * 2 * JITTER * CELL_LNG;
  const jy = (rng(s * 1.3) - 0.5) * 2 * JITTER * CELL_LAT;
  return {
    ...m,
    x: ORIGIN.lng + col * CELL_LNG + jx, // lng
    y: ORIGIN.lat - row * CELL_LAT + jy, // lat
  };
});

// Bir poligonni yarim-tekislik (a·x + b·y <= c) bo'yicha kesish (Sutherland-Hodgman)
const clipHalfPlane = (poly, a, b, c) => {
  const out = [];
  const inside = (p) => a * p.x + b * p.y <= c + 1e-12;
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const prev = poly[(i + poly.length - 1) % poly.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn !== prevIn) {
      // kesishish nuqtasi
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

// Bitta seed uchun Voronoi yacheykasi = bbox ni barcha qo'shnilarning
// perpendikulyar bissektrisalari bo'yicha kesib chiqish
const voronoiCell = (seed, all) => {
  let poly = [
    { x: BBOX.minLng, y: BBOX.minLat },
    { x: BBOX.maxLng, y: BBOX.minLat },
    { x: BBOX.maxLng, y: BBOX.maxLat },
    { x: BBOX.minLng, y: BBOX.maxLat },
  ];
  for (const other of all) {
    if (other === seed) continue;
    // {p : dist(p,seed) <= dist(p,other)} -> a·x+b·y<=c
    const a = other.x - seed.x;
    const b = other.y - seed.y;
    const c = (other.x * other.x - seed.x * seed.x + other.y * other.y - seed.y * seed.y) / 2;
    poly = clipHalfPlane(poly, a, b, c);
    if (poly.length === 0) break;
  }
  return poly;
};

// Koordinataga BOG'LIQ deterministik siljish (warp). Bir xil (x,y) har doim bir xil
// joyga ko'chadi -> ikki qo'shni yacheykaning umumiy chegarasi BIR XIL egiladi,
// shuning uchun gap ham, overlap ham paydo bo'lmaydi. Natija: egri-bugri, mos shakllar.
const WARP = 0.00026; // siljish amplitudasi (~28m)
const warp = (x, y) => {
  const dx =
    Math.sin(x * 9100 + y * 3700) * 0.6 + Math.sin(x * 21300 - y * 8700) * 0.4;
  const dy =
    Math.cos(x * 8300 - y * 4100) * 0.6 + Math.cos(x * 19700 + y * 9900) * 0.4;
  return { x: x + dx * WARP, y: y + dy * WARP };
};

// Har qirraga oraliq nuqtalar qo'shib, hammasini warp qilamiz (silliq emas, burama)
const SUBDIV = 4; // har qirra nechta bo'lakka bo'linadi
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

// Holatga qarab pul ko'rsatkichlarini deterministik hosil qilamiz
const buildInfo = (b) => {
  const perHh = 2_300_000 + Math.round(rng(b.c[0] * b.c[1]) * 900_000);
  const assessedUzs = b.hh * perHh;
  const collectedUzs = Math.round((assessedUzs * b.rate) / 100);
  return {
    households: b.hh,
    assessedUzs,
    collectedUzs,
    debtUzs: assessedUzs - collectedUzs,
    collectionRate: b.rate,
  };
};

export const MAHALLA_AREAS = BLOCKS.map((b, i) => ({
  id: `sarnovul-blok-${i + 1}`,
  name: `Sarnovul ${i + 1}-blok`,
  status: b.status,
  info: buildInfo(b),
  path: b.path,
}));

// Berilgan hududlar bo'yicha yig'indi (KPI uchun) — filtrlangan ro'yxatga ham ishlaydi
export const summarize = (zones) => {
  const acc = zones.reduce(
    (s, a) => {
      s.households += a.info.households;
      s.assessedUzs += a.info.assessedUzs;
      s.collectedUzs += a.info.collectedUzs;
      s.debtUzs += a.info.debtUzs;
      return s;
    },
    { households: 0, assessedUzs: 0, collectedUzs: 0, debtUzs: 0 },
  );
  acc.collectionRate = acc.assessedUzs
    ? Math.round((acc.collectedUzs / acc.assessedUzs) * 100)
    : 0;
  return acc;
};

export const mahallaSummary = summarize(MAHALLA_AREAS);
