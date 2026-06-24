// Yoshlar islohotlari — real davlat dasturlari asosida (demo, deterministik).
// Bandlik, Tashabbusli budjet, El-yurt umidi, Mehribonlik uyi bitiruvchilari.
import { MAHALLAS } from "./youth.data";

const rng = (seed) => {
  const x = Math.sin(seed * 64.9 + 19.3) * 43758.5453;
  return x - Math.floor(x);
};

// ───────── 1. BANDLIK DASTURLARI ─────────
// Asos: "Yoshlar biznesi" (100k yoshga daromad), "Kelajakka qadam" (140k bitiruvchi ish bilan)
export const EMPLOYMENT_PROGRAMS = [
  { key: "biznes", name: "Yoshlar biznesi", desc: "Yoshlarga daromadli ish", target: 100000, reached: 71400, color: "#34d399", icon: "💼" },
  { key: "kelajak", name: "Kelajakka qadam", desc: "Bitiruvchilarni ishga joylash", target: 140000, reached: 98200, color: "#22d3ee", icon: "🎓" },
  { key: "kasb", name: "Kasb-hunar o'rgatish", desc: "Bepul kasbga tayyorlash", target: 60000, reached: 44800, color: "#a78bfa", icon: "🔧" },
  { key: "subsidiya", name: "Tadbirkorlik subsidiyasi", desc: "Startap va biznes granti", target: 25000, reached: 16900, color: "#f59e0b", icon: "🚀" },
];

// Ish o'rni voronkasi (ariza → o'qish → joylashish)
export const EMPLOYMENT_FUNNEL = [
  { stage: "Ro'yxatdan o'tdi", value: 231000, color: "#22d3ee" },
  { stage: "Kasbga o'qitildi", value: 156000, color: "#a78bfa" },
  { stage: "Ish bilan ta'minlandi", value: 98200, color: "#34d399" },
  { stage: "Doimiy ishda", value: 74100, color: "#22c55e" },
];

export const employmentSummary = (() => {
  const target = EMPLOYMENT_PROGRAMS.reduce((s, p) => s + p.target, 0);
  const reached = EMPLOYMENT_PROGRAMS.reduce((s, p) => s + p.reached, 0);
  return { target, reached, pct: Math.round((reached / target) * 100), programs: EMPLOYMENT_PROGRAMS.length };
})();

// ───────── 2. TASHABBUSLI BUDJET (YOSHLAR) ─────────
// Asos: Tashabbusli budjet — yosh g'oyalarini moliyalash
export const YOUTH_INITIATIVES = Array.from({ length: 10 }, (_, i) => {
  const seed = i + 1;
  const TITLES = ["IT-laboratoriya", "Yoshlar kutubxonasi", "Sport zali jihozlari", "Robototexnika to'garagi", "Onlayn kurslar markazi", "Yoshlar teatri", "Startap inkubator", "Til o'rganish klubi", "Ijod ustaxonasi", "Media-studiya"];
  const votes = Math.round(50 + rng(seed * 2.3) * 850);
  const cost = Math.round((30 + rng(seed * 3.4) * 170)) * 1_000_000;
  const status = i < 4 ? "won" : i < 7 ? "voting" : "review";
  return {
    id: `YB-${String(100 + i)}`,
    title: TITLES[i],
    mahalla: MAHALLAS[i % MAHALLAS.length].shortName,
    votes, cost,
    status, // won | voting | review
  };
});

export const initiativeSummary = (() => {
  const won = YOUTH_INITIATIVES.filter((p) => p.status === "won");
  return {
    total: YOUTH_INITIATIVES.length,
    won: won.length,
    totalVotes: YOUTH_INITIATIVES.reduce((s, p) => s + p.votes, 0),
    allocated: won.reduce((s, p) => s + p.cost, 0),
  };
})();

// ───────── 3. EL-YURT UMIDI (CHET EL STIPENDIYASI) ─────────
export const SCHOLARSHIPS = Array.from({ length: 12 }, (_, i) => {
  const seed = i + 1;
  const COUNTRIES = ["AQSH", "Buyuk Britaniya", "Germaniya", "Yaponiya", "Janubiy Koreya", "Singapur", "Italiya", "Fransiya"];
  const FIELDS = ["Muhandislik", "Tibbiyot", "IT", "Iqtisod", "Pedagogika", "Huquq"];
  const NAMES = ["Diyor T.", "Madina E.", "Sardor Q.", "Nilufar R.", "Bekzod Y.", "Sevara A.", "Jasur N.", "Gulnoza S."];
  const status = i < 7 ? "studying" : i < 10 ? "selected" : "applied";
  return {
    id: `EYU-${String(100 + i)}`,
    name: NAMES[i % NAMES.length],
    country: COUNTRIES[i % COUNTRIES.length],
    field: FIELDS[i % FIELDS.length],
    level: rng(seed * 4) > 0.5 ? "Magistratura" : "Bakalavr",
    status, // applied | selected | studying
  };
});

export const scholarshipSummary = (() => {
  const studying = SCHOLARSHIPS.filter((s) => s.status === "studying").length;
  const selected = SCHOLARSHIPS.filter((s) => s.status === "selected").length;
  return { total: SCHOLARSHIPS.length, studying, selected, countries: new Set(SCHOLARSHIPS.map((s) => s.country)).size };
})();

// ───────── 4. MEHRIBONLIK UYI BITIRUVCHILARI ─────────
export const ORPHAN_GRADUATES = Array.from({ length: 10 }, (_, i) => {
  const seed = i + 1;
  const NAMES = ["Akmal K.", "Dilnoza Y.", "Sardor R.", "Madina T.", "Bekzod E.", "Sevara Q.", "Doston N.", "Kamola S.", "Jasur A.", "Ozoda Y."];
  // qo'llab-quvvatlash holatlari
  const housing = rng(seed * 2.1) > 0.4; // uy-joy berilgan
  const job = rng(seed * 3.2) > 0.35; // ish bilan ta'minlangan
  const study = rng(seed * 4.3) > 0.5; // o'qishga kirgan
  const supported = [housing, job, study].filter(Boolean).length;
  return {
    id: `MU-${String(100 + i)}`,
    name: NAMES[i % NAMES.length],
    age: 18 + Math.floor(rng(seed * 5) * 4),
    mahalla: MAHALLAS[i % MAHALLAS.length].shortName,
    housing, job, study,
    status: supported >= 2 ? "full" : supported === 1 ? "partial" : "pending",
  };
});

export const orphanSummary = (() => {
  const housing = ORPHAN_GRADUATES.filter((o) => o.housing).length;
  const job = ORPHAN_GRADUATES.filter((o) => o.job).length;
  const study = ORPHAN_GRADUATES.filter((o) => o.study).length;
  return { total: ORPHAN_GRADUATES.length, housing, job, study };
})();
