// Promise façade over the mock.
import { STREETS } from "../mock/gaz.data";
import { DELIVERIES } from "../mock/gaz.deliveries";
import { INCIDENTS } from "../mock/gaz.incidents";
import * as A from "../mock/gaz.analytics";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 250) => { await delay(ms); return data; };

const streets = (params = {}) => {
  let rows = A.streetRows(params);
  if (params.search) {
    const q = params.search.toLowerCase();
    rows = rows.filter((s) => s.name.toLowerCase().includes(q));
  }
  return { rows, total: rows.length };
};

const streetDetail = (id) => {
  const street = STREETS.find((s) => s.id === id);
  if (!street) return null;
  return {
    street: { ...street, adequacy: A.adequacyOf(street) },
    deliveries: DELIVERIES.filter((d) => d.streetId === id).slice(0, 8),
    incidents: INCIDENTS.filter((x) => x.streetId === id).slice(0, 8),
  };
};

const byKind = (kind, params) => {
  const fn = A[kind];
  return typeof fn === "function" ? fn(params) : null;
};

export const gazAPI = {
  streets: (params) => ok(streets(params)),
  street: (id) => ok(streetDetail(id)),
  analytics: (kind, params) => ok(byKind(kind, params)),
};
