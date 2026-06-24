// Gaz moduli — Sarnovul MFY ko'chalari bo'yicha ta'minot ma'lumoti.
// Ikki yo'nalish: gaz balon (LPG) + gazlashtirish (quvur). Seedlangan PRNG => barqaror.
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
  { id: "sup_2", name: "Baliqchi gaz xizmati", reliability: 88 },
  { id: "sup_3", name: "Sarnovul balon punkti", reliability: 79 },
  { id: "sup_4", name: "Andijon LPG", reliability: 71 },
];

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rint = (r, a, b) => Math.round(a + r() * (b - a));
const rnum = (r, a, b, d = 1) => Math.round((a + r() * (b - a)) * 10 ** d) / 10 ** d;

// Ko'cha (nom, ta'minot turi, holat) — izchil juftliklar
const SEED = [
  ["Sarnovul", "aralash", "yashil"], ["Navoiy", "quvur", "yashil"], ["Bobur", "quvur", "yashil"],
  ["Amir Temur", "quvur", "sariq"], ["Fidokor", "balon", "yashil"], ["Istiqlol", "balon", "sariq"],
  ["Do'stlik", "balon", "qizil"], ["Bog'", "aralash", "sariq"], ["Chinor", "quvur", "yashil"],
  ["Guliston", "balon", "qizil"], ["Mustaqillik", "quvur", "sariq"], ["Yangi hayot", "yoq", "qora"],
  ["Marvarid", "balon", "qizil"], ["Oqtepa", "yoq", "qora"],
];

const TIER = {
  yashil: { cov: [0.92, 1.0], cycle: [9, 14], uptime: [97, 99.5], repair: [2, 5], gas: [88, 100], inc: [0, 1] },
  sariq: { cov: [0.6, 0.82], cycle: [18, 30], uptime: [92, 96], repair: [5, 10], gas: [55, 80], inc: [1, 3] },
  qizil: { cov: [0.2, 0.42], cycle: [40, 70], uptime: [80, 90], repair: [10, 24], gas: [20, 45], inc: [2, 5] },
  qora: { cov: [0, 0.1], cycle: [90, 150], uptime: [0, 0], repair: [0, 0], gas: [0, 8], inc: [0, 0] },
};

const build = () => {
  const r = rng(930624);
  return SEED.map(([name, supplyType, status], i) => {
    const t = TIER[status];
    const households = rint(r, 180, 720);
    const population = Math.round(households * (3.6 + r() * 1.6));
    const usesBalon = supplyType === "balon" || supplyType === "aralash";
    const usesPipe = supplyType === "quvur" || supplyType === "aralash";

    const balonHomes = supplyType === "balon" ? households : supplyType === "aralash" ? Math.round(households * 0.5) : supplyType === "yoq" ? households : 0;
    const need = usesBalon || supplyType === "yoq" ? Math.round(balonHomes * 1.1) : 0;
    const coverage = rnum(r, t.cov[0], t.cov[1], 2);
    const cylindersPerMonth = Math.round(need * coverage);
    const cycle = rint(r, t.cycle[0], t.cycle[1]);

    return {
      id: `st_${String(i + 1).padStart(2, "0")}`,
      name,
      supplyType,
      status,
      households,
      population,
      balonHomes,
      cylindersNeeded: need,
      cylindersPerMonth,
      coveragePct: need ? Math.round((cylindersPerMonth / need) * 100) : null,
      avgCylindersPerFamily: balonHomes ? Math.round((cylindersPerMonth / balonHomes) * 10) / 10 : 0,
      perCapita: population ? Math.round((cylindersPerMonth / population) * 100) / 100 : 0,
      deliveryCycleDays: usesBalon || supplyType === "yoq" ? cycle : null,
      longestGapDays: usesBalon || supplyType === "yoq" ? Math.round(cycle * (1.4 + r() * 1.4)) : null,
      lastDeliveryDate: usesBalon
        ? new Date(REF.getTime() - cycle * (0.3 + r() * 1.6) * DAY).toISOString()
        : null,
      supplierId: usesBalon ? SUPPLIERS[rint(r, 0, SUPPLIERS.length - 1)].id : null,
      gasifiedPct: usesPipe ? rint(r, t.gas[0], t.gas[1]) : supplyType === "yoq" ? 0 : rint(r, 0, 8),
      pipelineKm: usesPipe ? rnum(r, 0.6, 4.2, 1) : 0,
      openIncidents: usesPipe ? rint(r, t.inc[0], t.inc[1]) : 0,
      avgRepairH: usesPipe ? rnum(r, t.repair[0], t.repair[1], 1) : null,
      uptimePct: usesPipe ? rnum(r, t.uptime[0], t.uptime[1], 1) : null,
    };
  });
};

export const STREETS = build();
export const streetById = (id) => STREETS.find((s) => s.id === id);
