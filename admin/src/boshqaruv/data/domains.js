// Dashboard domenlari + har domenning tahrirlanadigan KPI maydonlari.
// Server mahalla.constants.js (DOMAIN_OWNER) ning frontend ko'zgusi.
import { Users, GraduationCap, Droplets, Landmark, Banknote, ShieldAlert, Rocket, HeartHandshake, Map as MapIcon, MessageSquare } from "lucide-react";

const num = (key, label) => ({ key, label, type: "number" });
const sgn = (key, label) => ({ key, label, type: "signed" });

export const DOMAINS = [
  {
    domain: "population", title: "Aholi", icon: Users, ownerRole: "chairman", accent: "text-sky-400",
    fields: [
      num("population", "Aholi soni"), num("households", "Xonadonlar"), num("streets", "Ko'chalar"),
      num("ageChildren", "Bolalar (0-18)"), num("ageWorking", "Mehnatga layoqatli"), num("ageElderly", "Keksalar (60+)"),
      num("residentialBuildings", "Turar-joy binolari"), num("realEstateDeals", "Ko'chmas mulk bitimlari"),
      sgn("populationDelta", "Aholi o'zgarishi (%)"), sgn("householdsDelta", "Xonadon o'zgarishi (%)"),
    ],
  },
  {
    domain: "education", title: "Ta'lim", icon: GraduationCap, ownerRole: "chairman", accent: "text-emerald-400",
    fields: [
      num("students", "O'quvchilar"), sgn("studentsDelta", "O'quvchilar o'zgarishi (%)"),
      num("schools", "Maktablar"), num("kindergartens", "Bog'chalar"), num("clinics", "Poliklinikalar"), num("mosques", "Masjidlar"),
      num("chronicAbsentees", "Darsdan qolganlar"),
    ],
  },
  {
    domain: "utilities", title: "Kommunal", icon: Droplets, ownerRole: "chairman", accent: "text-cyan-400",
    fields: [
      num("waterPct", "Suv ta'minoti (%)"), num("internetPct", "Internet qamrovi (%)"), num("electricPct", "Elektr qamrovi (%)"),
      num("gasPct", "Gaz ta'minoti (%)"), num("sewagePct", "Kanalizatsiya (%)"), num("greenAreas", "Yashil hududlar"),
      sgn("waterDelta", "Suv o'zgarishi (%)"), sgn("internetDelta", "Internet o'zgarishi (%)"),
    ],
  },
  {
    domain: "tax", title: "Soliq", icon: Landmark, ownerRole: "tax_inspector", accent: "text-indigo-400",
    fields: [
      num("taxCollectedMln", "Yig'ilgan soliq (mln so'm)"), sgn("taxDelta", "Soliq o'zgarishi (%)"),
      num("enterprises", "Korxonalar"), sgn("enterprisesDelta", "Korxona o'zgarishi (%)"), num("newBusinesses", "Yangi bizneslar"),
    ],
  },
  {
    domain: "finance", title: "Moliya · Qarzdorlik", icon: Banknote, ownerRole: "bank_officer", accent: "text-emerald-400",
    fields: [
      num("gasDebtMln", "Gaz qarzdorlik (mln so'm)"), sgn("gasDebtDelta", "Gaz qarz o'zgarishi (%)"),
      num("electricDebtMln", "Elektr qarzdorlik (mln so'm)"), sgn("electricDebtDelta", "Elektr qarz o'zgarishi (%)"),
    ],
  },
  {
    domain: "safety", title: "Xavfsizlik · Profilaktika", icon: ShieldAlert, ownerRole: "prevention_inspector", accent: "text-red-400",
    fields: [
      num("preventionFamilies", "Profilaktikadagi oilalar"), sgn("preventionDelta", "O'zgarishi (%)"),
      num("hazardObjects", "Xavfli obyektlar"), sgn("hazardDelta", "Xavfli o'zgarishi (%)"),
      num("emergencies", "Favqulodda holatlar"), num("foreignVehicles", "Begona transportlar"), num("wantedPersons", "Qidiruvdagilar"),
    ],
  },
  {
    domain: "youth", title: "Yoshlar", icon: Rocket, ownerRole: "youth_leader", accent: "text-orange-400",
    fields: [num("youthRegistered", "Yoshlar daftari"), sgn("youthDelta", "O'zgarishi (%)")],
  },
  {
    domain: "women", title: "Xotin-qizlar · Obodonlashtirish", icon: HeartHandshake, ownerRole: "women_activist", accent: "text-violet-400",
    fields: [
      num("births", "Tug'ilish (yil)"), num("marriages", "Nikoh (yil)"), num("employmentPct", "Bandlik darajasi (%)"),
      num("improvementPct", "Obodonlashtirish (%)"), sgn("improvementDelta", "Obod o'zgarishi (%)"),
      num("greenTrees", "Yashil makon (tup)"), sgn("greenDelta", "Yashil o'zgarishi (%)"),
    ],
  },
  {
    domain: "land", title: "Yer kadastri", icon: MapIcon, ownerRole: "hokim_assistant", accent: "text-lime-400",
    fields: [num("landObjects", "Yer kadastri obyektlari"), sgn("landDelta", "O'zgarishi (%)")],
  },
  {
    domain: "appeals", title: "Murojaatlar", icon: MessageSquare, ownerRole: "hokim_assistant", accent: "text-fuchsia-400",
    fields: [
      num("appealsTotal", "Murojaatlar"), sgn("appealsDelta", "O'zgarishi (%)"), num("resolvedPct", "Hal qilingan (%)"),
      num("todayAppeals", "Bugungi murojaatlar"), num("mskOrders", "MSK buyurtmalar"),
    ],
  },
];

export const DOMAIN_BY_CODE = Object.fromEntries(DOMAINS.map((d) => [d.domain, d]));

// joriy foydalanuvchi tahrirlashi mumkin bo'lgan domenlar
export const domainsForRole = (role) => (role === "owner" ? DOMAINS : DOMAINS.filter((d) => d.ownerRole === role));

export const emptyDomain = (domain) => Object.fromEntries((DOMAIN_BY_CODE[domain]?.fields || []).map((f) => [f.key, ""]));
export const domainToForm = (data, domain) =>
  Object.fromEntries((DOMAIN_BY_CODE[domain]?.fields || []).map((f) => [f.key, data?.[f.key] ?? ""]));
export const domainToBody = (state, domain) =>
  Object.fromEntries(
    (DOMAIN_BY_CODE[domain]?.fields || []).map((f) => [f.key, state[f.key] === "" || state[f.key] == null ? null : Number(state[f.key])]),
  );
