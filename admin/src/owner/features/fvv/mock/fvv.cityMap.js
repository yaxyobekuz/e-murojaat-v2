// FVV operativ shahar xaritasi — Navbahor MFY (prototip, demo).
// Murakkab ko'cha to'ri (chiziladi) + honadonlar + yong'in mashinasi ("Pajar") harakati.
// Koordinata fazosi: SVG viewBox 0..1000 (x), 0..640 (y).

export const VIEW = { w: 1000, h: 640 };
export const MAP_PLACE_LABEL = "Navbahor MFY, Asaka tumani, Andijon";

// To'r tugunlari (x in 120,300,500,700,880 ; y in 90,230,400,560)
// ── Ko'chalar (chizish uchun) — to'liq gorizontal/vertikal + diagonal ──────────
export const ROADS = [
  // gorizontal
  { id: "h1", pts: [[100, 90], [900, 90]], name: "Mustaqillik ko'chasi" },
  { id: "h2", pts: [[100, 230], [900, 230]], name: "Navoiy ko'chasi" },
  { id: "h3", pts: [[100, 400], [900, 400]], name: "Bobur ko'chasi" },
  { id: "h4", pts: [[100, 560], [900, 560]], name: "Istiqlol ko'chasi" },
  // vertikal
  { id: "v1", pts: [[120, 90], [120, 560]], name: "Amir Temur ko'chasi" },
  { id: "v2", pts: [[300, 90], [300, 560]], name: "Yangihayot ko'chasi" },
  { id: "v3", pts: [[500, 90], [500, 560]], name: "Sharq ko'chasi" },
  { id: "v4", pts: [[700, 90], [700, 560]], name: "G'arb ko'chasi" },
  { id: "v5", pts: [[880, 90], [880, 560]], name: "Sanoat ko'chasi" },
  // diagonal/qisqartma yo'llar (faqat bezak — to'rni murakkab ko'rsatadi)
  { id: "d1", pts: [[300, 400], [500, 560]], name: "Bog' yo'li" },
  { id: "d2", pts: [[700, 90], [880, 230]], name: "Aylanma yo'l" },
  { id: "d3", pts: [[120, 230], [300, 90]], name: "Tegirmon yo'li" },
];

// Yong'in-qutqaruv deposi
export const FIRE_STATION = { x: 120, y: 560, name: "13-Yong'in qutqaruv qismi" };

// ── Pajar doimiy harakatlanadigan BURAMA marshrut (yo'llar ustida, to'rni kezadi) ──
// Har ketma-ket juftlik bir qator yoki ustunni baham ko'radi -> chizilgan yo'lda yuradi.
export const ROUTE = [
  [120, 560], // 0  depo
  [120, 400], // 1
  [300, 400], // 2
  [300, 230], // 3
  [500, 230], // 4  ← missiya (hh-1)
  [500, 90], //  5
  [880, 90], //  6  ← missiya (hh-5)
  [880, 230], // 7
  [700, 230], // 8
  [700, 400], // 9  ← missiya (hh-2)
  [880, 400], // 10
  [880, 560], // 11 ← missiya (hh-3)
  [500, 560], // 12
  [500, 400], // 13
  [300, 400], // 14
  [300, 560], // 15 ← missiya (hh-4)
  [120, 560], // 16 depoga qaytish
];

