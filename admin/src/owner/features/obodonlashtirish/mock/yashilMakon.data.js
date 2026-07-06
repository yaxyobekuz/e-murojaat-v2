// Yashil makon — ko'chat ekish hisoboti (demo). Asos: "Yashil makon" milliy dasturi,
// platforma yashilmakon.eco, PF-47 — ko'kalamzorlik 30% (2030).
// Kanonik (Sarnovul MFY, 2025–2026 mavsumi): jami 1 850 ko'chat —
// mevali 720, manzarali buta 640, soyabon daraxt 490; bajarilish 78%.

export const YM_PLACE = "Sarnovul MFY, Baliqchi tumani, Andijon";

const rng = (seed) => {
  const x = Math.sin(seed * 53.9 + 12.7) * 43758.5453;
  return x - Math.floor(x);
};

// Ko'chat turlari — kanonik 3 guruh: mevali 720, manzarali buta 640, soyabon daraxt 490
// (soyabon = bargli 380 + ignabargli 110)
export const TREE_TYPE = {
  ornamental: "Soyabon daraxt (chinor, terak)",
  fruit: "Mevali (o'rik, olma)",
  conifer: "Soyabon — ignabargli (archa, qarag'ay)",
  shrub: "Manzarali buta / jonli to'siq",
};

// Mavsum
export const SEASON = { spring: "Bahor", autumn: "Kuz" };

// Sarnovul MFY ko'chalari — kanonik 14 ta
const MAHALLAS = ["Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik", "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor"];
const TYPES = ["ornamental", "fruit", "conifer", "shrub"];
const SITES = ["Ko'cha bo'yi", "Maktab oldi", "Park hududi", "Daryo bo'yi", "MFY markazi", "Yo'l chet'i"];

const BASE_LAT = 40.9034;
const BASE_LNG = 71.8604;

// Tur bo'yicha ekish partiyalari (8 tadan) — yig'indi: 380 / 720 / 110 / 640 = 1 850
const COUNTS = {
  ornamental: [52, 44, 60, 38, 46, 55, 41, 44],
  fruit: [95, 110, 82, 74, 120, 88, 76, 75],
  conifer: [16, 12, 18, 10, 14, 15, 11, 14],
  shrub: [90, 72, 85, 68, 96, 78, 81, 70],
};

// Ekish yozuvlari — har biri bir joyga, bir mavsumda
export const YM_PLANTINGS = Array.from({ length: 32 }, (_, i) => {
  const mahalla = MAHALLAS[i % MAHALLAS.length];
  const type = TYPES[i % TYPES.length];
  const season = i % 3 === 0 ? "autumn" : "spring";
  const count = COUNTS[type][Math.floor(i / 4)];
  // yashilmakon.eco ga kiritilgan? ~71% (real gap ko'rsatkichi)
  const entered = rng(i * 5.1) < 0.71;
  // Tirik qolish ~88%
  const survivalPct = Math.round((82 + rng(i * 7.3) * 14));
  const lat = Math.round((BASE_LAT + (rng(i * 2.1) - 0.5) * 0.04) * 1e5) / 1e5;
  const lng = Math.round((BASE_LNG + (rng(i * 4.4) - 0.5) * 0.05) * 1e5) / 1e5;

  return {
    id: `ym-${i + 1}`,
    mahalla,
    site: SITES[i % SITES.length],
    type,
    season,
    count,
    entered,
    survivalPct,
    lat,
    lng,
    coords: `${lat}, ${lng}`,
  };
});

// Xarita uchun koordinata chegaralari (normalizatsiya)
export const YM_BOUNDS = {
  minLat: BASE_LAT - 0.024, maxLat: BASE_LAT + 0.024,
  minLng: BASE_LNG - 0.03, maxLng: BASE_LNG + 0.03,
};

const totalPlanted = YM_PLANTINGS.reduce((s, p) => s + p.count, 0);

// Mavsumiy stacked (bahor vs kuz) — oylar bo'yicha, jami 1 850
// (OBODON.plantedSeries bilan bir xil oylik taqsimot)
const MONTHS = ["Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
const SPRING_VALS = [0, 0, 0, 0, 0, 0, 0, 90, 520, 310, 70, 0]; // = 990
const AUTUMN_VALS = [0, 0, 120, 260, 480, 0, 0, 0, 0, 0, 0, 0]; // = 860
export const YM_SEASON_TREND = MONTHS.map((month, i) => ({
  month,
  spring: SPRING_VALS[i],
  autumn: AUTUMN_VALS[i],
}));
export const YM_SEASON_SERIES = [
  { key: "spring", label: "Bahor", color: "#16a34a" },
  { key: "autumn", label: "Kuz", color: "#d97706" },
];

// Ko'cha bo'yicha ekilgan soni
export const YM_BY_MAHALLA = MAHALLAS.map((name) => ({
  key: name,
  value: YM_PLANTINGS.filter((p) => p.mahalla === name).reduce((s, p) => s + p.count, 0),
}));

// Tur bo'yicha donut
export const YM_BY_TYPE = TYPES.map((key) => ({
  key,
  value: YM_PLANTINGS.filter((p) => p.type === key).reduce((s, p) => s + p.count, 0),
}));

export const ymSummary = (() => {
  const entered = YM_PLANTINGS.filter((p) => p.entered).reduce((s, p) => s + p.count, 0);
  const survival = Math.round(
    YM_PLANTINGS.reduce((s, p) => s + p.survivalPct * p.count, 0) / totalPlanted,
  );
  // 2025–2026 mavsumi rejasi — 1850/2370 ≈ 78% bajarilish (kanonik)
  const yearPlan = 2370;
  return {
    planted: totalPlanted,
    yearPlan,
    completionPct: Math.round((totalPlanted / yearPlan) * 100),
    enteredPct: Math.round((entered / totalPlanted) * 100),
    survivalPct: survival,
    // Ko'kalamzorlik (PF-47 target 30%)
    greenCoverage: 17.4,
  };
})();
