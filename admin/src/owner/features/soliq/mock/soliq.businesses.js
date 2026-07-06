// Soliq monitoringi — bizneslar mock ma'lumoti (Sarnovul MFY, Baliqchi tumani, Andijon).
// Kanonik raqamlar: mahallada aynan 13 korxona, yillik yig'ilgan soliq ~486 mln so'm,
// oxirgi 12 oyda 5 ta yangi biznes. Deterministik (Math.random YO'Q) — har refresh bir xil.
// Har biznes mahalla bloklari (MAHALLA_AREAS) ustiga joylashtiriladi va o'z 12-oylik
// soliq tarixi, qarzdorlik holati, faoliyat turi (icon) bilan keladi.
import {
  Store,
  ShoppingCart,
  Utensils,
  Scissors,
  Factory,
  Building2,
  Hammer,
  Truck,
  Stethoscope,
  GraduationCap,
  Fuel,
  Landmark,
} from "lucide-react";

import { MAHALLA_AREAS } from "./soliq.mapAreas";

// Yig'im darajasi (hudud/biznes rangi) — rules/02 holat rang xaritasi kengaytmasi
export const COLLECTION_TIERS = {
  high: { key: "high", label: "Yuqori (90-100%)", color: "#16a34a", tone: "done" },
  mid: { key: "mid", label: "O'rta (70-89%)", color: "#d97706", tone: "progress" },
  low: { key: "low", label: "Past (50-69%)", color: "#ea580c", tone: "danger" },
  veryLow: { key: "veryLow", label: "Juda past (0-49%)", color: "#dc2626", tone: "danger" },
};

export const tierOf = (rate) => {
  if (rate >= 90) return "high";
  if (rate >= 70) return "mid";
  if (rate >= 50) return "low";
  return "veryLow";
};

// Faoliyat turlari — icon + ranglar (xarita markerida ko'rinadi)
export const BUSINESS_TYPES = {
  retail: { key: "retail", label: "Chakana savdo", icon: ShoppingCart, color: "#2563eb" },
  shop: { key: "shop", label: "Savdo do'koni", icon: Store, color: "#0ea5e9" },
  food: { key: "food", label: "Umumiy ovqatlanish", icon: Utensils, color: "#ea580c" },
  service: { key: "service", label: "Maishiy xizmat", icon: Scissors, color: "#7c3aed" },
  manufacture: { key: "manufacture", label: "Ishlab chiqarish", icon: Factory, color: "#0d9488" },
  construction: { key: "construction", label: "Qurilish", icon: Hammer, color: "#d97706" },
  logistics: { key: "logistics", label: "Logistika", icon: Truck, color: "#475569" },
  medical: { key: "medical", label: "Tibbiyot", icon: Stethoscope, color: "#dc2626" },
  education: { key: "education", label: "Ta'lim", icon: GraduationCap, color: "#4f46e5" },
  fuel: { key: "fuel", label: "Yoqilg'i", icon: Fuel, color: "#b45309" },
  office: { key: "office", label: "Ofis / Xizmat", icon: Building2, color: "#0891b2" },
  finance: { key: "finance", label: "Moliya", icon: Landmark, color: "#1e40af" },
};

// Deterministik "tasodifiy"
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const pad2 = (n) => String(n).padStart(2, "0");

// Bir mahalla blokining poligoni ichida deterministik nuqta (markaz + ofset)
const pointInBlock = (block, seed) => {
  const pts = block.path;
  const cLat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
  const cLng = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
  // markazdan kichik ofset (blok ichida tarqaladi)
  const r = 0.0009;
  const ang = rng(seed * 7.7) * Math.PI * 2;
  const rad = (0.25 + rng(seed * 3.3) * 0.7) * r;
  return {
    lat: cLat + Math.sin(ang) * rad,
    lng: cLng + Math.cos(ang) * rad * 1.25,
  };
};

// 12 oy yorliqlari (oxirgi oy = joriy, Apr 2025 demo davri)
export const MONTHS = ["May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr"];

