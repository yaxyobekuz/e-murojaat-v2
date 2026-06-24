// MSK analitikasi — APPEALS ustidan aggregatsiya. Har funksiya global FILTR qabul qiladi
// (kategoriya/status/jins/yosh/ko'cha/manba/ustuvorlik/sana) — grafiklarni mix qilish uchun.
import { APPEALS } from "./msk.appeals";
import { CATEGORIES, CAT, STATUS_KEYS, AGE_BUCKETS, ageBucket, WORKERS } from "./msk.data";

const MONTH_UZ = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
const REF = new Date(2026, 5, 24);
const windowMonths = [];
for (let k = 11; k >= 0; k--) {
  const d = new Date(REF.getFullYear(), REF.getMonth() - k, 1);
  windowMonths.push({ y: d.getFullYear(), m: d.getMonth(), label: MONTH_UZ[d.getMonth()] });
}

export const applyFilter = (f = {}) =>
  APPEALS.filter((a) => {
    if (f.category && a.category !== f.category) return false;
    if (f.status && a.status !== f.status) return false;
    if (f.gender && a.applicant.gender !== f.gender) return false;
    if (f.ageBucket && ageBucket(a.applicant.age) !== f.ageBucket) return false;
    if (f.street && a.address.street !== f.street) return false;
    if (f.source && a.source !== f.source) return false;
    if (f.priority && a.priority !== f.priority) return false;
    if (f.worker && a.assignedWorker?.id !== f.worker) return false;
    if (f.dateFrom && new Date(a.createdAt) < new Date(f.dateFrom)) return false;
    if (f.dateTo && new Date(a.createdAt) > new Date(f.dateTo)) return false;
    return true;
  });

const countBy = (rows, keyFn) => {
  const map = {};
  rows.forEach((r) => { const k = keyFn(r); if (k != null) map[k] = (map[k] || 0) + 1; });
  return map;
};
const monthIdx = (iso) => {
  const d = new Date(iso);
  return windowMonths.findIndex((w) => w.y === d.getFullYear() && w.m === d.getMonth());
};
const avg = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export const summary = (f) => {
  const rows = applyFilter(f);
  const done = rows.filter((r) => r.status === "bajarildi");
  const closedSla = rows.filter((r) => r.slaMet != null);
  const rated = done.filter((r) => r.rating != null);
  return {
    total: rows.length,
    open: rows.filter((r) => ["yangi", "tayinlandi", "jarayonda", "kechikkan"].includes(r.status)).length,
    overdue: rows.filter((r) => r.status === "kechikkan").length,
    completionRate: rows.length ? Math.round((done.length / rows.length) * 100) : 0,
    avgDurationH: round(avg(done.map((r) => r.durationH).filter(Boolean)), 1),
    slaPct: closedSla.length ? Math.round((closedSla.filter((r) => r.slaMet).length / closedSla.length) * 100) : 0,
    activeWorkers: new Set(rows.map((r) => r.assignedWorker?.id).filter(Boolean)).size,
    avgRating: round(avg(rated.map((r) => r.rating)), 1),
    deltas: { total: 6.4, completionRate: 3.1, avgDurationH: -4.2, slaPct: 2.8 },
  };
};

const toPairs = (map, order) =>
  (order || Object.keys(map)).map((k) => ({ key: k, value: map[k] || 0 })).filter((x) => x.value > 0 || order);

export const byCategory = (f) =>
  CATEGORIES.map((c) => ({ key: c.key, value: countBy(applyFilter(f), (r) => r.category)[c.key] || 0 }))
    .sort((a, b) => b.value - a.value);

export const byStatus = (f) => toPairs(countBy(applyFilter(f), (r) => r.status), STATUS_KEYS);
export const byGender = (f) => toPairs(countBy(applyFilter(f), (r) => r.applicant.gender), ["erkak", "ayol"]);
export const bySource = (f) => toPairs(countBy(applyFilter(f), (r) => r.source));
export const byPriority = (f) => toPairs(countBy(applyFilter(f), (r) => r.priority), ["shoshilinch", "yuqori", "orta", "past"]);
export const byStreet = (f) =>
  Object.entries(countBy(applyFilter(f), (r) => r.address.street)).map(([key, value]) => ({ key, value })).sort((a, b) => b.value - a.value);

export const byAge = (f) => {
  const rows = applyFilter(f);
  return AGE_BUCKETS.map((b) => ({ key: b.key, value: rows.filter((r) => ageBucket(r.applicant.age) === b.key).length }));
};

