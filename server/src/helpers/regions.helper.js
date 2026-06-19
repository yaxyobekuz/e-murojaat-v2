// O'zbekiston ma'muriy birliklari — 4 daraja: viloyat → tuman → qishloq/shahar → mahalla.
// Barcha modullarda qayta ishlatiladi. Kod qiymati (key) inglizcha-translit, UI nomi (label) o'zbekcha.
//
// Tuzilishi:
//   REGIONS[].key/label
//   DISTRICTS[regionKey] = [{ key, label, settlements: [{ key, label, type }] }]
//   Mahallalar dasturiy generatsiya qilinadi (mahallasOf) — realistik nomlar bilan.

export const REGIONS = [
  { key: "toshkent_shahri", label: "Toshkent shahri" },
  { key: "toshkent", label: "Toshkent viloyati" },
  { key: "andijon", label: "Andijon" },
  { key: "fargona", label: "Farg'ona" },
  { key: "namangan", label: "Namangan" },
  { key: "samarqand", label: "Samarqand" },
  { key: "buxoro", label: "Buxoro" },
  { key: "navoiy", label: "Navoiy" },
  { key: "qashqadaryo", label: "Qashqadaryo" },
  { key: "surxondaryo", label: "Surxondaryo" },
  { key: "jizzax", label: "Jizzax" },
  { key: "sirdaryo", label: "Sirdaryo" },
  { key: "xorazm", label: "Xorazm" },
  { key: "qoraqalpogiston", label: "Qoraqalpog'iston Respublikasi" },
];

