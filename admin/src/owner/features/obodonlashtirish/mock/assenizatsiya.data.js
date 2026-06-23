// Gaz mashinasi / assenizatsiya (suyuq maishiy chiqindi — septik bo'shatish) demo.
// Asos: VM 95-son (06.02.2019) — suyuq chiqindi maxsus transport bilan, BUYURTMA asosida,
// belgilangan qabul nuqtasiga tashlanadi. Milliy tarif/SLA normasi YO'Q — buyurtma oqimi.
// Raqamlar deterministik (Math.random yo'q) — demo, real emas.

export const ASSEN_PLACE = "Baliqchi tumani, Andijon";
const TODAY = new Date("2026-06-24");

// Holat (rules/02): yangi=ko'k, jarayonda=amber, bajarildi=yashil, rad=qizil
export const ORDER_STATUS = {
  new: { label: "Yangi", tone: "new" },
  dispatched: { label: "Yuborildi", tone: "progress" },
  done: { label: "Bajarildi", tone: "done" },
  rejected: { label: "Rad etildi", tone: "danger" },
};

const rng = (seed) => {
  const x = Math.sin(seed * 73.3 + 19.1) * 43758.5453;
  return x - Math.floor(x);
};

const MAHALLAS = ["Sarnovul", "Yangiobod", "Bo'ston", "Guliston", "Navbahor", "Do'stlik", "Oltinko'l", "Bahor"];
const RECEPTION = "Baliqchi suyuq chiqindi qabul shoxobchasi";

const STATUSES = ["done", "done", "done", "done", "dispatched", "new", "rejected"];

export const ASSEN_ORDERS = Array.from({ length: 28 }, (_, i) => {
  const status = STATUSES[i % STATUSES.length];
  const daysBack = Math.floor(rng(i * 2.2) * 26);
  const created = new Date(TODAY);
  created.setDate(TODAY.getDate() - daysBack);
  // Bajarish vaqti (kun) — buyurtmadan to bajarilgangacha
  const slaDays = status === "done" ? 1 + Math.floor(rng(i * 3.4) * 3) : status === "dispatched" ? Math.floor(rng(i * 1.7) * 2) : 0;
  const completed = new Date(created);
  completed.setDate(created.getDate() + slaDays);
  const volume = status === "rejected" ? 0 : 3 + Math.floor(rng(i * 5.5) * 8); // m³

  return {
    id: `assen-${1000 + i}`,
    number: `AS-${2026}-${String(100 + i).padStart(3, "0")}`,
    mahalla: MAHALLAS[i % MAHALLAS.length],
    address: `${MAHALLAS[i % MAHALLAS.length]} MFY, ${1 + (i % 40)}-uy`,
    status,
    createdDate: created.toISOString().slice(0, 10),
    completedDate: status === "done" ? completed.toISOString().slice(0, 10) : null,
    slaDays: status === "done" ? slaDays : null,
    volume,
    reception: status === "done" ? RECEPTION : null,
  };
});

// 12 oylik buyurtma soni
const MONTHS = ["Iyul", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyun"];
export const ASSEN_ORDER_TREND = MONTHS.map((month, i) => ({
  month,
  value: Math.round(16 + rng(i * 6.6) * 18),
}));

// Mahalla bo'yicha buyurtma
export const ASSEN_BY_MAHALLA = MAHALLAS.map((name, i) => ({
  key: name,
  value: ASSEN_ORDERS.filter((o) => o.mahalla === name).length + Math.round(rng(i * 8.1) * 6),
}));

// Holat bo'yicha donut
export const ASSEN_BY_STATUS = Object.keys(ORDER_STATUS).map((key) => ({
  key,
  value: ASSEN_ORDERS.filter((o) => o.status === key).length,
}));
export const STATUS_LABELS = Object.fromEntries(
  Object.entries(ORDER_STATUS).map(([k, v]) => [k, v.label]),
);

export const assenSummary = (() => {
  const done = ASSEN_ORDERS.filter((o) => o.status === "done");
  const inProgress = ASSEN_ORDERS.filter((o) => o.status === "new" || o.status === "dispatched").length;
  const rejected = ASSEN_ORDERS.filter((o) => o.status === "rejected").length;
  const avgSla = done.length
    ? Math.round((done.reduce((sum, o) => sum + o.slaDays, 0) / done.length) * 10) / 10
    : 0;
  const volume = ASSEN_ORDERS.reduce((sum, o) => sum + o.volume, 0);
  return {
    total: ASSEN_ORDERS.length,
    done: done.length,
    inProgress,
    rejected,
    avgSla,
    volume,
  };
})();
