// Chinobod (Baliqchi tumani) binolarini yasaydi: OSM'da bu hudud binolari chizilmagan
// (bbox'da bor-yo'g'i 13 ta), shuning uchun real OSM ko'chalari bo'ylab deterministik
// demo uy izlari generatsiya qilinadi + mavjud real binolar qo'shiladi.
// Ishga tushirish: node scripts/generate-chinobod-buildings.mjs
// Natija: src/owner/features/asosiy/data/chinobodBuildings.geojson
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BBOX = { s: 40.8613, w: 71.9103, n: 40.8973, e: 71.9583 }; // ~4km, markaz: 40.87932, 71.93425
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/owner/features/asosiy/data/chinobodBuildings.geojson",
);

// deterministik RNG — har run bir xil natija beradi
const mulberry32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rnd = mulberry32(20260705);

// lokal metr proyeksiyasi (buildingElement.js bilan bir xil konstantalar)
const LAT0 = (BBOX.s + BBOX.n) / 2;
const M_LNG = 111_320 * Math.cos((LAT0 * Math.PI) / 180);
const M_LAT = 110_540;
const toXY = ([lon, lat]) => [(lon - BBOX.w) * M_LNG, (lat - BBOX.s) * M_LAT];
const toLL = ([x, y]) => [
  Math.round((x / M_LNG + BBOX.w) * 1e6) / 1e6,
  Math.round((y / M_LAT + BBOX.s) * 1e6) / 1e6,
];

const q = `[out:json][timeout:120];
(way["building"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});)->.b;
(way["highway"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});)->.h;
(way["landuse"="residential"](${BBOX.s},${BBOX.w},${BBOX.n},${BBOX.e});)->.l;
.b out geom;.h out geom;.l out geom;`;
const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: { "User-Agent": "e-murojaat-demo/1.0" },
  body: "data=" + encodeURIComponent(q),
});
if (!res.ok) throw new Error(`Overpass ${res.status}`);
const { elements } = await res.json();

const realBuildings = elements.filter((e) => e.tags?.building && e.geometry?.length >= 4);
const roads = elements.filter((e) => e.tags?.highway && e.geometry?.length >= 2);
const landuse = elements
  .filter((e) => e.tags?.landuse === "residential" && e.geometry?.length >= 4)
  .map((e) => e.geometry.map((p) => toXY([p.lon, p.lat])));

const pointInRing = ([x, y], ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const inResidential = (pt) => landuse.some((r) => pointInRing(pt, r));

// mahalla ko'chalari — har doim; kattaroq yo'llar — faqat turar-joy zonasi ichida
const ALWAYS = new Set(["residential", "living_street"]);
const MASKED = new Set(["service", "unclassified", "tertiary", "secondary", "primary"]);

// to'qnashuvni oldini olish — 12m katakli grid, markazlar orasi kamida 15m
const grid = new Map();
const cellOf = ([x, y]) => `${Math.floor(x / 12)}:${Math.floor(y / 12)}`;
const tooClose = ([x, y]) => {
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = -2; dy <= 2; dy++) {
      const pts = grid.get(`${Math.floor(x / 12) + dx}:${Math.floor(y / 12) + dy}`);
      if (pts) for (const [px, py] of pts) if ((px - x) ** 2 + (py - y) ** 2 < 15 ** 2) return true;
    }
  return false;
};
const occupy = (pt) => {
  const c = cellOf(pt);
  if (!grid.has(c)) grid.set(c, []);
  grid.get(c).push(pt);
};

const features = [];
const pushHouse = (center, dir, normal, w, d, height) => {
  const [cx, cy] = center;
  const hw = w / 2, hd = d / 2;
  const corners = [
    [cx - dir[0] * hw - normal[0] * hd, cy - dir[1] * hw - normal[1] * hd],
    [cx + dir[0] * hw - normal[0] * hd, cy + dir[1] * hw - normal[1] * hd],
    [cx + dir[0] * hw + normal[0] * hd, cy + dir[1] * hw + normal[1] * hd],
    [cx - dir[0] * hw + normal[0] * hd, cy - dir[1] * hw + normal[1] * hd],
  ];
  const ring = [...corners, corners[0]].map(toLL);
  features.push({
    type: "Feature",
    geometry: { type: "Polygon", coordinates: [ring] },
    properties: { height },
  });
};

// avval real binolar — grid'ni ham band qiladi
const TYPE_HEIGHT = { apartments: 12, school: 8, university: 10, hospital: 10, mosque: 8, commercial: 8 };
for (const b of realBuildings) {
  const ring = b.geometry.map((p) => [
    Math.round(p.lon * 1e6) / 1e6,
    Math.round(p.lat * 1e6) / 1e6,
  ]);
  const h = parseFloat(b.tags.height) || parseFloat(b.tags["building:levels"]) * 3 || TYPE_HEIGHT[b.tags.building] || 4;
  features.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [ring] }, properties: { height: h } });
  const xy = b.geometry.map((p) => toXY([p.lon, p.lat]));
  occupy([xy.reduce((s, p) => s + p[0], 0) / xy.length, xy.reduce((s, p) => s + p[1], 0) / xy.length]);
}

const XMAX = (BBOX.e - BBOX.w) * M_LNG;
const YMAX = (BBOX.n - BBOX.s) * M_LAT;
let generated = 0;
for (const road of roads) {
  const cls = road.tags.highway;
  if (!ALWAYS.has(cls) && !MASKED.has(cls)) continue;
  const pts = road.geometry.map((p) => toXY([p.lon, p.lat]));
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const segLen = Math.hypot(x2 - x1, y2 - y1);
    if (segLen < 14) continue;
    const dir = [(x2 - x1) / segLen, (y2 - y1) / segLen];
    const normal = [-dir[1], dir[0]];
    // segment boshi/oxiridan 8m chekinamiz (chorraha zonasi)
    for (let t = 8; t < segLen - 8; t += 18 + rnd() * 8) {
      const px = x1 + dir[0] * t;
      const py = y1 + dir[1] * t;
      for (const side of [-1, 1]) {
        if (rnd() < 0.08) continue; // ba'zi joylar bo'sh qoladi
        const setback = 7 + rnd() * 4;
        const depth = 9 + rnd() * 5;
        const width = 10 + rnd() * 6;
        const cx = px + normal[0] * side * (setback + depth / 2);
        const cy = py + normal[1] * side * (setback + depth / 2);
        if (cx < 20 || cy < 20 || cx > XMAX - 20 || cy > YMAX - 20) continue;
        if (!ALWAYS.has(cls) && !inResidential([cx, cy])) continue;
        if (ALWAYS.has(cls) && !inResidential([cx, cy]) && rnd() < 0.2) continue; // zona tashqarisida biroz siyraklashadi
        if (tooClose([cx, cy])) continue;
        const r = rnd();
        const height = r < 0.78 ? 4 : r < 0.93 ? 7 : r < 0.985 ? 10 : 13;
        pushHouse([cx, cy], dir, normal, width, depth, height);
        occupy([cx, cy]);
        generated++;
      }
    }
  }
}

writeFileSync(OUT, JSON.stringify({ type: "FeatureCollection", features }));
console.log(`✓ ${features.length} bino (${realBuildings.length} real OSM + ${generated} generatsiya) → ${OUT}`);
