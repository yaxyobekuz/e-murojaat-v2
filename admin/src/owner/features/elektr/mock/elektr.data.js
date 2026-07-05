// Elektr energiya moduli — mahalla darajasidagi demo ma'lumot (real kanonik raqamlar).
// Markaz: Sarnovul MFY, Baliqchi tumani, Andijon. 763 xonadon, 14 ko'cha.
// Barcha matn o'zbekcha; kod qiymatlari inglizcha.

export const CENTER = { lat: 40.87913596720542, lng: 71.93424196980021 };
export const PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Tarmoq salomatligi holatlari (transformator yuklamasi bo'yicha)
export const HEALTH = {
  norma: { label: "Norma", color: "#10b981", tone: "done" },
  ogohlik: { label: "Sub-kritik", color: "#f59e0b", tone: "progress" },
  kritik: { label: "Kritik yuklama", color: "#ef4444", tone: "danger" },
};

export const healthOf = (loadPct) =>
  loadPct > 115 ? "kritik" : loadPct >= 85 ? "ogohlik" : "norma";

// 14 ko'cha — Sarnovul MFY ichidagi ko'chalar (o'zbekcha nomlar).
const NAMES = [
  "Sarnovul", "Maslahat", "Ulug'vor", "Urganji", "Navoiy", "Bobur", "Amir Temur",
  "Istiqlol", "Do'stlik", "Guliston", "Mustaqillik", "Yangi hayot", "Chinor", "Oqtepa",
];

// Ataylab bir nechta ko'cha qizil (oshib ketgan yuklama) bo'lsin.
const LOAD_SEED = [64, 78, 122, 92, 71, 58, 96, 68, 84, 108, 52, 131, 74, 61];

// Kanonik yig'indilar: xonadon=763, quyoshli xonadon=58,
// quyosh=23 500 kVt·soat/oy (iyun), iste'mol=172.4 MVt·soat/oy (iyun), yo'qotish≈8.6%.
const HH_SEED = [72, 65, 58, 61, 54, 47, 56, 44, 52, 60, 38, 63, 49, 44];
const TP_SEED = [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1];
const VOLT_SEED = [224, 221, 208, 217, 222, 226, 216, 223, 219, 212, 227, 205, 222, 225];
const ASKUE_SEED = [99, 98, 95, 97, 99, 98, 96, 99, 98, 97, 100, 94, 99, 98];
const LOSS_SEED = [7.4, 8.2, 11.8, 8.9, 7.8, 6.9, 9.1, 7.2, 8.4, 9.6, 6.4, 12.3, 7.9, 7.1];
const CONS_SEED = [16.4, 14.8, 13.1, 13.9, 12.2, 10.6, 12.7, 9.8, 11.7, 13.6, 8.5, 14.3, 11.0, 9.8]; // MWh/oy
const SOLAR_HOMES_SEED = [7, 5, 3, 4, 6, 4, 5, 3, 4, 4, 2, 5, 3, 3];
const SOLAR_KWH_SEED = [2870, 2100, 1185, 1600, 2490, 1560, 2025, 1230, 1580, 1680, 770, 2000, 1215, 1195];
const OUTAGE_SEED = [1, 1, 3, 2, 1, 0, 2, 1, 1, 2, 0, 4, 1, 1];
const MTTR_SEED = [42, 48, 76, 58, 45, 40, 62, 44, 50, 66, 38, 88, 46, 43]; // daqiqa

const build = () =>
  NAMES.map((name, i) => {
    const load = LOAD_SEED[i];
    return {
      id: `mfy_${String(i + 1).padStart(2, "0")}`,
      name,
      label: `${name} ko'chasi`,
      load,
      status: healthOf(load),
      transformers: TP_SEED[i],
      households: HH_SEED[i],
      voltage: VOLT_SEED[i],
      askue: ASKUE_SEED[i],
      losses: LOSS_SEED[i],
      consumption: CONS_SEED[i],
      solarHomes: SOLAR_HOMES_SEED[i],
      solarKwh: SOLAR_KWH_SEED[i],
      outages: OUTAGE_SEED[i],
      mttr: MTTR_SEED[i],
    };
  });

export const MAHALLAS = build();

export const PERIODS = ["Hafta", "Oy", "12 oy"];