export const REGION_KEYS = REGIONS.map((r) => r.key);

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/['`’]/g, "")
    .replace(/[^a-z0-9À-ɏ]+/gi, "_")
    .replace(/^_+|_+$/g, "");

// type: shahar | qishloq | shaharcha. Demo uchun har tumanga 2-4 ta aholi punkti.
const S = (label, type = "qishloq") => ({ key: slug(label), label, type });

// Har viloyat uchun tumanlar + ichidagi aholi punktlari (qishloq/shahar).
// Andijon to'liqroq, qolganlari yetarli darajada.
const RAW_DISTRICTS = {
  toshkent_shahri: [
    ["Yunusobod", [["Yunusobod", "shahar"], ["Bodomzor", "shaharcha"]]],
    ["Chilonzor", [["Chilonzor", "shahar"], ["Qatortol", "shaharcha"]]],
    ["Mirzo Ulug'bek", [["Mirzo Ulug'bek", "shahar"], ["Qorasuv", "shaharcha"]]],
    ["Yashnobod", [["Yashnobod", "shahar"], ["Tuzel", "shaharcha"]]],
    ["Olmazor", [["Olmazor", "shahar"], ["Bo'z su", "shaharcha"]]],
  ],
  toshkent: [
    ["Zangiota", [["Zangiota", "shahar"], ["Eshonguzar", "qishloq"], ["Turkiston", "qishloq"]]],
    ["Qibray", [["Qibray", "shahar"], ["Salar", "qishloq"], ["Yangihayot", "qishloq"]]],
    ["Chirchiq", [["Chirchiq", "shahar"], ["Yangiobod", "qishloq"]]],
    ["Bekobod", [["Bekobod", "shahar"], ["Dalvarzin", "qishloq"]]],
    ["Yangiyo'l", [["Yangiyo'l", "shahar"], ["Gulbahor", "qishloq"]]],
  ],
  andijon: [
    ["Andijon shahri", [["Andijon", "shahar"], ["Bog'ishamol", "shaharcha"], ["Cho'lpon", "shaharcha"]]],
    ["Asaka", [["Asaka", "shahar"], ["Qo'rg'ontepa", "qishloq"], ["Mustaqillik", "qishloq"], ["Navbahor", "qishloq"]]],
    ["Xonobod", [["Xonobod", "shahar"], ["Paxtaobod", "qishloq"], ["Oltinko'l", "qishloq"]]],
    ["Shahrixon", [["Shahrixon", "shahar"], ["Marhamat", "qishloq"], ["Bo'ston", "qishloq"], ["Yangiqo'rg'on", "qishloq"]]],
    ["Marhamat", [["Marhamat", "shahar"], ["Polvontosh", "qishloq"], ["Qoradaryo", "qishloq"]]],
    ["Baliqchi", [["Baliqchi", "shahar"], ["Hakkulobod", "qishloq"], ["Oqoltin", "qishloq"]]],
  ],
  fargona: [
    ["Farg'ona shahri", [["Farg'ona", "shahar"], ["Yangiariq", "shaharcha"]]],
    ["Marg'ilon", [["Marg'ilon", "shahar"], ["Toshloq", "qishloq"]]],
    ["Qo'qon", [["Qo'qon", "shahar"], ["Muqimiy", "qishloq"]]],
    ["Quva", [["Quva", "shahar"], ["Yozyovon", "qishloq"]]],
    ["Rishton", [["Rishton", "shahar"], ["Bog'dod", "qishloq"]]],
  ],
  namangan: [
    ["Namangan shahri", [["Namangan", "shahar"], ["Davlatobod", "shaharcha"]]],
    ["Chust", [["Chust", "shahar"], ["Varzik", "qishloq"]]],
    ["Pop", [["Pop", "shahar"], ["Chodak", "qishloq"]]],
    ["Uchqo'rg'on", [["Uchqo'rg'on", "shahar"], ["Yangiqo'rg'on", "qishloq"]]],
    ["To'raqo'rg'on", [["To'raqo'rg'on", "shahar"], ["So'x", "qishloq"]]],
  ],
  samarqand: [
    ["Samarqand shahri", [["Samarqand", "shahar"], ["Sug'diyona", "shaharcha"]]],
    ["Kattaqo'rg'on", [["Kattaqo'rg'on", "shahar"], ["Payariq", "qishloq"]]],
    ["Urgut", [["Urgut", "shahar"], ["Go'sh", "qishloq"]]],
    ["Bulung'ur", [["Bulung'ur", "shahar"], ["Juma", "qishloq"]]],
    ["Jomboy", [["Jomboy", "shahar"], ["Tayloq", "qishloq"]]],
  ],
  buxoro: [
    ["Buxoro shahri", [["Buxoro", "shahar"], ["Galaosiyo", "shaharcha"]]],
    ["G'ijduvon", [["G'ijduvon", "shahar"], ["Vobkent", "qishloq"]]],
    ["Kogon", [["Kogon", "shahar"], ["Olot", "qishloq"]]],
    ["Romitan", [["Romitan", "shahar"], ["Shofirkon", "qishloq"]]],
    ["Qorako'l", [["Qorako'l", "shahar"], ["Jondor", "qishloq"]]],
  ],
  navoiy: [
    ["Navoiy shahri", [["Navoiy", "shahar"], ["Qiziltepa", "shaharcha"]]],
    ["Zarafshon", [["Zarafshon", "shahar"], ["Tomdi", "qishloq"]]],
    ["Karmana", [["Karmana", "shahar"], ["Nurota", "qishloq"]]],
    ["Konimex", [["Konimex", "shahar"], ["Uchquduq", "qishloq"]]],
  ],
  qashqadaryo: [
    ["Qarshi", [["Qarshi", "shahar"], ["Beshkent", "qishloq"]]],
    ["Shahrisabz", [["Shahrisabz", "shahar"], ["Kitob", "qishloq"]]],
    ["G'uzor", [["G'uzor", "shahar"], ["Dehqonobod", "qishloq"]]],
    ["Koson", [["Koson", "shahar"], ["Mubarak", "qishloq"]]],
  ],
  surxondaryo: [
    ["Termiz", [["Termiz", "shahar"], ["Angor", "qishloq"]]],
    ["Denov", [["Denov", "shahar"], ["Sho'rchi", "qishloq"]]],
    ["Boysun", [["Boysun", "shahar"], ["Sariosiyo", "qishloq"]]],
    ["Jarqo'rg'on", [["Jarqo'rg'on", "shahar"], ["Qumqo'rg'on", "qishloq"]]],
  ],
  jizzax: [
    ["Jizzax shahri", [["Jizzax", "shahar"], ["Sharof Rashidov", "shaharcha"]]],
    ["G'allaorol", [["G'allaorol", "shahar"], ["Baxmal", "qishloq"]]],
    ["Zomin", [["Zomin", "shahar"], ["Forish", "qishloq"]]],
    ["Paxtakor", [["Paxtakor", "shahar"], ["Do'stlik", "qishloq"]]],
  ],
  sirdaryo: [
    ["Guliston", [["Guliston", "shahar"], ["Sirdaryo", "qishloq"]]],
    ["Yangiyer", [["Yangiyer", "shahar"], ["Boyovut", "qishloq"]]],
    ["Sayxunobod", [["Sayxunobod", "shahar"], ["Oqoltin", "qishloq"]]],
    ["Sardoba", [["Sardoba", "shahar"], ["Mirzaobod", "qishloq"]]],
  ],
  xorazm: [
    ["Urganch", [["Urganch", "shahar"], ["Qo'shko'pir", "qishloq"]]],
    ["Xiva", [["Xiva", "shahar"], ["Hazorasp", "qishloq"]]],
    ["Shovot", [["Shovot", "shahar"], ["Gurlan", "qishloq"]]],
    ["Yangiariq", [["Yangiariq", "shahar"], ["Bog'ot", "qishloq"]]],
  ],
  qoraqalpogiston: [
    ["Nukus", [["Nukus", "shahar"], ["Oqmang'it", "qishloq"]]],
    ["Xo'jayli", [["Xo'jayli", "shahar"], ["Qo'ng'irot", "qishloq"]]],
    ["Chimboy", [["Chimboy", "shahar"], ["Kegeyli", "qishloq"]]],
    ["To'rtko'l", [["To'rtko'l", "shahar"], ["Beruniy", "qishloq"]]],
  ],
};

// RAW ni normallashtirilgan tuzilishga aylantiramiz.
export const DISTRICTS = Object.fromEntries(
  Object.entries(RAW_DISTRICTS).map(([regionKey, districts]) => [
    regionKey,
    districts.map(([dLabel, settlements]) => ({
      key: slug(dLabel),
      label: dLabel,
      settlements: settlements.map(([sLabel, type]) => S(sLabel, type)),
    })),
  ]),
);

// Mahalla nomlari (umumiy palitra — har aholi punktiga tasodifiy beriladi).
const MAHALLA_NAMES = [
  "Bo'ston", "Navbahor", "Guliston", "Yangiobod", "Do'stlik", "Mustaqillik",
  "Istiqlol", "Obod", "Chamanzor", "Bahor", "Yashnobod", "Oltinsoy",
  "Tinchlik", "Yangihayot", "Birlik", "Sharq", "Nurafshon", "Gulshan",
  "Yangiqishloq", "Markaz", "Qo'shchinor", "Bog'iston", "Lolazor", "Yulduz",
];

// Aholi punkti uchun mahallalar (deterministik: punkt key'iga bog'liq tartib).
// count — har punktdagi mahalla soni (default 4).
export const mahallasOf = (settlementKey, count = 4) => {
  // settlementKey'dan boshlang'ich indeks (deterministik, seed ↔ filtr mos kelishi uchun).
  let seed = 0;
  for (let i = 0; i < settlementKey.length; i += 1) seed += settlementKey.charCodeAt(i);
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const name = MAHALLA_NAMES[(seed + i * 7) % MAHALLA_NAMES.length];
    out.push({
      key: `${settlementKey}__${slug(name)}_${i + 1}`,
      label: `${name} MFY`,
    });
  }
  return out;
};

