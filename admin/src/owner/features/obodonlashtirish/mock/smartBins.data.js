// Aqlli chiqindi idishlari (smart bins) — Sarnovul MFY, har ko'chada 1-2 quti (jami 24),
// olib ketish jadvali. Asos: VM 648-son sensorli idish + GPS axlat mashinasi. Demo, deterministik.

const rng = (seed) => {
  const x = Math.sin(seed * 84.7 + 19.3) * 43758.5453;
  return x - Math.floor(x);
};

// Sarnovul MFY ko'chalari — kanonik 14 ta
export const BIN_MAHALLAS = [
  "Maslahat", "Ulug'vor", "Urganji", "Sarnovul", "Bog'bon", "Do'stlik", "Tinchlik",
  "Chinor", "Guliston", "Navro'z", "Istiqlol", "Mehnat", "Paxtakor", "Olmazor",
];

// Quti joylashgan mo'ljal (ko'cha ichidagi nuqta)
const STREETS = ["Masjid oldi", "Maktab yoni", "MFY guzari", "Bozorcha oldi", "Choyxona yoni", "Bekat yoni", "Bog' kirishi", "Do'kon oldi", "Ariq bo'yi", "Klub oldi"];

// Holat — to'lish foiziga qarab
export const BIN_STATUS = {
  empty: { label: "Bo'sh", tone: "done", color: "#22c55e", from: 0 },
  filling: { label: "To'lyapti", tone: "progress", color: "#84cc16", from: 35 },
  high: { label: "To'lay deb qoldi", tone: "progress", color: "#f59e0b", from: 70 },
  full: { label: "To'la", tone: "danger", color: "#ef4444", from: 90 },
};
export const fillStatus = (pct) => {
  if (pct >= 90) return "full";
  if (pct >= 70) return "high";
  if (pct >= 35) return "filling";
  return "empty";
};

const TODAY = new Date("2026-06-27T13:00:00");

// Real xarita markazi (Andijon, Baliqchi — boshqa obod xaritalari bilan bir xil)
const MAP_LAT = 40.9034;
const MAP_LNG = 71.8604;

// Har ko'chada 1-2 quti — 14 ko'cha bo'yicha jami 24 ta (mahalla masshtabi)
const BINS_PER_MAHALLA = 2;
const binsCount = (mi) => (mi % 3 === 2 ? 1 : BINS_PER_MAHALLA);

// Har chelak — xarita MARKAZI atrofida joylashtiriladi (kamera shu yerga qaraydi).
// Qutilar 2 ta aylana (halqa) bo'ylab teng taqsimlanadi → ustma-ust tushmaydi, markazda turadi.
const binGeo = (seed, mi, k, total) => {
  const half = Math.ceil(total / 2);
  const ring = k < half ? 0 : 1; // ichki / tashqi halqa
  const idxInRing = ring === 0 ? k : k - half;
  const ringCount = ring === 0 ? half : total - half;
  const ang = (idxInRing / ringCount) * Math.PI * 2 + mi * 0.35 + ring * 0.3;
  const radius = 0.0022 + ring * 0.0016; // ~245m (ichki) / ~420m (tashqi)
  const jitter = (rng(seed * 9.3) - 0.5) * 0.0004;
  const lat = Math.round((MAP_LAT + Math.sin(ang) * radius + jitter) * 1e5) / 1e5;
  const lng = Math.round((MAP_LNG + Math.cos(ang) * radius * 1.3 + jitter) * 1e5) / 1e5;
  return { lat, lng };
};

// Bitta ko'cha uchun chelaklar
const buildBins = (mahalla, mi) => Array.from({ length: binsCount(mi) }, (_, k) => {
  const seed = mi * 100 + k + 1;
  const geo = binGeo(seed, mi, k, binsCount(mi));
  const fill = Math.round(rng(seed * 2.3) * 100);
  const capacity = [240, 360, 660, 1100][Math.floor(rng(seed * 3.1) * 4)]; // litr
  // oxirgi bo'shatilgan — to'lish foiziga teskari (ko'p to'lsa ko'p vaqt o'tgan)
  const hoursAgo = Math.round((fill / 100) * 60 + rng(seed * 4.4) * 12);
  const emptied = new Date(TODAY.getTime() - hoursAgo * 3600 * 1000);
  // keyingi olib ketish (ETA) — to'la bo'lsa tezroq
  const etaHours = fill >= 90 ? 1 + Math.floor(rng(seed * 5.5) * 3) : fill >= 70 ? 4 + Math.floor(rng(seed * 5.5) * 8) : 12 + Math.floor(rng(seed * 5.5) * 24);
  const next = new Date(TODAY.getTime() + etaHours * 3600 * 1000);

  return {
    id: `BIN-${String(mi + 1).padStart(2, "0")}-${String(k + 1).padStart(2, "0")}`,
    mahalla,
    street: `${mahalla} ko'chasi, ${STREETS[(mi + k) % STREETS.length]}`,
    fill,
    capacity,
    status: fillStatus(fill),
    lastEmptied: emptied.toISOString(),
    nextEta: next.toISOString(),
    etaHours,
    hoursAgo,
    lat: geo.lat,
    lng: geo.lng,
  };
});

