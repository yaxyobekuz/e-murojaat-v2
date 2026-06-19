import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { gaz } = ENDPOINTS;

export const gazAPI = {
  myAccount: () => http.get(gaz.myAccount),
  myUsage: () => http.get(gaz.myUsage),
  myPayments: () => http.get(gaz.myPayments),
  myRequests: () => http.get(gaz.myRequests),
  createPayment: (body) => http.post(gaz.myPayments, body),
  createRequest: (body) => http.post(gaz.myRequests, body),
  checkRegistry: (accountNumber) =>
    http.get(gaz.registryCheck, { params: { accountNumber } }),
};
