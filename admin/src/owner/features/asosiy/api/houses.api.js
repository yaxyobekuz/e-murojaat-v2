import http from "@/shared/api/http";

// Xonadon ma'lumotlari — server'da OSM bino id'si bo'yicha saqlanadi
export const housesAPI = {
  list: () => http.get("/houses"),
  one: (osmId) => http.get(`/houses/${osmId}`),
  upsert: (osmId, body) => http.put(`/houses/${osmId}`, body),
  remove: (osmId) => http.delete(`/houses/${osmId}`),
};
