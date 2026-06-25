// Tashabbusli budjet — fuqarolar mahalla loyihalarini taklif qiladi va ovoz beradi.
// Asos: openbudget.uz (KQ-666, 2024) — "bir fuqaro, bir ovoz". 2025 1-mavsum: 10.45 mln ovoz,
// 2369 g'olib, 3.2 trln so'm. Demo — deterministik.
import { Route, Volleyball, Trees, Droplet, School, Lightbulb } from "lucide-react";

const rng = (seed) => {
  const x = Math.sin(seed * 77.3 + 13.9) * 43758.5453;
  return x - Math.floor(x);
};

// Loyiha turi
export const PB_TYPE = {
  road: { label: "Yo'l ta'miri", icon: Route },
  sport: { label: "Sport maydonchasi", icon: Volleyball },
  park: { label: "Bolalar maydoni / park", icon: Trees },
  water: { label: "Ichimlik suvi", icon: Droplet },
  school: { label: "Maktab / bog'cha ta'miri", icon: School },
  light: { label: "Ko'cha yoritish", icon: Lightbulb },
};

// Holat
export const PB_STATUS = {
  voting: { label: "Ovoz berilmoqda", tone: "new" },
  won: { label: "G'olib · moliyalashtirildi", tone: "done" },
  lost: { label: "Yetarli ovoz yo'q", tone: "danger" },
  building: { label: "Amalga oshmoqda", tone: "progress" },
};

const MAHALLAS = ["Sarnovul", "Markaz", "Yangiobod", "Bo'ston", "Guliston", "Navbahor", "Do'stlik", "Oltinko'l", "Chinor", "Bahor"];
const TYPES = ["road", "sport", "park", "water", "school", "light"];
const TITLES = {
  road: ["Ichki ko'cha asfaltlash", "Markaziy yo'l ta'miri", "Trotuar yangilash"],
  sport: ["Mini-futbol maydoni", "Vorkaut zonasi", "Sport inshooti"],
  park: ["Bolalar o'yin maydoni", "Mahalla bog'i", "Dam olish zonasi"],
  water: ["Ichimlik suvi quvuri", "Nasos stansiyasi", "Suv tarmog'i"],
  school: ["Maktab sport zali", "Bog'cha ta'miri", "Sinf jihozlari"],
  light: ["LED yoritish o'rnatish", "Ko'cha chiroqlari", "Park yoritishi"],
};

const STATUSES = ["won", "won", "building", "voting", "voting", "lost"];

export const PB_PROJECTS = Array.from({ length: 18 }, (_, i) => {
  const seed = i + 1;
  const type = TYPES[i % TYPES.length];
  const mahalla = MAHALLAS[i % MAHALLAS.length];
  const status = STATUSES[i % STATUSES.length];
  const titleArr = TITLES[type];
  const title = titleArr[Math.floor(rng(seed * 2.1) * titleArr.length)];
  const votes = status === "voting" ? Math.round(20 + rng(seed * 3.3) * 380) : Math.round(150 + rng(seed * 3.3) * 1400);
  const cost = Math.round((80 + rng(seed * 4.4) * 420)) * 1_000_000; // 80-500 mln
  const target = 50; // minimal ovoz (2025-da 50 ga oshirildi)

  return {
    id: `TB-${2026}-${String(100 + i).padStart(3, "0")}`,
    title,
    type,
    mahalla,
    status,
    votes,
    cost,
    target,
    author: status === "voting" ? "Fuqaro tashabbusi" : "Mahalla aholisi",
    // amalga oshmoqda bo'lsa progress
    progress: status === "building" ? Math.round(20 + rng(seed * 5.5) * 60) : status === "won" ? 100 : 0,
  };
});

export const pbSummary = (() => {
  const won = PB_PROJECTS.filter((p) => p.status === "won" || p.status === "building");
  const voting = PB_PROJECTS.filter((p) => p.status === "voting").length;
  const totalVotes = PB_PROJECTS.reduce((s, p) => s + p.votes, 0);
  const allocated = won.reduce((s, p) => s + p.cost, 0);
  return {
    total: PB_PROJECTS.length,
    won: won.length,
    voting,
    totalVotes,
    allocated,
  };
})();

// Tur bo'yicha donut
export const PB_BY_TYPE = TYPES.map((key) => ({
  key,
  value: PB_PROJECTS.filter((p) => p.type === key).length,
}));
