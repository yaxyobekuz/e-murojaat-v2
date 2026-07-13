import http from "@/shared/api/http";

// Mahalla dashboard ko'rsatkichlari (server) — o'qish ochiq
export const statsAPI = {
  indicators: () => http.get("/mahalla/indicators"),
};
