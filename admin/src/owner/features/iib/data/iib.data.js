// IIB moduli — demo seed + selektorlar (frontend). Keyin backendga ulanadi.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(770119);
const pick = (a) => a[Math.floor(rand() * a.length)];
const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const TUMANS = [
  "Andijon shahri", "Asaka tumani", "Shahrixon tumani", "Baliqchi tumani",
  "Buloqboshi tumani", "Izboskan tumani", "Marhamat tumani", "Xo'jaobod tumani",
  "Paxtaobod tumani", "Qo'rg'ontepa tumani", "Oltinko'l tumani", "Jalaquduq tumani",
];

function makeUnits() {
  const out = [];
  for (let i = 0; i < 16; i++) {
    const region = pick(TUMANS);
    const crimes30 = ri(30, 160);
    const openCases = ri(8, Math.max(10, Math.round(crimes30 * 0.4)));
    const clearance = round(ri(55, 90));
    const avgResponse = ri(7, 16);
    const trust = ri(55, 95);
    const prevention = ri(50, 95);
    const responseScore = clamp(100 - (avgResponse - 10) * 6, 0, 100);
    const rating = round(clearance * 0.4 + responseScore * 0.25 + trust * 0.2 + prevention * 0.15);
    out.push({
      id: `unit-${String(i + 1).padStart(2, "0")}`,
      name: `${region} IIB bo'limi`,
      region,
      crimes30,
      openCases,
      clearance,
      avgResponse,
      trust,
      prevention,
      rating,
    });
  }
  return out;
}

const UNITS = makeUnits();

const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

export const iibData = {
  units: UNITS,

  kpis() {
    const totalCrimes30 = UNITS.reduce((s, u) => s + u.crimes30, 0);
    const openCases = UNITS.reduce((s, u) => s + u.openCases, 0);
    const clearanceRate = round(UNITS.reduce((s, u) => s + u.clearance, 0) / UNITS.length);
    const avgResponse = round(UNITS.reduce((s, u) => s + u.avgResponse, 0) / UNITS.length);
    const trustIndex = round(UNITS.reduce((s, u) => s + u.trust, 0) / UNITS.length);
    const camerasTotal = ri(2400, 3200);
    const camerasOnline = camerasTotal - ri(40, 220);
    return {
      totalUnits: UNITS.length,
      totalCrimes30,
      clearanceRate,
      avgResponse,
      todayCalls: ri(120, 260),
      openCases,
      accidents30: ri(40, 120),
      camerasOnline,
      camerasTotal,
      trustIndex,
    };
  },

  trend() {
    const r = mulberry32(11);
    return MONTHS.map((label) => ({ label, value: Math.round(30 + r() * 130) }));
  },

  typeDistribution() {
    const r = mulberry32(23);
    const labels = ["O'g'irlik", "Tan jarohati", "Firibgarlik", "Bezorilik", "Kiberjinoyat", "Transport"];
    const colors = ["#1E4FD8", "#2f6bdd", "#5b8def", "#93b4f5", "#c2d4fb", "#64748b"];
    return labels.map((name, i) => ({
      name,
      value: Math.round(40 + r() * 220),
      color: colors[i],
    }));
  },

  topByClearance(n = 7) {
    return [...UNITS]
      .sort((a, b) => b.clearance - a.clearance)
      .slice(0, n)
      .map((u) => ({ name: u.name.length > 22 ? u.name.slice(0, 22) + "…" : u.name, value: u.clearance }));
  },

  regionBreakdown() {
    const map = new Map();
    for (const u of UNITS) {
      if (!map.has(u.region)) map.set(u.region, 0);
      map.set(u.region, map.get(u.region) + u.crimes30);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  },
};
