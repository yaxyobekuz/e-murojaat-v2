// Kamera backend (camera-system) bilan ishlash klienti.
// Alohida backend (default http://localhost:8083) — o'z JWT autentifikatsiyasi bilan.
// Token avtomatik olinadi (env dagi login/parol bilan) va xotirada saqlanadi.
import axios from "axios";

const BASE = import.meta.env.VITE_CAMERA_API || "http://localhost:8083";
const USER = import.meta.env.VITE_CAMERA_USER || "admin";
const PASS = import.meta.env.VITE_CAMERA_PASS || "admin123";

let token = null;
let loginPromise = null;

async function ensureToken() {
  if (token) return token;
  if (!loginPromise) {
    loginPromise = axios
      .post(`${BASE}/api/auth/login`, { username: USER, password: PASS })
      .then((r) => {
        token = r.data.token;
        return token;
      })
      .finally(() => {
        loginPromise = null;
      });
  }
  return loginPromise;
}

// Token muddati o'tsa (401) — bir marta qayta login qilib takrorlaydi.
async function req(method, path, data) {
  const t = await ensureToken();
  try {
    const r = await axios({ method, url: `${BASE}${path}`, data, headers: { Authorization: `Bearer ${t}` } });
    return r.data;
  } catch (e) {
    if (e?.response?.status === 401) {
      token = null;
      const t2 = await ensureToken();
      const r = await axios({ method, url: `${BASE}${path}`, data, headers: { Authorization: `Bearer ${t2}` } });
      return r.data;
    }
    throw e;
  }
}

export const cameraApi = {
  base: BASE,
  list: () => req("get", "/api/cameras"),
  get: (id) => req("get", `/api/cameras/${id}`),
  status: (id) => req("get", `/api/cameras/${id}/status`),
  create: (body) => req("post", "/api/cameras", body),
  remove: (id) => req("delete", `/api/cameras/${id}`),
};
