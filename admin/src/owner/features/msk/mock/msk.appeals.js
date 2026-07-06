// MSK arizalari — 460 ta (oyiga ~38), 12 oy tarix, to'liq maydonlar. Seedlangan PRNG => barqaror.
import { CATEGORIES, CAT, seasonCoeff, STREETS, WORKERS, workersFor } from "./msk.data";
import { pickDescription } from "./msk.descriptions";

const REF = new Date(2026, 5, 24); // 24-iyun 2026 (barqaror demo nuqtasi)
const DAY = 86400000;

const F_NAMES = ["Dilnoza", "Feruza", "Gulnora", "Iroda", "Kamola", "Madina", "Nargiza", "Ozoda", "Rayhona", "Sevara", "Zilola", "Munira"];
const M_NAMES = ["Akmal", "Bekzod", "Davron", "Eldor", "Farrux", "Hasan", "Islom", "Jasur", "Kamol", "Nodir", "Otabek", "Rustam", "Sardor", "Temur"];
const SURNAMES = ["Karimov", "Yusupov", "Toshmatov", "Ergashev", "Sharipov", "Qodirov", "Islomov", "Abdullayev", "Nazarov", "Rahimov"];
const SOURCES = ["mobil_ilova", "mobil_ilova", "call_markaz", "call_markaz", "mfy_rais", "veb"];
const PRIORITIES = ["past", "orta", "orta", "orta", "yuqori", "yuqori", "shoshilinch"];

// Xizmatlarning umumiy mashhurligi (mavsumdan tashqari)
const BASE_POP = {
  santexnik: 1.6, elektrik: 1.5, uy_tozalash: 1.3, tamirlash: 1.3, ariq_tozalash: 1.1,
  qor_tozalash: 1.0, suv_quvur_tamiri: 1.0, chiroq_ornatish: 0.95, boyoq_ishlari: 0.9,
  qulflash: 0.85, obodonlashtirish: 0.85, daraxt_kesish: 0.8, issiqlik_tizimi: 0.85,
  devor_suvoq: 0.7, tom_yopish: 0.65, payvandlash: 0.6, metall_konstruksiya: 0.5, kichik_qurilish: 0.45,
};

const rng = (seed) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const pickWeighted = (entries, r) => {
  const total = entries.reduce((s, e) => s + e[1], 0);
  let x = r * total;
  for (const [val, w] of entries) {
    x -= w;
    if (x <= 0) return val;
  }
  return entries[entries.length - 1][0];
};

// Yosh — 30-50 cho'qqi (ikki random o'rtachasi)
const ageOf = (r1, r2) => Math.round(18 + ((r1 + r2) / 2) * 64);

const months = [];
for (let k = 11; k >= 0; k--) {
  const d = new Date(REF.getFullYear(), REF.getMonth() - k, 1);
  months.push({ y: d.getFullYear(), m: d.getMonth() });
}

const statusFor = (ageDays, r) => {
  if (ageDays < 4) return pickWeighted([["yangi", 5], ["tayinlandi", 3], ["jarayonda", 2]], r);
  if (ageDays < 12) return pickWeighted([["jarayonda", 4], ["tayinlandi", 2], ["bajarildi", 3], ["kechikkan", 1], ["yangi", 1]], r);
  // Kanonik: hal qilinganlar ~61%
  return pickWeighted([["bajarildi", 62], ["bekor", 15], ["kechikkan", 8], ["jarayonda", 9], ["tayinlandi", 4], ["yangi", 2]], r);
};

