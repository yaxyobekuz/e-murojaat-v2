// Gaz analitikasi — STREETS/DELIVERIES/INCIDENTS ustidan. Har funksiya global FILTR oladi
// (ko'cha/ta'minot turi/holat/yetarlilik) — grafiklarni mix qilish uchun.
import { STREETS, SUPPLY, STATUS_KEYS, SUPPLIERS, REF } from "./gaz.data";
import { DELIVERIES } from "./gaz.deliveries";
import { INCIDENTS } from "./gaz.incidents";

const MONTH_UZ = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
const months = [];
for (let k = 11; k >= 0; k--) {
  const d = new Date(REF.getFullYear(), REF.getMonth() - k, 1);
  months.push({ y: d.getFullYear(), m: d.getMonth(), label: MONTH_UZ[d.getMonth()] });
}
const monthIdx = (iso) => {
  const d = new Date(iso);
  return months.findIndex((w) => w.y === d.getFullYear() && w.m === d.getMonth());
};
// Talab mavsumiyligi: iyun (1360 balon) = 1.0 bazaviy oy
const seasonF = (m) => [1.42, 1.3, 1.16, 1.06, 1.01, 1.0, 0.95, 0.93, 0.98, 1.1, 1.24, 1.38][m];
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export const adequacyOf = (s) => {
  if (s.supplyType === "yoq") return "deyarli_yoq";
  if (s.cylindersNeeded) return s.coveragePct >= 85 ? "yetarli" : s.coveragePct >= 40 ? "kam" : "deyarli_yoq";
  return s.uptimePct >= 95 ? "yetarli" : s.uptimePct >= 88 ? "kam" : "deyarli_yoq";
};

export const applyFilter = (f = {}) =>
  STREETS.filter((s) => {
    if (f.street && s.id !== f.street) return false;
    if (f.supplyType && s.supplyType !== f.supplyType) return false;
    if (f.status && s.status !== f.status) return false;
    if (f.adequacy && adequacyOf(s) !== f.adequacy) return false;
    return true;
  });

const ids = (f) => new Set(applyFilter(f).map((s) => s.id));
const toPairs = (map, order) => (order || Object.keys(map)).map((k) => ({ key: k, value: map[k] || 0 }));

export const summary = (f) => {
  const ss = applyFilter(f);
  const hh = sum(ss, (s) => s.households);
  const pipe = ss.filter((s) => s.uptimePct != null);
  const balon = ss.filter((s) => s.deliveryCycleDays != null);
  return {
    totalHouseholds: hh,
    gasifiedPct: hh ? Math.round(sum(ss, (s) => (s.households * s.gasifiedPct) / 100) / hh * 100) : 0,
    cylindersMonth: sum(ss, (s) => s.cylindersPerMonth),
    avgCycle: balon.length ? Math.round(sum(balon, (s) => s.deliveryCycleDays * s.households) / sum(balon, (s) => s.households)) : 0,
    regularPct: hh ? Math.round(sum(ss.filter((s) => s.status === "yashil"), (s) => s.households) / hh * 100) : 0,
    problemStreets: ss.filter((s) => s.status === "qizil" || s.status === "qora").length,
    avgRepairH: pipe.length ? round(sum(pipe, (s) => s.avgRepairH) / pipe.length, 1) : 0,
    openIncidents: sum(ss, (s) => s.openIncidents),
    deltas: { gasifiedPct: 0.9, cylindersMonth: -1.3, avgCycle: -0.8, regularPct: 1.2 },
  };
};

// Ko'cha holati gridi (heatmap)
export const heatmap = (f) =>
  applyFilter(f).map((s) => ({
    id: s.id, name: s.name, status: s.status, supplyType: s.supplyType,
    coveragePct: s.coveragePct, gasifiedPct: s.gasifiedPct,
    deliveryCycleDays: s.deliveryCycleDays, households: s.households,
  }));

export const byStatus = (f) => {
  const ss = applyFilter(f);
  return toPairs(ss.reduce((m, s) => ((m[s.status] = (m[s.status] || 0) + 1), m), {}), STATUS_KEYS);
};
export const bySupplyType = (f) => {
  const ss = applyFilter(f);
  return toPairs(ss.reduce((m, s) => ((m[s.supplyType] = (m[s.supplyType] || 0) + s.households), m), {}), Object.keys(SUPPLY));
};
export const adequacy = (f) => {
  const ss = applyFilter(f);
  return toPairs(ss.reduce((m, s) => { const a = adequacyOf(s); m[a] = (m[a] || 0) + 1; return m; }, {}), ["yetarli", "kam", "deyarli_yoq"]);
};

export const cylindersByStreet = (f) =>
  applyFilter(f).filter((s) => s.cylindersPerMonth > 0).map((s) => ({ key: s.name, value: s.cylindersPerMonth })).sort((a, b) => b.value - a.value);

export const cycleByStreet = (f) =>
  applyFilter(f).filter((s) => s.deliveryCycleDays != null).map((s) => ({ key: s.name, value: s.deliveryCycleDays })).sort((a, b) => b.value - a.value);

export const perFamily = (f) =>
  applyFilter(f).filter((s) => s.avgCylindersPerFamily > 0).map((s) => ({ key: s.name, value: s.avgCylindersPerFamily })).sort((a, b) => b.value - a.value);

// Balon yetkazish dinamikasi — kerakli vs yetkazilgan (12 oy)
export const deliveryTrend = (f) => {
  const set = ids(f);
  const balon = applyFilter(f).filter((s) => s.cylindersNeeded > 0);
  return months.map((w, i) => ({
    month: w.label,
    yetkazilgan: sum(DELIVERIES.filter((d) => set.has(d.streetId) && monthIdx(d.date) === i), (d) => d.cylinders),
    kerakli: Math.round(sum(balon, (s) => s.cylindersNeeded) * seasonF(w.m)),
  }));
};

// Quvur muammolari dinamikasi
export const incidentsTrend = (f) => {
  const set = ids(f);
  return months.map((w, i) => ({
    month: w.label,
    value: INCIDENTS.filter((x) => set.has(x.streetId) && monthIdx(x.reportedAt) === i).length,
  }));
};

// Tiklash / uptime ko'rsatkichlari (gauge)
export const repair = (f) => {
  const pipe = applyFilter(f).filter((s) => s.uptimePct != null);
  return {
    avgRepairH: pipe.length ? round(sum(pipe, (s) => s.avgRepairH) / pipe.length, 1) : 0,
    uptimePct: pipe.length ? round(sum(pipe, (s) => s.uptimePct * s.households) / sum(pipe, (s) => s.households), 1) : 0,
    openIncidents: sum(applyFilter(f), (s) => s.openIncidents),
  };
};

// Yetkazib beruvchilar ulushi (yetkazilgan balon bo'yicha)
export const suppliers = (f) => {
  const set = ids(f);
  const map = {};
  DELIVERIES.filter((d) => set.has(d.streetId)).forEach((d) => { map[d.supplierId] = (map[d.supplierId] || 0) + d.cylinders; });
  return SUPPLIERS.map((s) => ({ key: s.name, value: map[s.id] || 0 })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
};

// To'liq ko'cha jadvali
export const streetRows = (f) =>
  applyFilter(f).map((s) => ({ ...s, adequacy: adequacyOf(s) }));