const buildMonthly = (assessedYear, rate, seed) => {
  // yillik hisoblangan soliqni 12 oyga taqsimlaymiz (mavsumiy tebranish bilan)
  const base = assessedYear / 12;
  return MONTHS.map((m, i) => {
    const wob = 0.78 + rng(seed * (i + 2) * 1.7) * 0.5; // 0.78..1.28
    // to'liq to'lagan biznes oylik kesimda ham qarzsiz ko'rinadi
    const monthRate =
      rate >= 100 ? 100 : Math.max(0, Math.min(100, rate + (rng(seed * (i + 9)) - 0.5) * 24));
    const assessed = Math.round(base * wob);
    const collected = Math.round((assessed * monthRate) / 100);
    return { month: m, assessed, collected, debt: assessed - collected };
  });
};

// Kanonik ro'yxat — Sarnovul MFYdagi 13 korxona.
// Yig'ilgan soliq jami ~486 mln so'm/yil; 5 tasi oxirgi 12 oyda ochilgan (yangi).
const BUSINESS_SEED = [
  { name: `"Sarnovul Paxta" MChJ`, typeKey: "manufacture", block: 8, street: "Urganji", house: 1, stir: "305214881", employees: 46, rate: 100, assessedYear: 138_000_000, openedAt: "2014-03-12" },
  { name: `"Urganji Yoqilg'i" XK`, typeKey: "fuel", block: 4, street: "Urganji", house: 54, stir: "305309127", employees: 12, rate: 100, assessedYear: 88_000_000, openedAt: "2018-06-05" },
  { name: `"Baraka Savdo" MChJ`, typeKey: "shop", block: 0, street: "Maslahat", house: 17, stir: "305418236", employees: 8, rate: 100, assessedYear: 58_000_000, openedAt: "2017-09-21" },
  { name: `"Ulug'vor Qurilish" MChJ`, typeKey: "construction", block: 3, street: "Ulug'vor", house: 8, stir: "305523449", employees: 15, rate: 74, assessedYear: 56_000_000, openedAt: "2020-04-14" },
  { name: `"Hilol Market" YaTT`, typeKey: "retail", block: 1, street: "Maslahat", house: 42, stir: "305617582", employees: 6, rate: 91, assessedYear: 34_000_000, openedAt: "2024-09-10" },
  { name: `"Osh Markaz" YaTT`, typeKey: "food", block: 13, street: "Sarnovul", house: 3, stir: "305711694", employees: 9, rate: 100, assessedYear: 27_000_000, openedAt: "2019-05-02" },
  { name: `"Sarnovul Trans" YaTT`, typeKey: "logistics", block: 6, street: "Do'stlik", house: 25, stir: "305815708", employees: 7, rate: 58, assessedYear: 28_000_000, openedAt: "2021-11-19" },
  { name: `"Shifo Dorixona" YaTT`, typeKey: "medical", block: 2, street: "Maslahat", house: 5, stir: "305919812", employees: 4, rate: 100, assessedYear: 21_000_000, openedAt: "2018-02-27" },
  { name: `"Bilim Ziyo" MChJ`, typeKey: "education", block: 5, street: "Ziyokor", house: 12, stir: "306023926", employees: 11, rate: 87, assessedYear: 23_000_000, openedAt: "2022-08-15" },
  { name: `"Navbahor Tandir" YaTT`, typeKey: "food", block: 10, street: "Navbahor", house: 31, stir: "306128035", employees: 3, rate: 100, assessedYear: 16_000_000, openedAt: "2024-11-03" },
  { name: `"Chevar Xizmat" YaTT`, typeKey: "service", block: 14, street: "Guliston", house: 9, stir: "306232149", employees: 3, rate: 100, assessedYear: 13_000_000, openedAt: "2025-01-22" },
  { name: `"Mehnat Do'koni" YaTT`, typeKey: "shop", block: 7, street: "Mehnat", house: 14, stir: "306336252", employees: 2, rate: 76, assessedYear: 15_000_000, openedAt: "2025-02-18" },
  { name: `"Tinchlik Mini Market" YaTT`, typeKey: "shop", block: 11, street: "Tinchlik", house: 61, stir: "306440366", employees: 2, rate: 44, assessedYear: 12_000_000, openedAt: "2024-07-30" },
];