const build = () => {
  const r = rng(880624);
  const out = [];
  const TOTAL = 460;
  const seq = {};

  // Oylik hajm og'irligi (mavsumiy)
  const monthW = months.map((mo) =>
    [mo, CATEGORIES.reduce((s, c) => s + BASE_POP[c.key] * seasonCoeff(c.key, mo.m), 0)],
  );

  for (let i = 0; i < TOTAL; i++) {
    const mo = pickWeighted(monthW, r());
    const catKey = pickWeighted(
      CATEGORIES.map((c) => [c.key, BASE_POP[c.key] * seasonCoeff(c.key, mo.m)]),
      r(),
    );
    const c = CAT[catKey];

    // Sana shu oy ichida
    const isCurrent = mo.y === REF.getFullYear() && mo.m === REF.getMonth();
    const maxDay = isCurrent ? REF.getDate() : new Date(mo.y, mo.m + 1, 0).getDate();
    const day = 1 + Math.floor(r() * maxDay);
    const createdAt = new Date(mo.y, mo.m, day, 8 + Math.floor(r() * 11), Math.floor(r() * 60));
    const ageDays = Math.max(0, (REF - createdAt) / DAY);

    const status = statusFor(ageDays, r());
    const gender = r() < c.femaleBias ? "ayol" : "erkak";
    const first = gender === "ayol" ? F_NAMES[Math.floor(r() * F_NAMES.length)] : M_NAMES[Math.floor(r() * M_NAMES.length)];
    const applicant = {
      name: `${first} ${SURNAMES[Math.floor(r() * SURNAMES.length)]}`,
      gender,
      age: ageOf(r(), r()),
      phone: `+998 9${Math.floor(r() * 9)} ${100 + Math.floor(r() * 900)} ${10 + Math.floor(r() * 90)} ${10 + Math.floor(r() * 90)}`,
    };

    const assigned = status !== "yangi" && status !== "bekor";
    const pool = workersFor(catKey);
    const worker = assigned && pool.length ? pool[Math.floor(r() * pool.length)] : null;
    const assignedAt = assigned ? new Date(createdAt.getTime() + (0.2 + r() * 1.8) * DAY) : null;
    const slaHours = Math.max(24, c.durH * 3 + 24);
    const deadline = assignedAt ? new Date(assignedAt.getTime() + slaHours * 3600000 + r() * 2 * DAY) : null;

    let completedAt = null;
    let durationH = null;
    let slaMet = null;
    if (status === "bajarildi") {
      durationH = Math.round(c.durH * (0.6 + r() * 1.2));
      completedAt = new Date(assignedAt.getTime() + (0.3 + r() * 2.2) * DAY);
      slaMet = completedAt <= deadline;
    } else if (status === "kechikkan") {
      slaMet = false; // muddati o'tgan, hali yopilmagan
    }

    const cost = ["tayinlandi", "jarayonda", "bajarildi", "kechikkan"].includes(status)
      ? Math.round((c.cost[0] + r() * (c.cost[1] - c.cost[0])) / 10000) * 10000
      : null;
    const rating = status === "bajarildi" ? pickWeighted([[5, 5], [4, 4], [3, 2], [2, 1], [1, 1]], r()) : null;

    const year = createdAt.getFullYear();
    seq[year] = (seq[year] || 0) + 1;

    // Timeline
    const events = [{ at: createdAt.toISOString(), type: "yangi", note: "Ariza qabul qilindi" }];
    if (assigned) {
      events.push({ at: assignedAt.toISOString(), type: "tayinlandi", note: `${worker.name} (${c.label}) tayinlandi` });
      if (["jarayonda", "bajarildi", "kechikkan"].includes(status)) {
        events.push({ at: new Date(assignedAt.getTime() + 2 * 3600000).toISOString(), type: "jarayonda", note: "Ish boshlandi" });
      }
      if (status === "bajarildi") events.push({ at: completedAt.toISOString(), type: "bajarildi", note: `Ish yakunlandi, fuqaro bahosi: ${rating}★` });
      if (status === "kechikkan") events.push({ at: deadline.toISOString(), type: "kechikkan", note: "Ijro muddati o'tib ketdi" });
    }
    if (status === "bekor") events.push({ at: new Date(createdAt.getTime() + DAY).toISOString(), type: "bekor", note: "Ariza bekor qilindi" });

    out.push({
      id: `msk_${String(i + 1).padStart(4, "0")}`,
      appealNumber: `MSK-${year}-${String(seq[year]).padStart(5, "0")}`,
      createdAt: createdAt.toISOString(),
      status,
      category: catKey,
      priority: PRIORITIES[Math.floor(r() * PRIORITIES.length)],
      description: pickDescription(catKey, r()),
      applicant,
      address: { mahalla: "Sarnovul MFY", street: STREETS[Math.floor(r() * STREETS.length)], house: `${1 + Math.floor(r() * 140)}${r() < 0.2 ? "/" + (1 + Math.floor(r() * 4)) : ""}` },
      assignedWorker: worker ? { id: worker.id, name: worker.name, gender: worker.gender, specialty: c.label } : null,
      assignedAt: assignedAt ? assignedAt.toISOString() : null,
      deadline: deadline ? deadline.toISOString() : null,
      completedAt: completedAt ? completedAt.toISOString() : null,
      durationH,
      slaMet,
      costUzs: cost,
      rating,
      source: SOURCES[Math.floor(r() * SOURCES.length)],
      events,
    });
  }

  return out.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const APPEALS = build();
export const WORKERS_REF = WORKERS;
