// Sarnovul MFY raqamli pasporti — kanonik: 763 xonadon / 4 306 aholi / 13 korxona
export const PASSPORT = {
  name: "Sarnovul MFY",
  district: "Baliqchi tumani",
  region: "Andijon viloyati",
  households: 763,
  population: 4306,
  enterprises: 13,
  streets: 14,
};

// Oxirgi 12 oy (Iyul 2025 — Iyun 2026)
export const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

const series = (values) => MONTHS.map((month, i) => ({ month, value: values[i] }));

export const ELEKTR = {
  monthlyTotal: 172400, // kVt·soat, iyun
  fromGrid: 148900, // TP (tarmoq)
  fromSolar: 23500, // quyosh panellaridan iste'mol
  solarShare: 13.6,
  solarGenerated: 26300, // panellar ishlab chiqargani (ortiqchasi tarmoqqa)
  solarHomes: 58,
  lossPct: 8.6,
  lossKwh: 14800,
  deltas: { total: 1.4, solar: 6.3, generated: 18.2, loss: -1.6 },
  sources: MONTHS.map((month, i) => ({
    month,
    tp: [146200, 143800, 138900, 152400, 171800, 193600, 198400, 186200, 164900, 151200, 146800, 148900][i],
    solar: [21800, 22400, 19600, 15200, 10400, 8600, 9200, 11800, 15600, 19400, 22100, 23500][i],
  })),
  solarGenSeries: series([24300, 25100, 21900, 17000, 11600, 9500, 10300, 13200, 17400, 21700, 24800, 26300]),
  lossSeries: series([10.2, 10.0, 9.9, 9.7, 9.6, 9.4, 9.3, 9.1, 9.0, 8.8, 8.7, 8.6]),
};

export const GAZ = {
  cylindersDelivered: 1254, // iyun
  cylindersDemand: 1360,
  fulfillmentPct: 92,
  servedHouseholds: 486, // balon xizmati ko'rsatilganlar
  supply: [
    { key: "quvur", label: "Quvur (tabiiy gaz)", value: 218, color: "#3b82f6" },
    { key: "balon", label: "Suyultirilgan gaz (balon)", value: 486, color: "#06b6d4" },
    { key: "yoq", label: "Ta'minlanmagan", value: 59, color: "#64748b" },
  ],
  suppliedPct: 92.3, // (218 + 486) / 763
  deltas: { delivered: 4.8, served: 2.1, fulfillment: 1.9 },
  cylindersSeries: series([1180, 1150, 1230, 1390, 1560, 1710, 1740, 1620, 1450, 1330, 1270, 1254]),
};

export const INTERNET = {
  coveragePct: 84,
  covered: 641,
  uncovered: 122,
  fiber: 402,
  wireless: 239,
  avgSpeed: 68, // Mbit/s
  deltas: { coverage: 5.2, speed: 12.4 },
  speedSeries: series([41, 44, 47, 49, 52, 54, 57, 60, 62, 64, 66, 68]),
};

export const OBODON = {
  trashTrucks: 3,
  trashSchedule: "Haftasiga 2 marta, 14 ko'chada",
  saplings: 1850, // 2025–2026 mavsumi
  saplingTypes: [
    { key: "mevali", value: 720 },
    { key: "manzarali", value: 640 },
    { key: "daraxt", value: 490 },
  ],
  saplingLabels: { mevali: "Mevali ko'chatlar", manzarali: "Manzarali butalar", daraxt: "Soyabon daraxtlar" },
  plantedSeries: MONTHS.map((month, i) => ({
    month,
    planted: [0, 0, 120, 260, 480, 0, 0, 90, 520, 310, 70, 0][i],
  })),
  deltas: { saplings: 24.1 },
};

export const MSK = {
  activeJobs: 47,
  male: 29,
  female: 18,
  genderSplit: [
    { key: "erkak", value: 29 },
    { key: "ayol", value: 18 },
  ],
  genderLabels: { erkak: "Erkaklar", ayol: "Ayollar" },
  categories: [
    { key: "elektr", value: 12 },
    { key: "santexnika", value: 11 },
    { key: "duradgorlik", value: 8 },
    { key: "payvand", value: 6 },
    { key: "boshqa", value: 10 },
  ],
  categoryLabels: {
    elektr: "Elektr montaj",
    santexnika: "Santexnika",
    duradgorlik: "Duradgorlik",
    payvand: "Payvandlash",
    boshqa: "Boshqa xizmatlar",
  },
  deltas: { jobs: 9.3 },
};

export const TALIM = {
  schools: 2,
  schoolStudents: 1124,
  schoolAgeTotal: 1141,
  schoolCoveragePct: 98.5,
  kindergartens: 6,
  kgChildren: 312,
  kgAgeTotal: 348,
  kgCoveragePct: 89.7,
  // Bog'cha turi: soni + tarbiyalanuvchilar
  kgTypes: [
    { key: "davlat", value: 142 },
    { key: "xususiy", value: 98 },
    { key: "oilaviy", value: 72 },
  ],
  kgTypeLabels: { davlat: "Davlat (1 ta)", xususiy: "Xususiy (2 ta)", oilaviy: "Uy — oilaviy (3 ta)" },
  institutions: [
    { key: "m66", value: 668 },
    { key: "m67", value: 456 },
    { key: "bogcha", value: 312 },
  ],
  institutionLabels: { m66: "66-son maktab", m67: "67-son maktab", bogcha: "Bog'chalar (6 ta)" },
};

export const YOSHLAR = {
  total: 1178, // 14–30 yosh
  employed: 486,
  students: 507,
  unemployed: 164,
  other: 21, // harbiy xizmat, dekret
  notebook: 57, // yoshlar daftarida
  employmentPct: 74.8, // o'qimaydigan yoshlar orasida bandlik
  composition: [
    { key: "employed", label: "Ish bilan band", value: 486, color: "#10b981" },
    { key: "students", label: "O'qiydi (talaba/o'quvchi)", value: 507, color: "#3b82f6" },
    { key: "unemployed", label: "Ishsiz", value: 164, color: "#ef4444" },
    { key: "other", label: "Harbiy / dekret", value: 21, color: "#64748b" },
  ],
  deltas: { employed: 7.6, unemployed: -5.4, notebook: -12.3 },
};
