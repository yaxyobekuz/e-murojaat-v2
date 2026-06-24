// Yashil makon — ko'chat ekish hisoboti (demo). Asos: "Yashil makon" milliy dasturi (2021-dan,
// yillik 200 mln ko'chat target), platforma yashilmakon.eco (tizimga kiritilgan %),
// PF-47 (25.03.2026) — ko'kalamzorlik 14.2% → 30% (2030). Raqamlar deterministik — demo, real emas.

export const YM_PLACE = "Baliqchi tumani, Andijon";

const rng = (seed) => {
  const x = Math.sin(seed * 53.9 + 12.7) * 43758.5453;
  return x - Math.floor(x);
};

// Ko'chat turlari
export const TREE_TYPE = {
  ornamental: "Manzarali (chinor, terak)",
  fruit: "Mevali (o'rik, olma)",
  conifer: "Ignabargli (archa, qarag'ay)",
  shrub: "Buta / jonli to'siq",
};

// Mavsum
export const SEASON = { spring: "Bahor", autumn: "Kuz" };

const MAHALLAS = ["Sarnovul", "Markaz", "Yangiobod", "Bo'ston", "Guliston", "Navbahor", "Do'stlik", "Oltinko'l", "Chinor", "Bahor"];
const TYPES = ["ornamental", "fruit", "conifer", "shrub"];
const SITES = ["Ko'cha bo'yi", "Maktab oldi", "Park hududi", "Daryo bo'yi", "MFY markazi", "Yo'l chet'i"];

const BASE_LAT = 40.9034;
const BASE_LNG = 71.8604;

// Ekish yozuvlari — har biri bir joyga, bir mavsumda
export const YM_PLANTINGS = Array.from({ length: 32 }, (_, i) => {
  const mahalla = MAHALLAS[i % MAHALLAS.length];
  const type = TYPES[i % TYPES.length];
  const season = i % 3 === 0 ? "autumn" : "spring";
  const count = 50 + Math.round(rng(i * 3.7) * 850);
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

// Mavsumiy stacked (bahor vs kuz) — oylar bo'yicha
const MONTHS = ["Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
// Ekish kuz (okt-noy) va bahor (mar-may) da
const SPRING_M = { Mar: 1, Apr: 1, May: 1 };
const AUTUMN_M = { Okt: 1, Noy: 1 };
export const YM_SEASON_TREND = MONTHS.map((month, i) => ({
  month,
  spring: SPRING_M[month] ? Math.round(3000 + rng(i * 6.2) * 5000) : 0,
  autumn: AUTUMN_M[month] ? Math.round(2500 + rng(i * 8.8) * 4500) : 0,
}));
export const YM_SEASON_SERIES = [
  { key: "spring", label: "Bahor", color: "#16a34a" },
  { key: "autumn", label: "Kuz", color: "#d97706" },
];

// Mahalla bo'yicha ekilgan soni
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
  // Tuman rejasi (demo ulush) — milliy 200 mln dan kichik bo'lak
  const yearPlan = 28000;
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
