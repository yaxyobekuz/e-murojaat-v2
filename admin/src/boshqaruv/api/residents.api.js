import http from "@/shared/api/http";

// Aholi (fuqaro) yozuvlari — server'da unikal id bo'yicha saqlanadi
export const residentsAPI = {
  list: (params) => http.get("/residents", { params }),
  one: (id) => http.get(`/residents/${id}`),
  create: (body) => http.post("/residents", body),
  update: (id, body) => http.put(`/residents/${id}`, body),
  remove: (id) => http.delete(`/residents/${id}`),
};
