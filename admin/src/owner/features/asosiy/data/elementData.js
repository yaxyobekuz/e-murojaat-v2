// Tanlangan obyekt (uy/dala/yo'l/zavod) uchun deterministik boy mock ma'lumot.
// Mock id dan seed bilan generatsiya qilinadi — bir obyekt har doim bir xil kartochka beradi.

export const ELEMENT_TYPES = {
  uy: { key: "uy", label: "Uy", color: "#22d3ee", plural: "Uylar" },
  dala: { key: "dala", label: "Dala", color: "#10b981", plural: "Dalalar" },
  yol: { key: "yol", label: "Yo'l", color: "#f59e0b", plural: "Yo'llar" },
  zavod: { key: "zavod", label: "Zavod", color: "#a855f7", plural: "Zavodlar" },
};

// ---- deterministik seed (string -> 0..1) ----
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};
export const seeded = (id) => {
  let s = Math.floor(hash(id) * 1e9) || 1;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};
const ri = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

const FAMILY_NAMES = ["Azizov", "Karimov", "Rasulov", "Tursunov", "Yusupov", "Aliyev", "Saidov", "Qodirov", "Ergashev", "Olimov", "Nazarov", "Sobirov", "Mirzayev", "Hakimov", "Yo'ldoshev"];
const FIRST_NAMES = ["Jasur", "Bekzod", "Sardor", "Otabek", "Akmal", "Bobur", "Aziz", "Sherzod", "Dilshod", "Ulug'bek"];
const STREETS = ["Bobur shoh", "Navoiy", "Amir Temur", "Cho'lpon", "Fitrat", "Istiqlol", "Mustaqillik", "Yangiobod", "Fidokor", "Chashma"];
const CROPS = ["Bug'doy", "Paxta", "Kartoshka", "Sabzavot", "Bog' (meva)", "Uzumzor", "Beda", "Makkajo'xori"];
const FACTORIES = ["G'isht zavodi", "Non zavodi", "Mebel sexi", "To'qimachilik fabrikasi", "Oziq-ovqat sexi", "Savdo markazi", "Biznes markaz"];

export const fmt = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");

const buildHouse = (rnd) => {
  const family = pick(rnd, FAMILY_NAMES);
  const members = ri(rnd, 1, 9);
  const street = pick(rnd, STREETS);
  const houseNo = ri(rnd, 1, 120);
  const debtModules = [];
  if (rnd() < 0.28) debtModules.push({ name: "Gaz", amount: ri(rnd, 80, 900) * 1000 });
  if (rnd() < 0.22) debtModules.push({ name: "Elektr", amount: ri(rnd, 60, 600) * 1000 });
  if (rnd() < 0.18) debtModules.push({ name: "Soliq", amount: ri(rnd, 100, 1500) * 1000 });
  if (rnd() < 0.12) debtModules.push({ name: "Suv", amount: ri(rnd, 30, 200) * 1000 });
  const children = ri(rnd, 0, members);
  const youth = ri(rnd, 0, Math.max(0, members - 1));
  const pensioners = ri(rnd, 0, Math.max(0, members - children));
  const propertyTax = ri(rnd, 80, 600) * 1000;
  const landTax = ri(rnd, 40, 280) * 1000;
  return {
    title: `${family}lar honadoni`,
    subtitle: `${street} ko'chasi, ${houseNo}-uy`,
    badge: debtModules.length ? "Qarzi bor" : "Faol",
    badgeTone: debtModules.length ? "danger" : "success",
    facts: [
      { label: "Xonadon boshlig'i", value: `${family} ${pick(rnd, FIRST_NAMES)}` },
      { label: "Yashovchilar", value: `${members} kishi` },
      { label: "Bolalar (0-18)", value: `${children} ta` },
      { label: "Mehnatga layoqatli", value: `${ri(rnd, 1, members)} ta` },
      { label: "Maydon", value: `${(ri(rnd, 4, 12) * 100) / 10} sotix` },
      { label: "Qurilgan yili", value: `${ri(rnd, 1965, 2022)}` },
    ],
    utilities: [
      { name: "Gaz", on: rnd() < 0.9 },
      { name: "Elektr", on: rnd() < 0.98 },
      { name: "Suv", on: rnd() < 0.85 },
      { name: "Internet", on: rnd() < 0.7 },
    ],
    consumption: { gas: ri(rnd, 40, 320), elec: ri(rnd, 120, 650), water: ri(rnd, 6, 28) },
    debts: debtModules,
    // Moliya yo'nalishi — soliqlar
    taxes: [
      { name: "Mol-mulk solig'i", amount: propertyTax, paid: rnd() < 0.75 },
      { name: "Yer solig'i", amount: landTax, paid: rnd() < 0.7 },
    ],
    // Ijtimoiy yo'nalish
    social: {
      children,
      youth,
      pensioners,
      employed: ri(rnd, 0, members),
      students: ri(rnd, 0, children),
      risk: rnd() < 0.08 ? "Profilaktika hisobida" : rnd() < 0.2 ? "Nazoratda" : "Toza",
      benefits: rnd() < 0.3 ? pick(rnd, ["Kam ta'minlangan", "Nogironlik nafaqasi", "Bolalar nafaqasi"]) : null,
    },
    youthCount: youth,
    risk: rnd() < 0.08 ? "Profilaktika hisobida" : rnd() < 0.2 ? "Nazoratda" : "Toza",
  };
};

