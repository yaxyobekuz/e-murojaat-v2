// Grant / ish o'rni kuzatuvi — Sarnovul MFY yoshlariga ajratilgan grant va ish o'rinlari oqimi.
// Asos: Yoshlar agentligi grant dasturlari (mahalla masshtabida, ~20 ariza / 12 oy).
// Demo — deterministik, mavjud MAHALLAS dan.
import { MAHALLAS } from "./youth.data";

const rng = (seed) => {
  const x = Math.sin(seed * 59.7 + 31.3) * 43758.5453;
  return x - Math.floor(x);
};

// Grant turi
export const GRANT_TYPE = {
  startup: { label: "Startap granti", color: "#34d399" },
  agro: { label: "Agro subsidiya", color: "#84cc16" },
  craft: { label: "Hunarmandchilik", color: "#f59e0b" },
  it: { label: "IT tashabbus", color: "#22d3ee" },
  social: { label: "Ijtimoiy loyiha", color: "#a78bfa" },
};

// Ariza holati (oqim)
export const GRANT_STATUS = {
  new: { label: "Yangi ariza", tone: "new" },
  review: { label: "Ko'rib chiqilmoqda", tone: "progress" },
  approved: { label: "Berildi", tone: "done" },
  rejected: { label: "Rad etildi", tone: "danger" },
};

const NAMES = ["Akmal K.", "Diyor Y.", "Nilufar R.", "Sardor T.", "Madina E.", "Bekzod Q.", "Sevara S.", "Jasur N.", "Gulnoza A.", "Doston Y."];
const TYPES = ["startup", "agro", "craft", "it", "social"];
const STATUSES = ["approved", "approved", "review", "new", "rejected"];

const TODAY = new Date("2026-06-24");
let counter = 0;

export const GRANTS = MAHALLAS.flatMap((m, mi) => {
  const sample = 1 + Math.floor(rng(mi * 3.1) * 2); // 1-2 ariza/ko'cha
  return Array.from({ length: sample }, (_, k) => {
    counter += 1;
    const seed = counter * 2.3 + k;
    const type = TYPES[Math.floor(rng(seed * 2.7) * TYPES.length)];
    const status = STATUSES[Math.floor(rng(seed * 3.8) * STATUSES.length)];
    // summa (so'm) — tur bo'yicha
    const base = { startup: 50_000_000, agro: 30_000_000, craft: 15_000_000, it: 40_000_000, social: 20_000_000 }[type];
    const amount = Math.round((base * (0.6 + rng(seed * 4.9) * 0.8)) / 1_000_000) * 1_000_000;
    const days = Math.floor(rng(seed * 5.1) * 250);
    const date = new Date(TODAY);
    date.setDate(TODAY.getDate() - days);
    // berilgan bo'lsa — ish o'rni soni
    const jobs = status === "approved" ? 1 + Math.floor(rng(seed * 6.2) * 3) : 0;

    return {
      id: `GR-${String(counter).padStart(4, "0")}`,
      applicant: NAMES[Math.floor(rng(seed * 7.3) * NAMES.length)],
      mahalla: m.shortName,
      type,
      status,
      amount: status === "approved" ? amount : status === "rejected" ? 0 : amount,
      jobs,
      date: date.toISOString().slice(0, 10),
    };
  });
});

export const grantsSummary = (() => {
  const total = GRANTS.length;
  const approved = GRANTS.filter((g) => g.status === "approved");
  const review = GRANTS.filter((g) => g.status === "new" || g.status === "review").length;
  const totalAmount = approved.reduce((s, g) => s + g.amount, 0);
  const totalJobs = approved.reduce((s, g) => s + g.jobs, 0);
  return {
    total,
    approved: approved.length,
    review,
    approvedPct: Math.round((approved.length / total) * 100),
    totalAmount,
    totalJobs,
  };
})();

// Tur bo'yicha donut
export const GRANTS_BY_TYPE = Object.keys(GRANT_TYPE).map((key) => ({
  key,
  value: GRANTS.filter((g) => g.type === key).length,
}));
