// Balon yetkazib berish yozuvlari — 12 oy, ko'cha cikli bo'yicha (mavsumiy).
import { STREETS, REF, SUPPLIERS } from "./gaz.data";

const DAY = 86400000;
const seasonF = (m) => [1.45, 1.4, 1.1, 0.85, 0.7, 0.62, 0.6, 0.62, 0.75, 1.0, 1.25, 1.45][m];

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Holatga qarab yetkazish natijasi ehtimoli
const outcome = (status, r) => {
  const x = r();
  if (status === "yashil") return x < 0.92 ? "yetkazildi" : "kechikdi";
  if (status === "sariq") return x < 0.62 ? "yetkazildi" : x < 0.85 ? "kechikdi" : "yetkazilmadi";
  if (status === "qizil") return x < 0.28 ? "yetkazildi" : x < 0.55 ? "kechikdi" : "yetkazilmadi";
  return x < 0.08 ? "kechikdi" : "yetkazilmadi"; // qora
};

const build = () => {
  const r = rng(771203);
  const out = [];
  let n = 0;
  const start = REF.getTime() - 365 * DAY;

  STREETS.forEach((s) => {
    if (!s.deliveryCycleDays) return; // faqat balon/aralash/yoq
    const perDelivery = Math.max(1, Math.round((s.cylindersPerMonth * s.deliveryCycleDays) / 30));
    let t = start;
    while (t <= REF.getTime()) {
      const d = new Date(t);
      const st = outcome(s.status, r);
      const season = seasonF(d.getMonth());
      const cyl = st === "yetkazilmadi" ? 0 : Math.max(1, Math.round(perDelivery * season * (0.85 + r() * 0.3)));
      n += 1;
      out.push({
        id: `dlv_${String(n).padStart(4, "0")}`,
        streetId: s.id,
        date: d.toISOString(),
        cylinders: cyl,
        supplierId: s.supplierId || SUPPLIERS[3].id,
        status: st,
      });
      t += s.deliveryCycleDays * (0.7 + r() * 0.7) * DAY;
    }
  });
  return out.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const DELIVERIES = build();
