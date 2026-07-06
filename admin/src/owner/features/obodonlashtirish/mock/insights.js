// Mavjud raqamlardan KELIB CHIQADIGAN insightlar (impact ekvivalenti, ballar, AI xulosa,
// nishonlar, mahalla salomatlik indeksi). Asl mock data O'ZGARMAYDI — faqat o'qiladi.
import { Trophy, TreePine, Truck, Zap } from "lucide-react";

import { axlatSummary, AXLAT_ROUTES } from "./axlat.data";
import { assenSummary, ASSEN_ORDERS } from "./assenizatsiya.data";
import { ymSummary, YM_PLANTINGS } from "./yashilMakon.data";
import { hasharSummary, HASHAR_RANKING, HASHAR_EVENTS } from "./hashar.data";

// Konvertatsiya koeffitsientlari (demo, real emas)
const FOOTBALL_FIELD_HA = 0.714; // 1 futbol maydoni ≈ 0.714 ga
const TRUCK_M3 = 10; // 1 axlat mashinasi ≈ 10 m³
const CO2_PER_TREE = 118; // kg/yil
const O2_PER_TREE = 100; // kg/yil

// ───────────────────────── AXLAT ─────────────────────────
export const axlatImpact = (() => {
  const s = axlatSummary;
  const trucks = Math.round(s.collectedVolume / TRUCK_M3);
  const fields = Math.round(s.collectedVolume * 0.0008 * 100) / 100; // demo tozalangan maydon ekvivalenti
  // Route Health Score: o'z vaqtida kelgan reys ulushi + kechikish jarimasi
  const reliability = Math.round((s.done / s.routes) * 100 - s.late * 3);
  const healthScore = Math.max(0, Math.min(100, reliability + 6));
  // District Cleanliness Index — hajm bajarilishi + ishonchlilik
  const fulfill = Math.round((s.collectedVolume / s.plannedVolume) * 100);
  const cleanlinessIndex = Math.round((fulfill * 0.5 + reliability * 0.5));
  return {
    trucks, fields,
    reliabilityScore: Math.max(0, Math.min(100, reliability)),
    healthScore,
    cleanlinessIndex: Math.max(0, Math.min(100, cleanlinessIndex)),
    fulfillPct: fulfill,
    missedRoutes: AXLAT_ROUTES.filter((r) => r.status === "missed"),
  };
})();

export const axlatInsights = (() => {
  const s = axlatSummary, im = axlatImpact;
  const out = [];
  out.push({ text: `Xizmat ishonchliligi ${im.reliabilityScore}/100 — ${s.done} ta marshrut o'z vaqtida xizmat ko'rsatdi.`, tone: im.reliabilityScore >= 70 ? "#22c55e" : "#f59e0b" });
  if (s.missed > 0) out.push({ text: `${s.missed} ta marshrutda mashina kelmadi — darhol qayta yo'naltirish tavsiya etiladi.`, tone: "#ef4444" });
  out.push({ text: `Bir yig'ish siklida to'plangan hajm ${im.trucks} ta to'la axlat mashinasiga teng.`, tone: "#22d3ee" });
  return out;
})();

export const axlatTrends = (() => {
  const s = axlatSummary;
  return [
    { dir: s.completionPct >= 75 ? "up" : "flat", title: "Bajarilish darajasi", value: `${s.completionPct}%`, note: "Rejalashtirilgan reyslarga nisbatan" },
    { dir: s.missed > 1 ? "down" : "up", title: "Kelmay qolgan reyslar", value: s.missed, note: s.missed > 1 ? "E'tibor talab qiladi" : "Nazoratda" },
    { dir: "up", title: "Tarif yig'imi", value: "+4%", note: "O'tgan oyga nisbatan (demo)" },
  ];
})();

