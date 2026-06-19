// O'zbekiston viloyatlari va tumanlari (demo uchun) — barcha modullarda qayta ishlatiladi.
// Kod qiymatlari (key) inglizcha-translit, UI nomi (label) o'zbekcha.

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

// Har viloyat uchun bir nechta tuman (demo uchun yetarli, hammasi to'liq emas).
export const DISTRICTS = {
  toshkent_shahri: ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Yashnobod", "Olmazor"],
  toshkent: ["Zangiota", "Qibray", "Chirchiq", "Bekobod", "Yangiyo'l"],
  andijon: ["Andijon", "Asaka", "Xonobod", "Shahrixon", "Marhamat"],
  fargona: ["Farg'ona", "Marg'ilon", "Qo'qon", "Quva", "Rishton"],
  namangan: ["Namangan", "Chust", "Pop", "Uchqo'rg'on", "To'raqo'rg'on"],
  samarqand: ["Samarqand", "Kattaqo'rg'on", "Urgut", "Bulung'ur", "Jomboy"],
  buxoro: ["Buxoro", "G'ijduvon", "Kogon", "Vobkent", "Romitan"],
  navoiy: ["Navoiy", "Zarafshon", "Karmana", "Nurota", "Konimex"],
  qashqadaryo: ["Qarshi", "Shahrisabz", "Kitob", "G'uzor", "Koson"],
  surxondaryo: ["Termiz", "Denov", "Sho'rchi", "Boysun", "Sariosiyo"],
  jizzax: ["Jizzax", "G'allaorol", "Zomin", "Paxtakor", "Forish"],
  sirdaryo: ["Guliston", "Yangiyer", "Sirdaryo", "Boyovut", "Sayxunobod"],
  xorazm: ["Urganch", "Xiva", "Shovot", "Gurlan", "Xonqa"],
  qoraqalpogiston: ["Nukus", "Xo'jayli", "Chimboy", "Beruniy", "To'rtko'l"],
};

export const regionLabel = (key) =>
  REGIONS.find((r) => r.key === key)?.label || key;

export const districtsOf = (regionKey) => DISTRICTS[regionKey] || [];
