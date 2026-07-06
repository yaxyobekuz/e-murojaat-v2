// MSK (Mahalla Servis Kompaniyasi) — ma'lumotnoma. Barcha matn o'zbekcha, kod inglizcha.
// Demo konteksti: Sarnovul MFY, Baliqchi tumani, Andijon.
import {
  Waves, Paintbrush, Lightbulb, TreeDeciduous, Layers, Plug, Flame, Hammer,
  Grid2x2, Trees, Flame as Weld, Snowflake, Lock, Droplets, Wrench, Construction,
  Home, Sparkles,
} from "lucide-react";

export const MAHALLA = "Sarnovul MFY";
export const PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Mavsumiy profillar (12 oy: Yan..Dek)
const SEASON = {
  winter: [1.6, 1.5, 1.0, 0.6, 0.4, 0.3, 0.3, 0.3, 0.5, 0.8, 1.2, 1.6],
  summer: [0.5, 0.6, 0.9, 1.2, 1.4, 1.6, 1.6, 1.5, 1.2, 0.9, 0.6, 0.5],
  spring: [0.5, 0.7, 1.2, 1.5, 1.5, 1.2, 1.0, 0.9, 0.9, 0.9, 0.8, 0.6],
  autumn: [0.7, 0.7, 0.8, 0.9, 0.9, 0.9, 0.9, 1.0, 1.3, 1.6, 1.4, 0.9],
  allyear: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

// 18 kategoriya: kod + o'zbekcha yorliq + ikonka + rang + narx/davomiylik + mavsum + ayol-ulushi
export const CATEGORIES = [
  { key: "ariq_tozalash", label: "Ariq tozalash", icon: Waves, color: "#0ea5e9", cost: [80000, 250000], durH: 4, season: "spring", femaleBias: 0.3 },
  { key: "boyoq_ishlari", label: "Bo'yoq ishlari", icon: Paintbrush, color: "#f59e0b", cost: [150000, 700000], durH: 8, season: "summer", femaleBias: 0.45 },
  { key: "chiroq_ornatish", label: "Chiroq o'rnatish", icon: Lightbulb, color: "#eab308", cost: [60000, 300000], durH: 3, season: "autumn", femaleBias: 0.28 },
  { key: "daraxt_kesish", label: "Daraxt kesish", icon: TreeDeciduous, color: "#16a34a", cost: [100000, 450000], durH: 5, season: "spring", femaleBias: 0.22 },
  { key: "devor_suvoq", label: "Devor suvoq", icon: Layers, color: "#a16207", cost: [200000, 900000], durH: 10, season: "summer", femaleBias: 0.3 },
  { key: "elektrik", label: "Elektrik xizmatlari", icon: Plug, color: "#f43f5e", cost: [70000, 400000], durH: 3, season: "allyear", femaleBias: 0.25 },
  { key: "issiqlik_tizimi", label: "Issiqlik tizimi", icon: Flame, color: "#ef4444", cost: [200000, 1200000], durH: 7, season: "winter", femaleBias: 0.32 },
  { key: "kichik_qurilish", label: "Kichik qurilish", icon: Hammer, color: "#d97706", cost: [500000, 3500000], durH: 24, season: "summer", femaleBias: 0.2 },
  { key: "metall_konstruksiya", label: "Metall konstruksiya", icon: Grid2x2, color: "#64748b", cost: [400000, 2500000], durH: 16, season: "allyear", femaleBias: 0.15 },
  { key: "obodonlashtirish", label: "Obodonlashtirish", icon: Trees, color: "#10b981", cost: [150000, 800000], durH: 9, season: "summer", femaleBias: 0.35 },
  { key: "payvandlash", label: "Payvandlash", icon: Weld, color: "#fb7185", cost: [120000, 600000], durH: 5, season: "allyear", femaleBias: 0.12 },
  { key: "qor_tozalash", label: "Qor tozalash", icon: Snowflake, color: "#38bdf8", cost: [50000, 200000], durH: 3, season: "winter", femaleBias: 0.3 },
  { key: "qulflash", label: "Qulflash xizmatlari", icon: Lock, color: "#8b5cf6", cost: [40000, 180000], durH: 2, season: "allyear", femaleBias: 0.33 },
  { key: "santexnik", label: "Santexnik xizmatlari", icon: Droplets, color: "#06b6d4", cost: [80000, 500000], durH: 3, season: "allyear", femaleBias: 0.38 },
  { key: "suv_quvur_tamiri", label: "Suv quvur ta'miri", icon: Wrench, color: "#0891b2", cost: [120000, 650000], durH: 4, season: "winter", femaleBias: 0.3 },
  { key: "tamirlash", label: "Ta'mirlash ishlari", icon: Construction, color: "#f97316", cost: [150000, 1500000], durH: 12, season: "allyear", femaleBias: 0.34 },
  { key: "tom_yopish", label: "Tom yopish", icon: Home, color: "#b45309", cost: [400000, 3000000], durH: 18, season: "autumn", femaleBias: 0.2 },
  { key: "uy_tozalash", label: "Uy tozalash", icon: Sparkles, color: "#ec4899", cost: [60000, 280000], durH: 4, season: "allyear", femaleBias: 0.7 },
];

export const CAT = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));
export const seasonCoeff = (key, monthIdx) => SEASON[CAT[key].season][monthIdx];
export const catLabel = (key) => CAT[key]?.label || key;

// Sarnovul ko'chalari — kanonik 14 ta (Maslahat, Ulug'vor, Urganji + boshqalar)
export const STREETS = [
  "Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik",
  "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor",
];

