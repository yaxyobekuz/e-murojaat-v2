// Aqlli chiqindi idishlari (smart bins) — har mahallada 10 ta chelak, to'lish foizi,
// olib ketish jadvali. Asos: VM 648-son sensorli idish + GPS axlat mashinasi. Demo, deterministik.

const rng = (seed) => {
  const x = Math.sin(seed * 84.7 + 19.3) * 43758.5453;
  return x - Math.floor(x);
};

export const BIN_MAHALLAS = [
  "Sarnovul", "Markaz", "Yangiobod", "Bo'ston", "Guliston",
  "Navbahor", "Do'stlik", "Oltinko'l", "Chinor", "Bahor",
];

const STREETS = ["Markaziy", "Bog'", "Navoiy", "Amir Temur", "Mustaqillik", "Yoshlik", "Chinor", "Guliston", "Bahor", "Do'stlik"];

// Holat — to'lish foiziga qarab
export const BIN_STATUS = {
  empty: { label: "Bo'sh", tone: "done", color: "#22c55e", from: 0 },
  filling: { label: "To'lyapti", tone: "progress", color: "#84cc16", from: 35 },
  high: { label: "To'lay deb qoldi", tone: "progress", color: "#f59e0b", from: 70 },
  full: { label: "To'la", tone: "danger", color: "#ef4444", from: 90 },
};
export const fillStatus = (pct) => {
  if (pct >= 90) return "full";
  if (pct >= 70) return "high";
  if (pct >= 35) return "filling";
  return "empty";
};

const TODAY = new Date("2026-06-27T13:00:00");

// Bitta mahalla uchun 10 ta chelak
const buildBins = (mahalla, mi) => Array.from({ length: 10 }, (_, k) => {
  const seed = mi * 100 + k + 1;
  const fill = Math.round(rng(seed * 2.3) * 100);
  const capacity = [240, 360, 660, 1100][Math.floor(rng(seed * 3.1) * 4)]; // litr
  // oxirgi bo'shatilgan — to'lish foiziga teskari (ko'p to'lsa ko'p vaqt o'tgan)
  const hoursAgo = Math.round((fill / 100) * 60 + rng(seed * 4.4) * 12);
  const emptied = new Date(TODAY.getTime() - hoursAgo * 3600 * 1000);
  // keyingi olib ketish (ETA) — to'la bo'lsa tezroq
  const etaHours = fill >= 90 ? 1 + Math.floor(rng(seed * 5.5) * 3) : fill >= 70 ? 4 + Math.floor(rng(seed * 5.5) * 8) : 12 + Math.floor(rng(seed * 5.5) * 24);
  const next = new Date(TODAY.getTime() + etaHours * 3600 * 1000);

  return {
    id: `BIN-${String(mi + 1).padStart(2, "0")}-${String(k + 1).padStart(2, "0")}`,
    mahalla,
    street: `${STREETS[k % STREETS.length]} ko'chasi`,
    fill,
    capacity,
    status: fillStatus(fill),
    lastEmptied: emptied.toISOString(),
    nextEta: next.toISOString(),
    etaHours,
    hoursAgo,
  };
});

export const BINS_BY_MAHALLA = BIN_MAHALLAS.map((m, i) => ({ mahalla: m, bins: buildBins(m, i) }));

// Mahalla bo'yicha yig'indi
export const binMahallaStats = BINS_BY_MAHALLA.map(({ mahalla, bins }) => {
  const avgFill = Math.round(bins.reduce((s, b) => s + b.fill, 0) / bins.length);
  const full = bins.filter((b) => b.status === "full").length;
  const high = bins.filter((b) => b.status === "high").length;
  // olib ketish bajarilishi — bo'sh + to'lyapti idishlar ulushi (o'z vaqtida xizmat)
  const served = Math.round((bins.filter((b) => b.fill < 70).length / bins.length) * 100);
  return { mahalla, avgFill, full, high, served };
});

// ── Chiqindi turlari (tarkib) — qancha plastik, qog'oz, organik va h.k. ──
// Asos: O'zbekistonda QMC tarkibi (organik ~50%, plastik ~17%, qog'oz ~10%...) — demo.
export const WASTE_TYPES = {
  organic: { label: "Organik", color: "#84cc16", pct: 48, recyclable: false },
  plastic: { label: "Plastik", color: "#3b82f6", pct: 18, recyclable: true },
  paper: { label: "Qog'oz / karton", color: "#f59e0b", pct: 12, recyclable: true },
  glass: { label: "Shisha", color: "#06b6d4", pct: 7, recyclable: true },
  metal: { label: "Metall", color: "#94a3b8", pct: 5, recyclable: true },
  other: { label: "Aralash / boshqa", color: "#a78bfa", pct: 10, recyclable: false },
};

// Umumiy oylik hajmga (binSummary dan keyin hisoblanadi) nisbatan tonna
export const wasteComposition = (() => {
  const monthlyTons = 1850; // demo umumiy oylik QMC (tonna)
  return Object.entries(WASTE_TYPES).map(([key, t]) => ({
    key,
    label: t.label,
    color: t.color,
    pct: t.pct,
    tons: Math.round((monthlyTons * t.pct) / 100),
    recyclable: t.recyclable,
  }));
})();

export const wasteSummary = (() => {
  const recyclablePct = wasteComposition.filter((w) => w.recyclable).reduce((s, w) => s + w.pct, 0);
  const plastic = wasteComposition.find((w) => w.key === "plastic");
  return {
    recyclablePct,
    plasticTons: plastic.tons,
    plasticPct: plastic.pct,
    monthlyTons: 1850,
  };
})();

// Umumiy KPI
export const binSummary = (() => {
  const all = BINS_BY_MAHALLA.flatMap((m) => m.bins);
  const avgFill = Math.round(all.reduce((s, b) => s + b.fill, 0) / all.length);
  const full = all.filter((b) => b.status === "full").length;
  const totalCapacity = all.reduce((s, b) => s + b.capacity, 0);
  const collected = Math.round((all.filter((b) => b.fill < 70).length / all.length) * 100);
  // o'rtacha olib ketish davriyligi (soat) — faol idishlar ETA o'rtachasi
  const avgEta = Math.round(all.reduce((s, b) => s + b.etaHours, 0) / all.length);
  return {
    totalBins: all.length,
    avgFill,
    full,
    collected,
    avgEta,
    totalCapacity,
  };
})();
