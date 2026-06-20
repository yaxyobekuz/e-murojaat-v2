// FVV operativ shahar xaritasi — Navbahor MFY (prototip, demo).
// Izometrik (qiya) ko'rinish: organik egri ko'chalar + daryo + honadon pinlari.
// "World" fazo (tekis reja): x 0..1000, y 0..720. Komponent uni qiya proyeksiya qiladi.

export const WORLD = { w: 1000, h: 720 };
export const MAP_PLACE_LABEL = "Navbahor MFY, Asaka tumani, Andijon";

// ── Daryo (egri tasma) ─────────────────────────────────────────────────────────
export const RIVER = {
  pts: [
    [330, -20], [360, 110], [410, 220], [380, 330],
    [430, 430], [400, 540], [450, 650], [430, 760],
  ],
  width: 54,
};

// ── Pajar doimiy aylanadigan ASOSIY yo'l (organik halqa, world nuqtalari) ───────
// Komponent buni silliqlab (Catmull-Rom) chizadi va mashina shu bo'ylab yuradi.
export const ROUTE_CTRL = [
  [170, 600], // depo yaqini
  [150, 430],
  [240, 300],
  [200, 170],
  [340, 110], // ← honadon (hh-4)
  [520, 150], // ← honadon (hh-1)
  [650, 90], //  ← honadon (hh-5)
  [810, 150],
  [870, 320],
  [760, 430], // ← honadon (hh-2)
  [830, 580], // ← honadon (hh-3)
  [600, 630], // ← honadon (hh-7)
  [360, 610],
  [200, 660],
];

// ── Qo'shimcha ko'chalar (faqat bezak — to'rni boy ko'rsatadi) ──────────────────
export const SIDE_ROADS = [
  { id: "s1", pts: [[60, 250], [240, 300], [430, 280], [620, 330], [880, 320]] },
  { id: "s2", pts: [[120, 520], [360, 480], [560, 520], [760, 470], [940, 520]] },
  { id: "s3", pts: [[300, 30], [340, 220], [380, 420], [420, 620]] },
  { id: "s4", pts: [[650, 60], [680, 260], [720, 470], [760, 700]] },
  { id: "s5", pts: [[40, 120], [200, 170], [360, 130], [520, 160]] },
];

// Yong'in-qutqaruv deposi (world)
export const FIRE_STATION = { x: 170, y: 600, name: "13-Yong'in qutqaruv qismi" };

