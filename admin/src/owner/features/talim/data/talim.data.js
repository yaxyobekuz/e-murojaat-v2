// Ta'lim moduli — demo seed + selektorlar (frontend). Keyin backendga ulanadi.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260619);
const pick = (a) => a[Math.floor(rand() * a.length)];
const ri = (min, max) => Math.floor(rand() * (max - min + 1)) + min;
const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

const TUMANS = [
  "Andijon shahri", "Asaka tumani", "Shahrixon tumani", "Baliqchi tumani",
  "Buloqboshi tumani", "Izboskan tumani", "Marhamat tumani", "Xo'jaobod tumani",
  "Paxtaobod tumani", "Qo'rg'ontepa tumani", "Oltinko'l tumani", "Jalaquduq tumani",
];
const TYPES = [
  { key: "school", label: "Maktab" },
  { key: "kindergarten", label: "Bog'cha" },
  { key: "private_school", label: "Xususiy maktab" },
];

function makeInstitutions() {
  const out = [];
  const plan = [...Array(10).fill("school"), ...Array(6).fill("kindergarten"), ...Array(4).fill("private_school")];
  plan.forEach((type, i) => {
    const region = pick(TUMANS);
    const students = type === "kindergarten" ? ri(120, 280) : ri(420, 1100);
    const rate = round(78 + rand() * 19);
    const presentToday = Math.round((students * rate) / 100);
    const commission = ri(60, 98);
    const security = ri(58, 99);
    const ratingTotal = round(rate * 0.5 + commission * 0.3 + security * 0.2);
    const name =
      type === "school" ? `${ri(1, 64)}-son umumiy o'rta ta'lim maktabi`
      : type === "kindergarten" ? `${ri(1, 220)}-son "${pick(["Quyoshcha", "Kapalak", "Bolajon", "Lola", "Umid"]) }" bog'chasi`
      : `"${pick(["Bilim", "Tafakkur", "Kelajak", "Ziyo", "Iqtidor"]) }" xususiy maktabi`;
    out.push({
      id: `inst-${String(i + 1).padStart(2, "0")}`,
      type,
      typeLabel: TYPES.find((t) => t.key === type).label,
      name,
      region,
      students,
      presentToday,
      absentToday: students - presentToday,
      attendanceRate: rate,
      commission,
      security,
      rating: ratingTotal,
    });
  });
  return out;
}

const INSTITUTIONS = makeInstitutions();

const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];

export const talimData = {
  institutions: INSTITUTIONS,

  kpis() {
    const totalStudents = INSTITUTIONS.reduce((s, i) => s + i.students, 0);
    const present = INSTITUTIONS.reduce((s, i) => s + i.presentToday, 0);
    const absent = INSTITUTIONS.reduce((s, i) => s + i.absentToday, 0);
    const avgRate = round(INSTITUTIONS.reduce((s, i) => s + i.attendanceRate, 0) / INSTITUTIONS.length);
    return {
      totalInstitutions: INSTITUTIONS.length,
      schools: INSTITUTIONS.filter((i) => i.type === "school").length,
      kindergartens: INSTITUTIONS.filter((i) => i.type === "kindergarten").length,
      privateSchools: INSTITUTIONS.filter((i) => i.type === "private_school").length,
      totalStudents,
      present,
      absent,
      presentPct: round((present / totalStudents) * 100),
      avgRate,
    };
  },

  trend() {
    const r = mulberry32(7);
    return MONTHS.map((label) => ({ label, value: round(82 + r() * 12) }));
  },

  typeDistribution() {
    return [
      { name: "Maktablar", value: INSTITUTIONS.filter((i) => i.type === "school").length, color: "#1E4FD8" },
      { name: "Bog'chalar", value: INSTITUTIONS.filter((i) => i.type === "kindergarten").length, color: "#5b8def" },
      { name: "Xususiy", value: INSTITUTIONS.filter((i) => i.type === "private_school").length, color: "#94a3b8" },
    ];
  },

  topRated(n = 7) {
    return [...INSTITUTIONS]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, n)
      .map((i) => ({ name: i.name.length > 22 ? i.name.slice(0, 22) + "…" : i.name, value: i.rating }));
  },

  regionBreakdown() {
    const map = new Map();
    for (const i of INSTITUTIONS) {
      if (!map.has(i.region)) map.set(i.region, 0);
      map.set(i.region, map.get(i.region) + i.students);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  },
};
