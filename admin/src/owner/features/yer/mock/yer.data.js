// Client-side mock for the Yer/Mol-mulk module. Seedable PRNG => stable demo
// across reloads. Shapes mirror the future backend so swapping to a real API is trivial.

// ---- Reference data (English keys + Uzbek labels) ----
export const REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Samarqand",
  "Buxoro",
  "Navoiy",
  "Qashqadaryo",
  "Surxondaryo",
  "Jizzax",
  "Sirdaryo",
  "Xorazm",
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

// Weighted property-type distribution (~kvartira heavy)
const weightedType = () => {
  const r = rnd();
  if (r < 0.22) return "uy";
  if (r < 0.61) return "kvartira";
  if (r < 0.85) return "yer";
  return "noturar";
};

const areaFor = (type) => {
  if (type === "kvartira") return int(35, 120);
  if (type === "uy") return int(80, 400);
  if (type === "yer") return int(300, 5000);
  return int(60, 900);
};

const valueFor = (type, area) => {
  const perM2 =
    type === "kvartira"
      ? int(7_000_000, 14_000_000)
      : type === "uy"
        ? int(3_000_000, 9_000_000)
        : type === "yer"
          ? int(200_000, 1_200_000)
          : int(2_000_000, 6_000_000);
  return area * perM2;
};

// 12-month date within the past year (idx 0 = 11 months ago ... 11 = now)
const dateInMonth = (monthsAgo) => {
  const base = new Date(2026, 5, 20); // 2026-06-20 (demo "today")
  const d = new Date(base.getFullYear(), base.getMonth() - monthsAgo, int(1, 27));
  return d.toISOString();
};

// ---- Properties ----
export const properties = Array.from({ length: 404 }, (_, i) => {
  const type = weightedType();
  const area = areaFor(type);
  const region = pick(REGIONS);
  const statusRoll = rnd();
  const status =
    statusRoll < 0.85 ? "royxatda" : statusRoll < 0.94 ? "jarayonda" : "nizoli";
  return {
    id: `prop_${pad(i + 1, 4)}`,
    cadastreNumber: `UZ:${pad(int(1, 14), 2)}:${pad(int(1, 30), 2)}:${pad(int(1, 12), 2)}:${pad(int(1, 9999), 4)}`,
    type,
    region,
    district: `${region} tumani`,
    address: `${pick(["Mustaqillik", "Navoiy", "Amir Temur", "Bobur", "Chilonzor"])} ko'chasi, ${int(1, 120)}-uy`,
    areaM2: area,
    valueUzs: valueFor(type, area),
    ownershipType: pick(OWNERSHIP_TYPES),
    status,
    registeredAt: dateInMonth(int(0, 11)),
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

export const requests = Array.from({ length: 250 }, (_, i) => {
  const r = rnd();
  const status =
    r < 0.2
      ? "yangi"
      : r < 0.4
        ? "korib_chiqilmoqda"
        : r < 0.5
          ? "olchov"
          : r < 0.7
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
