// Suyultirilgan gaz (balon) moduli — ko'cha (MFY) kesimida ta'minot ko'rsatkichlari.
// Markaziy quvur gazi yo'q ko'chalar uchun ballonli ta'minot mock ma'lumoti.

export const STREETS = [
  { id: "s1", name: "Sarnovul", label: "Sarnovul MFY", households: 1240, served: 980, demand: 2600, delivered: 2480, stock: 320, debt: 18400000, status: "yaxshi" },
  { id: "s2", name: "Bog'ibo'ston", label: "Bog'ibo'ston MFY", households: 980, served: 910, demand: 2100, delivered: 1740, stock: 90, debt: 41200000, status: "o'rta" },
  { id: "s3", name: "Yangiobod", label: "Yangiobod MFY", households: 1520, served: 1180, demand: 3100, delivered: 3020, stock: 410, debt: 12700000, status: "yaxshi" },
  { id: "s4", name: "Guliston", label: "Guliston MFY", households: 720, served: 690, demand: 1800, delivered: 1120, stock: 40, debt: 58900000, status: "kritik" },
  { id: "s5", name: "Navro'z", label: "Navro'z MFY", households: 1100, served: 870, demand: 2300, delivered: 2180, stock: 260, debt: 21500000, status: "yaxshi" },
  { id: "s6", name: "Do'stlik", label: "Do'stlik MFY", households: 860, served: 820, demand: 1950, delivered: 1560, stock: 70, debt: 38600000, status: "o'rta" },
  { id: "s7", name: "Chamanzor", label: "Chamanzor MFY", households: 1340, served: 1020, demand: 2700, delivered: 2620, stock: 350, debt: 15300000, status: "yaxshi" },
  { id: "s8", name: "Qishloqobod", label: "Qishloqobod MFY", households: 540, served: 520, demand: 1500, delivered: 880, stock: 25, debt: 49100000, status: "kritik" },
];

// Ta'minot manbasi (taqsimot punktlari)
export const SOURCES = [
  { key: "shoxobcha", label: "Gaz to'ldirish shoxobchasi", share: 46 },
  { key: "mobil", label: "Mobil yetkazib berish", share: 28 },
  { key: "ombor", label: "Tuman ombori", share: 18 },
  { key: "boshqa", label: "Boshqa", share: 8 },
];