// ── Obyektlar (binolar) — world pos; pin sifatida chiziladi, bosilsa ma'lumot ────
// Ko'p kvartirali uy = butun bino (aholi = barcha kvartiralar yig'indisi, ~3.5 kishi/kvartira).
// Hovli = bitta oila (kichik raqamlar). Raqamlar izchil: aholi ≈ kvartira × 3.5.
export const HOUSEHOLDS = [
  {
    id: "hh-1", head: "12-uy · 5 qavatli", kind: "apartment", owner: "TJM — Karimov R.",
    address: "Sharq ko'chasi, 12-uy", pos: { x: 520, y: 150 },
    buildingType: "Ko'p kvartirali uy", floors: 5, apartments: 40,
    residents: 142, children: 33, elderly: 15, gas: true,
    risk: "Yuqori", phone: "+998 90 123-45-67", lastInspection: "12.03.2026",
    note: "Gaz tarmog'i eski, 3-qavatda yong'in signali ishlamaydi.",
  },
  {
    id: "hh-2", head: "7-uy · 9 qavatli", kind: "apartment", owner: "TJM — To'xtasinov A.",
    address: "G'arb ko'chasi, 7-uy", pos: { x: 760, y: 430 },
    buildingType: "Ko'p kvartirali uy", floors: 9, apartments: 72,
    residents: 254, children: 58, elderly: 27, gas: true,
    risk: "O'rta", phone: "+998 91 222-33-44", lastInspection: "28.01.2026",
    note: "Lift nosoz — yuqori qavatlardan qutqaruv qiyin.",
  },
  {
    id: "hh-3", head: "24-uy · 5 qavatli", kind: "apartment", owner: "TJM — Rasulova M.",
    address: "Sanoat ko'chasi, 24-uy", pos: { x: 830, y: 580 },
    buildingType: "Ko'p kvartirali uy", floors: 5, apartments: 30,
    residents: 104, children: 24, elderly: 11, gas: true,
    risk: "Yuqori", phone: "+998 93 444-55-66", lastInspection: "05.02.2026",
    note: "Yaqinida transformator — yong'in xavfi yuqori.",
  },
  {
    id: "hh-4", head: "Yusupovlar hovlisi", kind: "house", owner: "Yusupov B.",
    address: "Yangihayot ko'chasi, 1-uy", pos: { x: 340, y: 110 },
    buildingType: "Xususiy hovli", floors: 1, apartments: 1,
    residents: 6, children: 2, elderly: 1, gas: true,
    risk: "Past", phone: "+998 94 555-66-77", lastInspection: "19.04.2026",
    note: "Profilaktika tekshiruvi rejalashtirilgan.",
  },
  {
    id: "hh-5", head: "30-uy · 7 qavatli", kind: "apartment", owner: "TJM — Sobirov J.",
    address: "Mustaqillik ko'chasi, 30-uy", pos: { x: 650, y: 90 },
    buildingType: "Ko'p kvartirali uy", floors: 7, apartments: 56,
    residents: 196, children: 45, elderly: 21, gas: true,
    risk: "O'rta", phone: "+998 99 888-77-66", lastInspection: "02.06.2026",
    note: "3-qavatda tutun datchigi ishga tushgan.",
  },
  // qo'shimcha (missiya emas, lekin bosilsa ma'lumot chiqadi)
  {
    id: "hh-6", head: "16-uy · 4 qavatli", kind: "apartment", owner: "TJM — Ergashev S.",
    address: "Bobur ko'chasi, 16-uy", pos: { x: 150, y: 430 },
    buildingType: "Ko'p kvartirali uy", floors: 4, apartments: 24,
    residents: 82, children: 18, elderly: 8, gas: false,
    risk: "Past", phone: "+998 95 666-77-88", lastInspection: "22.05.2026",
    note: "Elektr isitish, gaz tarmog'i yo'q.",
  },
  {
    id: "hh-7", head: "Aliyevlar hovlisi", kind: "house", owner: "Aliyev N.",
    address: "Istiqlol ko'chasi, 9-uy", pos: { x: 600, y: 630 },
    buildingType: "Xususiy hovli (2 qavat)", floors: 2, apartments: 1,
    residents: 8, children: 3, elderly: 1, gas: true,
    risk: "O'rta", phone: "+998 97 777-88-99", lastInspection: "30.03.2026",
    note: "Hovlida gaz balloni saqlanadi.",
  },
  {
    id: "hh-8", head: "5-uy · 3 qavatli", kind: "apartment", owner: "TJM — Nazarov B.",
    address: "Navoiy ko'chasi, 5-uy", pos: { x: 240, y: 300 },
    buildingType: "Ko'p kvartirali uy", floors: 3, apartments: 18,
    residents: 62, children: 14, elderly: 6, gas: true,
    risk: "Past", phone: "+998 98 333-22-11", lastInspection: "11.05.2026",
    note: "Yong'in shkafi to'liq jihozlangan.",
  },
];

// ── Missiyalar (crew = rasch, water = suv litr). Tartib route bo'ylab hisoblanadi ──
export const MISSIONS = [
  { householdId: "hh-4", reason: "Profilaktika tekshiruvi", kind: "check", code: "P-204", crew: 3, water: 2000 },
  { householdId: "hh-1", reason: "Yong'in — gaz plitasi", kind: "fire", code: "Y-118", crew: 6, water: 6000 },
  { householdId: "hh-5", reason: "Tutun signali — 3-qavat", kind: "smoke", code: "T-077", crew: 4, water: 4000 },
  { householdId: "hh-2", reason: "Qutqaruv — liftda odam qoldi", kind: "rescue", code: "Q-051", crew: 5, water: 3000 },
  { householdId: "hh-3", reason: "Yong'in — transformator", kind: "fire", code: "Y-133", crew: 6, water: 8000 },
];

export const MISSION_KIND = {
  fire: { label: "Yong'in", color: "#ef4444" },
  smoke: { label: "Tutun signali", color: "#f97316" },
  rescue: { label: "Qutqaruv", color: "#0ea5e9" },
  check: { label: "Profilaktika", color: "#22c55e" },
};

export const RISK_TONE = {
  Yuqori: { color: "#ef4444", tone: "danger" },
  "O'rta": { color: "#f59e0b", tone: "progress" },
  Past: { color: "#22c55e", tone: "done" },
};

export const getHousehold = (id) => HOUSEHOLDS.find((h) => h.id === id) || null;