// ───────────────────────── ASSENIZATSIYA ─────────────────────────
export const assenImpact = (() => {
  const s = assenSummary;
  const efficiency = Math.max(0, Math.min(100, Math.round(100 - (s.avgSla - 1) * 18 - s.rejected * 4)));
  // Eng tez xizmat ko'rsatilgan hududlar (o'rtacha SLA bo'yicha)
  const byMahalla = {};
  ASSEN_ORDERS.filter((o) => o.status === "done").forEach((o) => {
    byMahalla[o.mahalla] = byMahalla[o.mahalla] || { sum: 0, n: 0 };
    byMahalla[o.mahalla].sum += o.slaDays; byMahalla[o.mahalla].n += 1;
  });
  const heat = Object.entries(byMahalla)
    .map(([label, v]) => ({ label, avg: Math.round((v.sum / v.n) * 10) / 10 }))
    .sort((a, b) => a.avg - b.avg);
  return { efficiency, heat };
})();

export const assenInsights = (() => {
  const s = assenSummary, im = assenImpact;
  const out = [];
  out.push({ text: `O'rtacha bajarilish vaqti ${s.avgSla} kun — samaradorlik ${im.efficiency}/100.`, tone: im.efficiency >= 70 ? "#22c55e" : "#f59e0b" });
  if (im.heat[0]) out.push({ text: `Eng tez hudud: ${im.heat[0].label} (${im.heat[0].avg} kun).`, tone: "#22d3ee" });
  if (s.inProgress > 0) out.push({ text: `${s.inProgress} ta buyurtma kutilmoqda — dispetcherlik navbati faol.`, tone: "#f59e0b" });
  return out;
})();

export const assenTrends = (() => {
  const s = assenSummary;
  return [
    { dir: s.avgSla <= 2 ? "up" : "flat", title: "Bajarilish tezligi", value: `${s.avgSla} kun`, note: "O'rtacha SLA" },
    { dir: s.rejected === 0 ? "up" : "down", title: "Rad etilgan", value: s.rejected, note: s.rejected ? "Sabablari ko'rib chiqilsin" : "Nol — a'lo" },
    { dir: "up", title: "Bajarilgan hajm", value: `${s.volume} m³`, note: "Joriy davr" },
  ];
})();

// ───────────────────────── YASHIL MAKON ─────────────────────────
export const ymImpact = (() => {
  const s = ymSummary;
  const co2 = Math.round((s.planted * CO2_PER_TREE) / 1000); // tonna/yil
  const o2 = Math.round((s.planted * O2_PER_TREE) / 1000); // tonna/yil
  // 1 ko'cha yashil qoplamasi ≈ 132 daraxt (1850/14) — demo
  const mahallasGreen = Math.round((s.planted / 132) * 10) / 10;
  // Survival radar — tur bo'yicha tirik qolish
  const byType = {};
  YM_PLANTINGS.forEach((p) => {
    byType[p.type] = byType[p.type] || { sum: 0, n: 0 };
    byType[p.type].sum += p.survivalPct; byType[p.type].n += 1;
  });
  const TYPE_LABEL = { ornamental: "Manzarali", fruit: "Mevali", conifer: "Ignabargli", shrub: "Buta" };
  const radar = Object.entries(byType).map(([k, v]) => ({ axis: TYPE_LABEL[k] || k, value: Math.round(v.sum / v.n) }));
  return { co2, o2, mahallasGreen, radar };
})();

export const ymInsights = (() => {
  const s = ymSummary, im = ymImpact;
  const out = [];
  out.push({ text: `Ko'chat tirik qolish darajasi ${s.survivalPct}% — o'tgan mavsumga nisbatan +8% (demo).`, tone: "#22c55e" });
  out.push({ text: `Ekilgan daraxtlar yiliga ~${im.co2.toLocaleString("uz-UZ")} t CO₂ yutadi va ~${im.o2.toLocaleString("uz-UZ")} t O₂ ajratadi.`, tone: "#22d3ee" });
  if (s.enteredPct < 80) out.push({ text: `Ko'chatlarning ${100 - s.enteredPct}% qismi hali yashilmakon.eco ga kiritilmagan.`, tone: "#f59e0b" });
  return out;
})();