// Holat / ustuvorlik / manba / jins xaritalari
export const STATUS = {
  yangi: { label: "Yangi", tone: "new" },
  tayinlandi: { label: "Tayinlandi", tone: "new" },
  jarayonda: { label: "Jarayonda", tone: "progress" },
  bajarildi: { label: "Bajarildi", tone: "done" },
  bekor: { label: "Bekor qilindi", tone: "neutral" },
  kechikkan: { label: "Muddati o'tgan", tone: "danger" },
};
export const STATUS_KEYS = Object.keys(STATUS);

export const PRIORITY = {
  past: { label: "Past", color: "#94a3b8" },
  orta: { label: "O'rta", color: "#0ea5e9" },
  yuqori: { label: "Yuqori", color: "#f59e0b" },
  shoshilinch: { label: "Shoshilinch", color: "#ef4444" },
};

export const SOURCE = {
  mobil_ilova: "Mobil ilova",
  call_markaz: "Call markaz",
  mfy_rais: "MFY raisi",
  veb: "Veb-sayt",
};

export const GENDER = { erkak: "Erkak", ayol: "Ayol" };

export const AGE_BUCKETS = [
  { key: "18-25", min: 18, max: 25 },
  { key: "26-35", min: 26, max: 35 },
  { key: "36-45", min: 36, max: 45 },
  { key: "46-60", min: 46, max: 60 },
  { key: "60+", min: 61, max: 95 },
];
export const ageBucket = (age) => AGE_BUCKETS.find((b) => age >= b.min && age <= b.max)?.key || "60+";

// Xodimlar reestri — kanonik shtat: 47 faol ish o'rni (erkak 29 / ayol 18).
// Yo'nalishlar: elektr montaj 12, santexnika 11, duradgorlik 8, payvandlash 6, boshqa 10.
const MALE_NAMES = ["Akmal", "Bekzod", "Davron", "Eldor", "Farrux", "G'ayrat", "Hasan", "Islom", "Jasur", "Kamol", "Laziz", "Mirjalol", "Nodir", "Otabek", "Rustam", "Sardor", "Temur", "Ulug'bek"];
const FEMALE_NAMES = ["Dilnoza", "Feruza", "Gulnora", "Iroda", "Kamola", "Madina", "Nargiza", "Ozoda", "Rayhona", "Sevara"];
const SURNAMES = ["Karimov", "Yusupov", "Toshmatov", "Ergashev", "Sharipov", "Qodirov", "Islomov", "Abdullayev", "Nazarov", "Rahimov", "Salimov", "Usmonov"];

const mkRng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Yo'nalish guruhlari (2-mutaxassislik faqat o'z guruhidan olinadi)
const DIRECTION_GROUPS = [
  ["elektrik", "chiroq_ornatish"], // elektr montaj — 12
  ["santexnik", "suv_quvur_tamiri", "issiqlik_tizimi"], // santexnika — 11
  ["tamirlash", "tom_yopish", "kichik_qurilish"], // duradgorlik — 8
  ["payvandlash", "metall_konstruksiya"], // payvandlash — 6
  ["ariq_tozalash", "boyoq_ishlari", "daraxt_kesish", "devor_suvoq", "obodonlashtirish", "qor_tozalash", "qulflash", "uy_tozalash"], // boshqa — 10
];
const groupOf = (key) => DIRECTION_GROUPS.find((g) => g.includes(key)) || [key];

// Har kategoriya bo'yicha [erkak, ayol] shtat — jami 47 (29/18)
const STAFF_PLAN = {
  elektrik: [5, 2], chiroq_ornatish: [3, 2],
  santexnik: [3, 2], suv_quvur_tamiri: [2, 1], issiqlik_tizimi: [1, 2],
  tamirlash: [2, 2], tom_yopish: [2, 0], kichik_qurilish: [2, 0],
  payvandlash: [4, 0], metall_konstruksiya: [2, 0],
  ariq_tozalash: [1, 0], boyoq_ishlari: [0, 2], daraxt_kesish: [1, 0], devor_suvoq: [0, 1],
  obodonlashtirish: [0, 2], qor_tozalash: [1, 0], qulflash: [0, 1], uy_tozalash: [0, 1],
};

const buildWorkers = () => {
  const r = mkRng(7711);
  const workers = [];
  const used = new Set();
  let n = 0;
  CATEGORIES.forEach((c) => {
    const [maleCount, femaleCount] = STAFF_PLAN[c.key];
    for (let i = 0; i < maleCount + femaleCount; i++) {
      n += 1;
      const isFemale = i >= maleCount;
      let name;
      do {
        const first = isFemale ? FEMALE_NAMES[Math.floor(r() * FEMALE_NAMES.length)] : MALE_NAMES[Math.floor(r() * MALE_NAMES.length)];
        name = `${first} ${SURNAMES[Math.floor(r() * SURNAMES.length)]}`;
      } while (used.has(name));
      used.add(name);
      // Ba'zilari o'z yo'nalishi ichida 2-mutaxassislik bilan
      const group = groupOf(c.key);
      const extra = r() < 0.35 && group.length > 1 ? [group[Math.floor(r() * group.length)]] : [];
      workers.push({
        id: `wrk_${String(n).padStart(3, "0")}`,
        name,
        gender: isFemale ? "ayol" : "erkak",
        specialties: Array.from(new Set([c.key, ...extra])),
      });
    }
  });
  return workers;
};

export const WORKERS = buildWorkers();
export const workersFor = (catKey) => WORKERS.filter((w) => w.specialties.includes(catKey));

export const PERIODS = ["Hafta", "Oy", "12 oy"];
