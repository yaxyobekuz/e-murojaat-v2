// Pure selectors over the mock arrays — return ready-to-render dashboard shapes.
import { properties, requests, REGIONS } from "./yer.data";

const MONTHS_UZ = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}`;
};

// Kadastr qiymatidan yillik mulk/yer solig'i ulushi — kanonik "yiliga ~486 mln
// so'm yig'ilgan soliq" raqamiga moslangan koeffitsient.
const TAX_COEF = 0.0018;
const TOTAL_TAX_UZS = Math.round(properties.reduce((s, p) => s + p.valueUzs * TAX_COEF, 0));

// KPI summary
export const summary = () => {
  const totalPlots = properties.length;
  const taxRevenueUzs = TOTAL_TAX_UZS;
  const pendingCadaster = requests.filter((r) =>
    ["yangi", "korib_chiqilmoqda", "olchov", "tolov"].includes(r.status),
  ).length;

  const now = new Date(2026, 5, 20);
  const thisKey = `${now.getFullYear()}-${now.getMonth()}`;
  const registeredThisMonth = properties.filter(
    (p) => monthKey(p.registeredAt) === thisKey,
  ).length;

  return {
    totalPlots,
    taxRevenueUzs,
    pendingCadaster,
    registeredThisMonth,
    // demo deltas (vs previous period) for the green ▲ pills
    deltas: { totalPlots: 0.2, taxRevenueUzs: 3.1, pendingCadaster: -1.8, registeredThisMonth: 1.4 },
  };
};

const WEEKDAYS_UZ = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];

const dayKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

// Oylik yig'im — yillik soliqning mavsumiy taqsimoti (yig'indisi ~486 mln)
const MONTH_WEIGHTS = [0.82, 0.86, 0.95, 1.02, 1.1, 1.06, 0.98, 0.92, 1.04, 1.12, 1.08, 1.05];

// Last 12 months series: requests + revenue (so'm, mln)
const yearlySeries = () => {
  const now = new Date(2026, 5, 20);
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const reqs = requests.filter((r) => monthKey(r.createdAt) === key);
    const revenue = Math.round(((TOTAL_TAX_UZS / 12) * MONTH_WEIGHTS[i]) / 1_000_000);
    return {
      month: MONTHS_UZ[d.getMonth()],
      arizalar: reqs.length,
      tushum: revenue, // mln so'm
    };
  });
};

// Kunlik yig'im — yillik soliqning kunlik ulushi (deterministik tebranish bilan)
const dailyRevenue = (i) => {
  const w = 0.6 + ((i * 37) % 100) / 125; // 0.6..1.39
  return Math.round(((TOTAL_TAX_UZS / 365) * w) / 1_000_000);
};

// Joriy oy — har kuni bir nuqta (oyning kunlari bo'yicha)
const monthlySeries = () => {
  const now = new Date(2026, 5, 20);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
    const key = dayKey(d);
    const reqs = requests.filter((r) => dayKey(r.createdAt) === key);
    return {
      month: String(i + 1), // oyning kuni
      arizalar: reqs.length,
      tushum: dailyRevenue(i), // mln so'm
    };
  });
};

// Oxirgi 7 kun — hafta kunlari bo'yicha (Hafta)
const weeklySeries = () => {
  const now = new Date(2026, 5, 20);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
    const key = dayKey(d);
    const reqs = requests.filter((r) => dayKey(r.createdAt) === key);
    return {
      month: WEEKDAYS_UZ[d.getDay()],
      arizalar: reqs.length,
      tushum: dailyRevenue(d.getDate()), // mln so'm
    };
  });
};

// range: "Hafta" -> oxirgi 7 kun, "Oy" -> joriy oy (kunlik), "12 oy" -> 12 oy (default)
export const timeseries = (range = "12 oy") => {
  if (range === "Hafta") return weeklySeries();
  if (range === "Oy") return monthlySeries();
  return yearlySeries();
};

// Breakdown by a dimension -> [{ key, value }]
export const breakdown = (by = "region") => {
  const map = new Map();
  if (by === "region") {
    REGIONS.forEach((r) => map.set(r, 0));
    properties.forEach((p) => map.set(p.region, (map.get(p.region) || 0) + 1));
  } else if (by === "type") {
    properties.forEach((p) => map.set(p.type, (map.get(p.type) || 0) + 1));
  } else if (by === "ownership") {
    properties.forEach((p) => map.set(p.ownershipType, (map.get(p.ownershipType) || 0) + 1));
  } else if (by === "status") {
    requests.forEach((r) => map.set(r.status, (map.get(r.status) || 0) + 1));
  } else if (by === "serviceType") {
    requests.forEach((r) => map.set(r.serviceType, (map.get(r.serviceType) || 0) + 1));
  }
  return [...map.entries()]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
};

// Land-use classification as percentages (bubble chart)
export const landUse = () => {
  const buckets = { qishloq_xojaligi: 0, turar_joy: 0, tijorat: 0, boshqa: 0 };
  properties.forEach((p) => {
    if (p.type === "yer") buckets.qishloq_xojaligi += 1;
    else if (p.type === "uy" || p.type === "kvartira") buckets.turar_joy += 1;
    // davlat noturar = ijtimoiy obyektlar (maktab/bog'cha/poliklinika/masjid)
    else if (p.type === "noturar" && p.ownershipType !== "davlat") buckets.tijorat += 1;
    else buckets.boshqa += 1;
  });
  const total = properties.length || 1;
  return Object.entries(buckets).map(([key, count]) => ({
    key,
    value: count,
    percent: Math.round((count / total) * 100),
  }));
};

// Capsule-bar dataset: last 7 distinct months of registrations
export const monthlyRegistrations = () => timeseries().slice(-7);

// Radial gauge: cadaster completeness %
export const cadasterCompleteness = () => {
  const done = properties.filter((p) => p.status === "royxatda").length;
  return Math.round((done / (properties.length || 1)) * 100);
};
