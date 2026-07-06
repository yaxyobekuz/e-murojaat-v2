// Suyultirilgan gaz (balon) moduli — Sarnovul MFY (Baliqchi tumani, Andijon) ko'chalari kesimida.
// Kanonik: balon bilan ta'minlanadigan 486 xonadon, oylik talab 1 360 balon, yetkazilgan 1 254 (92%).
// Gaz moduli (gaz.data.js) bilan izchil — shu balon ko'chalari; Chinor va Guliston bitta marshrut zonasi.

export const STREETS = [
  { id: "s1", name: "Amir Temur", label: "Amir Temur ko'chasi", households: 64, served: 64, demand: 179, delivered: 179, stock: 46, debt: 2400000, status: "yaxshi" },
  { id: "s2", name: "Istiqlol", label: "Istiqlol ko'chasi", households: 61, served: 61, demand: 171, delivered: 171, stock: 44, debt: 2300000, status: "yaxshi" },
  { id: "s3", name: "Maslahat", label: "Maslahat ko'chasi", households: 58, served: 58, demand: 162, delivered: 162, stock: 40, debt: 2100000, status: "yaxshi" },
  { id: "s4", name: "Mustaqillik", label: "Mustaqillik ko'chasi", households: 57, served: 57, demand: 160, delivered: 158, stock: 41, debt: 2150000, status: "yaxshi" },
  { id: "s5", name: "Ulug'vor", label: "Ulug'vor ko'chasi", households: 55, served: 55, demand: 154, delivered: 152, stock: 38, debt: 2000000, status: "yaxshi" },
  { id: "s6", name: "Chinor–Guliston", label: "Chinor–Guliston zonasi", households: 101, served: 101, demand: 283, delivered: 279, stock: 72, debt: 3900000, status: "yaxshi" },
  { id: "s7", name: "Urganji", label: "Urganji ko'chasi", households: 43, served: 43, demand: 119, delivered: 98, stock: 18, debt: 4800000, status: "o'rta" },
  { id: "s8", name: "Do'stlik", label: "Do'stlik ko'chasi", households: 47, served: 47, demand: 132, delivered: 55, stock: 6, debt: 8600000, status: "kritik" },
];

// Ta'minot manbasi (taqsimot punktlari)
export const SOURCES = [
  { key: "shoxobcha", label: "Gaz to'ldirish shoxobchasi", share: 50 },
  { key: "mobil", label: "Mobil yetkazib berish", share: 30 },
  { key: "ombor", label: "Tuman ombori", share: 14 },
  { key: "boshqa", label: "Boshqa", share: 6 },
];
