import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { svet } = ENDPOINTS;

export const svetAPI = {
  listSubscribers: (params) => http.get(svet.subscribers, { params }),
  getSubscriber: (id) => http.get(svet.subscriberById(id)),

  listRequests: (params) => http.get(svet.requests, { params }),
  getRequest: (id) => http.get(svet.requestById(id)),
  updateRequestStatus: (id, body) => http.patch(svet.requestById(id), body),

  listViolations: (params) => http.get(svet.violations, { params }),

  analyticsSummary: (params) => http.get(svet.analytics.summary, { params }),
  analyticsTimeseries: (params) => http.get(svet.analytics.timeseries, { params }),
  analyticsBreakdown: (params) => http.get(svet.analytics.breakdown, { params }),
};
