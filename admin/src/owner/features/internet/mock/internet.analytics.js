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
    deltas: { coverage: 5.4, avgSpeed: 12.8, uptime: 0.6, complaints: -8.2 },
  };
};

const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
const SPEED_TREND = [0.74, 0.78, 0.81, 0.83, 0.86, 0.88, 0.9, 0.92, 0.94, 0.96, 0.98, 1.0];

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

// Ulanish texnologiyasi taqsimoti (donut) — fiber vs ADSL vs mobil
export const techMix = (streetId) => {
  const s = summary(streetId);
  const fiber = s.fiber;
  const rest = s.covered - fiber;
  return [
    { key: "fiber", label: "Optik tolali (FTTH)", value: fiber },
    { key: "adsl", label: "ADSL / mis", value: Math.round(rest * 0.58) },
    { key: "mobil", label: "Mobil (4G/5G)", value: Math.round(rest * 0.42) },
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
