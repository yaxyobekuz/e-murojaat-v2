// Yoshlar daftari (reyestr) — Sarnovul MFY da daftar BO'SHATILGAN (hozirda 0 faol).
// Quyidagi yozuvlar — arxiv: chora ko'rilib daftardan chiqarilgan yoshlar tarixi.
// Demo — mavjud MAHALLAS ro'yxatidan generatsiya. Deterministik.
import { MAHALLAS } from "./youth.data";

const rng = (seed) => {
  const x = Math.sin(seed * 71.3 + 17.9) * 43758.5453;
  return x - Math.floor(x);
};

// Yo'nalish (yoshning holati)
export const YOUTH_DIRECTION = {
  unemployed: { label: "Ishsiz", tone: "danger" },
  student: { label: "Talaba", tone: "new" },
  entrepreneur: { label: "Tadbirkor", tone: "done" },
  risk: { label: "Risk guruh", tone: "danger" },
};

// Ehtiyoj turi
export const NEED_TYPE = {
  job: "Ish o'rni",
  grant: "Grant / subsidiya",
  skill: "Kasb-hunar o'rgatish",
  loan: "Imtiyozli kredit",
  social: "Ijtimoiy yordam",
};

// Ko'rilgan chora holati
export const MEASURE_STATUS = {
  pending: { label: "Ko'rib chiqilmoqda", tone: "progress" },
  assigned: { label: "Chora belgilandi", tone: "new" },
  resolved: { label: "Daftardan chiqarilgan", tone: "done" },
};

const FIRST = ["Akmal", "Diyor", "Sardor", "Jasur", "Bekzod", "Aziz", "Doston", "Shoxrux", "Ulug'bek", "Farrux", "Nilufar", "Dilnoza", "Madina", "Sevara", "Gulnoza", "Ozoda", "Kamola", "Shahnoza"];
const LAST = ["Karimov", "Yusupov", "To'xtayev", "Rahimov", "Ergashev", "Qodirov", "Saidov", "Nazarov", "Yo'ldoshev", "Aliyev", "Karimova", "Yusupova", "Rahimova", "Ergasheva"];

const DIRS = ["unemployed", "unemployed", "risk", "student", "entrepreneur"];
const NEEDS = ["job", "grant", "skill", "loan", "social"];
// Daftar bo'shatilgan — barcha arxiv yozuvlari chora ko'rilib chiqarilgan
const STATUSES = ["resolved", "resolved", "resolved", "resolved"];

const TODAY = new Date("2026-06-24");
let counter = 0;

// Har ko'chadan ~3 ta arxiv yozuv (daftardan chiqarilganlar tarixi, jami 42)
export const YOUTH_RECORDS = MAHALLAS.flatMap((m, mi) => {
  const sample = 3;
  return Array.from({ length: Math.min(sample, 8) }, (_, k) => {
    counter += 1;
    const seed = counter * 1.9 + k;
    const dir = DIRS[Math.floor(rng(seed * 2.1) * DIRS.length)];
    const need = NEEDS[Math.floor(rng(seed * 3.2) * NEEDS.length)];
    const status = STATUSES[Math.floor(rng(seed * 4.3) * STATUSES.length)];
    const age = 18 + Math.floor(rng(seed * 5.4) * 12); // 18-29
    const isFemale = rng(seed * 6.5) > 0.5;
    const fname = FIRST[Math.floor(rng(seed * 7.6) * FIRST.length)];
    const lname = LAST[Math.floor(rng(seed * 8.7) * LAST.length)];
    const regDays = Math.floor(rng(seed * 9.8) * 280);
    const regDate = new Date(TODAY);
    regDate.setDate(TODAY.getDate() - regDays);

    return {
      id: `YD-${String(counter).padStart(4, "0")}`,
      name: `${fname} ${lname}`,
      age,
      gender: isFemale ? "F" : "M",
      mahalla: m.shortName,
      direction: dir,
      need,
      status,
      regDate: regDate.toISOString().slice(0, 10),
      // chora tavsifi
      measure: status === "resolved"
        ? (need === "job" ? "Ish o'rniga joylashtirildi" : need === "grant" ? "Grant ajratildi" : "Kasbga o'qitildi")
        : status === "assigned" ? `${NEED_TYPE[need]} bo'yicha chora belgilandi` : "Hujjatlar ko'rib chiqilmoqda",
    };
  });
});

export const youthRegistrySummary = (() => {
  const total = YOUTH_RECORDS.length;
  const resolved = YOUTH_RECORDS.filter((r) => r.status === "resolved").length;
  const pending = YOUTH_RECORDS.filter((r) => r.status === "pending").length;
  const female = YOUTH_RECORDS.filter((r) => r.gender === "F").length;
  return {
    total, resolved, pending,
    resolvedPct: Math.round((resolved / total) * 100),
    femalePct: Math.round((female / total) * 100),
  };
})();

// Yo'nalish bo'yicha donut
export const YOUTH_BY_DIRECTION = Object.keys(YOUTH_DIRECTION).map((key) => ({
  key,
  value: YOUTH_RECORDS.filter((r) => r.direction === key).length,
}));
