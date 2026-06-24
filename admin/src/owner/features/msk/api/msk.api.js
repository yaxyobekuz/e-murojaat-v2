// Promise façade over the mock — real *.api.js bilan bir xil shakl.
import { APPEALS } from "../mock/msk.appeals";
import * as A from "../mock/msk.analytics";
import { filterSortPaginate } from "../utils/msk.filters";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 250) => {
  await delay(ms);
  return data;
};

const byKind = (kind, params) => {
  const fn = A[kind];
  return typeof fn === "function" ? fn(params) : null;
};

export const mskAPI = {
  appeals: (params) => ok(filterSortPaginate(APPEALS, params)),
  appeal: (id) => ok(APPEALS.find((a) => a.id === id)),
  analytics: (kind, params) => ok(byKind(kind, params)),
};