// ── Honadonlar (kartada nuqta, bosilsa ma'lumot chiqadi) ───────────────────────
export const HOUSEHOLDS = [
  {
    id: "hh-1", head: "Karimovlar oilasi", address: "Sharq ko'chasi, 12-uy",
    pos: { x: 500, y: 230 }, buildingType: "Ko'p qavatli (5 qavat)",
    apartments: 40, residents: 168, children: 39, elderly: 14, gas: true,
    risk: "Yuqori", phone: "+998 90 123-45-67", lastInspection: "12.03.2026",
    note: "Gaz tarmog'i eski, 3-qavatda signal ishlamaydi.",
  },
  {
    id: "hh-2", head: "To'xtasinov Akmal", address: "G'arb ko'chasi, 7-uy",
    pos: { x: 700, y: 400 }, buildingType: "Ko'p qavatli (9 qavat)",
    apartments: 72, residents: 290, children: 61, elderly: 25, gas: true,
    risk: "O'rta", phone: "+998 91 222-33-44", lastInspection: "28.01.2026",
    note: "Lift nosoz — qutqaruv qiyin.",
  },
  {
    id: "hh-3", head: "Rasulova Madina", address: "Sanoat ko'chasi, 24-uy",
    pos: { x: 880, y: 560 }, buildingType: "Ko'p qavatli (5 qavat)",
    apartments: 30, residents: 121, children: 28, elderly: 9, gas: true,
    risk: "Yuqori", phone: "+998 93 444-55-66", lastInspection: "05.02.2026",
    note: "Yaqinida transformator — yong'in xavfi.",
  },
  {
    id: "hh-4", head: "Yusupovlar oilasi", address: "Yangihayot ko'chasi, 1-uy",
    pos: { x: 300, y: 560 }, buildingType: "Hovli (1 qavat)",
    apartments: 1, residents: 7, children: 3, elderly: 1, gas: true,
    risk: "Past", phone: "+998 94 555-66-77", lastInspection: "19.04.2026",
    note: "Profilaktika tekshiruvi rejalashtirilgan.",
  },
  {
    id: "hh-5", head: "Sobirov Jasur", address: "Mustaqillik ko'chasi, 30-uy",
    pos: { x: 880, y: 90 }, buildingType: "Ko'p qavatli (7 qavat)",
    apartments: 56, residents: 214, children: 47, elderly: 18, gas: true,
    risk: "O'rta", phone: "+998 99 888-77-66", lastInspection: "02.06.2026",
    note: "3-qavatda tutun datchigi ishga tushgan.",
  },
  // qo'shimcha (missiya emas, lekin bosilsa ma'lumot chiqadi)
  {
    id: "hh-6", head: "Ergashev Sardor", address: "Bobur ko'chasi, 16-uy",
    pos: { x: 120, y: 400 }, buildingType: "Ko'p qavatli (4 qavat)",
    apartments: 24, residents: 96, children: 20, elderly: 7, gas: false,
    risk: "Past", phone: "+998 95 666-77-88", lastInspection: "22.05.2026",
    note: "Elektr isitish, gaz yo'q.",
  },
  {
    id: "hh-7", head: "Aliyeva Nilufar", address: "Istiqlol ko'chasi, 9-uy",
    pos: { x: 500, y: 560 }, buildingType: "Hovli (2 qavat)",
    apartments: 2, residents: 11, children: 4, elderly: 2, gas: true,
    risk: "O'rta", phone: "+998 97 777-88-99", lastInspection: "30.03.2026",
    note: "Hovlida gaz balloni saqlanadi.",
  },
  {
    id: "hh-8", head: "Nazarov Bobur", address: "Navoiy ko'chasi, 5-uy",
    pos: { x: 700, y: 230 }, buildingType: "Ko'p qavatli (3 qavat)",
    apartments: 18, residents: 73, children: 15, elderly: 6, gas: true,
    risk: "Past", phone: "+998 98 333-22-11", lastInspection: "11.05.2026",
    note: "Yong'in shkafi to'liq jihozlangan.",
  },
];

// ── Missiyalar — marshrut nuqtalariga bog'langan (crew = rasch, water = suv litr) ──
export const MISSIONS = [
  { routeIndex: 4, householdId: "hh-1", reason: "Yong'in — gaz plitasi", kind: "fire", code: "Y-118", crew: 6, water: 6000 },
  { routeIndex: 6, householdId: "hh-5", reason: "Tutun signali — 3-qavat", kind: "smoke", code: "T-077", crew: 4, water: 4000 },
  { routeIndex: 9, householdId: "hh-2", reason: "Qutqaruv — liftda odam qoldi", kind: "rescue", code: "Q-051", crew: 5, water: 3000 },
  { routeIndex: 11, householdId: "hh-3", reason: "Yong'in — transformator", kind: "fire", code: "Y-133", crew: 6, water: 8000 },
  { routeIndex: 15, householdId: "hh-4", reason: "Profilaktika tekshiruvi", kind: "check", code: "P-204", crew: 3, water: 2000 },
];

export const MISSION_KIND = {
  fire: { label: "Yong'in", color: "#ef4444" },
  smoke: { label: "Tutun signali", color: "#f97316" },
  rescue: { label: "Qutqaruv", color: "#06b6d4" },
  check: { label: "Profilaktika", color: "#22c55e" },
};

export const RISK_TONE = {
  Yuqori: { color: "#ef4444", tone: "danger" },
  "O'rta": { color: "#f59e0b", tone: "progress" },
  Past: { color: "#22c55e", tone: "done" },
};

export const getHousehold = (id) => HOUSEHOLDS.find((h) => h.id === id) || null;
