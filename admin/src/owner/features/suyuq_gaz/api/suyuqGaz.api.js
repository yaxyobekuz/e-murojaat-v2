// Promise façade over the mock — real *.api.js bilan bir xil shakl.
import * as A from "../mock/suyuqGaz.analytics";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 250) => {
  await delay(ms);
  return data;
};

const byKind = (kind, params) => {
  const id = params?.streetId;
  switch (kind) {
    case "summary": return A.summary(id);
    case "deliveryTrend": return A.deliveryTrend(id);
    case "sources": return A.sources();
    case "fulfillmentByStreet": return A.fulfillmentByStreet();
    case "debtByStreet": return A.debtByStreet();
    case "streetRows": return A.streetRows();
    default: return null;
  }
};

export const suyuqGazAPI = {
  analytics: (kind, params) => ok(byKind(kind, params)),
};
