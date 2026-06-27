// Elektr energiya moduli — mahalla/qishloq darajasidagi demo ma'lumot.
// Markaz: Sarnovul MFY, Baliqchi tumani, Andijon. Seedlangan PRNG => barqaror demo.
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

const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// 14 ko'cha — Sarnovul MFY ichidagi ko'chalar (o'zbekcha nomlar).
const NAMES = [
  "Sarnovul", "Navoiy", "Bobur", "Amir Temur", "Fidokor", "Istiqlol", "Do'stlik",
  "Bog'", "Chinor", "Guliston", "Mustaqillik", "Yangi hayot", "Marvarid", "Oqtepa",
];

// Ataylab bir nechta ko'cha qizil (oshib ketgan yuklama) bo'lsin.
const LOAD_SEED = [62, 78, 168, 95, 142, 71, 188, 104, 58, 126, 83, 155, 112, 67];

const build = () => {
  const r = rng(40879);
  return NAMES.map((name, i) => {
    const load = LOAD_SEED[i];
    const transformers = 2 + Math.floor(r() * 5);
    const households = 280 + Math.floor(r() * 720);
    // Yuklama yuqori bo'lsa kuchlanish pasayadi (220V me'yor)
    const voltage = Math.round(232 - load * 0.55 - r() * 14);
    const askue = Math.max(38, Math.min(99, Math.round(100 - load * 0.28 - r() * 18)));
    // ASKUE past bo'lsa yo'qotish ko'p (o'g'irlik/qochqin)
    const losses = Math.round((26 - askue * 0.18 + r() * 5) * 10) / 10;
    // Uy boshiga ~220-340 kWt·soat/oy => realistik MVt·soat
    const consumption = Math.round(households * (0.22 + r() * 0.12) * 10) / 10; // MWh/oy
    const solarHomes = Math.floor(households * (0.02 + r() * 0.07));
    const solarKwh = Math.round(solarHomes * (160 + r() * 120));
    const outages = Math.round(load / 22 + r() * 4);
    const mttr = Math.round(38 + load * 0.42 + r() * 25); // daqiqa

    return {
      id: `mfy_${String(i + 1).padStart(2, "0")}`,
      name,
      label: `${name} ko'chasi`,
      load,
      status: healthOf(load),
      transformers,
      households,
      voltage,
      askue,
      losses: Math.max(4, losses),
      consumption,
      solarHomes,
      solarKwh,
      outages,
      mttr,
    };
  });
};

export const MAHALLAS = build();

export const PERIODS = ["Hafta", "Oy", "12 oy"];
