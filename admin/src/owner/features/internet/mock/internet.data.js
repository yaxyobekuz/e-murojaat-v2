// Internet moduli — ko'cha (MFY) kesimida tarmoq ko'rsatkichlari. Barcha label o'zbekcha.
// Provayder qamrovi, uzilishlar, tezlik va shikoyatlar mock ma'lumoti.

export const STREETS = [
  { id: "s1", name: "Sarnovul", label: "Sarnovul MFY", households: 1240, covered: 1180, fiber: 920, speed: 78, uptime: 99.2, complaints: 14, outages: 3, status: "yaxshi" },
  { id: "s2", name: "Bog'ibo'ston", label: "Bog'ibo'ston MFY", households: 980, covered: 760, fiber: 410, speed: 52, uptime: 97.1, complaints: 31, outages: 8, status: "o'rta" },
  { id: "s3", name: "Yangiobod", label: "Yangiobod MFY", households: 1520, covered: 1490, fiber: 1320, speed: 92, uptime: 99.6, complaints: 9, outages: 2, status: "yaxshi" },
  { id: "s4", name: "Guliston", label: "Guliston MFY", households: 720, covered: 430, fiber: 120, speed: 31, uptime: 94.3, complaints: 48, outages: 15, status: "kritik" },
  { id: "s5", name: "Navro'z", label: "Navro'z MFY", households: 1100, covered: 1010, fiber: 840, speed: 71, uptime: 98.4, complaints: 19, outages: 5, status: "yaxshi" },
  { id: "s6", name: "Do'stlik", label: "Do'stlik MFY", households: 860, covered: 590, fiber: 280, speed: 44, uptime: 96.0, complaints: 37, outages: 11, status: "o'rta" },
  { id: "s7", name: "Chamanzor", label: "Chamanzor MFY", households: 1340, covered: 1295, fiber: 1180, speed: 88, uptime: 99.4, complaints: 11, outages: 2, status: "yaxshi" },
  { id: "s8", name: "Qishloqobod", label: "Qishloqobod MFY", households: 540, covered: 260, fiber: 40, speed: 22, uptime: 91.8, complaints: 53, outages: 19, status: "kritik" },
];

// ── Antennalar (bazaviy stansiyalar) — xaritada signal sifati bilan ──
// Holat signal sifatiga qarab: yaxshi (yashil) / o'rta (amber) / zaif (qizil).
export const ANTENNA_STATUS = {
  good: { label: "Yaxshi signal", color: "#22c55e", from: 80 },
  mid: { label: "O'rtacha signal", color: "#f59e0b", from: 55 },
  weak: { label: "Zaif signal", color: "#ef4444", from: 0 },
};
export const signalStatus = (q) => (q >= 80 ? "good" : q >= 55 ? "mid" : "weak");

const MAP_LAT = 40.9034;
const MAP_LNG = 71.8604;
const rng = (s) => { const x = Math.sin(s * 71.3 + 9.7) * 43758.5453; return x - Math.floor(x); };

const ANTENNA_META = [
  { id: "ant-1", name: "Sarnovul BS-1", tech: "5G", provider: "Uztelecom", signal: 92 },
  { id: "ant-2", name: "Markaz BS-2", tech: "4G/LTE", provider: "UZONLINE", signal: 84 },
  { id: "ant-3", name: "Bog'ibo'ston BS-3", tech: "4G/LTE", provider: "Comnet", signal: 61 },
  { id: "ant-4", name: "Guliston BS-4", tech: "4G", provider: "Uztelecom", signal: 43 },
  { id: "ant-5", name: "Yangiobod BS-5", tech: "5G", provider: "Sarkor Telekom", signal: 88 },
  { id: "ant-6", name: "Do'stlik BS-6", tech: "4G/LTE", provider: "Comnet", signal: 58 },
  { id: "ant-7", name: "Chamanzor BS-7", tech: "5G", provider: "Uztelecom", signal: 90 },
  { id: "ant-8", name: "Qishloqobod BS-8", tech: "3G/4G", provider: "UZONLINE", signal: 38 },
  { id: "ant-9", name: "Navro'z BS-9", tech: "4G/LTE", provider: "Sarkor Telekom", signal: 76 },
];

