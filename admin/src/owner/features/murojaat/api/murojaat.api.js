import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { murojaat } = ENDPOINTS;

export const murojaatAPI = {
  listAppeals: (params) => http.get(murojaat.appeals, { params }),
  getAppeal: (id) => http.get(murojaat.appealById(id)),
  updateAppeal: (id, body) => http.patch(murojaat.appealById(id), body),

  listOrganizations: () => http.get(murojaat.organizations),
  createOrganization: (body) => http.post(murojaat.organizations, body),

  analyticsSummary: (params) => http.get(murojaat.analytics.summary, { params }),
  analyticsTimeseries: (params) => http.get(murojaat.analytics.timeseries, { params }),
  analyticsBreakdown: (params) => http.get(murojaat.analytics.breakdown, { params }),
};
