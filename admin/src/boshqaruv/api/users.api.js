import http from "@/shared/api/http";

// Foydalanuvchi hisoblari — faqat owner
export const usersAPI = {
  list: () => http.get("/users"),
  create: (body) => http.post("/users", body),
  update: (id, body) => http.patch(`/users/${id}`, body),
  remove: (id) => http.delete(`/users/${id}`),
};