// Antennalar markaz atrofida aylana bo'ylab joylashadi (xarita markazida ko'rinadi)
export const ANTENNAS = ANTENNA_META.map((a, i) => {
  const ang = (i / ANTENNA_META.length) * Math.PI * 2;
  const radius = 0.004 + (i % 2) * 0.0022;
  const lat = Math.round((MAP_LAT + Math.sin(ang) * radius) * 1e5) / 1e5;
  const lng = Math.round((MAP_LNG + Math.cos(ang) * radius * 1.3) * 1e5) / 1e5;
  const status = signalStatus(a.signal);
  // qamrov radiusi (m) — signal kuchiga bog'liq
  const coverageM = Math.round(350 + (a.signal / 100) * 650);
  // ulangan abonentlar — taxminiy
  const users = Math.round(180 + rng(i * 3.3) * 1400);
  return { ...a, lat, lng, status, coverageM, users };
});

// ── Uylar — har uyda taxminiy internet tezligi (Mbit/s) ──
// Tezlik eng yaqin antenna signaliga va undan uzoqlikка bog'liq (uzoq = sekinroq).
export const HOUSE_SPEED = {
  fast: { label: "Tez (50+ Mbit/s)", color: "#22c55e", from: 50 },
  ok: { label: "O'rta (20–50)", color: "#84cc16", from: 20 },
  slow: { label: "Sekin (8–20)", color: "#f59e0b", from: 8 },
  bad: { label: "Juda sekin (<8)", color: "#ef4444", from: 0 },
};
export const houseSpeedStatus = (mbps) => (mbps >= 50 ? "fast" : mbps >= 20 ? "ok" : mbps >= 8 ? "slow" : "bad");

const distM = (aLat, aLng, bLat, bLng) => {
  const dLat = (aLat - bLat) * 111000;
  const dLng = (aLng - bLng) * 111000 * Math.cos((aLat * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

// ~130 ta uy — antennalar atrofida tarqaladi
export const HOUSES = Array.from({ length: 130 }, (_, i) => {
  const ang = rng(i * 1.7) * Math.PI * 2;
  const radius = 0.001 + rng(i * 2.9) * 0.008;
  const lat = Math.round((MAP_LAT + Math.sin(ang) * radius) * 1e6) / 1e6;
  const lng = Math.round((MAP_LNG + Math.cos(ang) * radius * 1.3) * 1e6) / 1e6;

  // eng yaqin antennani topish
  let nearest = ANTENNAS[0];
  let best = Infinity;
  for (const a of ANTENNAS) {
    const d = distM(lat, lng, a.lat, a.lng);
    if (d < best) { best = d; nearest = a; }
  }
  // tezlik — antenna signali × uzoqlik so'nishi (qamrov radiusidan tashqarida keskin tushadi)
  const falloff = Math.max(0.12, 1 - best / (nearest.coverageM * 1.4));
  const base = nearest.tech.includes("5G") ? 120 : nearest.tech.includes("LTE") ? 70 : 35;
  const mbps = Math.max(2, Math.round(base * (nearest.signal / 100) * falloff * (0.85 + rng(i * 5.1) * 0.3)));

  return {
    id: `H-${String(i + 1).padStart(3, "0")}`,
    lat,
    lng,
    mbps,
    status: houseSpeedStatus(mbps),
    antenna: nearest.name,
    tech: nearest.tech,
  };
});

export const houseSpeedSummary = (() => {
  const avg = Math.round(HOUSES.reduce((s, h) => s + h.mbps, 0) / HOUSES.length);
  const fast = HOUSES.filter((h) => h.status === "fast").length;
  const slow = HOUSES.filter((h) => h.status === "slow" || h.status === "bad").length;
  return { total: HOUSES.length, avg, fast, slow };
})();

// Provayder ulushi (bozor) — qamrov bo'yicha
export const PROVIDERS = [
  { key: "uztelecom", label: "Uztelecom", share: 38 },
  { key: "uzonline", label: "UZONLINE", share: 22 },
  { key: "comnet", label: "Comnet", share: 17 },
  { key: "sarkor", label: "Sarkor Telekom", share: 13 },
  { key: "boshqa", label: "Boshqa", share: 10 },
];