export const BINS_BY_MAHALLA = BIN_MAHALLAS.map((m, i) => ({ mahalla: m, bins: buildBins(m, i) }));

// ── Axlat mashinalari (GPS) — kanonik 3 ta mashina 14 ko'chani navbat bilan yig'adi ──
// Holat: enroute=yo'lda, collecting=yig'moqda, done=tugatdi (ketdi), idle=garaj
export const TRUCK_STATUS = {
  collecting: { label: "Yig'moqda", color: "#22c55e", live: true },
  enroute: { label: "Yo'lda", color: "#3b82f6", live: true },
  done: { label: "Tugatdi (ketdi)", color: "#94a3b8", live: false },
  idle: { label: "Garajda", color: "#64748b", live: false },
};

// 3 ta mashina (raqam/haydovchi takrorlanadi — bir mashina bir necha ko'chaga xizmat qiladi)
const PLATES = ["01 A 245 GA", "01 B 718 MX", "01 A 052 KT", "01 A 245 GA", "01 B 718 MX", "01 A 052 KT"];
const DRIVERS = ["Olimov B.", "Yusupov R.", "Karimov A.", "Olimov B.", "Yusupov R.", "Karimov A."];

const fmtClock = (d) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// Bitta ko'cha smenasi — mashinalardan biri xizmat qiladi
const buildTruck = (mahalla, mi, bins) => {
  const seed = mi + 1;
  const r = rng(seed * 8.9);
  const status = r < 0.45 ? "collecting" : r < 0.7 ? "enroute" : r < 0.9 ? "done" : "idle";
  // Smena boshlanishi 06:00–07:30 oralig'ida
  const startH = 6 + Math.floor(rng(seed * 2.7) * 2);
  const startM = Math.floor(rng(seed * 3.9) * 60);
  const arrived = new Date(TODAY);
  arrived.setHours(startH, startM, 0, 0);
  // Smena davomiyligi ~50–90 daqiqa
  const durMin = 50 + Math.floor(rng(seed * 4.6) * 40);
  const departed = new Date(arrived.getTime() + durMin * 60 * 1000);
  const left = status === "done" || status === "idle";

  const total = bins.length;
  // Xizmat ko'rsatilgan chelaklar soni (holatga qarab)
  const servedBins = status === "done" ? total : status === "idle" ? 0 : Math.floor(total * (0.3 + rng(seed * 5.2) * 0.4));
  // Mashina joriy joylashuvi — keyingi xizmat qilinadigan chelak yonida (live) yoki markazda
  const targetBin = bins[Math.min(servedBins, total - 1)];
  const lat = left ? Math.round((MAP_LAT - 0.004) * 1e5) / 1e5 : Math.round((targetBin.lat + 0.0005) * 1e5) / 1e5;
  const lng = left ? Math.round((MAP_LNG - 0.005) * 1e5) / 1e5 : Math.round((targetBin.lng + 0.0005) * 1e5) / 1e5;

  return {
    id: `TRK-${String(mi + 1).padStart(2, "0")}`,
    mahalla,
    plate: PLATES[mi % PLATES.length],
    driver: DRIVERS[mi % DRIVERS.length],
    status,
    arrived: arrived.toISOString(),
    departed: left ? departed.toISOString() : null,
    arrivedClock: fmtClock(arrived),
    departedClock: left ? fmtClock(departed) : null,
    durMin,
    servedBins,
    totalBins: total,
    lat,
    lng,
    speed: TRUCK_STATUS[status].live ? Math.round(8 + rng(seed * 6.4) * 18) : 0, // km/soat
  };
};

export const TRUCKS_BY_MAHALLA = BINS_BY_MAHALLA.map(({ mahalla, bins }, i) => buildTruck(mahalla, i, bins));

export const truckForMahalla = (mahalla) =>
  TRUCKS_BY_MAHALLA.find((t) => t.mahalla === mahalla) || TRUCKS_BY_MAHALLA[0];

// ── Har mahallaga ajratilgan chiqindi maydoni (hudud) ──
// Markaz atrofida ko'pburchak zona (qutilar joylashgan hududni qamrab oladi).
const ringPolygon = (cLat, cLng, rLat, rLng, steps = 7, seed = 1) => {
  const ring = [];
  for (let i = 0; i < steps; i++) {
    const ang = (i / steps) * Math.PI * 2;
    const wob = 0.82 + rng(seed * (i + 3.1)) * 0.36; // notekis chegara (tabiiyroq)
    ring.push({
      lat: Math.round((cLat + Math.sin(ang) * rLat * wob) * 1e5) / 1e5,
      lng: Math.round((cLng + Math.cos(ang) * rLng * wob) * 1e5) / 1e5,
    });
  }
  return ring;
};

