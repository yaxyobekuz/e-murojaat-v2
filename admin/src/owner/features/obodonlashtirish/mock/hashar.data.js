// Tozalov & umumiy hashar (demo). Asos: PQ-234 (25.06.2024) — mahalla obodonlashtirish,
// "Eng toza mahalla" reytingi; hashar — uyushtirilgan tadbir (majburiy chastota normasi yo'q).
// Raqamlar deterministik (Math.random yo'q) — demo, real emas.

export const HASHAR_PLACE = "Baliqchi tumani, Andijon";
const TODAY = new Date("2026-06-24");

// Tadbir turi
export const EVENT_TYPE = {
  cleanup: "Umumiy tozalash (hashar)",
  greening: "Ko'kalamzorlashtirish",
  sanitation: "Sanitar tozalash",
  repair: "Obodonlashtirish ta'mir",
};

const rng = (seed) => {
  const x = Math.sin(seed * 61.3 + 28.9) * 43758.5453;
  return x - Math.floor(x);
};

const MAHALLAS = ["Sarnovul", "Markaz", "Yangiobod", "Bo'ston", "Guliston", "Navbahor", "Do'stlik", "Oltinko'l", "Chinor", "Bahor"];
const TYPES = ["cleanup", "greening", "sanitation", "repair"];

// Tadbirlar (so'nggi 6 oy)
export const HASHAR_EVENTS = Array.from({ length: 30 }, (_, i) => {
  const daysBack = Math.floor(rng(i * 2.6) * 170);
  const date = new Date(TODAY);
  date.setDate(TODAY.getDate() - daysBack);
  const type = TYPES[i % TYPES.length];
  const participants = 30 + Math.round(rng(i * 3.9) * 220);
  const areaHa = Math.round((0.5 + rng(i * 5.2) * 6) * 10) / 10;
  const treesPlanted = type === "greening" ? 20 + Math.round(rng(i * 7.1) * 180) : 0;

  return {
    id: `hashar-${i + 1}`,
    date: date.toISOString().slice(0, 10),
    mahalla: MAHALLAS[i % MAHALLAS.length],
    type,
    participants,
    areaHa,
    treesPlanted,
    result: type === "greening" ? `${treesPlanted} ko'chat ekildi` : `${areaHa} ga tozalandi`,
  };
});

// Oylik tadbir soni (so'nggi 12 oy)
const MONTHS = ["Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
// Bahor/kuz da ko'proq hashar
const PEAK = { Mar: 1, Apr: 1, May: 1, Okt: 1, Noy: 1 };
export const HASHAR_TREND = MONTHS.map((month, i) => ({
  month,
  value: (PEAK[month] ? 5 : 2) + Math.round(rng(i * 6.4) * 3),
}));

// Mahalla reytingi (Eng toza mahalla) — ball
export const HASHAR_RANKING = MAHALLAS.map((name, i) => ({
  key: name,
  value: 60 + Math.round(rng(i * 4.8) * 38), // 60-98 ball
})).sort((a, b) => b.value - a.value);

// Tadbir turi donut
export const HASHAR_BY_TYPE = TYPES.map((key) => ({
  key,
  value: HASHAR_EVENTS.filter((e) => e.type === key).length,
}));

export const hasharSummary = (() => {
  const participants = HASHAR_EVENTS.reduce((s, e) => s + e.participants, 0);
  const area = Math.round(HASHAR_EVENTS.reduce((s, e) => s + e.areaHa, 0) * 10) / 10;
  const trees = HASHAR_EVENTS.reduce((s, e) => s + e.treesPlanted, 0);
  // Tuman reytingidagi o'rni (demo)
  return {
    events: HASHAR_EVENTS.length,
    participants,
    area,
    trees,
    topMahalla: HASHAR_RANKING[0],
    rank: 3,
  };
})();
