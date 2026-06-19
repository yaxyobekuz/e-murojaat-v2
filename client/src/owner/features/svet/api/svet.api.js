import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { svet } = ENDPOINTS;

export const svetAPI = {
  myAccount: () => http.get(svet.myAccount),
  myRequests: () => http.get(svet.myRequests),
  createRequest: (body) => http.post(svet.myRequests, body),
  createPayment: (body) => http.post(svet.myPayments, body),
  checkAccount: (accountNumber) =>
    http.get(svet.accountCheck, { params: { accountNumber } }),
};
