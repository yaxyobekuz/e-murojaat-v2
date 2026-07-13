// Ko'p foydalanuvchili auth — hisoblar MongoDB'da, sessiyalar xotirada (token -> profil).
import { randomUUID } from "node:crypto";

import ApiError from "../../utils/ApiError.js";
import User from "../../models/User.js";
import { verify } from "../../utils/password.js";

const sessions = new Map(); // token -> { userId, role, fullName, username }

export const authService = {
  login: async (username, password) => {
    const user = await User.findOne({ username: String(username).toLowerCase().trim(), active: true }).select("+passwordHash");
    if (!user || !(await verify(password, user.passwordHash)))
      throw new ApiError(401, "Login yoki parol noto'g'ri", "INVALID_CREDENTIALS");
    const token = randomUUID();
    const session = { userId: String(user._id), role: user.role, fullName: user.fullName, username: user.username };
    sessions.set(token, session);
    return { token, user: { username: user.username, role: user.role, fullName: user.fullName } };
  },
  // sessiya obyekti yoki null (truthy tekshiruvlar ishlashda davom etadi)
  check: (token) => (token && sessions.get(token)) || null,
  getSession: (token) => (token && sessions.get(token)) || null,
  logout: (token) => sessions.delete(token),
};
