// Xalq Nazorati — fuqaro shikoyatlari (foto + xarita pin) + kuzatuv.
// Asos: xalqnazorati.uz — noqonuniy axlat, buzilgan yoritish, kesilgan daraxt → biriktirildi
// → bajarildi → fuqaro tasdiqlaydi. 24/72s SLA. Demo — deterministik.
import { Trash2, Lightbulb, TreePine, Route, Droplet, SprayCan } from "lucide-react";

const rng = (seed) => {
  const x = Math.sin(seed * 91.7 + 33.1) * 43758.5453;
  return x - Math.floor(x);
};

// Shikoyat turi
export const REPORT_TYPE = {
  dump: { label: "Noqonuniy axlat", icon: Trash2 },
  light: { label: "Buzilgan yoritish", icon: Lightbulb },
  tree: { label: "Noqonuniy daraxt kesish", icon: TreePine },
  road: { label: "Yo'l buzilishi", icon: Route },
  water: { label: "Suv oqishi / tarmoq", icon: Droplet },
  sanitation: { label: "Sanitar holat", icon: SprayCan },
};

// Holat (rules/02) — fuqaro tasdiqlashi bilan yopiladi
export const REPORT_STATUS = {
  new: { label: "Yangi", tone: "new" },
  assigned: { label: "Biriktirildi", tone: "progress" },
  fixed: { label: "Hal qilindi · tasdiq kutilmoqda", tone: "progress" },
  confirmed: { label: "Fuqaro tasdiqladi", tone: "done" },
  returned: { label: "Qayta ishlashga qaytarildi", tone: "danger" },
};

// Sarnovul MFY ko'chalari — kanonik 14 ta
const MAHALLAS = ["Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik", "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor"];
const TYPES = ["dump", "light", "tree", "road", "water", "sanitation"];
const STATUSES = ["confirmed", "confirmed", "fixed", "assigned", "new", "returned"];
const ORG = "Obodonlashtirish boshqarmasi";

const TODAY = new Date("2026-06-24");

export const CITIZEN_REPORTS = Array.from({ length: 24 }, (_, i) => {
  const seed = i + 1;
  const type = TYPES[i % TYPES.length];
  const status = STATUSES[i % STATUSES.length];
  const mahalla = MAHALLAS[i % MAHALLAS.length];
  const days = Math.floor(rng(seed * 2.2) * 30);
  const created = new Date(TODAY);
  created.setDate(TODAY.getDate() - days);
  // SLA: 24/72s — kechikkanmi
  const slaHours = status === "confirmed" || status === "fixed" ? 18 + Math.floor(rng(seed * 3.3) * 60) : null;
  const overdue = slaHours != null && slaHours > 72;

  return {
    id: `XN-${String(1000 + i)}`,
    type,
    mahalla,
    address: `${mahalla} ko'chasi, ${1 + (i % 50)}-uy`,
    status,
    org: ORG,
    createdDate: created.toISOString().slice(0, 10),
    slaHours,
    overdue,
    // foto (real ko'rinish — grayscale)
    photo: `https://loremflickr.com/200/140/street,city?lock=${seed * 9}`,
  };
});

export const reportsSummary = (() => {
  const total = CITIZEN_REPORTS.length;
  const confirmed = CITIZEN_REPORTS.filter((r) => r.status === "confirmed").length;
  const active = CITIZEN_REPORTS.filter((r) => r.status === "new" || r.status === "assigned" || r.status === "fixed").length;
  const overdue = CITIZEN_REPORTS.filter((r) => r.overdue).length;
  const resolvedSla = CITIZEN_REPORTS.filter((r) => r.slaHours != null);
  const avgSla = resolvedSla.length ? Math.round(resolvedSla.reduce((s, r) => s + r.slaHours, 0) / resolvedSla.length) : 0;
  return {
    total, confirmed, active, overdue, avgSla,
    confirmedPct: Math.round((confirmed / total) * 100),
  };
})();

// Tur bo'yicha
export const REPORTS_BY_TYPE = TYPES.map((key) => ({
  key,
  value: CITIZEN_REPORTS.filter((r) => r.type === key).length,
}));
