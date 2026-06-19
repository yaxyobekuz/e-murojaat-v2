import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { yer } = ENDPOINTS;

export const yerAPI = {
  listProperties: (params) => http.get(yer.properties, { params }),
  getProperty: (id) => http.get(yer.propertyById(id)),
  createProperty: (body) => http.post(yer.properties, body),
  updateProperty: (id, body) => http.patch(yer.propertyById(id), body),

  listRequests: (params) => http.get(yer.requests, { params }),
  getRequest: (id) => http.get(yer.requestById(id)),
  updateRequestStatus: (id, body) => http.patch(yer.requestById(id), body),

  checkRegistry: (cadastreNumber) =>
    http.get(yer.registryCheck, { params: { cadastreNumber } }),

  analyticsSummary: (params) => http.get(yer.analytics.summary, { params }),
  analyticsTimeseries: (params) => http.get(yer.analytics.timeseries, { params }),
  analyticsBreakdown: (params) => http.get(yer.analytics.breakdown, { params }),
};