// Tayinlangan ishlar — xodim jinsi bo'yicha (kim ko'proq band)
export const workerGender = (f) => {
  const rows = applyFilter(f).filter((r) => r.assignedWorker);
  return toPairs(countBy(rows, (r) => r.assignedWorker.gender), ["erkak", "ayol"]);
};

// Yosh × kategoriya matritsasi (heatmap) — top kategoriyalar
export const ageCategory = (f) => {
  const rows = applyFilter(f);
  const top = byCategory(f).slice(0, 8).map((x) => x.key);
  const matrix = AGE_BUCKETS.map((b) =>
    top.map((ck) => rows.filter((r) => ageBucket(r.applicant.age) === b.key && r.category === ck).length),
  );
  return { buckets: AGE_BUCKETS.map((b) => b.key), categories: top.map((k) => CAT[k].label), keys: top, matrix };
};

// Ijro vaqti taqsimoti (soat)
const DUR_BINS = [["0-2 soat", 0, 2], ["2-4 soat", 2, 4], ["4-8 soat", 4, 8], ["8-16 soat", 8, 16], ["16-24 soat", 16, 24], ["24+ soat", 24, 1e9]];
export const durationHist = (f) => {
  const ds = applyFilter(f).filter((r) => r.durationH != null).map((r) => r.durationH);
  return DUR_BINS.map(([label, lo, hi]) => ({ key: label, value: ds.filter((d) => d >= lo && d < hi).length }));
};
export const durationByCategory = (f) => {
  const rows = applyFilter(f).filter((r) => r.durationH != null);
  return CATEGORIES.map((c) => ({
    key: c.key,
    value: round(avg(rows.filter((r) => r.category === c.key).map((r) => r.durationH)), 1),
  })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
};

// SLA — oy bo'yicha muddatida vs kechikkan
export const sla = (f) => {
  const rows = applyFilter(f).filter((r) => r.slaMet != null);
  return windowMonths.map((w, i) => {
    const mr = rows.filter((r) => monthIdx(r.createdAt) === i);
    return { month: w.label, met: mr.filter((r) => r.slaMet).length, missed: mr.filter((r) => !r.slaMet).length };
  });
};

// 12 oylik dinamika — tushgan vs bajarilgan
export const timeseries = (f) => {
  const rows = applyFilter(f);
  return windowMonths.map((w, i) => ({
    month: w.label,
    received: rows.filter((r) => monthIdx(r.createdAt) === i).length,
    completed: rows.filter((r) => r.completedAt && monthIdx(r.completedAt) === i).length,
  }));
};

// Mamnuniyat dinamikasi (o'rtacha baho / oy)
export const satisfaction = (f) => {
  const rows = applyFilter(f).filter((r) => r.rating != null);
  return windowMonths.map((w, i) => ({
    month: w.label,
    value: round(avg(rows.filter((r) => r.completedAt && monthIdx(r.completedAt) === i).map((r) => r.rating)), 2),
  }));
};

// Mavsumiylik — oy × top kategoriya (stacked)
export const seasonal = (f) => {
  const rows = applyFilter(f);
  const top = byCategory(f).slice(0, 4);
  const series = top.map((t) => ({ key: t.key, label: CAT[t.key].label, color: CAT[t.key].color }));
  const data = windowMonths.map((w, i) => {
    const row = { month: w.label };
    top.forEach((t) => { row[t.key] = rows.filter((r) => monthIdx(r.createdAt) === i && r.category === t.key).length; });
    return row;
  });
  return { data, series };
};

// Xodimlar reytingi jadvali
export const workers = (f) => {
  const rows = applyFilter(f).filter((r) => r.assignedWorker);
  return WORKERS.map((w) => {
    const mine = rows.filter((r) => r.assignedWorker.id === w.id);
    const done = mine.filter((r) => r.status === "bajarildi");
    const sla = mine.filter((r) => r.slaMet != null);
    return {
      id: w.id,
      name: w.name,
      gender: w.gender,
      specialties: w.specialties.map((k) => CAT[k].label).join(", "),
      assigned: mine.length,
      done: done.length,
      avgH: round(avg(done.map((r) => r.durationH).filter(Boolean)), 1),
      avgRating: round(avg(done.map((r) => r.rating).filter(Boolean)), 1),
      slaPct: sla.length ? Math.round((sla.filter((r) => r.slaMet).length / sla.length) * 100) : 0,
    };
  }).filter((w) => w.assigned > 0).sort((a, b) => b.done - a.done);
};
