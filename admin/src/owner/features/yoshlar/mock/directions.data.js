// Yoshlar agentligi yo'nalishlari — real davlat dasturlari asosida (demo, deterministik).
// Manba: yoshlar.gov.uz, Yoshlar agentligi vazifalari, 2024-2025 davlat dasturlari.
// Ikonlar — lucide (UI), emoji emas.
import {
  Leaf, Stethoscope, BookOpen, Siren, Theater, Medal, Laptop, BookMarked, UserRound,
  Music, Palette, PenLine, Drama, FlaskConical, Trophy, Tractor, Factory, Rocket,
  PartyPopper, Dumbbell, Microscope, Megaphone, Briefcase, Accessibility, HandHeart, Award,
} from "lucide-react";

const rng = (seed) => {
  const x = Math.sin(seed * 51.3 + 27.7) * 43758.5453;
  return x - Math.floor(x);
};

// ───────── 1. VOLONTYORLIK ─────────
export const VOLUNTEER_FIELDS = [
  { key: "eco", label: "Ekologiya", icon: Leaf, color: "#22c55e", count: 38400 },
  { key: "med", label: "Tibbiy xizmat", icon: Stethoscope, color: "#ef4444", count: 24700 },
  { key: "edu", label: "Ta'lim", icon: BookOpen, color: "#3b82f6", count: 21900 },
  { key: "fvv", label: "Favqulodda", icon: Siren, color: "#f59e0b", count: 16800 },
];
export const volunteerSummary = (() => {
  const total = VOLUNTEER_FIELDS.reduce((s, f) => s + f.count, 0);
  return { total, growth: 5, fields: VOLUNTEER_FIELDS.length };
})();

// ───────── 2. BESHTA TASHABBUS ─────────
export const FIVE_INITIATIVES = [
  { key: "culture", label: "Madaniyat va san'at", icon: Theater, color: "#a78bfa", reach: 1_240_000, target: 1_500_000 },
  { key: "sport", label: "Sport", icon: Medal, color: "#fbbf24", reach: 2_180_000, target: 2_500_000 },
  { key: "it", label: "IT savodxonlik", icon: Laptop, color: "#22d3ee", reach: 940_000, target: 1_200_000 },
  { key: "book", label: "Kitobxonlik", icon: BookMarked, color: "#34d399", reach: 1_560_000, target: 1_800_000 },
  { key: "women", label: "Xotin-qizlar bandligi", icon: UserRound, color: "#f472b6", reach: 410_000, target: 600_000 },
];

// ───────── 3. YOSHLAR PARLAMENTI ─────────
export const PARLIAMENT = {
  seats: 36,
  filled: 32,
  initiatives: 148,
  adopted: 57,
  factions: [
    { label: "Ta'lim", count: 9, color: "#3b82f6" },
    { label: "Bandlik", count: 8, color: "#34d399" },
    { label: "Ekologiya", count: 6, color: "#22c55e" },
    { label: "Madaniyat", count: 5, color: "#a78bfa" },
    { label: "Sport", count: 4, color: "#fbbf24" },
  ],
};

// ───────── 4. IQTIDORLI YOSHLAR REESTRI ─────────
export const TALENT_DOMAINS = [
  { key: "music", label: "Musiqa", icon: Music, color: "#a78bfa" },
  { key: "art", label: "Rassomlik", icon: Palette, color: "#f472b6" },
  { key: "lit", label: "Adabiyot", icon: PenLine, color: "#22d3ee" },
  { key: "theatre", label: "Teatr", icon: Drama, color: "#fbbf24" },
  { key: "science", label: "Fan", icon: FlaskConical, color: "#34d399" },
  { key: "sport", label: "Sport", icon: Trophy, color: "#ef4444" },
];
export const TALENT_STARS = Array.from({ length: 72 }, (_, i) => {
  const seed = i + 1;
  const d = TALENT_DOMAINS[i % TALENT_DOMAINS.length];
  return {
    id: i,
    domain: d.key,
    color: d.color,
    x: Math.round(6 + rng(seed * 2.1) * 88),
    y: Math.round(8 + rng(seed * 3.3) * 84),
    size: 0.9 + rng(seed * 4.4) * 1.3,
    delay: rng(seed * 5.5) * 3,
    bright: rng(seed * 6.6) > 0.72,
  };
});
export const talentSummary = (() => ({
  total: TALENT_STARS.length * 47,
  domains: TALENT_DOMAINS.length,
  byDomain: TALENT_DOMAINS.map((d) => ({ ...d, count: TALENT_STARS.filter((s) => s.domain === d.key).length * 47 })),
}))();

// ───────── 5. TADBIRKORLIK KREDITLARI ─────────
export const CREDIT_TIERS = [
  { key: "self", label: "O'z-o'zini band qilish", max: 300_000_000, unit: "so'm", count: 8400, color: "#34d399", icon: Tractor },
  { key: "project", label: "Yosh tadbirkor loyihasi", max: 10_000_000_000, unit: "so'm", count: 1240, color: "#f59e0b", icon: Factory },
  { key: "startup", label: "Innovatsion startap", max: 100_000, unit: "$", count: 86, color: "#22d3ee", icon: Rocket },
];
export const creditSummary = (() => {
  const total = 8400 * 120_000_000 + 1240 * 2_400_000_000 + 86 * 1_200_000_000;
  return { totalUzs: total, beneficiaries: 8400 + 1240 + 86 };
})();

// ───────── 6. DOLZARB 90 KUN ─────────
export const DOLZARB = {
  target: 7_000_000,
  reached: 4_820_000,
  daysTotal: 90,
  daysPassed: 62,
  activities: [
    { label: "Madaniy tadbirlar", count: 18400, icon: PartyPopper, color: "#a78bfa" },
    { label: "Sport musobaqalari", count: 12600, icon: Dumbbell, color: "#fbbf24" },
    { label: "Ilmiy to'garaklar", count: 8900, icon: Microscope, color: "#34d399" },
    { label: "Ma'rifiy uchrashuvlar", count: 15200, icon: Megaphone, color: "#22d3ee" },
  ],
};

// ───────── 7. NOGIRON YOSHLAR ─────────
export const DISABLED_YOUTH = {
  total: 3200,
  measures: [
    { key: "job", label: "Ish o'rni (kvota)", value: 1180, icon: Briefcase, color: "#34d399" },
    { key: "rehab", label: "Reabilitatsiya", value: 2040, icon: Accessibility, color: "#22d3ee" },
    { key: "social", label: "Ijtimoiy xizmat", value: 2680, icon: HandHeart, color: "#a78bfa" },
    { key: "sport", label: "Sport / madaniyat", value: 940, icon: Award, color: "#fbbf24" },
  ],
};
