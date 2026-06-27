// Yoshlar Command Center — Sarnovul MFY ichidagi 14 ko'cha bo'yicha realistik mock ma'lumot.
// Deterministik (Math.random YO'Q) — seed asosida, har refresh bir xil.
// AI qatlamlari (risk/opportunity/forecast/migration) shu ma'lumotdan formula bilan hisoblanadi.

// Markaz — Sarnovul MFY, Baliqchi tumani, Andijon (soliq moduli bilan bir hudud)
export const MAP_CENTER = { lat: 40.9034, lng: 71.8604 };
export const PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

const rng = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const MAHALLA_NAMES = [
  "Sarnovul", "Navoiy", "Bobur", "Amir Temur", "Fidokor",
  "Istiqlol", "Do'stlik", "Bog'", "Chinor", "Guliston",
  "Mustaqillik", "Yangi hayot", "Marvarid", "Oqtepa",
];

// 14 ko'cha — Sarnovul MFY ichida, ixcham grid (markaz atrofida)
const ORIGIN = { lat: 40.9070, lng: 71.8556 };
const STEP_LAT = 0.0016;
const STEP_LNG = 0.0020;
const COLS = 5;

// Talant turlari (Talent Map uchun)
export const TALENT_TYPES = {
  programmer: { key: "programmer", label: "Dasturchi", color: "#22d3ee", glyph: "💻" },
  designer: { key: "designer", label: "Dizayner", color: "#a78bfa", glyph: "🎨" },
  entrepreneur: { key: "entrepreneur", label: "Tadbirkor", color: "#34d399", glyph: "🚀" },
  athlete: { key: "athlete", label: "Sportchi", color: "#fbbf24", glyph: "🏅" },
};

// Yoshlar darajasi (score) -> holat va rang
export const SCORE_TIERS = {
  high: { key: "high", label: "Yuqori salohiyat", color: "#22c55e", glow: "34,197,94" },
  mid: { key: "mid", label: "Barqaror", color: "#06b6d4", glow: "6,182,212" },
  low: { key: "low", label: "E'tibor talab", color: "#f59e0b", glow: "245,158,11" },
  risk: { key: "risk", label: "Risk zonasi", color: "#ef4444", glow: "239,68,68" },
};

export const tierOfScore = (score) => {
  if (score >= 75) return "high";
  if (score >= 60) return "mid";
  if (score >= 45) return "low";
  return "risk";
};

const buildMahallas = () => {
  return MAHALLA_NAMES.map((name, i) => {
    const seed = i + 1;
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const lat = ORIGIN.lat - row * STEP_LAT + (rng(seed * 2.3) - 0.5) * 0.0004;
    const lng = ORIGIN.lng + col * STEP_LNG + (rng(seed * 3.1) - 0.5) * 0.0004;

    // aholi va yoshlar — ko'cha darajasida (Sarnovul MFY ichidagi bitta ko'cha)
    const population = 320 + Math.round(rng(seed * 1.7) * 680); // 320..1000
    const youth = Math.round(population * (0.28 + rng(seed * 4.4) * 0.12)); // ~28-40%

    // taqsimotlar (yig'indi youthга yaqin)
    const students = Math.round(youth * (0.26 + rng(seed * 5.1) * 0.14));
    const entrepreneurs = Math.round(youth * (0.04 + rng(seed * 6.3) * 0.06));
    const itLearners = Math.round(youth * (0.06 + rng(seed * 7.7) * 0.1));
    const langLearners = Math.round(youth * (0.08 + rng(seed * 8.9) * 0.1));
    const unemployed = Math.round(youth * (0.08 + rng(seed * 9.5) * 0.16)); // 8-24%
    const migration = Math.round(youth * (0.03 + rng(seed * 10.2) * 0.09));
    const talented = Math.round(youth * (0.05 + rng(seed * 11.4) * 0.08));
    const riskGroup = Math.round(youth * (0.02 + rng(seed * 12.6) * 0.07));
    const notebook = Math.round((unemployed + riskGroup) * (0.7 + rng(seed * 13.1) * 0.5)); // Yoshlar daftari

    // Youth Score (0-100) — ko'p omildan
    const empRate = 1 - unemployed / youth;
    const eduRate = (students + itLearners + langLearners) / youth;
    const riskPenalty = (riskGroup + migration) / youth;
    const rawScore = empRate * 45 + Math.min(eduRate, 1) * 35 + (talented / youth) * 40 - riskPenalty * 60;
    const score = Math.max(18, Math.min(98, Math.round(rawScore + 30)));

    // Talantlar (Talent Map nuqtalari)
    const talents = [];
    const tKeys = Object.keys(TALENT_TYPES);
    const tCount = 2 + Math.floor(rng(seed * 14.3) * 4);
    for (let t = 0; t < tCount; t++) {
      const key = tKeys[Math.floor(rng(seed * (t + 1) * 1.9) * tKeys.length)];
      talents.push({
        key,
        count: 3 + Math.floor(rng(seed * (t + 2) * 2.7) * 30),
      });
    }

    return {
      id: `mahalla-${String(i + 1).padStart(2, "0")}`,
      name: `${name} ko'chasi`,
      shortName: name,
      lat,
      lng,
      population,
      youth,
      students,
      entrepreneurs,
      itLearners,
      langLearners,
      unemployed,
      migration,
      talented,
      riskGroup,
      notebook,
      score,
      talents,
    };
  });
};

export const MAHALLAS = buildMahallas();

// --- AI qatlamlari (deterministik formula — real LLM emas, demo) ---

