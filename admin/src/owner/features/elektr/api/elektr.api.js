// Promise façade over the mock — real *.api.js bilan bir xil shakl.
import * as A from "../mock/elektr.analytics";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 250) => {
  await delay(ms);
  return data;
};

const byKind = (kind, params) => {
  const id = params?.mahallaId;
  switch (kind) {
    case "summary": return A.summary(id);
    case "timeseries": return A.timeseries(id);
    case "energyBalance": return A.energyBalance(id);
    case "lossesWaterfall": return A.lossesWaterfall(id);
    case "mttr": return A.mttr(id);
    case "health": return A.health();
    case "mahallaRows": return A.mahallaRows();
    case "voltage": return A.voltage();
    case "askue": return A.askue(id);
    case "solar": return A.solar(id);
    case "breakdownType": return A.breakdownByType(id);
    case "reliability": return A.reliability(id);
    default: return null;
  }
};

export const elektrAPI = {
  analytics: (kind, params) => ok(byKind(kind, params)),
};
