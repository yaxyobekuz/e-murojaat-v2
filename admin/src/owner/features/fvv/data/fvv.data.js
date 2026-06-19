// FVV moduli — demo seed + selektorlar (frontend). Keyin backendga ulanadi.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(112430);
const pick = (a) => a[Math.floor(rand() * a.length)];
const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const round = (n, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
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
    const incidents30 = ri(20, 90);
    const active = ri(0, 6);
    const avgResponse = ri(6, 15);
    const vehiclesTotal = ri(5, 12);
    const vehiclesActive = ri(0, vehiclesTotal);
    const readiness = round((vehiclesActive / vehiclesTotal) * 100);
    const responseScore = clamp(100 - (avgResponse - 10) * 6, 0, 100);
    const resolution = ri(70, 96);
    const readinessScore = readiness;
    const prevention = ri(50, 95);
    const rating = round(
      responseScore * 0.35 + resolution * 0.25 + readinessScore * 0.22 + prevention * 0.18,
    );
    out.push({
      id: `runit-${String(i + 1).padStart(2, "0")}`,
      name: `${region} yong'in-qutqaruv qismi`,
      region,
      incidents30,
      active,
      avgResponse,
      vehiclesTotal,
      vehiclesActive,
      readiness,
      rating,
    });
  }
  return out;
}

const UNITS = makeUnits();

const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

export const fvvData = {
  units: UNITS,

  kpis() {
    const activeIncidents = UNITS.reduce((s, u) => s + u.active, 0);
    const vehiclesActive = UNITS.reduce((s, u) => s + u.vehiclesActive, 0);
    const vehiclesTotal = UNITS.reduce((s, u) => s + u.vehiclesTotal, 0);
    const avgResponse = round(
      UNITS.reduce((s, u) => s + u.avgResponse, 0) / UNITS.length,
      1,
    );
    return {
      totalUnits: UNITS.length,
      activeIncidents,
      todayIncidents: ri(8, 26),
      avgResponse,
      compliance: ri(70, 92),
      todayResolved: ri(5, 22),
      rescued30: ri(40, 160),
      injured30: ri(10, 70),
      vehiclesActive,
      vehiclesTotal,
      trainingPct: ri(60, 95),
    };
  },

  trend() {
    const r = mulberry32(31);
    return MONTHS.map((label) => ({ label, value: round(40 + r() * 60) }));
  },

  typeDistribution() {
    return [
      { name: "Yong'in", value: ri(40, 90), color: "#1E4FD8" },
      { name: "Qutqaruv", value: ri(30, 70), color: "#2f6bdd" },
      { name: "Tabiiy ofat", value: ri(20, 55), color: "#5b8def" },
      { name: "Texnogen", value: ri(15, 45), color: "#93b4f5" },
      { name: "Tibbiy yordam", value: ri(25, 60), color: "#c2d4fb" },
      { name: "Transport", value: ri(15, 50), color: "#64748b" },
    ];
  },

  topByReadiness(n = 7) {
    return [...UNITS]
      .sort((a, b) => b.readiness - a.readiness)
      .slice(0, n)
      .map((u) => ({ name: u.name.length > 22 ? u.name.slice(0, 22) + "…" : u.name, value: u.readiness }));
  },

  regionBreakdown() {
    const map = new Map();
    for (const u of UNITS) {
      if (!map.has(u.region)) map.set(u.region, 0);
      map.set(u.region, map.get(u.region) + u.incidents30);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  },
};
