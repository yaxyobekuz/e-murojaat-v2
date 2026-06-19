import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { yer } = ENDPOINTS;

export const yerAPI = {
  myProperties: () => http.get(yer.myProperties),
  myRequests: () => http.get(yer.myRequests),
  getProperty: (id) => http.get(yer.propertyById(id)),
  createRequest: (body) => http.post(yer.myRequests, body),
  checkRegistry: (cadastreNumber) =>
    http.get(yer.registryCheck, { params: { cadastreNumber } }),
};
