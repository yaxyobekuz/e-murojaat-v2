// Operator / ko'cha reytingi — Xalq Nazorati metodologiyasi asosida (7 vaznli metrik).
// Asos: xalqnazorati.uz bajaruvchi reytingi (bajarilgan %, kechikkan, tang holat,
// faollik/10k aholi, rad/qayta ishlash, murakkablik). Demo — mavjud datadan hisoblanadi.
import { AXLAT_ROUTES } from "./axlat.data";
import { ASSEN_ORDERS } from "./assenizatsiya.data";
import { HASHAR_RANKING } from "./hashar.data";

const rng = (seed) => {
  const x = Math.sin(seed * 88.1 + 41.7) * 43758.5453;
  return x - Math.floor(x);
};

// Metrik ta'riflari + vaznlar (Xalq Nazorati uslubi)
export const RATING_METRICS = [
  { key: "resolved", label: "Bajarilgan %", weight: 2.3, hint: "Yopilgan ishlar ulushi", positive: true },
  { key: "overdue", label: "Kechikkan", weight: 1.5, hint: "Muddati o'tgan ishlar", positive: false },
  { key: "tension", label: "Tang holat %", weight: 1.2, hint: "Aktiv (yopilmagan) ishlar ulushi", positive: false },
  { key: "activity", label: "Faollik /10k", weight: 1.0, hint: "10 000 aholiga xizmat soni", positive: true },
  { key: "rejection", label: "Rad/qayta", weight: 1.3, hint: "Qayta ishlashga qaytarilgan", positive: false },
  { key: "complexity", label: "Murakkablik", weight: 0.8, hint: "Ko'p qavatli/yirik obyektlar", positive: true },
  { key: "speed", label: "Tezlik bali", weight: 1.4, hint: "O'rtacha bajarish tezligi (SLA)", positive: true },
];

// Sarnovul MFY ko'chalari — kanonik 14 ta
const MAHALLAS = ["Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik", "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor"];

// Har ko'cha uchun 7 metrikni mavjud datadan yig'amiz
const buildRow = (name, i) => {
  const routes = AXLAT_ROUTES.filter((r) => r.mahalla === name);
  const orders = ASSEN_ORDERS.filter((o) => o.mahalla === name);
  const hashar = HASHAR_RANKING.find((h) => h.key === name);

  const totalJobs = routes.length + orders.length;
  const doneJobs = routes.filter((r) => r.status === "done").length + orders.filter((o) => o.status === "done").length;
  const overdueJobs = routes.filter((r) => r.status === "missed").length + orders.filter((o) => o.status === "rejected").length;
  const activeJobs = orders.filter((o) => o.status === "new" || o.status === "dispatched").length + routes.filter((r) => r.status === "late").length;
  const doneOrders = orders.filter((o) => o.status === "done");
  const avgSla = doneOrders.length ? doneOrders.reduce((s, o) => s + o.slaDays, 0) / doneOrders.length : 2;

  const seed = i + 1;
  // Ko'cha aholisi ~220-420 (jami ≈ 4 306)
  const population = 220 + Math.round(rng(seed * 2.2) * 200);

  // Raw metriklar
  const resolved = totalJobs ? Math.round((doneJobs / totalJobs) * 100) : Math.round(70 + rng(seed * 3) * 25);
  const overdue = overdueJobs;
  const tension = totalJobs ? Math.round((activeJobs / totalJobs) * 100) : Math.round(rng(seed * 4) * 20);
  const activity = Math.round(((totalJobs + (hashar ? 4 : 0)) / population) * 10000 * 10) / 10;
  const rejection = orders.filter((o) => o.status === "rejected").length;
  const complexity = routes.filter((r) => r.norm === "daily").length + Math.round(rng(seed * 6) * 3);
  const speed = Math.max(0, Math.min(100, Math.round(100 - (avgSla - 1) * 20)));

  // 0..100 normallashtirilgan ball (ijobiy metriklar +, salbiy -)
  const norm = {
    resolved, // 0-100
    overdue: Math.max(0, 100 - overdue * 18),
    tension: Math.max(0, 100 - tension * 1.6),
    activity: Math.min(100, activity * 0.35),
    rejection: Math.max(0, 100 - rejection * 22),
    complexity: Math.min(100, complexity * 14),
    speed,
  };
  const totalWeight = RATING_METRICS.reduce((s, m) => s + m.weight, 0);
  const score = Math.round(RATING_METRICS.reduce((s, m) => s + norm[m.key] * m.weight, 0) / totalWeight);

  const tier = score >= 85 ? "A'lo" : score >= 70 ? "Yaxshi" : score >= 55 ? "Qoniqarli" : "E'tibor talab";
  const tierTone = score >= 85 ? "done" : score >= 70 ? "done" : score >= 55 ? "progress" : "danger";

  return {
    name, score, tier, tierTone, population,
    raw: { resolved, overdue, tension, activity, rejection, complexity, speed, avgSla: Math.round(avgSla * 10) / 10 },
    norm,
  };
};

export const OPERATOR_RATINGS = MAHALLAS.map(buildRow).sort((a, b) => b.score - a.score);

export const ratingSummary = (() => {
  const top = OPERATOR_RATINGS[0];
  const worst = OPERATOR_RATINGS[OPERATOR_RATINGS.length - 1];
  const avg = Math.round(OPERATOR_RATINGS.reduce((s, r) => s + r.score, 0) / OPERATOR_RATINGS.length);
  const excellent = OPERATOR_RATINGS.filter((r) => r.score >= 85).length;
  return { top, worst, avg, excellent, count: OPERATOR_RATINGS.length };
})();
