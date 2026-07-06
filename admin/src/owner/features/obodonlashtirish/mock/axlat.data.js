// Axlat mashinasi (qattiq maishiy chiqindi — QMC) demo ma'lumotlari.
// Kanonik: Sarnovul MFY — 763 xonadon, 14 ko'cha, 3 ta axlat mashinasi, haftasiga 2 marta.
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

// Norma turi — kanonik jadval: haftasiga 2 marta, 14 ko'chada
export const SCHEDULE_NORM = {
  daily: "Haftasiga 2 marta (dush · pay)",
  every3: "Haftasiga 2 marta (sesh · juma)",
};

const rng = (seed) => {
  const x = Math.sin(seed * 91.7 + 47.3) * 43758.5453;
  return x - Math.floor(x);
};

// Sarnovul MFY ko'chalari — kanonik 14 ta
const MAHALLAS = [
  "Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik",
  "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor",
];

// Marshrutlar — 3 ta mashina 14 ko'chani ikki jadvalda (dush-pay / sesh-juma) yig'adi
const META = [
  { name: "M-1 Maslahat", norm: "daily", houses: 82, lateMin: 12 },
  { name: "M-2 Ulug'vor", norm: "daily", houses: 64, lateMin: 0 },
  { name: "M-3 Urganji", norm: "every3", houses: 55, lateMin: 0 },
  { name: "M-4 Sarnovul", norm: "every3", houses: 48, lateMin: 0 },
  { name: "M-5 Bog'bon", norm: "daily", houses: 71, lateMin: 35 },
  { name: "M-6 Do'stlik", norm: "every3", houses: 58, lateMin: 0 },
  { name: "M-7 Tinchlik", norm: "daily", houses: 66, lateMin: 8 },
  { name: "M-8 Chinor", norm: "every3", houses: 42, lateMin: 0 },
  { name: "M-9 Guliston", norm: "daily", houses: 60, lateMin: 0 },
  { name: "M-10 Navro'z", norm: "every3", houses: 50, lateMin: 0 },
  { name: "M-11 Istiqlol", norm: "daily", houses: 63, lateMin: 0 },
  { name: "M-12 Mehnat", norm: "every3", houses: 52, lateMin: 0 },
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
  const daysBack = status === "missed" ? (m.norm === "daily" ? 4 : 5) : 0;
  const last = new Date(TODAY);
  last.setDate(TODAY.getDate() - daysBack);
  const h = 6 + Math.floor(rng(i * 3.1) * 4);
  const min = Math.floor(rng(i * 5.7) * 60);
  // Keyingi reja — haftasiga 2 marta (3-4 kunlik sikl)
  const next = new Date(last);
  next.setDate(last.getDate() + (m.norm === "daily" ? 3 : 4));

  const plannedVolume = Math.round(m.houses * (m.norm === "daily" ? 0.045 : 0.05) * 10) / 10; // m³
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
const BASE_VOLUME = 460; // oylik m³ — 763 xonadonlik mahalla masshtabi
export const AXLAT_VOLUME_TREND = MONTHS.map((month, i) => ({
  month,
  value: Math.round(BASE_VOLUME * SEASON[i] * (0.97 + rng(i * 7.7) * 0.06)),
}));

// Ko'cha bo'yicha reys soni (oylik) — haftasiga 2 marta ≈ 8-10 reys
export const AXLAT_BY_MAHALLA = MAHALLAS.map((name, i) => ({
  key: name,
  value: Math.round(8 + rng(i * 4.4) * 2),
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
    // Tarif yig'imi: 7 840 so'm/kishi (2025), ~5.6 kishi/uy (4306/763)
    tariffRevenue: Math.round(totalHouses * 5.6 * 7840),
  };
})();
