// Server indikatorlarini mahallaData.js konstantalari ustidan qo'yadi (mergeHouse falsafasi).
// Indikator yo'q/loading/offline bo'lsa — konstanta fallback (dashboard hech qachon bo'sh emas).
import { TOP_CARDS, OVERVIEW, BOTTOM_STATS, LIVE_FEEDS } from "./mahallaData";

const g = (ind, domain, key, fb) => {
  const v = ind?.[domain]?.[key];
  return v === undefined || v === null ? fb : v;
};
const nf = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");
const toNum = (s) => Number(String(s).replace(/\s/g, "")) || 0;

// TOP_CARDS key -> [domain, valueKey, deltaKey]
const TOP_MAP = {
  aholi: ["population", "population", "populationDelta"],
  honadon: ["population", "households", "householdsDelta"],
  soliq: ["tax", "taxCollectedMln", "taxDelta"],
  talim: ["education", "students", "studentsDelta"],
  yoshlar: ["youth", "youthRegistered", "youthDelta"],
  iib: ["safety", "preventionFamilies", "preventionDelta"],
  gaz: ["finance", "gasDebtMln", "gasDebtDelta"],
  obod: ["women", "improvementPct", "improvementDelta"],
  suv: ["utilities", "waterPct", "waterDelta"],
  elektr: ["finance", "electricDebtMln", "electricDebtDelta"],
  yer: ["land", "landObjects", "landDelta"],
  fvv: ["safety", "hazardObjects", "hazardDelta"],
  zavod: ["tax", "enterprises", "enterprisesDelta"],
  yashil: ["women", "greenTrees", "greenDelta"],
  internet: ["utilities", "internetPct", "internetDelta"],
  murojaat: ["appeals", "appealsTotal", "appealsDelta"],
};

// OVERVIEW — tartib bo'yicha (index) [domain, key]
const HERO_MAP = [["population", "population"], ["population", "households"], ["tax", "enterprises"], ["population", "streets"]];
const POP_MAP = [["population", "ageChildren"], ["population", "ageWorking"], ["population", "ageElderly"]];
const COVERAGE_MAP = [["utilities", "gasPct"], ["utilities", "electricPct"], ["utilities", "waterPct"], ["utilities", "internetPct"], ["utilities", "sewagePct"]];
const MAPOBJ_MAP = [["population", "residentialBuildings"], ["tax", "enterprises"], ["population", "streets"], ["utilities", "greenAreas"]];
const FACIL_MAP = [["education", "schools"], ["education", "kindergartens"], ["education", "clinics"], ["education", "mosques"]];

// BOTTOM_STATS — [domain, key, isPercent]
const BOTTOM_MAP = [
  ["women", "employmentPct", true],
  ["women", "births", false],
  ["women", "marriages", false],
  ["tax", "newBusinesses", false],
  ["appeals", "resolvedPct", true],
  ["population", "realEstateDeals", false],
];

// LIVE_FEEDS key -> [domain, key]
const FEED_MAP = {
  murojaat: ["appeals", "todayAppeals"],
  favqulodda: ["safety", "emergencies"],
  msk: ["appeals", "mskOrders"],
  davomat: ["education", "chronicAbsentees"],
  transport: ["safety", "foreignVehicles"],
  qidiruv: ["safety", "wantedPersons"],
};

export const buildStats = (ind) => {
  // "Aholi soni"/"Honadonlar" default'i — real kiritilgan fuqarolar/uylar (computed); qo'lda kiritilsa override
  const residentsTotal = ind?.computed?.residentsTotal;
  const housesWithResidents = ind?.computed?.housesWithResidents;
  const computedFb = { aholi: residentsTotal, honadon: housesWithResidents };

  const topCards = TOP_CARDS.map((c) => {
    const m = TOP_MAP[c.key];
    if (!m) return c;
    const fb = computedFb[c.key] ?? c.value; // manual (g) -> computed -> mock
    return { ...c, value: g(ind, m[0], m[1], fb), delta: g(ind, m[0], m[2], c.delta) };
  });

  const overview = {
    ...OVERVIEW,
    hero: OVERVIEW.hero.map((h, i) => {
      const m = HERO_MAP[i];
      if (!m) return h;
      const fb = [residentsTotal, housesWithResidents][i] ?? toNum(h.value);
      return { ...h, value: nf(g(ind, m[0], m[1], fb)) };
    }),
    population: OVERVIEW.population.map((p, i) => {
      const m = POP_MAP[i];
      return m ? { ...p, value: g(ind, m[0], m[1], p.value) } : p;
    }),
    coverage: OVERVIEW.coverage.map((c, i) => {
      const m = COVERAGE_MAP[i];
      return m ? { ...c, value: g(ind, m[0], m[1], c.value) } : c;
    }),
    mapObjects: OVERVIEW.mapObjects.map((o, i) => {
      const m = MAPOBJ_MAP[i];
      return m ? { ...o, value: g(ind, m[0], m[1], o.value) } : o;
    }),
    facilities: OVERVIEW.facilities.map((f, i) => {
      const m = FACIL_MAP[i];
      return m ? { ...f, value: g(ind, m[0], m[1], f.value) } : f;
    }),
  };

  const bottomStats = BOTTOM_STATS.map((s, i) => {
    const m = BOTTOM_MAP[i];
    if (!m) return s;
    const raw = g(ind, m[0], m[1], null);
    return raw === null ? s : { ...s, value: m[2] ? `${raw}%` : String(raw) };
  });

  const leftFeeds = LIVE_FEEDS.map((f) => {
    const m = FEED_MAP[f.key];
    return m ? { ...f, value: g(ind, m[0], m[1], f.value) } : f;
  });

  return { topCards, overview, bottomStats, leftFeeds };
};
