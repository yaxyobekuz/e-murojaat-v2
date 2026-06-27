// Promise façade over the mock — real *.api.js bilan bir xil shakl.
import * as A from "../mock/internet.analytics";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 250) => {
  await delay(ms);
  return data;
};

const byKind = (kind, params) => {
  const id = params?.streetId;
  switch (kind) {
    case "summary": return A.summary(id);
    case "speedTrend": return A.speedTrend(id);
    case "providers": return A.providers();
    case "coverageByStreet": return A.coverageByStreet();
    case "techMix": return A.techMix(id);
    case "streetRows": return A.streetRows();
    default: return null;
  }
};

export const internetAPI = {
  analytics: (kind, params) => ok(byKind(kind, params)),
};
