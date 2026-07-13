import http from "@/shared/api/http";

// Mahalla dashboard ko'rsatkichlari — o'qish ochiq, yozish domen mas'uli/owner
export const mahallaAPI = {
  indicators: () => http.get("/mahalla/indicators"),
  patch: (domain, body) => http.patch(`/mahalla/indicators/${domain}`, body),
};
