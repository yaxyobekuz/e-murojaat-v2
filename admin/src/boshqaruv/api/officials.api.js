import http from "@/shared/api/http";

// Mahalla yettiligi — server'da lavozim kodi (role) bo'yicha saqlanadi
export const officialsAPI = {
  list: () => http.get("/officials"),
  upsert: (role, body) => http.put(`/officials/${role}`, body),
  remove: (role) => http.delete(`/officials/${role}`),
};
