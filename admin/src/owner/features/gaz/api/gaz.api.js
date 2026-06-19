import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { gaz } = ENDPOINTS;

export const gazAPI = {
  listSubscribers: (params) => http.get(gaz.subscribers, { params }),
  getSubscriber: (id) => http.get(gaz.subscriberById(id)),

  listRequests: (params) => http.get(gaz.requests, { params }),
  getRequest: (id) => http.get(gaz.requestById(id)),
  updateRequestStatus: (id, body) => http.patch(gaz.requestById(id), body),

  listPayments: (params) => http.get(gaz.payments, { params }),
  listDebtors: (params) => http.get(gaz.debtors, { params }),
  getTariff: () => http.get(gaz.tariff),

  checkRegistry: (accountNumber) =>
    http.get(gaz.registryCheck, { params: { accountNumber } }),

  analyticsSummary: (params) => http.get(gaz.analytics.summary, { params }),
  analyticsTimeseries: (params) => http.get(gaz.analytics.timeseries, { params }),
  analyticsBreakdown: (params) => http.get(gaz.analytics.breakdown, { params }),
};
