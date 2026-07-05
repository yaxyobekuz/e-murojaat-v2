// Sarnovul MFY umumiy ko'rsatkichlari — top-bar cardlar, overview paneli, bottom bar uchun.
// Kanonik raqamlar sarnovul modulidan: 763 xonadon / 4 306 aholi / 13 korxona / 14 ko'cha.
import {
  Users, Landmark, GraduationCap, Briefcase, ShieldAlert, Flame,
  Sparkles, Droplets, Zap, Map as MapIcon, Building2, Home, TreePine, Wifi,
} from "lucide-react";

export const MAHALLA = "Sarnovul";

// ===== Top bar — 16 ta card (2 qator × 8 ustun) =====
// to: bosilganda o'tadigan modul sahifasi (mavjud route'lar)
export const TOP_CARDS = [
  { key: "aholi", title: "Aholi soni", value: 4306, unit: "kishi", delta: +1.8, icon: Users, color: "#38bdf8", to: "/owner/talim" },
  { key: "honadon", title: "Honadonlar", value: 763, unit: "ta", delta: +0.6, icon: Home, color: "#22d3ee", to: "/owner/asosiy" },
  { key: "soliq", title: "Yig'ilgan soliq", value: 486, unit: "mln", delta: +6.4, icon: Landmark, color: "#818cf8", to: "/owner/soliq", money: true },
  { key: "talim", title: "O'quvchilar", value: 1124, unit: "o'quvchi", delta: +2.1, icon: GraduationCap, color: "#34d399", to: "/owner/talim" },
  { key: "yoshlar", title: "Yoshlar daftari", value: 57, unit: "yosh", delta: -12.3, icon: Briefcase, color: "#fb923c", to: "/owner/yoshlar" },
  { key: "iib", title: "Profilaktikada", value: 9, unit: "oila", delta: -8.0, icon: ShieldAlert, color: "#f87171", to: "/owner/iib" },
  { key: "gaz", title: "Gaz qarzdorlik", value: 38, unit: "mln", delta: -4.2, icon: Flame, color: "#60a5fa", to: "/owner/gaz", money: true },
  { key: "obod", title: "Obodonlashtirish", value: 78, unit: "% bajarildi", delta: +5.5, icon: Sparkles, color: "#2dd4bf", to: "/owner/obodonlashtirish" },
  { key: "suv", title: "Suv ta'minoti", value: 91, unit: "% qamrov", delta: +1.2, icon: Droplets, color: "#22d3ee", to: "/owner/asosiy" },
  { key: "elektr", title: "Elektr qarzdorlik", value: 29, unit: "mln", delta: -2.8, icon: Zap, color: "#fbbf24", to: "/owner/elektr", money: true },
  { key: "yer", title: "Yer kadastri", value: 812, unit: "obyekt", delta: +0.4, icon: MapIcon, color: "#4ade80", to: "/owner/yer" },
  { key: "fvv", title: "Xavfli obyektlar", value: 6, unit: "obyekt", delta: -1.0, icon: Flame, color: "#f97316", to: "/owner/fvv" },
  { key: "zavod", title: "Korxonalar", value: 13, unit: "korxona", delta: +3.3, icon: Building2, color: "#a78bfa", to: "/owner/soliq" },
  { key: "yashil", title: "Yashil makon", value: 1850, unit: "tup", delta: +24.1, icon: TreePine, color: "#22c55e", to: "/owner/obodonlashtirish/yashil-makon" },
  { key: "internet", title: "Internet qamrovi", value: 84, unit: "%", delta: +5.2, icon: Wifi, color: "#38bdf8", to: "/owner/internet" },
  { key: "murojaat", title: "Murojaatlar", value: 38, unit: "ta", delta: +12.0, icon: Sparkles, color: "#c084fc", to: "/owner/msk" },
];