// Yordamchi qidiruvlar
export const regionLabel = (key) => REGIONS.find((r) => r.key === key)?.label || key || "—";

export const districtsOf = (regionKey) => DISTRICTS[regionKey] || [];

export const settlementsOf = (regionKey, districtKey) =>
  districtsOf(regionKey).find((d) => d.key === districtKey)?.settlements || [];

const allFlat = () => {
  const list = [];
  for (const region of REGIONS) {
    for (const d of districtsOf(region.key)) {
      for (const s of d.settlements) {
        for (const m of mahallasOf(s.key)) {
          list.push({
            region: region.key,
            district: d.key,
            settlement: s.key,
            settlementType: s.type,
            mahalla: m.key,
            districtLabel: d.label,
            settlementLabel: s.label,
            mahallaLabel: m.label,
          });
        }
      }
    }
  }
  return list;
};

// Seed va label qidiruvi uchun to'liq tekis ro'yxat (bir marta hisoblanadi).
export const ALL_LOCATIONS = allFlat();

export const districtLabel = (regionKey, districtKey) =>
  districtsOf(regionKey).find((d) => d.key === districtKey)?.label || districtKey || "—";

export const settlementLabel = (regionKey, districtKey, settlementKey) =>
  settlementsOf(regionKey, districtKey).find((s) => s.key === settlementKey)?.label ||
  settlementKey ||
  "—";

export const mahallaLabel = (mahallaKey) =>
  ALL_LOCATIONS.find((l) => l.mahalla === mahallaKey)?.mahallaLabel || mahallaKey || "—";
