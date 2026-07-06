// Client-side mock for the Yer/Mol-mulk module. Seedable PRNG => stable demo
// across reloads. Shapes mirror the future backend so swapping to a real API is trivial.

// ---- Reference data (English keys + Uzbek labels) ----
// Sarnovul MFY ko'chalari — butun modul shu mahalla ichida, ko'cha kesimida.
// Kanonik: Maslahat, Ulug'vor, Urganji + boshqa o'zbekcha nomlar (jami 14 ko'cha).
export const PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";
export const REGIONS = [
  "Sarnovul",
  "Maslahat",
  "Ulug'vor",
  "Urganji",
  "Bog'bon",
  "Tinchlik",
  "Mehnat",
  "Paxtakor",
  "Navbahor",
  "Do'stlik",
  "Yangiobod",
  "Guliston",
  "Ziyokor",
  "Obod",
];

export const PROPERTY_TYPES = ["uy", "kvartira", "yer", "noturar"];
export const TYPE_LABELS = {
  uy: "Uy",
  kvartira: "Kvartira",
  yer: "Yer uchastkasi",
  noturar: "Noturar bino",
};

export const OWNERSHIP_TYPES = ["xususiy", "davlat", "ulushli"];
export const OWNERSHIP_LABELS = {
  xususiy: "Xususiy",
  davlat: "Davlat",
  ulushli: "Ulushli",
};

export const PROPERTY_STATUS = ["royxatda", "jarayonda", "nizoli"];
export const PROPERTY_STATUS_LABELS = {
  royxatda: "Ro'yxatda",
  jarayonda: "Jarayonda",
  nizoli: "Nizoli",
};
export const PROPERTY_STATUS_TONE = {
  royxatda: "done",
  jarayonda: "progress",
  nizoli: "danger",
};

export const SERVICE_TYPES = [
  "kadastr_pasport",
  "malumot_tahrir",
  "ijara_royxat",
  "servitut_royxat",
];
export const SERVICE_LABELS = {
  kadastr_pasport: "Kadastr pasporti",
  malumot_tahrir: "Ma'lumot tahrirlash",
  ijara_royxat: "Ijara ro'yxati",
  servitut_royxat: "Servitut ro'yxati",
};

export const REQUEST_STATUS = [
  "yangi",
  "korib_chiqilmoqda",
  "olchov",
  "tolov",
  "bajarildi",
  "rad_etildi",
];
export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  olchov: "O'lchov",
  tolov: "To'lov",
  bajarildi: "Bajarildi",
  rad_etildi: "Rad etildi",
};
export const REQUEST_STATUS_TONE = {
  yangi: "new",
  korib_chiqilmoqda: "progress",
  olchov: "progress",
  tolov: "progress",
  bajarildi: "done",
  rad_etildi: "danger",
};

// Land-use classification (for the bubble chart)
export const LAND_USE_LABELS = {
  qishloq_xojaligi: "Qishloq xo'jaligi",
  turar_joy: "Turar-joy",
  tijorat: "Tijorat",
  boshqa: "Boshqa",
};

const FIRST_NAMES = [
  "Akmal", "Dilnoza", "Sardor", "Nigora", "Jasur", "Malika", "Bekzod",
  "Gulnora", "Otabek", "Shahnoza", "Rustam", "Kamola", "Aziz", "Feruza",
];
const LAST_NAMES = [
  "Karimov", "Yusupova", "Rahimov", "Tosheva", "Aliyev", "Sobirova",
  "Ergashev", "Qodirova", "Saidov", "Ibrohimova",
];

// ---- Seedable PRNG (mulberry32) ----
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const SEED = 20260620;
const rnd = mulberry32(SEED);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const int = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
const pad = (n, len) => String(n).padStart(len, "0");

// Kanonik tarkib (jami 812 kadastr obyekti):
//   0..762   — 763 xonadon (asosan uy, ozroq kvartira)
//   763..775 — 13 korxona (noturar)
//   776..787 — 12 ijtimoiy bino: 2 maktab (66-, 67-son), 6 bog'cha, 1 poliklinika, 3 masjid
//   788..811 — 24 yer uchastkasi
const typeForIndex = (i) => {
  if (i < 763) return rnd() < 0.92 ? "uy" : "kvartira";
  if (i < 788) return "noturar";
  return "yer";
};

// ijtimoiy binolar davlatniki, korxonalar xususiy
const ownershipForIndex = (i) => {
  if (i >= 776 && i < 788) return "davlat";
  if (i >= 763) return "xususiy";
  const r = rnd();
  return r < 0.9 ? "xususiy" : r < 0.98 ? "ulushli" : "davlat";
};