export const BIN_ZONE_BY_MAHALLA = BINS_BY_MAHALLA.map(({ mahalla, bins }, i) => {
  // zona markazi — mahalla qutilarining o'rtacha nuqtasi
  const cLat = bins.reduce((s, b) => s + b.lat, 0) / bins.length;
  const cLng = bins.reduce((s, b) => s + b.lng, 0) / bins.length;
  return {
    mahalla,
    name: `${mahalla} chiqindi maydoni`,
    center: { lat: Math.round(cLat * 1e5) / 1e5, lng: Math.round(cLng * 1e5) / 1e5 },
    polygon: ringPolygon(cLat, cLng, 0.0052, 0.0066, 7, i + 1),
    bins: bins.length,
  };
});

export const zoneForMahalla = (mahalla) =>
  BIN_ZONE_BY_MAHALLA.find((z) => z.mahalla === mahalla) || BIN_ZONE_BY_MAHALLA[0];

// Mashinalar yig'indisi — total: fizik mashinalar soni (3 ta)
export const truckSummary = (() => {
  const live = TRUCKS_BY_MAHALLA.filter((t) => TRUCK_STATUS[t.status].live).length;
  const done = TRUCKS_BY_MAHALLA.filter((t) => t.status === "done").length;
  return { total: new Set(TRUCKS_BY_MAHALLA.map((t) => t.plate)).size, live, done };
})();

// Ko'cha bo'yicha yig'indi
export const binMahallaStats = BINS_BY_MAHALLA.map(({ mahalla, bins }) => {
  const avgFill = Math.round(bins.reduce((s, b) => s + b.fill, 0) / bins.length);
  const full = bins.filter((b) => b.status === "full").length;
  const high = bins.filter((b) => b.status === "high").length;
  // olib ketish bajarilishi — bo'sh + to'lyapti idishlar ulushi (o'z vaqtida xizmat)
  const served = Math.round((bins.filter((b) => b.fill < 70).length / bins.length) * 100);
  return { mahalla, avgFill, full, high, served };
});

// ── Chiqindi turlari (tarkib) — qancha plastik, qog'oz, organik va h.k. ──
// Asos: O'zbekistonda QMC tarkibi (organik ~50%, plastik ~17%, qog'oz ~10%...) — demo.
export const WASTE_TYPES = {
  organic: { label: "Organik", color: "#84cc16", pct: 48, recyclable: false },
  plastic: { label: "Plastik", color: "#3b82f6", pct: 18, recyclable: true },
  paper: { label: "Qog'oz / karton", color: "#f59e0b", pct: 12, recyclable: true },
  glass: { label: "Shisha", color: "#06b6d4", pct: 7, recyclable: true },
  metal: { label: "Metall", color: "#94a3b8", pct: 5, recyclable: true },
  other: { label: "Aralash / boshqa", color: "#a78bfa", pct: 10, recyclable: false },
};

// Umumiy oylik hajmga (binSummary dan keyin hisoblanadi) nisbatan tonna
export const wasteComposition = (() => {
  const monthlyTons = 90; // oylik QMC (tonna) — 763 xonadonlik mahalla
  return Object.entries(WASTE_TYPES).map(([key, t]) => ({
    key,
    label: t.label,
    color: t.color,
    pct: t.pct,
    tons: Math.round((monthlyTons * t.pct) / 100),
    recyclable: t.recyclable,
  }));
})();

export const wasteSummary = (() => {
  const recyclablePct = wasteComposition.filter((w) => w.recyclable).reduce((s, w) => s + w.pct, 0);
  const plastic = wasteComposition.find((w) => w.key === "plastic");
  return {
    recyclablePct,
    plasticTons: plastic.tons,
    plasticPct: plastic.pct,
    monthlyTons: 90,
  };
})();

// Umumiy KPI
export const binSummary = (() => {
  const all = BINS_BY_MAHALLA.flatMap((m) => m.bins);
  const avgFill = Math.round(all.reduce((s, b) => s + b.fill, 0) / all.length);
  const full = all.filter((b) => b.status === "full").length;
  const totalCapacity = all.reduce((s, b) => s + b.capacity, 0);
  const collected = Math.round((all.filter((b) => b.fill < 70).length / all.length) * 100);
  // o'rtacha olib ketish davriyligi (soat) — faol idishlar ETA o'rtachasi
  const avgEta = Math.round(all.reduce((s, b) => s + b.etaHours, 0) / all.length);
  return {
    totalBins: all.length,
    avgFill,
    full,
    collected,
    avgEta,
    totalCapacity,
  };
})();