const buildField = (rnd) => {
  const crop = pick(rnd, CROPS);
  const ha = (ri(rnd, 5, 120) / 10).toFixed(1);
  return {
    title: `${crop} dalasi`,
    subtitle: `Qishloq xo'jaligi yeri · ${ha} ga`,
    badge: rnd() < 0.8 ? "Ekin ekilgan" : "Bo'sh",
    badgeTone: rnd() < 0.8 ? "success" : "warning",
    facts: [
      { label: "Ekin turi", value: crop },
      { label: "Maydon", value: `${ha} gektar` },
      { label: "Egasi", value: `${pick(rnd, FAMILY_NAMES)} fermer xo'jaligi` },
      { label: "Hosildorlik", value: `${ri(rnd, 18, 65)} s/ga` },
      { label: "Sug'orish", value: pick(rnd, ["Tomchilatib", "Ariqdan", "Nasos orqali"]) },
      { label: "Kadastr", value: `12:0${ri(rnd, 1, 9)}:${ri(rnd, 1000, 9999)}` },
    ],
    yieldTrend: Array.from({ length: 6 }, () => ri(rnd, 30, 70)),
  };
};

const buildRoad = (rnd) => {
  const street = pick(rnd, STREETS);
  const len = ri(rnd, 200, 2400);
  const quality = ri(rnd, 35, 99);
  return {
    title: `${street} ko'chasi`,
    subtitle: `Avtomobil yo'li · ${fmt(len)} m`,
    badge: quality > 75 ? "Yaxshi holatda" : quality > 50 ? "O'rtacha" : "Ta'mir kerak",
    badgeTone: quality > 75 ? "success" : quality > 50 ? "warning" : "danger",
    facts: [
      { label: "Uzunligi", value: `${fmt(len)} m` },
      { label: "Qoplama", value: pick(rnd, ["Asfalt", "Beton", "Shag'al"]) },
      { label: "Holati", value: `${quality}%` },
      { label: "Yoritilgan", value: rnd() < 0.6 ? "Ha" : "Yo'q" },
      { label: "Oxirgi ta'mir", value: `${ri(rnd, 2015, 2025)}` },
      { label: "Kunlik harakat", value: `${fmt(ri(rnd, 200, 4000))} avto` },
    ],
    quality,
  };
};

const buildFactory = (rnd) => {
  const name = pick(rnd, FACTORIES);
  const workers = ri(rnd, 8, 240);
  return {
    title: name,
    subtitle: `Ishlab chiqarish / tijorat obyekti`,
    badge: rnd() < 0.85 ? "Faoliyatda" : "To'xtatilgan",
    badgeTone: rnd() < 0.85 ? "success" : "danger",
    facts: [
      { label: "Faoliyat turi", value: name },
      { label: "Ishchilar", value: `${workers} kishi` },
      { label: "Egasi (MChJ)", value: `"${pick(rnd, FAMILY_NAMES)} biznes"` },
      { label: "Yillik aylanma", value: `${fmt(ri(rnd, 200, 9000))} mln so'm` },
      { label: "Soliq holati", value: rnd() < 0.8 ? "To'langan" : "Qarzdor" },
      { label: "Ro'yxatga olingan", value: `${ri(rnd, 2005, 2024)}` },
    ],
    workers,
  };
};

const BUILDERS = { uy: buildHouse, dala: buildField, yol: buildRoad, zavod: buildFactory };

// element uchun deterministik to'liq ma'lumot
export const elementInfo = (el) => {
  if (!el) return null;
  const rnd = seeded(el.id);
  const data = (BUILDERS[el.type] || buildHouse)(rnd, el);
  return { ...data, type: el.type, typeMeta: ELEMENT_TYPES[el.type], id: el.id };
};