// Maydonlar mahalla (qishloq) masshtabida
const areaFor = (type) => {
  if (type === "kvartira") return int(42, 90);
  if (type === "uy") return int(200, 800); // tomorqa bilan
  if (type === "yer") return int(400, 2500);
  return int(120, 2400);
};

const valueFor = (type, area) => {
  const perM2 =
    type === "kvartira"
      ? int(2_500_000, 4_500_000)
      : type === "uy"
        ? int(350_000, 800_000)
        : type === "yer"
          ? int(40_000, 120_000)
          : int(800_000, 2_000_000);
  return area * perM2;
};

// 12-month date within the past year (idx 0 = 11 months ago ... 11 = now)
const dateInMonth = (monthsAgo) => {
  const base = new Date(2026, 5, 20); // 2026-06-20 (demo "today")
  const d = new Date(base.getFullYear(), base.getMonth() - monthsAgo, int(1, 27));
  return d.toISOString();
};

// ---- Properties ----
// Ko'chmas mulk bitimlari: yiliga 19 ta (kanonik) — faqat shu obyektlar oxirgi
// 12 oyda ro'yxatga olingan, qolganlari eski yillarda.
const oldDate = () => new Date(int(1996, 2024), int(0, 11), int(1, 27)).toISOString();
let dealSeq = 0;

export const properties = Array.from({ length: 812 }, (_, i) => {
  const type = typeForIndex(i);
  const area = areaFor(type);
  const region = pick(REGIONS); // ko'cha (Sarnovul ichida)
  const statusRoll = rnd();
  const status =
    statusRoll < 0.85 ? "royxatda" : statusRoll < 0.94 ? "jarayonda" : "nizoli";
  const isDeal = i % 43 === 7; // 812 obyektdan aynan 19 tasi
  return {
    id: `prop_${pad(i + 1, 4)}`,
    cadastreNumber: `UZ:40:${pad(int(1, 30), 2)}:${pad(int(1, 12), 2)}:${pad(int(1, 9999), 4)}`,
    type,
    region,
    district: "Baliqchi tumani",
    address: `${region} ko'chasi, ${int(1, 120)}-uy`,
    areaM2: area,
    valueUzs: valueFor(type, area),
    ownershipType: ownershipForIndex(i),
    status,
    registeredAt: isDeal ? dateInMonth(dealSeq++ % 12) : oldDate(),
  };
});

// ---- Requests (12 months history, with timeline events) ----
const STATUS_FLOW = ["yangi", "korib_chiqilmoqda", "olchov", "tolov", "bajarildi"];
const EVENT_NOTE = {
  yangi: "Ariza qabul qilindi",
  korib_chiqilmoqda: "Hujjatlar ko'rib chiqilmoqda",
  olchov: "Yer o'lchovi tayinlandi",
  tolov: "To'lov uchun hisob-faktura chiqarildi",
  bajarildi: "Xizmat bajarildi",
  rad_etildi: "Ariza rad etildi",
};

const buildEvents = (finalStatus, createdAt) => {
  const start = new Date(createdAt);
  if (finalStatus === "rad_etildi") {
    return [
      { at: createdAt, status: "yangi", note: EVENT_NOTE.yangi },
      {
        at: new Date(start.getTime() + 2 * 864e5).toISOString(),
        status: "rad_etildi",
        note: EVENT_NOTE.rad_etildi,
      },
    ];
  }
  const upto = STATUS_FLOW.indexOf(finalStatus);
  return STATUS_FLOW.slice(0, upto + 1).map((s, idx) => ({
    at: new Date(start.getTime() + idx * 2 * 864e5).toISOString(),
    status: s,
    note: EVENT_NOTE[s],
  }));
};

// Mahalla masshtabi: yiliga ~60 xizmat arizasi (oyiga ~5 ta)
export const requests = Array.from({ length: 60 }, (_, i) => {
  const r = rnd();
  const status =
    r < 0.12
      ? "yangi"
      : r < 0.26
        ? "korib_chiqilmoqda"
        : r < 0.34
          ? "olchov"
          : r < 0.46
            ? "tolov"
            : r < 0.9
              ? "bajarildi"
              : "rad_etildi";
  const createdAt = dateInMonth(int(0, 11));
  const reachedPayment = ["tolov", "bajarildi"].includes(status);
  return {
    id: `req_${pad(i + 1, 4)}`,
    requestNumber: `YER-2026-${pad(i + 1, 5)}`,
    serviceType: pick(SERVICE_TYPES),
    applicantName: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    region: pick(REGIONS),
    status,
    invoiceAmount: reachedPayment ? int(150_000, 850_000) : 0,
    paid: status === "bajarildi",
    createdAt,
    events: buildEvents(status, createdAt),
  };
});
