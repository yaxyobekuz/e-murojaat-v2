// Tanlangan obyekt (uy/dala/yo'l/zavod) uchun deterministik boy mock ma'lumot.
// Mock id dan seed bilan generatsiya qilinadi — bir obyekt har doim bir xil kartochka beradi.

export const ELEMENT_TYPES = {
  uy: { key: "uy", label: "Uy", color: "#22d3ee", plural: "Uylar" },
  dala: { key: "dala", label: "Dala", color: "#10b981", plural: "Dalalar" },
  yol: { key: "yol", label: "Yo'l", color: "#f59e0b", plural: "Yo'llar" },
  zavod: { key: "zavod", label: "Zavod", color: "#a855f7", plural: "Zavodlar" },
};

// ---- deterministik seed (string -> 0..1) ----
const hash = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};
export const seeded = (id) => {
  let s = Math.floor(hash(id) * 1e9) || 1;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
};
const ri = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];

const FAMILY_NAMES = ["Azizov", "Karimov", "Rasulov", "Tursunov", "Yusupov", "Aliyev", "Saidov", "Qodirov", "Ergashev", "Olimov", "Nazarov", "Sobirov", "Mirzayev", "Hakimov", "Yo'ldoshev"];
const FIRST_NAMES = ["Jasur", "Bekzod", "Sardor", "Otabek", "Akmal", "Bobur", "Aziz", "Sherzod", "Dilshod", "Ulug'bek"];
const FEMALE_FIRST = ["Gulnora", "Dilfuza", "Nodira", "Zulfiya", "Munira", "Saodat", "Feruza", "Malika", "Nigora", "Shahnoza"];
const STREETS = ["Bobur shoh", "Navoiy", "Amir Temur", "Cho'lpon", "Fitrat", "Istiqlol", "Mustaqillik", "Yangiobod", "Fidokor", "Chashma"];
const INSPECTOR_TITLES = ["Soliq inspektori", "Yetakchi soliq inspektori", "Mahalla soliq nazoratchisi", "Katta davlat soliq inspektori"];
const CROPS = ["Bug'doy", "Paxta", "Kartoshka", "Sabzavot", "Bog' (meva)", "Uzumzor", "Beda", "Makkajo'xori"];
const FACTORIES = ["G'isht zavodi", "Non zavodi", "Mebel sexi", "To'qimachilik fabrikasi", "Oziq-ovqat sexi", "Savdo markazi", "Biznes markaz"];
const APPEAL_TOPICS = [
  "Ko'cha yoritilishi ishlamayapti",
  "Suv ta'minoti uzilishi",
  "Yo'l qoplamasini ta'mirlash",
  "Axlat o'z vaqtida olib ketilmayapti",
  "Gaz bosimi past",
  "Hovli obodonlashtirish",
  "Kanalizatsiya tiqilishi",
  "Elektr kuchlanishi past",
  "Daraxt kesish ruxsati",
  "Qo'shni bilan nizo",
];
// murojaat holatlari — loyiha status xaritasiga mos
const APPEAL_STATUSES = [
  { key: "yangi", label: "Yangi", tone: "info" },
  { key: "jarayonda", label: "Jarayonda", tone: "warning" },
  { key: "bajarildi", label: "Bajarildi", tone: "success" },
  { key: "rad", label: "Rad etildi", tone: "danger" },
];

export const fmt = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");

