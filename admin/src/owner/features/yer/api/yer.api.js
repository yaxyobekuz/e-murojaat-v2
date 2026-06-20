// Promise façade over the mock — same shape as a real *.api.js so hooks/pages
// don't change when a backend is wired later.
import { properties, requests } from "../mock/yer.data";
import {
  summary,
  timeseries,
  breakdown,
  landUse,
  monthlyRegistrations,
  cadasterCompleteness,
} from "../mock/yer.analytics";
import { filterSortPaginate } from "../utils/yer.filters";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = async (data, ms = 300) => {
  await delay(ms);
  return data;
};

const analyticsByKind = (kind, params) => {
  switch (kind) {
    case "summary":
      return summary();
    case "timeseries":
      return timeseries(params?.range);
    case "landUse":
      return landUse();
    case "monthlyRegistrations":
      return monthlyRegistrations();
    case "cadasterCompleteness":
      return cadasterCompleteness();
    case "breakdown:region":
      return breakdown("region");
    case "breakdown:type":
      return breakdown("type");
    case "breakdown:status":
      return breakdown("status");
    case "breakdown:ownership":
      return breakdown("ownership");
    case "breakdown:serviceType":
      return breakdown("serviceType");
    default:
      return null;
  }
};

export const yerAPI = {
  properties: (params) => ok(filterSortPaginate(properties, params)),
  property: (id) => ok(properties.find((p) => p.id === id)),
  requests: (params) => ok(filterSortPaginate(requests, params)),
  request: (id) => ok(requests.find((r) => r.id === id)),
  analytics: (kind, params) => ok(analyticsByKind(kind, params)),
};
