// Sarnovul mahallasi umumiy ko'rsatkichlari — top-bar cardlar, overview paneli, bottom bar uchun.
// Barchasi namunaviy (demo). Modul accent ranglari rules/02 ga mos.
import {
  Users, Landmark, GraduationCap, Briefcase, ShieldAlert, Flame,
  Sparkles, Droplets, Zap, Map as MapIcon, Building2, Home, TreePine, Wifi,
} from "lucide-react";

export const MAHALLA = "Sarnovul";

// ===== Top bar — 16 ta card (2 qator × 8 ustun) =====
// to: bosilganda o'tadigan modul sahifasi (mavjud route'lar)
export const TOP_CARDS = [
  { key: "aholi", title: "Aholi soni", value: 7842, unit: "kishi", delta: +1.8, icon: Users, color: "#38bdf8", to: "/owner/talim" },
  { key: "honadon", title: "Honadonlar", value: 1640, unit: "ta", delta: +0.6, icon: Home, color: "#22d3ee", to: "/owner/asosiy" },
  { key: "soliq", title: "Yig'ilgan soliq", value: 4.21, unit: "mlrd", delta: +6.4, icon: Landmark, color: "#818cf8", to: "/owner/soliq", money: true },
  { key: "talim", title: "O'quvchilar", value: 2540, unit: "o'quvchi", delta: +2.1, icon: GraduationCap, color: "#34d399", to: "/owner/talim" },
  { key: "yoshlar", title: "Yoshlar daftari", value: 96, unit: "yosh", delta: -3.0, icon: Briefcase, color: "#fb923c", to: "/owner/yoshlar" },
  { key: "iib", title: "Profilaktikada", value: 31, unit: "oila", delta: -8.0, icon: ShieldAlert, color: "#f87171", to: "/owner/iib" },
  { key: "gaz", title: "Gaz qarzdorlik", value: 182, unit: "mln", delta: -4.2, icon: Flame, color: "#60a5fa", to: "/owner/gaz", money: true },
  { key: "obod", title: "Obodonlashtirish", value: 78, unit: "% bajarildi", delta: +5.5, icon: Sparkles, color: "#2dd4bf", to: "/owner/obodonlashtirish" },
  { key: "suv", title: "Suv ta'minoti", value: 91, unit: "% qamrov", delta: +1.2, icon: Droplets, color: "#22d3ee", to: "/owner/asosiy" },
  { key: "elektr", title: "Elektr qarzdorlik", value: 156, unit: "mln", delta: -2.8, icon: Zap, color: "#fbbf24", to: "/owner/elektr", money: true },
  { key: "yer", title: "Yer kadastri", value: 1640, unit: "obyekt", delta: +0.4, icon: MapIcon, color: "#4ade80", to: "/owner/yer" },
  { key: "fvv", title: "Xavfli obyektlar", value: 28, unit: "obyekt", delta: -1.0, icon: Flame, color: "#f97316", to: "/owner/fvv" },
  { key: "zavod", title: "Korxonalar", value: 24, unit: "korxona", delta: +3.3, icon: Building2, color: "#a78bfa", to: "/owner/soliq" },
  { key: "yashil", title: "Yashil makon", value: 12400, unit: "tup", delta: +7.0, icon: TreePine, color: "#22c55e", to: "/owner/obodonlashtirish/yashil-makon" },
  { key: "internet", title: "Internet qamrovi", value: 84, unit: "%", delta: +9.1, icon: Wifi, color: "#38bdf8", to: "/owner/internet" },
  { key: "murojaat", title: "Murojaatlar", value: 143, unit: "ta", delta: +12.0, icon: Sparkles, color: "#c084fc", to: "/owner/msk" },
];

// ===== Overview paneli (hech narsa tanlanmaganda) =====
export const OVERVIEW = {
  name: "Andijon shahri",
  region: "Andijon viloyati · Markaz",
  hero: [
    { label: "Aholi", value: "468 ming", sub: "doimiy yashovchi" },
    { label: "Hudud", value: "74 km²", sub: "umumiy maydon" },
    { label: "Honadon", value: "112 400", sub: "ro'yxatdagi" },
    { label: "Mahallalar", value: "162", sub: "umumiy" },
  ],
  // aholi tarkibi (donut)
  population: [
    { key: "bolalar", label: "Bolalar (0-18)", value: 2540, color: "#22d3ee" },
    { key: "mehnat", label: "Mehnatga layoqatli", value: 4210, color: "#34d399" },
    { key: "keksalar", label: "Keksalar (60+)", value: 1092, color: "#f59e0b" },
  ],
  // infratuzilma qamrovi (progress)
  coverage: [
    { label: "Tabiiy gaz", value: 90, color: "#60a5fa" },
    { label: "Elektr energiyasi", value: 98, color: "#fbbf24" },
    { label: "Ichimlik suvi", value: 91, color: "#22d3ee" },
    { label: "Internet", value: 84, color: "#38bdf8" },
    { label: "Markazlashgan kanalizatsiya", value: 62, color: "#a78bfa" },
  ],
  // xaritadagi obyektlar (shahar bo'yicha)
  mapObjects: [
    { label: "Turar-joy binolari", value: 112400, color: "#22d3ee" },
    { label: "Tijorat obyektlari", value: 8650, color: "#a855f7" },
    { label: "Ko'chalar", value: 1240, color: "#f59e0b" },
    { label: "Yashil hududlar", value: 86, color: "#10b981" },
  ],
  // ijtimoiy obyektlar
  facilities: [
    { label: "Maktab", value: 64, icon: GraduationCap },
    { label: "Bog'cha", value: 98, icon: Home },
    { label: "Poliklinika", value: 21, icon: Sparkles },
    { label: "Masjid", value: 34, icon: Building2 },
  ],
};

// ===== Bottom bar =====
export const BOTTOM_STATS = [
  { label: "Bandlik darajasi", value: "71%", tone: "success" },
  { label: "Tug'ilish (yil)", value: "184", tone: "info" },
  { label: "Nikoh (yil)", value: "96", tone: "info" },
  { label: "Yangi bizneslar", value: "12", tone: "success" },
  { label: "Hal qilingan murojaat", value: "61%", tone: "warning" },
  { label: "Ko'chmas mulk bitimlari", value: "47", tone: "info" },
];
