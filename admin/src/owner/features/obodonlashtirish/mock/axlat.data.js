// Axlat mashinasi (qattiq maishiy chiqindi — QMC) demo ma'lumotlari.
// Norma: VM 95-son (06.02.2019) — ko'p qavatli ≥1×/kun, xususiy sektor ≥1×/3 kun ("signal" usuli).
// Operator reytingi: VM 648-son (16.10.2025) — qizil/sariq/yashil.
// Barcha raqamlar deterministik (seed asosida, Math.random yo'q) — demo, real emas.

export const AXLAT_PLACE = "Sarnovul MFY, Baliqchi tumani, Andijon";
const TODAY = new Date("2026-06-24");

// Holat ranglari (rules/02): keldi=yashil, kechikdi=amber, kelmadi=qizil
export const ROUTE_STATUS = {
  done: { label: "Keldi", tone: "done" },
  late: { label: "Kechikdi", tone: "progress" },
  missed: { label: "Kelmadi", tone: "danger" },
};

// Norma turi
export const SCHEDULE_NORM = {
  daily: "Har kuni (1×/kun)",
  every3: "3 kunda 1 marta",
};

const rng = (seed) => {
  const x = Math.sin(seed * 91.7 + 47.3) * 43758.5453;
  return x - Math.floor(x);
};

const MAHALLAS = [
  "Sarnovul", "Navoiy", "Bobur", "Amir Temur", "Fidokor", "Istiqlol", "Do'stlik",
  "Bog'", "Chinor", "Guliston", "Mustaqillik", "Yangi hayot", "Marvarid", "Oqtepa",
];

// Marshrutlar — ko'p qavatli (daily) yoki xususiy sektor (every3)
const META = [
  { name: "M-1 Sarnovul", norm: "daily", houses: 480, lateMin: 12 },
  { name: "M-2 Navoiy", norm: "daily", houses: 360, lateMin: 0 },
  { name: "M-3 Bobur", norm: "every3", houses: 220, lateMin: 0 },
  { name: "M-4 Amir Temur", norm: "every3", houses: 180, lateMin: 0 },
  { name: "M-5 Fidokor", norm: "daily", houses: 410, lateMin: 35 },
  { name: "M-6 Istiqlol", norm: "every3", houses: 240, lateMin: 0 },
  { name: "M-7 Do'stlik", norm: "daily", houses: 300, lateMin: 8 },
  { name: "M-8 Bog'", norm: "every3", houses: 160, lateMin: 0 },
  { name: "M-9 Chinor", norm: "daily", houses: 350, lateMin: 0 },
  { name: "M-10 Guliston", norm: "every3", houses: 200, lateMin: 0 },
  { name: "M-11 Mustaqillik", norm: "daily", houses: 280, lateMin: 0 },
  { name: "M-12 Yangi hayot", norm: "every3", houses: 190, lateMin: 0 },
];

// Holatni aniqlash: missed → kechagi kun ham qoldirilgan; late → kechikkan; aks holda keldi
const deriveStatus = (m, i) => {
  if (rng(i + 1) < 0.12) return "missed"; // ~12% kelmay qolgan
  if (m.lateMin > 0) return "late";
  return "done";
};

const fmtTime = (h, min) => `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

export const AXLAT_ROUTES = META.map((m, i) => {
  const status = deriveStatus(m, i);
  // Oxirgi kelgan vaqt — bugun (done/late) yoki normaga ko'ra ortda (missed)
  const daysBack = status === "missed" ? (m.norm === "daily" ? 2 : 4) : 0;
  const last = new Date(TODAY);
  last.setDate(TODAY.getDate() - daysBack);
  const h = 6 + Math.floor(rng(i * 3.1) * 4);
  const min = Math.floor(rng(i * 5.7) * 60);
  // Keyingi reja — normaga ko'ra
  const next = new Date(last);
  next.setDate(last.getDate() + (m.norm === "daily" ? 1 : 3));

  const plannedVolume = Math.round(m.houses * (m.norm === "daily" ? 0.014 : 0.04) * 10) / 10; // m³
  const collectedVolume = status === "missed" ? 0 : Math.round(plannedVolume * (0.85 + rng(i * 2.3) * 0.15) * 10) / 10;

  return {
    id: `axlat-route-${i + 1}`,
    name: m.name,
    mahalla: MAHALLAS[i % MAHALLAS.length],
    norm: m.norm,
    houses: m.houses,
    status,
    lastArrival: status === "missed" ? null : `${fmtTime(h, min)}`,
    lastDate: last.toISOString().slice(0, 10),
    nextPlanned: next.toISOString().slice(0, 10),
    lateMin: status === "late" ? m.lateMin : 0,
    plannedVolume,
    collectedVolume,
  };
});

// 12 oylik to'plangan hajm (m³) — yozda biroz ko'p
const MONTHS = ["Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
const SEASON = [1.05, 1.08, 1.0, 0.95, 0.9, 0.88, 0.85, 0.86, 0.92, 0.98, 1.03, 1.07];
const BASE_VOLUME = 1850;
export const AXLAT_VOLUME_TREND = MONTHS.map((month, i) => ({
  month,
  value: Math.round(BASE_VOLUME * SEASON[i] * (0.97 + rng(i * 7.7) * 0.06)),
}));

// Mahalla bo'yicha reys soni (oylik)
export const AXLAT_BY_MAHALLA = MAHALLAS.map((name, i) => ({
  key: name,
  value: Math.round(18 + rng(i * 4.4) * 14),
}));

// Operator reytingi (VM 648) — qizil/sariq/yashil ulush (marshrut soni)
export const AXLAT_OPERATOR_RATING = [
  { key: "green", value: AXLAT_ROUTES.filter((r) => r.status === "done").length },
  { key: "yellow", value: AXLAT_ROUTES.filter((r) => r.status === "late").length },
  { key: "red", value: AXLAT_ROUTES.filter((r) => r.status === "missed").length },
];
export const RATING_LABELS = { green: "Yashil (yaxshi)", yellow: "Sariq (o'rta)", red: "Qizil (yomon)" };
export const RATING_COLORS = ["#16a34a", "#d97706", "#dc2626"];

// KPI yig'indi
export const axlatSummary = (() => {
  const done = AXLAT_ROUTES.filter((r) => r.status === "done").length;
  const late = AXLAT_ROUTES.filter((r) => r.status === "late").length;
  const missed = AXLAT_ROUTES.filter((r) => r.status === "missed").length;
  const collected = AXLAT_ROUTES.reduce((s, r) => s + r.collectedVolume, 0);
  const planned = AXLAT_ROUTES.reduce((s, r) => s + r.plannedVolume, 0);
  const totalHouses = AXLAT_ROUTES.reduce((s, r) => s + r.houses, 0);
  return {
    routes: AXLAT_ROUTES.length,
    done,
    late,
    missed,
    completionPct: Math.round((done / AXLAT_ROUTES.length) * 100),
    collectedVolume: Math.round(collected * 10) / 10,
    plannedVolume: Math.round(planned * 10) / 10,
    // Tarif yig'imi: 7 840 so'm/kishi (2025), ~2.8 kishi/uy
    tariffRevenue: Math.round(totalHouses * 2.8 * 7840),
  };
})();
