// Suyultirilgan gaz moduli analitikasi — STREETS dan hosil qilinadi.
import { STREETS, SOURCES } from "./suyuqGaz.data";

const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

const inScope = (streetId) =>
  streetId ? STREETS.filter((s) => s.id === streetId) : STREETS;

export const summary = (streetId) => {
  const ss = inScope(streetId);
  const served = sum(ss, (s) => s.served);
  const demand = sum(ss, (s) => s.demand);
  const delivered = sum(ss, (s) => s.delivered);
  const fulfillment = round((delivered / Math.max(1, demand)) * 100, 1);
  const stock = sum(ss, (s) => s.stock);
  const debt = sum(ss, (s) => s.debt);
  const critical = ss.filter((s) => s.status === "kritik").length;

  return {
    served,
    demand,
    delivered,
    fulfillment,
    stock,
    debt,
    critical,
    deltas: { served: 0.8, delivered: -1.3, fulfillment: -0.3, debt: -2.1 },
  };
};

const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];
// Joriy oyga (iyun, 1254 balon) nisbatan mavsumiy koeffitsiyent — qishda cho'qqi (isitish).
// Kanonik seriya (iyul→iyun): 1180, 1150, 1230, 1390, 1560, 1710, 1740, 1620, 1450, 1330, 1270, 1254.
const SEAS = [0.941, 0.9171, 0.9809, 1.1085, 1.244, 1.3636, 1.3876, 1.2919, 1.1563, 1.0606, 1.0128, 1];

// 12 oylik yetkazib berilgan ballon dinamikasi (dona) — gaz moduli seriyasi bilan bir xil
export const deliveryTrend = (streetId) => {
  const base = summary(streetId).delivered;
  return MONTHS.map((month, i) => ({ month, value: Math.round(base * SEAS[i]) }));
};

// Ta'minot manbasi (donut)
export const sources = () =>
  SOURCES.map((s) => ({ key: s.key, label: s.label, value: s.share }));

// Ko'cha kesimida talab qondirish (% bar)
export const fulfillmentByStreet = () =>
  [...STREETS]
    .sort((a, b) => a.delivered / a.demand - b.delivered / b.demand)
    .map((s) => ({ key: s.name, value: round((s.delivered / s.demand) * 100, 0) }));

// Ko'cha kesimida qarzdorlik (so'm bar)
export const debtByStreet = () =>
  [...STREETS]
    .sort((a, b) => b.debt - a.debt)
    .map((s) => ({ key: s.name, value: s.debt }));

// Ko'cha kesimida to'liq ko'rsatkichlar (jadval uchun)
export const streetRows = () =>
  STREETS.map((s) => ({
    id: s.id,
    name: s.name,
    label: s.label,
    households: s.households,
    served: s.served,
    demand: s.demand,
    delivered: s.delivered,
    fulfillment: round((s.delivered / s.demand) * 100, 0),
    stock: s.stock,
    debt: s.debt,
    status: s.status,
  }));
