import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const { murojaat } = ENDPOINTS;

export const murojaatAPI = {
  myAppeals: () => http.get(murojaat.myAppeals),
  createAppeal: (body) => http.post(murojaat.myAppeals, body),
  listOrganizations: () => http.get(murojaat.organizations),
  track: (appealNumber) => http.get(murojaat.track, { params: { appealNumber } }),
};
