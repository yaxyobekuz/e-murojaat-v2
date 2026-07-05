// Internet moduli — Sarnovul MFY (Baliqchi tumani) ko'chalari kesimida tarmoq ko'rsatkichlari.
// Kanonik: 763 xonadon, 641 ulangan (qamrov 84%), optika 402, simsiz 239, o'rtacha 68 Mbit/s.

export const STREETS = [
  { id: "s1", name: "Maslahat", label: "Maslahat ko'chasi", households: 128, covered: 118, fiber: 89, speed: 82, uptime: 99.3, complaints: 3, outages: 1, status: "yaxshi" },
  { id: "s2", name: "Ulug'vor", label: "Ulug'vor ko'chasi", households: 112, covered: 102, fiber: 76, speed: 78, uptime: 99.1, complaints: 2, outages: 1, status: "yaxshi" },
  { id: "s3", name: "Urganji", label: "Urganji ko'chasi", households: 96, covered: 87, fiber: 62, speed: 75, uptime: 98.8, complaints: 2, outages: 1, status: "yaxshi" },
  { id: "s4", name: "Bog'iston", label: "Bog'iston ko'chasi", households: 90, covered: 76, fiber: 48, speed: 66, uptime: 98.2, complaints: 4, outages: 2, status: "o'rta" },
  { id: "s5", name: "Tinchlik", label: "Tinchlik ko'chasi", households: 88, covered: 74, fiber: 45, speed: 64, uptime: 97.9, complaints: 3, outages: 1, status: "o'rta" },
  { id: "s6", name: "Do'stlik", label: "Do'stlik ko'chasi", households: 86, covered: 68, fiber: 36, speed: 58, uptime: 97.4, complaints: 5, outages: 2, status: "o'rta" },
  { id: "s7", name: "Navro'z", label: "Navro'z ko'chasi", households: 84, covered: 65, fiber: 30, speed: 55, uptime: 96.8, complaints: 4, outages: 2, status: "o'rta" },
  { id: "s8", name: "Guliston", label: "Guliston ko'chasi", households: 79, covered: 51, fiber: 16, speed: 42, uptime: 95.1, complaints: 6, outages: 3, status: "kritik" },
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
  { id: "ant-1", name: "Sarnovul markaz BS-1", tech: "5G", provider: "Uztelecom", signal: 92 },
  { id: "ant-2", name: "Maslahat BS-2", tech: "4G/LTE", provider: "UZONLINE", signal: 84 },
  { id: "ant-3", name: "Bog'iston BS-3", tech: "4G/LTE", provider: "Comnet", signal: 61 },
  { id: "ant-4", name: "Guliston BS-4", tech: "4G", provider: "Uztelecom", signal: 43 },
  { id: "ant-5", name: "Ulug'vor BS-5", tech: "5G", provider: "Sarkor Telekom", signal: 88 },
  { id: "ant-6", name: "Do'stlik BS-6", tech: "4G/LTE", provider: "Comnet", signal: 58 },
  { id: "ant-7", name: "Urganji BS-7", tech: "5G", provider: "Uztelecom", signal: 90 },
  { id: "ant-8", name: "Tinchlik BS-8", tech: "3G/4G", provider: "UZONLINE", signal: 38 },
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
  // ulangan simsiz abonentlar — taxminiy (jami ~239 simsiz xonadon)
  const users = Math.round(16 + rng(i * 3.3) * 35);
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
  const base = nearest.tech.includes("5G") ? 142 : nearest.tech.includes("LTE") ? 90 : 48;
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
