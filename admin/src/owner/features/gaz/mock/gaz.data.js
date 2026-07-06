// Gaz moduli — Sarnovul MFY ko'chalari bo'yicha ta'minot ma'lumoti.
// Kanonik raqamlar: 763 xonadon (quvur 218 + balon 486 + yo'q 59), 4 306 aholi, 14 ko'cha.
export const MAHALLA = "Sarnovul MFY";
export const PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";
export const REF = new Date(2026, 5, 24);
const DAY = 86400000;

export const SUPPLY = {
  quvur: { label: "Quvur gazi", color: "#1E4FD8" },
  balon: { label: "Gaz balon", color: "#06b6d4" },
  aralash: { label: "Aralash", color: "#8b5cf6" },
  yoq: { label: "Gaz yo'q", color: "#64748b" },
};

export const STATUS = {
  yashil: { label: "Doimiy ta'minlangan", tone: "done", color: "#10b981" },
  sariq: { label: "Kam / kechikishli", tone: "progress", color: "#f59e0b" },
  qizil: { label: "Ta'minot to'xtagan", tone: "danger", color: "#ef4444" },
  qora: { label: "Deyarli yo'q", tone: "neutral", color: "#1f2937" },
};
export const STATUS_KEYS = Object.keys(STATUS);

export const ADEQUACY = { yetarli: "Yetarli", kam: "Kam", deyarli_yoq: "Deyarli yo'q" };
export const DELIVERY_STATUS = { yetkazildi: "Yetkazildi", kechikdi: "Kechikdi", yetkazilmadi: "Yetkazilmadi" };
export const INCIDENT_TYPE = {
  sizish: "Gaz sizishi",
  bosim_pastligi: "Bosim pastligi",
  uzilish: "Ta'minot uzilishi",
  hisoblagich: "Hisoblagich nosozligi",
};

export const SUPPLIERS = [
  { id: "sup_1", name: "Hududgaz filiali", reliability: 96 },
  { id: "sup_2", name: "Baliqchi gaz xizmati", reliability: 90 },
  { id: "sup_3", name: "Sarnovul balon punkti", reliability: 94 },
  { id: "sup_4", name: "Andijon LPG", reliability: 78 },
];

// Ko'cha ma'lumoti — kanonikka moslangan aniq qiymatlar (random emas):
// hh=xonadon, pop=aholi, need=oylik balon talabi, month=oylik yetkazilgan balon,
// cycle=yetkazish davri (kun), gap=eng uzoq uzilish, last=oxirgi yetkazish (necha kun oldin).
const SEED = [
  { name: "Sarnovul", supplyType: "quvur", status: "yashil", hh: 82, pop: 463, pipeKm: 1.8, inc: 0, repairH: 3.5, uptime: 99.2 },
  { name: "Navoiy", supplyType: "quvur", status: "yashil", hh: 74, pop: 418, pipeKm: 1.6, inc: 1, repairH: 4.2, uptime: 98.4 },
  { name: "Bobur", supplyType: "quvur", status: "sariq", hh: 62, pop: 350, pipeKm: 1.4, inc: 2, repairH: 7.5, uptime: 94.1 },
  { name: "Amir Temur", supplyType: "balon", status: "yashil", hh: 64, pop: 361, need: 179, month: 179, cycle: 12, gap: 16, last: 4, supplierId: "sup_3" },
  { name: "Maslahat", supplyType: "balon", status: "yashil", hh: 58, pop: 327, need: 162, month: 162, cycle: 10, gap: 14, last: 2, supplierId: "sup_3" },
  { name: "Istiqlol", supplyType: "balon", status: "yashil", hh: 61, pop: 344, need: 171, month: 171, cycle: 11, gap: 15, last: 3, supplierId: "sup_2" },
  { name: "Do'stlik", supplyType: "balon", status: "qizil", hh: 47, pop: 265, need: 132, month: 55, cycle: 48, gap: 86, last: 31, supplierId: "sup_4" },
  { name: "Ulug'vor", supplyType: "balon", status: "yashil", hh: 55, pop: 310, need: 154, month: 152, cycle: 12, gap: 17, last: 5, supplierId: "sup_3" },
  { name: "Chinor", supplyType: "balon", status: "yashil", hh: 52, pop: 293, need: 146, month: 144, cycle: 13, gap: 18, last: 6, supplierId: "sup_2" },
  { name: "Guliston", supplyType: "balon", status: "yashil", hh: 49, pop: 277, need: 137, month: 135, cycle: 12, gap: 16, last: 4, supplierId: "sup_3" },
  { name: "Mustaqillik", supplyType: "balon", status: "yashil", hh: 57, pop: 322, need: 160, month: 158, cycle: 11, gap: 15, last: 3, supplierId: "sup_2" },
  { name: "Urganji", supplyType: "balon", status: "sariq", hh: 43, pop: 243, need: 119, month: 98, cycle: 21, gap: 36, last: 12, supplierId: "sup_4" },
  { name: "Yangi hayot", supplyType: "yoq", status: "qora", hh: 34, pop: 192 },
  { name: "Oqtepa", supplyType: "yoq", status: "qora", hh: 25, pop: 141 },
];

const build = () =>
  SEED.map((s, i) => {
    const usesBalon = s.supplyType === "balon" || s.supplyType === "aralash";
    const usesPipe = s.supplyType === "quvur" || s.supplyType === "aralash";
    const need = s.need || 0;
    const month = s.month || 0;

    return {
      id: `st_${String(i + 1).padStart(2, "0")}`,
      name: s.name,
      supplyType: s.supplyType,
      status: s.status,
      households: s.hh,
      population: s.pop,
      balonHomes: usesBalon ? s.hh : 0,
      cylindersNeeded: need,
      cylindersPerMonth: month,
      coveragePct: need ? Math.round((month / need) * 100) : null,
      avgCylindersPerFamily: usesBalon && s.hh ? Math.round((month / s.hh) * 10) / 10 : 0,
      perCapita: s.pop ? Math.round((month / s.pop) * 100) / 100 : 0,
      deliveryCycleDays: usesBalon ? s.cycle : null,
      longestGapDays: usesBalon ? s.gap : null,
      lastDeliveryDate: usesBalon ? new Date(REF.getTime() - s.last * DAY).toISOString() : null,
      supplierId: usesBalon ? s.supplierId : null,
      gasifiedPct: usesPipe ? 100 : 0,
      pipelineKm: usesPipe ? s.pipeKm : 0,
      openIncidents: usesPipe ? s.inc : 0,
      avgRepairH: usesPipe ? s.repairH : null,
      uptimePct: usesPipe ? s.uptime : null,
    };
  });

export const STREETS = build();
export const streetById = (id) => STREETS.find((s) => s.id === id);
