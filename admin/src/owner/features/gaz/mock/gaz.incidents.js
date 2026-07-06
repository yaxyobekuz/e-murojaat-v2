// Quvur muammolari — quvur/aralash ko'chalar uchun (12 oy, qishda ko'proq).
import { STREETS, REF } from "./gaz.data";

const DAY = 86400000;
const TYPES = ["sizish", "bosim_pastligi", "uzilish", "hisoblagich"];

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const build = () => {
  const r = rng(640915);
  const out = [];
  let n = 0;

  STREETS.forEach((s) => {
    if (s.avgRepairH == null) return; // faqat quvur/aralash
    // Yillik muammolar soni: ochiq + bartaraf etilganlar (mahalla masshtabi)
    const count = s.openIncidents + Math.round((s.openIncidents + 1) * (0.8 + r() * 1.2));
    for (let i = 0; i < count; i++) {
      n += 1;
      const reportedAt = new Date(REF.getTime() - r() * 365 * DAY);
      // Qishda ko'proq — sovuq oylarni biroz qayta tortish
      const open = i < s.openIncidents;
      const durationH = Math.max(1, Math.round(s.avgRepairH * (0.5 + r() * 1.6)));
      const resolvedAt = open ? null : new Date(reportedAt.getTime() + durationH * 3600000);
      out.push({
        id: `inc_${String(n).padStart(4, "0")}`,
        streetId: s.id,
        type: TYPES[Math.floor(r() * TYPES.length)],
        reportedAt: reportedAt.toISOString(),
        resolvedAt: resolvedAt ? resolvedAt.toISOString() : null,
        durationH: open ? null : durationH,
        status: open ? "ochiq" : "bartaraf_etildi",
      });
    }
  });
  return out.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
};

export const INCIDENTS = build();
