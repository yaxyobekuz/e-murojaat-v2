// Eko Faol Fuqaro — fuqaro/oila eko-faollik ballari + "Yashil oila" status + mukofotlar.
// Asos: ecofaolfuqaro.uz — daraxt ekkani +50, quyosh +100/kW, tozalash +30, h.k.
// "Yashil oila" → elektromobil tanlovi (Obod Mahalla). Demo — deterministik.
import { TreePine, Sun, Trash2, Lightbulb, Footprints, Car, Bike, Home, Ticket } from "lucide-react";

const rng = (seed) => {
  const x = Math.sin(seed * 83.1 + 27.7) * 43758.5453;
  return x - Math.floor(x);
};

// Ball turlari (real koeffitsientlar)
export const ECO_ACTIONS = [
  { key: "tree", label: "Daraxt ekish / parvarish", points: 50, icon: TreePine },
  { key: "solar", label: "Quyosh paneli (1 kW)", points: 100, icon: Sun },
  { key: "cleanup", label: "Hudud tozalash / saralash", points: 30, icon: Trash2 },
  { key: "device", label: "Energiya tejovchi qurilma", points: 75, icon: Lightbulb },
  { key: "walk", label: "Piyoda yurish (kun)", points: 15, icon: Footprints },
];

const NAMES = ["Karimovlar", "Yusupovlar", "Rahimovlar", "Ergashevlar", "Qodirovlar", "Saidovlar", "Nazarovlar", "Aliyevlar", "To'xtayevlar", "Yo'ldoshevlar"];
// Sarnovul MFY ko'chalari — kanonik 14 ta
const MAHALLAS = ["Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik", "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor"];

// Oilalar reytingi (eko-ball bo'yicha) — mahalla masshtabi
export const ECO_FAMILIES = Array.from({ length: 12 }, (_, i) => {
  const seed = i + 1;
  const trees = Math.round(rng(seed * 2.1) * 30);
  const solar = Math.round(rng(seed * 3.2) * 3);
  const cleanups = Math.round(rng(seed * 4.3) * 15);
  const devices = Math.round(rng(seed * 5.4) * 5);
  const walks = Math.round(rng(seed * 6.5) * 120);
  const points = trees * 50 + solar * 100 + cleanups * 30 + devices * 75 + walks * 15;
  // 20+ daraxt yoki 3000+ ball → "Yashil oila" status
  const greenFamily = trees >= 20 || points >= 3000;
  return {
    id: `EF-${String(i + 1).padStart(3, "0")}`,
    name: NAMES[i % NAMES.length],
    mahalla: MAHALLAS[i % MAHALLAS.length],
    trees, solar, cleanups, devices, walks,
    points,
    greenFamily,
  };
}).sort((a, b) => b.points - a.points);

export const ecoSummary = (() => {
  const totalPoints = ECO_FAMILIES.reduce((s, f) => s + f.points, 0);
  const greenFamilies = ECO_FAMILIES.filter((f) => f.greenFamily).length;
  const totalTrees = ECO_FAMILIES.reduce((s, f) => s + f.trees, 0);
  const totalSolar = ECO_FAMILIES.reduce((s, f) => s + f.solar, 0);
  return {
    families: ECO_FAMILIES.length,
    greenFamilies,
    totalPoints,
    totalTrees,
    totalSolar,
  };
})();

// Mukofotlar (Obod Mahalla)
export const ECO_REWARDS = [
  { icon: Car, title: "Elektromobil", sub: "Yashil oila tanlovi g'olibiga", color: "#22c55e" },
  { icon: Bike, title: "Velosiped", sub: "Eko-faollarga oylik", color: "#06b6d4" },
  { icon: Home, title: "500 mln so'm", sub: "Mahalla yo'l/yoritishiga", color: "#f59e0b" },
  { icon: Ticket, title: "Yashil chipta", sub: "Davlat xizmatiga 10% chegirma", color: "#a78bfa" },
];