// ===== Overview paneli (hech narsa tanlanmaganda) =====
export const OVERVIEW = {
  name: "Sarnovul MFY",
  region: "Andijon viloyati · Baliqchi tumani",
  hero: [
    { label: "Aholi", value: "4 306", sub: "doimiy yashovchi" },
    { label: "Honadon", value: "763", sub: "ro'yxatdagi" },
    { label: "Korxonalar", value: "13", sub: "faoliyatda" },
    { label: "Ko'chalar", value: "14", sub: "umumiy" },
  ],
  // aholi tarkibi (donut) — jami 4 306
  population: [
    { key: "bolalar", label: "Bolalar (0-18)", value: 1420, color: "#22d3ee" },
    { key: "mehnat", label: "Mehnatga layoqatli", value: 2280, color: "#34d399" },
    { key: "keksalar", label: "Keksalar (60+)", value: 606, color: "#f59e0b" },
  ],
  // infratuzilma qamrovi (progress) — sarnovul modulidagi real ko'rsatkichlar
  coverage: [
    { label: "Gaz ta'minoti (quvur + balon)", value: 92, color: "#60a5fa" },
    { label: "Elektr energiyasi", value: 98, color: "#fbbf24" },
    { label: "Ichimlik suvi", value: 91, color: "#22d3ee" },
    { label: "Internet", value: 84, color: "#38bdf8" },
    { label: "Markazlashgan kanalizatsiya", value: 18, color: "#a78bfa" },
  ],
  // xaritadagi obyektlar (mahalla bo'yicha, jonli OSM'dan)
  mapObjects: [
    { label: "Turar-joy binolari", value: 452, color: "#22d3ee" },
    { label: "Tijorat obyektlari", value: 13, color: "#a855f7" },
    { label: "Ko'chalar", value: 14, color: "#f59e0b" },
    { label: "Yashil hududlar", value: 84, color: "#10b981" },
  ],
  // ijtimoiy obyektlar — sarnovul modulidagi real sonlar
  facilities: [
    { label: "Maktab", value: 2, icon: GraduationCap },
    { label: "Bog'cha", value: 6, icon: Home },
    { label: "Poliklinika", value: 1, icon: Sparkles },
    { label: "Masjid", value: 3, icon: Building2 },
  ],
};

// ===== Bottom bar =====
export const BOTTOM_STATS = [
  { label: "Bandlik darajasi", value: "74%", tone: "success" },
  { label: "Tug'ilish (yil)", value: "86", tone: "info" },
  { label: "Nikoh (yil)", value: "41", tone: "info" },
  { label: "Yangi bizneslar", value: "5", tone: "success" },
  { label: "Hal qilingan murojaat", value: "61%", tone: "warning" },
  { label: "Ko'chmas mulk bitimlari", value: "19", tone: "info" },
];

// ===== Chap panel — kamera kuzatuvi (2×2) =====
// demo video oqimlari (ochiq namuna manbalar)
export const CAMERAS = [
  { id: "cam1", label: "Bobur ko'chasi · kirish", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: "cam2", label: "Oltinko'l · chiqish", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: "cam3", label: "Markaziy ko'cha", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { id: "cam4", label: "Bozor maydoni", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
];

// ===== Chap panel — jonli operativ ko'rsatkichlar =====
export const LIVE_FEEDS = [
  { key: "murojaat", label: "Bugungi murojaatlar", value: 9, delta: +2, tone: "info", icon: "MessageSquare" },
  { key: "favqulodda", label: "Favqulodda holatlar", value: 1, delta: -1, tone: "danger", icon: "Siren" },
  { key: "msk", label: "MSK buyurtmalar", value: 6, delta: +2, tone: "success", icon: "ClipboardList" },
  { key: "davomat", label: "Darsdan qolganlar", value: 7, delta: +3, tone: "warning", icon: "GraduationCap", sub: "doimiy davomatsiz" },
  { key: "transport", label: "Begona transportlar", value: 4, delta: +1, tone: "warning", icon: "Car" },
  { key: "qidiruv", label: "Qidiruvdagi shaxslar", value: 1, delta: 0, tone: "danger", icon: "UserSearch" },
];
