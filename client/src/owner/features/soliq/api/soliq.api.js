import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const soliqAPI = {
  // Demo fuqaro: birinchi to'lovchini (demo) olib ko'rsatamiz.
  listTaxpayers: (params) => http.get(ENDPOINTS.soliq.taxpayers, { params }),
  getTaxpayer: (id) => http.get(ENDPOINTS.soliq.taxpayerById(id)),
  pay: (id, body) => http.post(ENDPOINTS.soliq.pay(id), body),
};
