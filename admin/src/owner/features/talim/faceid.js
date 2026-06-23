// Face-ID davomat tizimi — real API mijozi (JWT). Base URL .env (VITE_FACEID_API) yoki default.
export const FID_BASE = import.meta.env.VITE_FACEID_API || "http://157.180.46.214:7080";
let token = (typeof sessionStorage !== "undefined" && sessionStorage.getItem("faceid_token")) || null;

export const fidToken = () => token;
export const fidLogout = () => { token = null; try { sessionStorage.removeItem("faceid_token"); } catch { /* */ } };

export const fidLogin = async (username, password) => {
  const r = await fetch(`${FID_BASE}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || d.message || "Login yoki parol noto'g'ri");
  token = d.token; try { sessionStorage.setItem("faceid_token", token); } catch { /* */ }
  return d;
};

const get = async (path) => {
  const r = await fetch(`${FID_BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (r.status === 401) { fidLogout(); throw new Error("Sessiya tugadi — qayta kiring"); }
  if (!r.ok) throw new Error(`Xatolik: ${r.status}`);
  return r.json();
};

export const fidMe = () => get("/api/auth/me");
export const fidEmployees = () => get("/api/employees");
export const fidEmployee = (id) => get(`/api/employees/${id}`);
export const fidEventsToday = () => get("/api/events/today");
export const fidEvents = (params = "") => get(`/api/events${params}`);
export const fidDashboard = (date = "") => get(`/api/dashboard${date ? `?date=${date}` : ""}`);
export const fidTrendWeek = () => get("/api/trend/week");

// Javob shaklini moslashuvchan o'qish (massiv yoki {data|items|employees|events})
export const asArray = (x) => Array.isArray(x) ? x : (x && (x.data || x.items || x.employees || x.events || x.rows)) || [];
// Base64 rasmni <img src> ga
export const faceSrc = (img) => !img ? null : (String(img).startsWith("data:") ? img : `data:image/jpeg;base64,${img}`);