const buildBusinesses = () =>
  BUSINESS_SEED.map((b, i) => {
    const seed = i + 1;
    const block = MAHALLA_AREAS[b.block];
    const type = BUSINESS_TYPES[b.typeKey];
    const collectedYear = Math.round((b.assessedYear * b.rate) / 100);
    const debtYear = b.assessedYear - collectedYear;
    const isNew = b.openedAt >= "2024-05-01"; // demo davri boshi (oxirgi 12 oy)
    const pos = pointInBlock(block, seed);

    return {
      id: `biz-${pad2(seed)}`,
      stir: b.stir,
      name: b.name,
      typeKey: b.typeKey,
      typeLabel: type.label,
      status: "active",
      address: `Sarnovul MFY, ${b.street} ko'chasi ${b.house}-uy`,
      blockId: block.id,
      blockName: block.name,
      employees: b.employees,
      openedAt: b.openedAt,
      isNew,
      rate: b.rate,
      assessedYear: b.assessedYear,
      collectedYear,
      debtYear,
      isDebtor: debtYear > 0 && b.rate < 100,
      isLarge: b.assessedYear >= 80_000_000, // yirik soliq to'lovchi
      tier: tierOf(b.rate),
      monthly: buildMonthly(b.assessedYear, b.rate, seed),
      // o'tgan oyga nisbatan o'zgarish (%)
      momDelta: Math.round((rng(seed * 11.1) - 0.35) * 24),
      lat: pos.lat,
      lng: pos.lng,
    };
  });

export const BUSINESSES = buildBusinesses();

// Tepa KPI lar uchun umumiy yig'indi
export const businessSummary = (list = BUSINESSES) => {
  const acc = list.reduce(
    (s, b) => {
      s.assessed += b.assessedYear;
      s.collected += b.collectedYear;
      s.debt += b.debtYear;
      if (b.isDebtor) s.debtors += 1;
      if (b.status === "active") s.active += 1;
      if (b.isNew) s.newCount += 1;
      return s;
    },
    { assessed: 0, collected: 0, debt: 0, debtors: 0, active: 0, newCount: 0 },
  );
  acc.total = list.length;
  acc.collectionRate = acc.assessed ? Math.round((acc.collected / acc.assessed) * 100) : 0;
  return acc;
};

// Bitta hudud (mahalla bloki) bo'yicha yig'indi — blok bosilganda panel uchun.
// filtered: joriy filtrdagi bizneslar (panel filtr bilan mos kelsin).
export const blockSummary = (blockId, blockName, filtered = BUSINESSES) => {
  const inside = filtered.filter((b) => b.blockId === blockId);
  const acc = inside.reduce(
    (s, b) => {
      s.assessed += b.assessedYear;
      s.collected += b.collectedYear;
      s.debt += b.debtYear;
      if (b.isDebtor) s.debtors += 1;
      return s;
    },
    { assessed: 0, collected: 0, debt: 0, debtors: 0 },
  );
  acc.rate = acc.assessed ? Math.round((acc.collected / acc.assessed) * 100) : 0;
  acc.tier = tierOf(acc.rate);
  acc.count = inside.length;
  acc.blockId = blockId;
  acc.blockName = blockName;
  // eng katta qarzdor 3 ta biznes (panelda ko'rsatish uchun)
  acc.topDebtors = inside
    .filter((b) => b.debtYear > 0)
    .sort((a, b) => b.debtYear - a.debtYear)
    .slice(0, 3);
  return acc;
};

// Filtrlar: { all, large, debtor, isNew } — checkboxlar
export const filterBusinesses = (list, filters = {}) => {
  const { large, debtor, isNew, types } = filters;
  return list.filter((b) => {
    if (large && !b.isLarge) return false;
    if (debtor && !b.isDebtor) return false;
    if (isNew && !b.isNew) return false;
    if (types && types.length && !types.includes(b.typeKey)) return false;
    return true;
  });
};
