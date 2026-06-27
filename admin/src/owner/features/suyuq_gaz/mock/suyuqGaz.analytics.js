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
    deltas: { served: 3.1, delivered: 6.4, fulfillment: 2.8, debt: -4.5 },
  };
};

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
// Ballonga talab qishda cho'qqi (isitish)
const SEAS = [1.62, 1.48, 1.2, 0.92, 0.74, 0.66, 0.68, 0.72, 0.84, 1.06, 1.34, 1.58];

// 12 oylik yetkazib berilgan ballon dinamikasi (dona)
export const deliveryTrend = (streetId) => {
  const base = summary(streetId).delivered / 12;
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