export const ymTrends = (() => {
  const s = ymSummary;
  return [
    { dir: "up", title: "Tirik qolish", value: `${s.survivalPct}%`, note: "Mavsumiy o'sish +8% (demo)" },
    { dir: s.enteredPct >= 80 ? "up" : "down", title: "Tizimga kiritish", value: `${s.enteredPct}%`, note: "yashilmakon.eco" },
    { dir: "up", title: "Ko'kalamzorlik", value: `${s.greenCoverage}%`, note: "Maqsad: 30% (2030)" },
  ];
})();

// ───────────────────────── HASHAR ─────────────────────────
export const hasharImpact = (() => {
  const s = hasharSummary;
  const fields = Math.round((s.area / FOOTBALL_FIELD_HA));
  // Engagement Score — ishtirokchi/tadbir + maydon
  const avgPart = s.participants / s.events;
  const engagement = Math.max(0, Math.min(100, Math.round(avgPart / 2.5 + 30)));
  const leaderboard = HASHAR_RANKING.map((r) => ({ label: r.key, value: r.value, pct: r.value }));
  return { fields, engagement, leaderboard };
})();

export const hasharInsights = (() => {
  const s = hasharSummary, im = hasharImpact;
  const out = [];
  out.push({ text: `Jamoatchilik faolligi ${im.engagement}/100 — ${s.events} tadbirda ${s.participants.toLocaleString("uz-UZ")} ishtirokchi.`, tone: im.engagement >= 60 ? "#22c55e" : "#f59e0b" });
  out.push({ text: `Tozalangan maydon ${im.fields} ta futbol maydoniga teng.`, tone: "#22d3ee" });
  const last = HASHAR_RANKING[HASHAR_RANKING.length - 1];
  if (last) out.push({ text: `${last.key} ko'chasi e'tibor talab qiladi — past faollik (${last.value} ball).`, tone: "#f59e0b" });
  return out;
})();

export const hasharTrends = (() => {
  const s = hasharSummary;
  return [
    { dir: "up", title: "Faollik o'sishi", value: "+12%", note: "Volontyorlar soni (demo)" },
    { dir: "up", title: "Tadbirlar", value: s.events, note: "So'nggi 6 oy" },
    { dir: "flat", title: "Ekilgan daraxt", value: s.trees, note: "Hashar davomida" },
  ];
})();

// ───────────────────────── NISHONLAR ─────────────────────────
export const obodBadges = (() => {
  const topClean = HASHAR_RANKING[0];
  const bestRoute = [...AXLAT_ROUTES].filter((r) => r.status === "done").sort((a, b) => b.collectedVolume - a.collectedVolume)[0];
  return [
    { icon: Trophy, title: "Eng toza ko'cha", sub: topClean ? `${topClean.key} · ${topClean.value} ball` : "—", color: "#fbbf24" },
    { icon: TreePine, title: "Yashil chempion", sub: `${ymSummary.survivalPct}% tirik qolish`, color: "#22c55e" },
    { icon: Truck, title: "Eng ishonchli marshrut", sub: bestRoute ? bestRoute.name : "—", color: "#22d3ee" },
    { icon: Zap, title: "Tez xizmat", sub: `${assenSummary.avgSla} kun o'rtacha SLA`, color: "#3b82f6" },
  ];
})();

// ───────────────────────── XARITA BLOKLARI (ko'cha bo'yicha) ─────────────────────────
const STATUS_RGB = { done: "#22c55e", late: "#f59e0b", missed: "#ef4444", new: "#3b82f6", dispatched: "#f59e0b", rejected: "#ef4444" };