const buildHouse = (rnd, el = {}) => {
  const female = rnd() < 0.5;
  const family = pick(rnd, FAMILY_NAMES);
  const ownerSurname = female ? `${family}a` : family;
  const ownerName = `${ownerSurname} ${(female ? pick(rnd, FEMALE_FIRST) : pick(rnd, FIRST_NAMES))[0]}.`;
  const members = ri(rnd, 1, 9);
  const street = pick(rnd, STREETS);
  const houseNo = ri(rnd, 1, 120);

  // Real Mapbox binosidan: maydon (m²) va balandlik (m) → qavatlar, kadastr qiymati
  const area = Math.round(el.area || ri(rnd, 60, 200));
  const height = Math.round(el.height || ri(rnd, 3, 12));
  const floors = Math.max(1, Math.round(height / 3));
  const multi = floors >= 2;
  const value = (area * ri(rnd, 26, 38) * 100000) | 0; // m² narxi ~2.6-3.8 mln
  const ownership = pick(rnd, ["Xususiy", "Davlat", "Yuridik shaxs"]);
  const kind = multi ? "Ko'p qavatli turar-joy" : "Yakka tartibdagi uy";

  // Moliya — soliqlar
  const annualTax = Math.round((value * (ri(rnd, 8, 16) / 1000)) / 1000) * 1000; // qiymatdan ~0.8-1.6%
  const hasTaxDebt = rnd() < 0.45;
  const taxDebt = hasTaxDebt ? Math.round((annualTax * ri(rnd, 15, 90)) / 100 / 1000) * 1000 : 0;
  const hasMibDebt = rnd() < 0.3;
  const mibDebt = hasMibDebt ? ri(rnd, 30, 900) * 1000 : 0; // MIB (ijro) qarzi
  // to'lov darajasi: to'langan / (yillik soliq + barcha qarz)
  const totalDue = annualTax + taxDebt + mibDebt;
  const paid = Math.max(0, annualTax - taxDebt) + Math.round(mibDebt * (rnd() < 0.3 ? rnd() : 0));
  const payRate = Math.min(100, Math.round((paid / Math.max(1, totalDue)) * 100));

  const debtModules = [];
  if (taxDebt) debtModules.push({ name: "Soliq", amount: taxDebt });
  if (mibDebt) debtModules.push({ name: "MIB (ijro)", amount: mibDebt });
  if (rnd() < 0.28) debtModules.push({ name: "Gaz", amount: ri(rnd, 80, 900) * 1000 });
  if (rnd() < 0.22) debtModules.push({ name: "Elektr", amount: ri(rnd, 60, 600) * 1000 });

  // ===== Xonadon (turar-joy) bo'yicha demografik ma'lumot =====
  // Ko'p qavatli binoda oilalar soni qavat/maydonga bog'liq
  const families = multi ? Math.max(1, Math.round((floors * area) / ri(rnd, 120, 220))) : 1;
  const totalResidents = multi ? families * ri(rnd, 2, 5) : members;
  const womenTotal = Math.round(totalResidents * (ri(rnd, 46, 54) / 100));
  const menTotal = totalResidents - womenTotal;
  // daftarlar (e-daftar)
  const youthLedger = Math.round(totalResidents * (ri(rnd, 14, 24) / 100)); // 14-30 yosh
  const womenLedger = Math.round(womenTotal * (ri(rnd, 6, 16) / 100)); // e'tiborga muhtoj ayollar
  // bandlik (mehnatga layoqatlilar orasida)
  const workforce = Math.round(totalResidents * (ri(rnd, 48, 62) / 100));
  const unemployed = Math.round(workforce * (ri(rnd, 8, 28) / 100));
  const employed = workforce - unemployed;
  // gaz balloni ta'minoti (har oilaga) — qishloq/markazlashmagan ta'minot ko'rsatkichi
  const gasCylinders = Math.round(families * (ri(rnd, 55, 100) / 100));
  const gasCoverage = Math.min(100, Math.round((gasCylinders / Math.max(1, families)) * 100));

  const children = multi ? Math.round(totalResidents * (ri(rnd, 18, 30) / 100)) : ri(rnd, 0, members);
  const youth = youthLedger;
  const pensioners = multi ? Math.round(totalResidents * (ri(rnd, 8, 16) / 100)) : ri(rnd, 0, Math.max(0, members - children));

  // Murojaatlar (e-murojaat) — shu manzil bo'yicha fuqaro murojaatlari
  const appealCount = multi ? ri(rnd, 3, 14) : ri(rnd, 0, 5);
  const usedTopics = [];
  const appeals = Array.from({ length: appealCount }, () => {
    let topic = pick(rnd, APPEAL_TOPICS);
    let guard = 0;
    while (usedTopics.includes(topic) && guard++ < 5) topic = pick(rnd, APPEAL_TOPICS);
    usedTopics.push(topic);
    const st = pick(rnd, APPEAL_STATUSES);
    const overdue = st.key === "jarayonda" && rnd() < 0.3;
    return {
      number: `M-${ri(rnd, 100000, 999999)}`,
      topic,
      status: st,
      overdue,
      daysAgo: ri(rnd, 1, 180),
    };
  }).sort((a, b) => a.daysAgo - b.daysAgo);

  // murojaat hisoboti (statuslar bo'yicha yig'indi)
  const appealStats = {
    total: appeals.length,
    done: appeals.filter((a) => a.status.key === "bajarildi").length,
    progress: appeals.filter((a) => a.status.key === "yangi" || a.status.key === "jarayonda").length,
    rejected: appeals.filter((a) => a.status.key === "rad").length,
  };

  return {
    title: multi ? "Ko'p qavatli turar-joy" : `${ownerSurname}lar honadoni`,
    subtitle: `Fidokor ko'chasi, ${houseNo}-uy`,
    badge: payRate >= 80 ? "Soliq to'langan" : taxDebt || mibDebt ? "Qarzi bor" : "Faol",
    badgeTone: payRate >= 80 ? "success" : payRate >= 40 ? "warning" : "danger",
    // 1-tab (Asosiy) — rasmga mos reyestr faktlari
    facts: [
      { label: "Turi", value: kind },
      { label: "Egasi", value: ownerName },
      { label: "Mulkchilik", value: ownership },
      { label: "Maydon", value: `${fmt(area)} m²` },
      { label: "Qavatlar", value: `${floors} qavat` },
      { label: "Balandlik", value: `${height} m` },
      { label: "Qiymati", value: `${fmt(value)} so'm` },
      { label: "Manzil", value: `Fidokor ko'chasi, ${houseNo}-uy` },
    ],
    // Soliq holati (1-tabda progressbar bilan)
    tax: {
      annual: annualTax,
      taxDebt,
      mibDebt,
      payRate,
      // biriktirilgan xodim
      officer: {
        name: `${pick(rnd, FAMILY_NAMES)} ${pick(rnd, FIRST_NAMES)[0]}.`,
        title: pick(rnd, INSPECTOR_TITLES),
        phone: `+998 ${pick(rnd, ["90", "91", "93", "94", "97", "99"])} ${ri(rnd, 100, 999)}-${ri(rnd, 10, 99)}-${ri(rnd, 10, 99)}`,
        sector: `${ri(rnd, 1, 12)}-sektor`,
      },
    },
    appeals,
    appealStats,
    // Murojaat tabi — xonadon demografiyasi
    household: {
      owner: ownerName,
      families,
      residents: totalResidents,
      women: womenTotal,
      men: menTotal,
      youthLedger,
      womenLedger,
      employed,
      unemployed,
      workforce,
      gas: { cylinders: gasCylinders, coverage: gasCoverage },
    },
    // Murojaat bo'yicha biriktirilgan xodim
    appealOfficer: {
      name: `${pick(rnd, FAMILY_NAMES)} ${pick(rnd, FIRST_NAMES)[0]}.`,
      title: pick(rnd, ["Mahalla raisi yordamchisi", "Murojaatlar bo'yicha mas'ul", "Sektor rahbari", "Yoshlar yetakchisi"]),
      phone: `+998 ${pick(rnd, ["90", "91", "93", "94", "97", "99"])} ${ri(rnd, 100, 999)}-${ri(rnd, 10, 99)}-${ri(rnd, 10, 99)}`,
      sector: `${ri(rnd, 1, 12)}-sektor`,
    },
    // Biriktirilgan tibbiyot xodimi (oilaviy shifokor / hamshira)
    medic: {
      name: `${pick(rnd, FAMILY_NAMES)} ${pick(rnd, female ? FIRST_NAMES : FEMALE_FIRST)[0]}.`,
      title: pick(rnd, ["Oilaviy shifokor", "Uchastka hamshirasi", "Umumiy amaliyot shifokori"]),
      phone: `+998 ${pick(rnd, ["90", "91", "93", "94", "97", "99"])} ${ri(rnd, 100, 999)}-${ri(rnd, 10, 99)}-${ri(rnd, 10, 99)}`,
      facility: `${ri(rnd, 1, 24)}-son oilaviy poliklinika`,
    },
    utilities: [
      { name: "Gaz", on: rnd() < 0.9 },
      { name: "Elektr", on: rnd() < 0.98 },
      { name: "Suv", on: rnd() < 0.85 },
      { name: "Internet", on: rnd() < 0.7 },
    ],
    consumption: { gas: ri(rnd, 40, 320), elec: ri(rnd, 120, 650), water: ri(rnd, 6, 28) },
    debts: debtModules,
    taxes: [
      { name: "Mol-mulk solig'i", amount: Math.round(annualTax * 0.6), paid: !hasTaxDebt || rnd() < 0.5 },
      { name: "Yer solig'i", amount: Math.round(annualTax * 0.4), paid: rnd() < 0.7 },
    ],
    social: {
      children,
      youth,
      pensioners,
      employed,
      students: Math.round(children * (ri(rnd, 60, 95) / 100)),
      risk: rnd() < 0.08 ? "Profilaktika hisobida" : rnd() < 0.2 ? "Nazoratda" : "Toza",
      benefits: rnd() < 0.3 ? pick(rnd, ["Kam ta'minlangan", "Nogironlik nafaqasi", "Bolalar nafaqasi"]) : null,
    },
    youthCount: youth,
    risk: rnd() < 0.08 ? "Profilaktika hisobida" : rnd() < 0.2 ? "Nazoratda" : "Toza",
  };
};

