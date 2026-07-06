// Balon yetkazib berish yozuvlari — 12 oy, kanonik oylik seriya bo'yicha aniq taqsimlanadi.
import { STREETS, REF, SUPPLIERS } from "./gaz.data";

// Kanonik oylik yetkazilgan balon (iyul 2025 → iyun 2026)
const TARGETS = [1180, 1150, 1230, 1390, 1560, 1710, 1740, 1620, 1450, 1330, 1270, 1254];

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Holatga qarab yetkazish natijasi (balon yetkazilgan reyslar uchun)
const outcome = (status, r) => {
  const x = r();
  if (status === "yashil") return x < 0.92 ? "yetkazildi" : "kechikdi";
  if (status === "sariq") return x < 0.68 ? "yetkazildi" : "kechikdi";
  return x < 0.45 ? "yetkazildi" : "kechikdi"; // qizil
};

const build = () => {
  const r = rng(771203);
  const out = [];
  let n = 0;
  const balon = STREETS.filter((s) => s.cylindersPerMonth > 0);
  const total = balon.reduce((a, s) => a + s.cylindersPerMonth, 0);

  TARGETS.forEach((target, i) => {
    const m = new Date(REF.getFullYear(), REF.getMonth() - (11 - i), 1);
    const maxDay = i === TARGETS.length - 1 ? REF.getDate() : 28;

    // Oylik yig'indini ko'chalarga ulushiga qarab aniq bo'lish (qoldiq kasrga qarab)
    const raw = balon.map((s) => (target * s.cylindersPerMonth) / total);
    const alloc = raw.map(Math.floor);
    let rem = target - alloc.reduce((a, b) => a + b, 0);
    raw
      .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac)
      .forEach((x) => { if (rem > 0) { alloc[x.idx] += 1; rem -= 1; } });

    balon.forEach((s, si) => {
      const events = Math.max(1, Math.round(30 / s.deliveryCycleDays));
      const base = Math.floor(alloc[si] / events);
      const extra = alloc[si] - base * events;

      for (let j = 0; j < events; j++) {
        const cyl = base + (j < extra ? 1 : 0);
        const day = Math.max(1, Math.min(maxDay, Math.round(((j + 1) * maxDay) / (events + 1)) + Math.floor(r() * 4) - 1));
        n += 1;
        out.push({
          id: `dlv_${String(n).padStart(4, "0")}`,
          streetId: s.id,
          date: new Date(m.getFullYear(), m.getMonth(), day, 9 + Math.floor(r() * 8)).toISOString(),
          cylinders: cyl,
          supplierId: s.supplierId || SUPPLIERS[3].id,
          status: outcome(s.status, r),
        });
      }

      // Muammoli ko'chalarda yetkazilmagan reys (0 balon — yig'indini buzmaydi)
      if ((s.status === "qizil" && r() < 0.85) || (s.status === "sariq" && r() < 0.35)) {
        n += 1;
        out.push({
          id: `dlv_${String(n).padStart(4, "0")}`,
          streetId: s.id,
          date: new Date(m.getFullYear(), m.getMonth(), Math.min(maxDay, 24), 10 + Math.floor(r() * 6)).toISOString(),
          cylinders: 0,
          supplierId: s.supplierId || SUPPLIERS[3].id,
          status: "yetkazilmadi",
        });
      }
    });
  });
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const DELIVERIES = build();
