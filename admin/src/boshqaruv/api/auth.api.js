import http from "@/shared/api/http";

// Boshqaruv paneli auth — owner sessiyasi httpOnly cookie'da saqlanadi
export const boshqaruvAuthAPI = {
  login: (body) => http.post("/auth/login", body),
  me: () => http.get("/auth/me"),
  logout: () => http.post("/auth/logout"),
};
