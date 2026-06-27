// Internet moduli — ko'cha (MFY) kesimida tarmoq ko'rsatkichlari. Barcha label o'zbekcha.
// Provayder qamrovi, uzilishlar, tezlik va shikoyatlar mock ma'lumoti.

export const STREETS = [
  { id: "s1", name: "Sarnovul", label: "Sarnovul MFY", households: 1240, covered: 1180, fiber: 920, speed: 78, uptime: 99.2, complaints: 14, outages: 3, status: "yaxshi" },
  { id: "s2", name: "Bog'ibo'ston", label: "Bog'ibo'ston MFY", households: 980, covered: 760, fiber: 410, speed: 52, uptime: 97.1, complaints: 31, outages: 8, status: "o'rta" },
  { id: "s3", name: "Yangiobod", label: "Yangiobod MFY", households: 1520, covered: 1490, fiber: 1320, speed: 92, uptime: 99.6, complaints: 9, outages: 2, status: "yaxshi" },
  { id: "s4", name: "Guliston", label: "Guliston MFY", households: 720, covered: 430, fiber: 120, speed: 31, uptime: 94.3, complaints: 48, outages: 15, status: "kritik" },
  { id: "s5", name: "Navro'z", label: "Navro'z MFY", households: 1100, covered: 1010, fiber: 840, speed: 71, uptime: 98.4, complaints: 19, outages: 5, status: "yaxshi" },
  { id: "s6", name: "Do'stlik", label: "Do'stlik MFY", households: 860, covered: 590, fiber: 280, speed: 44, uptime: 96.0, complaints: 37, outages: 11, status: "o'rta" },
  { id: "s7", name: "Chamanzor", label: "Chamanzor MFY", households: 1340, covered: 1295, fiber: 1180, speed: 88, uptime: 99.4, complaints: 11, outages: 2, status: "yaxshi" },
  { id: "s8", name: "Qishloqobod", label: "Qishloqobod MFY", households: 540, covered: 260, fiber: 40, speed: 22, uptime: 91.8, complaints: 53, outages: 19, status: "kritik" },
];

// Provayder ulushi (bozor) — qamrov bo'yicha
export const PROVIDERS = [
  { key: "uztelecom", label: "Uztelecom", share: 38 },
  { key: "uzonline", label: "UZONLINE", share: 22 },
  { key: "comnet", label: "Comnet", share: 17 },
  { key: "sarkor", label: "Sarkor Telekom", share: 13 },
  { key: "boshqa", label: "Boshqa", share: 10 },
];