const buildField = (rnd) => {
  const crop = pick(rnd, CROPS);
  const ha = (ri(rnd, 5, 120) / 10).toFixed(1);
  return {
    title: `${crop} dalasi`,
    subtitle: `Qishloq xo'jaligi yeri · ${ha} ga`,
    badge: rnd() < 0.8 ? "Ekin ekilgan" : "Bo'sh",
    badgeTone: rnd() < 0.8 ? "success" : "warning",
    facts: [
      { label: "Ekin turi", value: crop },
      { label: "Maydon", value: `${ha} gektar` },
      { label: "Egasi", value: `${pick(rnd, FAMILY_NAMES)} fermer xo'jaligi` },
      { label: "Hosildorlik", value: `${ri(rnd, 18, 65)} s/ga` },
      { label: "Sug'orish", value: pick(rnd, ["Tomchilatib", "Ariqdan", "Nasos orqali"]) },
      { label: "Kadastr", value: `12:0${ri(rnd, 1, 9)}:${ri(rnd, 1000, 9999)}` },
    ],
    yieldTrend: Array.from({ length: 6 }, () => ri(rnd, 30, 70)),
  };
};

const buildRoad = (rnd) => {
  const street = pick(rnd, STREETS);
  const len = ri(rnd, 200, 2400);
  const quality = ri(rnd, 35, 99);
  return {
    title: `${street} ko'chasi`,
    subtitle: `Avtomobil yo'li · ${fmt(len)} m`,
    badge: quality > 75 ? "Yaxshi holatda" : quality > 50 ? "O'rtacha" : "Ta'mir kerak",
    badgeTone: quality > 75 ? "success" : quality > 50 ? "warning" : "danger",
    facts: [
      { label: "Uzunligi", value: `${fmt(len)} m` },
      { label: "Qoplama", value: pick(rnd, ["Asfalt", "Beton", "Shag'al"]) },
      { label: "Holati", value: `${quality}%` },
      { label: "Yoritilgan", value: rnd() < 0.6 ? "Ha" : "Yo'q" },
      { label: "Oxirgi ta'mir", value: `${ri(rnd, 2015, 2025)}` },
      { label: "Kunlik harakat", value: `${fmt(ri(rnd, 200, 4000))} avto` },
    ],
    quality,
  };
};

