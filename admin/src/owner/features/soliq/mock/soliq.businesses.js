// Soliq monitoringi — bizneslar mock ma'lumoti (Sarnovul MFY, Baliqchi tumani, Andijon).
// Deterministik (Math.random YO'Q) — seed asosida hosil qilinadi, har refresh bir xil.
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

const TYPE_KEYS = Object.keys(BUSINESS_TYPES);

const FOOD_NAMES = ["Osh Markaz", "Milliy Taomlar", "Choyxona", "Bahor", "Lazzat", "Sharq Taom"];
const SHOP_NAMES = ["Mega Market", "Oziq-ovqat", "Universal", "Hilol", "Anvar Savdo", "Bereke"];
const PREFIX = ["", "Yangi ", "Markaziy ", "Sharq ", "Oltin ", "Baraka ", "Nur "];
const SUFFIX = ["MChJ", "MChJ", "YaTT", "OK", "MChJ", "XK"];

// Deterministik "tasodifiy"
const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const STREETS = [
  "Markaz", "Mustaqillik", "Bog'iston", "Navoiy", "Amir Temur",
  "Bobur", "Fidokor", "Guliston", "Yangiobod", "Do'stlik",
];

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

// Blok holatiga (paid/partial/unpaid) qarab biznes yig'im foizini moylash —
// shunda xarita rangi hudud bilan mantiqan mos tushadi
const blockBias = { paid: 22, partial: -2, unpaid: -28 };

// 12 oy yorliqlari (oxirgi oy = joriy, Apr 2025 demo davri)
export const MONTHS = ["May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr"];

const buildMonthly = (assessedYear, rate, seed) => {
  // yillik hisoblangan soliqni 12 oyga taqsimlaymiz (mavsumiy tebranish bilan)
  const base = assessedYear / 12;
  return MONTHS.map((m, i) => {
    const wob = 0.78 + rng(seed * (i + 2) * 1.7) * 0.5; // 0.78..1.28
    const assessed = Math.round(base * wob);
    const monthRate = Math.max(0, Math.min(100, rate + (rng(seed * (i + 9)) - 0.5) * 24));
    const collected = Math.round((assessed * monthRate) / 100);
    return { month: m, assessed, collected, debt: assessed - collected };
  });
};

// 4 biznes/blok atrofida — jami ~60-90 biznes
const PER_BLOCK = 5;

const buildBusinesses = () => {
  const list = [];
  let n = 0;

  MAHALLA_AREAS.forEach((block, bi) => {
    const count = 3 + Math.round(rng(bi * 5.1) * (PER_BLOCK - 3) * 2); // 3..7
    for (let k = 0; k < count; k++) {
      n += 1;
      const seed = bi * 100 + k + 1;
      const typeKey = TYPE_KEYS[Math.floor(rng(seed * 2.1) * TYPE_KEYS.length)];
      const type = BUSINESS_TYPES[typeKey];

      // nom
      let baseName;
      if (typeKey === "food") baseName = FOOD_NAMES[Math.floor(rng(seed * 4.3) * FOOD_NAMES.length)];
      else if (typeKey === "shop" || typeKey === "retail")
        baseName = SHOP_NAMES[Math.floor(rng(seed * 6.7) * SHOP_NAMES.length)];
      else baseName = type.label;
      const pre = PREFIX[Math.floor(rng(seed * 1.9) * PREFIX.length)];
      const suf = SUFFIX[Math.floor(rng(seed * 8.1) * SUFFIX.length)];
      const name = `"${pre}${baseName}" ${suf}`;

      // yig'im foizi (blok holatiga moslangan)
      const baseRate = 50 + rng(seed * 3.7) * 50; // 50..100
      const rate = Math.max(8, Math.min(100, Math.round(baseRate + (blockBias[block.status] || 0))));

      // yillik hisoblangan soliq (faoliyat turi va o'lchamiga qarab)
      const employees = 2 + Math.round(rng(seed * 9.3) * 40);
      const assessedYear = Math.round((28 + rng(seed * 2.9) * 220) * 1_000_000); // 28..248 mln
      const collectedYear = Math.round((assessedYear * rate) / 100);
      const debtYear = assessedYear - collectedYear;

      // ochilgan sana (2016..2024) — "yangi ochilgan" = oxirgi 12 oy
      const yearOpened = 2016 + Math.floor(rng(seed * 5.5) * 9);
      const monthOpened = 1 + Math.floor(rng(seed * 7.1) * 12);
      const isNew = yearOpened >= 2024;

      const monthly = buildMonthly(assessedYear, rate, seed);
      const pos = pointInBlock(block, seed);

      list.push({
        id: `biz-${pad2(n)}`,
        stir: `30${4 + (n % 5)}${pad2((seed * 13) % 99)}${pad2((seed * 7) % 99)}${pad2((seed * 3) % 99)}`,
        name,
        typeKey,
        typeLabel: type.label,
        status: rate >= 70 ? "active" : debtYear > 0 ? "active" : "active", // demo: hammasi faol
        address: `Sarnovul MFY, ${STREETS[n % STREETS.length]} ko'chasi ${1 + (n % 90)}-uy`,
        blockId: block.id,
        blockName: block.name,
        employees,
        openedAt: `${yearOpened}-${pad2(monthOpened)}-${pad2(1 + ((seed * 3) % 27))}`,
        isNew,
        rate,
        assessedYear,
        collectedYear,
        debtYear,
        isDebtor: debtYear > 0 && rate < 100,
        isLarge: assessedYear >= 160_000_000, // yirik soliq to'lovchi
        tier: tierOf(rate),
        monthly,
        // o'tgan oyga nisbatan o'zgarish (%)
        momDelta: Math.round((rng(seed * 11.1) - 0.35) * 24),
        lat: pos.lat,
        lng: pos.lng,
      });
    }
  });

  return list;
};

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