// AI Risk Detection — risk darajasi (0-100, yuqori = xavfli)
export const aiRiskScore = (m) => {
  const unempRate = m.unemployed / m.youth;
  const riskRate = m.riskGroup / m.youth;
  const migRate = m.migration / m.youth;
  return Math.round(Math.min(100, unempRate * 120 + riskRate * 180 + migRate * 80));
};

// AI Opportunity Score — imkoniyat indeksi (0-100, yuqori = ko'p imkoniyat)
export const aiOpportunityScore = (m) => {
  const eduRate = (m.students + m.itLearners + m.langLearners) / m.youth;
  const entRate = m.entrepreneurs / m.youth;
  const talentRate = m.talented / m.youth;
  return Math.round(Math.min(100, eduRate * 55 + entRate * 220 + talentRate * 160 + 12));
};

// AI Employment Forecast — kelgusi 6 oyda bandlik prognozi (%)
export const aiEmploymentForecast = (m) => {
  const base = (1 - m.unemployed / m.youth) * 100;
  const lift = aiOpportunityScore(m) / 14; // imkoniyat ko'p -> tezroq o'sish
  return Math.round(Math.min(99, base + lift));
};

// AI Migration Analysis — migratsiya bosimi (past/o'rta/yuqori)
export const aiMigrationLevel = (m) => {
  const rate = m.migration / m.youth;
  if (rate > 0.08) return { level: "Yuqori", tone: "danger", value: Math.round(rate * 100) };
  if (rate > 0.05) return { level: "O'rta", tone: "progress", value: Math.round(rate * 100) };
  return { level: "Past", tone: "done", value: Math.round(rate * 100) };
};

// AI Career Recommendation — mahalla profiliga mos yo'nalish
export const aiCareerRecommendation = (m) => {
  const ops = [
    { cond: m.itLearners / m.youth > 0.12, text: "IT bootcamp + masofaviy ish (yuqori IT qiziqishi)" },
    { cond: m.entrepreneurs / m.youth > 0.07, text: "Startap grant + tadbirkorlik akseleratori" },
    { cond: m.unemployed / m.youth > 0.18, text: "Kasb-hunar kurslari + ish bilan ta'minlash dasturi" },
    { cond: m.langLearners / m.youth > 0.14, text: "Xalqaro til sertifikati + chet el ta'lim granti" },
    { cond: true, text: "Aralash dastur: ta'lim + amaliyot + mentorlik" },
  ];
  return ops.find((o) => o.cond).text;
};

// --- KPI yig'indilari (10 ta asosiy ko'rsatkich) ---
export const youthTotals = (list = MAHALLAS) =>
  list.reduce(
    (s, m) => {
      s.population += m.population;
      s.youth += m.youth;
      s.notebook += m.notebook;
      s.unemployed += m.unemployed;
      s.students += m.students;
      s.entrepreneurs += m.entrepreneurs;
      s.itLearners += m.itLearners;
      s.langLearners += m.langLearners;
      s.migration += m.migration;
      s.talented += m.talented;
      s.riskGroup += m.riskGroup;
      return s;
    },
    {
      population: 0, youth: 0, notebook: 0, unemployed: 0, students: 0,
      entrepreneurs: 0, itLearners: 0, langLearners: 0, migration: 0,
      talented: 0, riskGroup: 0,
    },
  );

// Radar uchun — mahalla yoki umumiy profil (0-100 normallashtirilgan 6 o'q)
export const radarProfile = (m) => {
  const denom = m ? m.youth : youthTotals().youth;
  const src = m || youthTotals();
  return [
    { axis: "Bandlik", value: Math.round((1 - src.unemployed / denom) * 100) },
    { axis: "Ta'lim", value: Math.round(Math.min(100, (src.students / denom) * 260)) },
    { axis: "IT", value: Math.round(Math.min(100, (src.itLearners / denom) * 520)) },
    { axis: "Tadbirkorlik", value: Math.round(Math.min(100, (src.entrepreneurs / denom) * 700)) },
    { axis: "Til", value: Math.round(Math.min(100, (src.langLearners / denom) * 420)) },
    { axis: "Salohiyat", value: Math.round(Math.min(100, (src.talented / denom) * 600)) },
  ];
};

// Eng muammoli mahallalar (Mission Mode uchun — risk bo'yicha)
export const problematicMahallas = () =>
  [...MAHALLAS].sort((a, b) => aiRiskScore(b) - aiRiskScore(a)).slice(0, 5);

// 2026-2030 prognoz (Future Simulator) — bandlik & score o'sishi
export const futureProjection = (year) => {
  const t = Math.max(0, Math.min(4, year - 2026)); // 0..4
  const base = youthTotals();
  const growth = 1 + t * 0.06;
  return {
    year,
    employmentRate: Math.min(98, Math.round((1 - base.unemployed / base.youth) * 100 + t * 4.5)),
    avgScore: Math.min(95, Math.round(
      MAHALLAS.reduce((s, m) => s + m.score, 0) / MAHALLAS.length + t * 5,
    )),
    entrepreneurs: Math.round(base.entrepreneurs * growth),
    itLearners: Math.round(base.itLearners * (1 + t * 0.14)),
    migration: Math.round(base.migration * (1 - t * 0.08)),
  };
};

// Impact Simulator — N nafar ishsizga ish topilsa iqtisodiy ta'sir
export const impactOfJobs = (n) => {
  const avgSalaryYear = 36_000_000; // so'm/yil (taxminiy)
  const taxRate = 0.12;
  const economicAdd = n * avgSalaryYear;
  return {
    jobs: n,
    economicAdd, // yillik qo'shilgan daromad
    taxAdd: Math.round(economicAdd * taxRate),
    scoreDelta: +(n / youthTotals().unemployed * 18).toFixed(1), // o'rtacha score o'sishi
  };
};
