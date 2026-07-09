// Owner auth — bitta statik hisob (env orqali), sessiyalar xotirada saqlanadi.
import { randomUUID } from "node:crypto";

import ApiError from "../../utils/ApiError.js";

const OWNER_USERNAME = process.env.OWNER_USERNAME || "owner";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "owner123";

const sessions = new Set();

export const authService = {
  login: (username, password) => {
    if (username !== OWNER_USERNAME || password !== OWNER_PASSWORD)
      throw new ApiError(401, "Login yoki parol noto'g'ri", "INVALID_CREDENTIALS");
    const token = randomUUID();
    sessions.add(token);
    return token;
  },
  check: (token) => Boolean(token && sessions.has(token)),
  logout: (token) => sessions.delete(token),
  username: () => OWNER_USERNAME,
};
