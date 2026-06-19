import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const soliqAPI = {
  // To'lovchilar
  listTaxpayers: (params) => http.get(ENDPOINTS.soliq.taxpayers, { params }),
  getTaxpayer: (id) => http.get(ENDPOINTS.soliq.taxpayerById(id)),
  createTaxpayer: (body) => http.post(ENDPOINTS.soliq.taxpayers, body),
  updateTaxpayer: (id, body) => http.patch(ENDPOINTS.soliq.taxpayerById(id), body),

  // Soliqlar va qarzdorlik
  listAssessments: (params) => http.get(ENDPOINTS.soliq.assessments, { params }),
  listDebtors: (params) => http.get(ENDPOINTS.soliq.debtors, { params }),
  pay: (id, body) => http.post(ENDPOINTS.soliq.pay(id), body),

  // Hudud ma'lumotnomasi (drilldown filtr)
  locations: (params) => http.get(ENDPOINTS.soliq.locations, { params }),

  // Analitika
  summary: (params) => http.get(ENDPOINTS.soliq.summary, { params }),
  timeseries: (params) => http.get(ENDPOINTS.soliq.timeseries, { params }),
  breakdown: (params) => http.get(ENDPOINTS.soliq.breakdown, { params }),
  mahalla: (params) => http.get(ENDPOINTS.soliq.mahalla, { params }),
};