const buildFactory = (rnd) => {
  const name = pick(rnd, FACTORIES);
  const workers = ri(rnd, 8, 240);
  return {
    title: name,
    subtitle: `Ishlab chiqarish / tijorat obyekti`,
    badge: rnd() < 0.85 ? "Faoliyatda" : "To'xtatilgan",
    badgeTone: rnd() < 0.85 ? "success" : "danger",
    facts: [
      { label: "Faoliyat turi", value: name },
      { label: "Ishchilar", value: `${workers} kishi` },
      { label: "Egasi (MChJ)", value: `"${pick(rnd, FAMILY_NAMES)} biznes"` },
      { label: "Yillik aylanma", value: `${fmt(ri(rnd, 200, 9000))} mln so'm` },
      { label: "Soliq holati", value: rnd() < 0.8 ? "To'langan" : "Qarzdor" },
      { label: "Ro'yxatga olingan", value: `${ri(rnd, 2005, 2024)}` },
    ],
    workers,
  };
};

const BUILDERS = { uy: buildHouse, dala: buildField, yol: buildRoad, zavod: buildFactory };

// deterministik kadastr raqami (UZ:03:01:20:7126 ko'rinishida)
const cadastreNo = (id) => {
  const r = seeded(`${id}_kad`);
  const ri2 = (a, b) => a + Math.floor(r() * (b - a + 1));
  return `UZ:03:${String(ri2(1, 14)).padStart(2, "0")}:${String(ri2(1, 40)).padStart(2, "0")}:${ri2(1000, 9999)}`;
};

// element uchun deterministik to'liq ma'lumot
export const elementInfo = (el) => {
  if (!el) return null;
  const rnd = seeded(el.id);
  const data = (BUILDERS[el.type] || buildHouse)(rnd, el);
  return { ...data, type: el.type, typeMeta: ELEMENT_TYPES[el.type], id: el.id, cadastre: cadastreNo(el.id) };
};
