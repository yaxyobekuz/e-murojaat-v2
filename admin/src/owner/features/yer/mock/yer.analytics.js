// Pure selectors over the mock arrays — return ready-to-render dashboard shapes.
import { properties, requests, REGIONS } from "./yer.data";

const MONTHS_UZ = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];

const monthKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}`;
};

// KPI summary
export const summary = () => {
  const totalPlots = properties.length;
  const taxRevenueUzs = Math.round(
    properties.reduce((s, p) => s + p.valueUzs * 0.012, 0), // ~1.2% mulk solig'i
  );
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
    deltas: { totalPlots: 2.4, taxRevenueUzs: 4.7, pendingCadaster: -1.8, registeredThisMonth: 6.1 },
  };
};

const WEEKDAYS_UZ = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];

const dayKey = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

// Last 12 months series: registrations + revenue (so'm, mln)
const yearlySeries = () => {
  const now = new Date(2026, 5, 20);
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const reqs = requests.filter((r) => monthKey(r.createdAt) === key);
    const props = properties.filter((p) => monthKey(p.registeredAt) === key);
    const revenue = Math.round(
      props.reduce((s, p) => s + p.valueUzs * 0.012, 0) / 1_000_000,
    );
    return {
      month: MONTHS_UZ[d.getMonth()],
      arizalar: reqs.length,
      tushum: revenue, // mln so'm
    };
  });
};

// Joriy oy — har kuni bir nuqta (oyning kunlari bo'yicha)
const monthlySeries = () => {
  const now = new Date(2026, 5, 20);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), i + 1);
    const key = dayKey(d);
    const reqs = requests.filter((r) => dayKey(r.createdAt) === key);
    const props = properties.filter((p) => dayKey(p.registeredAt) === key);
    const revenue = Math.round(
      props.reduce((s, p) => s + p.valueUzs * 0.012, 0) / 1_000_000,
    );
    return {
      month: String(i + 1), // oyning kuni
      arizalar: reqs.length,
      tushum: revenue, // mln so'm
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
    const props = properties.filter((p) => dayKey(p.registeredAt) === key);
    const revenue = Math.round(
      props.reduce((s, p) => s + p.valueUzs * 0.012, 0) / 1_000_000,
    );
    return {
      month: WEEKDAYS_UZ[d.getDay()],
      arizalar: reqs.length,
      tushum: revenue, // mln so'm
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
    else if (p.type === "noturar") buckets.tijorat += 1;
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