export const axlatMapBlocks = AXLAT_ROUTES.map((r) => ({
  name: r.mahalla,
  color: STATUS_RGB[r.status],
  metric: r.status === "missed" ? "✕" : `${r.collectedVolume}m³`,
  detail: `${r.name} · ${r.status === "missed" ? "kelmadi" : r.status === "late" ? "kechikdi" : "keldi"} · ${r.houses} xonadon`,
}));
export const axlatMapLegend = [
  { color: "#22c55e", label: "Keldi" }, { color: "#f59e0b", label: "Kechikdi" }, { color: "#ef4444", label: "Kelmadi" },
];

export const assenMapBlocks = (() => {
  const by = {};
  ASSEN_ORDERS.forEach((o) => {
    by[o.mahalla] = by[o.mahalla] || { n: 0, sla: 0, done: 0 };
    by[o.mahalla].n += 1;
    if (o.status === "done") { by[o.mahalla].sla += o.slaDays; by[o.mahalla].done += 1; }
  });
  return Object.entries(by).map(([name, v]) => {
    const avg = v.done ? v.sla / v.done : 99;
    const color = avg <= 1.5 ? "#22c55e" : avg <= 2.5 ? "#f59e0b" : "#ef4444";
    return { name, color, metric: `${v.n}`, detail: `${v.n} buyurtma · o'rtacha ${v.done ? Math.round(avg * 10) / 10 : "—"} kun` };
  });
})();
export const assenMapLegend = [
  { color: "#22c55e", label: "Tez (<1.5 kun)" }, { color: "#f59e0b", label: "O'rta" }, { color: "#ef4444", label: "Sekin" },
];

export const ymMapBlocks = (() => {
  const by = {};
  YM_PLANTINGS.forEach((p) => {
    by[p.mahalla] = by[p.mahalla] || { count: 0, surv: 0, n: 0 };
    by[p.mahalla].count += p.count; by[p.mahalla].surv += p.survivalPct; by[p.mahalla].n += 1;
  });
  return Object.entries(by).map(([name, v]) => {
    const surv = Math.round(v.surv / v.n);
    const color = surv >= 90 ? "#22c55e" : surv >= 85 ? "#84cc16" : "#f59e0b";
    return { name, color, metric: v.count.toLocaleString("uz-UZ"), detail: `${v.count.toLocaleString("uz-UZ")} ko'chat · ${surv}% tirik` };
  });
})();
export const ymMapLegend = [
  { color: "#22c55e", label: "≥90% tirik" }, { color: "#84cc16", label: "85-90%" }, { color: "#f59e0b", label: "<85%" },
];

export const hasharMapBlocks = HASHAR_RANKING.map((r) => ({
  name: r.key,
  color: r.value >= 90 ? "#22c55e" : r.value >= 75 ? "#84cc16" : r.value >= 65 ? "#f59e0b" : "#ef4444",
  metric: `${r.value}`,
  detail: `Tozalik reytingi: ${r.value} ball`,
}));
export const hasharMapLegend = [
  { color: "#22c55e", label: "A'lo (≥90)" }, { color: "#84cc16", label: "Yaxshi" }, { color: "#f59e0b", label: "O'rta" }, { color: "#ef4444", label: "Past" },
];

// ───────────────────────── MAHALLA SALOMATLIK INDEKSI ─────────────────────────
// 4 modul ballarining vaznli o'rtachasi → 0..100
export const districtHealth = (() => {
  const waste = axlatImpact.cleanlinessIndex;
  const septic = assenImpact.efficiency;
  const green = Math.round((ymSummary.survivalPct + ymSummary.completionPct) / 2);
  const community = hasharImpact.engagement;
  const score = Math.round(waste * 0.3 + septic * 0.2 + green * 0.3 + community * 0.2);
  return {
    score: Math.max(0, Math.min(100, score)),
    parts: [
      { label: "Chiqindi boshqaruvi", value: waste, accent: "#22d3ee" },
      { label: "Suyuq chiqindi", value: septic, accent: "#3b82f6" },
      { label: "Ko'kalamzorlashtirish", value: green, accent: "#22c55e" },
      { label: "Jamoatchilik", value: community, accent: "#b794f6" },
    ],
  };
})();
