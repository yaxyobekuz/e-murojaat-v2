// Internet moduli analitikasi — STREETS dan hosil qilinadi.
import { STREETS, PROVIDERS } from "./internet.data";

const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

const inScope = (streetId) =>
  streetId ? STREETS.filter((s) => s.id === streetId) : STREETS;

export const summary = (streetId) => {
  const ss = inScope(streetId);
  const households = sum(ss, (s) => s.households);
  const covered = sum(ss, (s) => s.covered);
  const fiber = sum(ss, (s) => s.fiber);
  const coverage = round((covered / Math.max(1, households)) * 100, 1);
  const fiberPct = round((fiber / Math.max(1, covered)) * 100, 1);
  const avgSpeed = Math.round(sum(ss, (s) => s.speed * s.covered) / Math.max(1, covered));
  const uptime = round(sum(ss, (s) => s.uptime * s.covered) / Math.max(1, covered), 1);
  const complaints = sum(ss, (s) => s.complaints);
  const outages = sum(ss, (s) => s.outages);
  const critical = ss.filter((s) => s.status === "kritik").length;

  return {
    households,
    covered,
    coverage,
    fiber,
    fiberPct,
    avgSpeed,
    uptime,
    complaints,
    outages,
    critical,
    deltas: { coverage: 1.9, avgSpeed: 3.0, uptime: 0.3, complaints: -8.2 },
  };
};

const MONTHS = ["Iyl", "Avg", "Sen", "Okt", "Noy", "Dek", "Yan", "Fev", "Mar", "Apr", "May", "Iyn"];
// Kanonik seriya (base=68): 41, 44, 47, 49, 52, 54, 57, 60, 62, 64, 66, 68
const SPEED_TREND = [0.6029, 0.6471, 0.6912, 0.7206, 0.7647, 0.7941, 0.8382, 0.8824, 0.9118, 0.9412, 0.9706, 1.0];

// 12 oylik o'rtacha tezlik dinamikasi (Mbit/s)
export const speedTrend = (streetId) => {
  const base = summary(streetId).avgSpeed;
  return MONTHS.map((month, i) => ({ month, value: Math.round(base * SPEED_TREND[i]) }));
};

// Provayder ulushi (donut)
export const providers = () =>
  PROVIDERS.map((p) => ({ key: p.key, label: p.label, value: p.share }));

// Ko'cha kesimida qamrov (% bar)
export const coverageByStreet = () =>
  [...STREETS]
    .sort((a, b) => a.covered / a.households - b.covered / b.households)
    .map((s) => ({ key: s.name, value: round((s.covered / s.households) * 100, 0) }));

// Ulanish texnologiyasi taqsimoti (donut) — optika 402 vs simsiz 239 (radio + mobil)
export const techMix = (streetId) => {
  const s = summary(streetId);
  const fiber = s.fiber;
  const rest = s.covered - fiber;
  return [
    { key: "fiber", label: "Optik tolali (FTTH)", value: fiber },
    { key: "adsl", label: "Simsiz (radio)", value: Math.round(rest * 0.58) },
    { key: "mobil", label: "Simsiz (mobil 4G/5G)", value: Math.round(rest * 0.42) },
  ];
};

// Ko'cha kesimida to'liq ko'rsatkichlar (jadval uchun)
export const streetRows = () =>
  STREETS.map((s) => ({
    id: s.id,
    name: s.name,
    label: s.label,
    households: s.households,
    covered: s.covered,
    coverage: round((s.covered / s.households) * 100, 0),
    fiber: s.fiber,
    speed: s.speed,
    uptime: s.uptime,
    complaints: s.complaints,
    outages: s.outages,
    status: s.status,
  }));
