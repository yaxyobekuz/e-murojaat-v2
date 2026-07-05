// Elektr moduli analitikasi — MAHALLAS dan hosil qilinadi. Barcha label o'zbekcha.
import { MAHALLAS } from "./elektr.data";

const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

const inScope = (mahallaId) =>
  mahallaId ? MAHALLAS.filter((m) => m.id === mahallaId) : MAHALLAS;

export const summary = (mahallaId) => {
  const ms = inScope(mahallaId);
  const consumption = round(sum(ms, (m) => m.consumption), 1); // MWh/oy
  const households = sum(ms, (m) => m.households);
  const lossPct = round(sum(ms, (m) => m.losses * m.consumption) / Math.max(1, sum(ms, (m) => m.consumption)), 1);
  const askue = Math.round(sum(ms, (m) => m.askue * m.households) / Math.max(1, households));
  const solarKwh = sum(ms, (m) => m.solarKwh);
  const solarHomes = sum(ms, (m) => m.solarHomes);
  const avgVoltage = Math.round(sum(ms, (m) => m.voltage * m.households) / Math.max(1, households));
  const critical = ms.filter((m) => m.status === "kritik").length;
  const outages = sum(ms, (m) => m.outages);

  return {
    consumption,
    households,
    lossPct,
    askue,
    solarKwh,
    solarHomes,
    avgVoltage,
    critical,
    outages,
    transformers: sum(ms, (m) => m.transformers),
    deltas: { consumption: 2.1, lossPct: -0.4, askue: 1.2, solarKwh: 6.3 },
  };
};

// 12 oylik dinamika: iste'mol (qishda cho'qqi) vs quyosh generatsiyasi (yozda cho'qqi).
// Koeffitsiyentlar real seriyadan (iyun=1.0): TP 148 900 + quyosh 23 500 kVt·soat.
const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
const CONS_SEAS = [1.204, 1.148, 1.047, 0.99, 0.98, 1, 0.974, 0.964, 0.919, 0.972, 1.057, 1.173];
const SOLAR_SEAS = [0.391, 0.502, 0.664, 0.826, 0.94, 1, 0.928, 0.953, 0.834, 0.647, 0.443, 0.366];

export const timeseries = (mahallaId) => {
  const base = summary(mahallaId).consumption; // MWh/oy
  const solarBase = summary(mahallaId).solarKwh / 1000; // MWh
  return MONTHS.map((month, i) => ({
    month,
    consumption: round(base * CONS_SEAS[i], 1),
    generation: round(solarBase * SOLAR_SEAS[i], 1),
  }));
};

// Energiya balansi (donut): kirim manbasi + iste'mol/yo'qotish taqsimoti
export const energyBalance = (mahallaId) => {
  const s = summary(mahallaId);
  const total = s.consumption;
  const solar = round(s.solarKwh / 1000, 1);
  const grid = round(total - solar, 1);
  const techLoss = round((total * s.lossPct) / 100 * 0.62, 1);
  const commLoss = round((total * s.lossPct) / 100 * 0.38, 1);
  const useful = round(total - techLoss - commLoss, 1);
  return {
    source: [
      { key: "grid", label: "Markaziy tarmoq", value: grid },
      { key: "solar", label: "Quyosh panellari", value: solar },
    ],
    output: [
      { key: "useful", label: "Foydali iste'mol", value: useful },
      { key: "tech", label: "Texnik yo'qotish", value: techLoss },
      { key: "comm", label: "Tijoriy yo'qotish", value: commLoss },
    ],
  };
};

// Yo'qotishlar tahlili — Waterfall bosqichlari (% da, stansiyadan aholigacha)
export const lossesWaterfall = (mahallaId) => {
  const s = summary(mahallaId);
  const techShare = s.lossPct * 0.62;
  const commShare = s.lossPct * 0.38;
  return [
    { name: "Stansiyadan chiqdi", type: "start", value: 100 },
    { name: "Yuqori kuchlanish", type: "loss", delta: -round(techShare * 0.3, 1) },
    { name: "Transformator", type: "loss", delta: -round(techShare * 0.45, 1) },
    { name: "Past kuchlanish liniya", type: "loss", delta: -round(techShare * 0.25, 1) },
    { name: "Tijoriy (o'g'irlik/qochqin)", type: "loss", delta: -round(commShare, 1) },
    { name: "Aholi to'ladi", type: "end", value: round(100 - s.lossPct, 1) },
  ];
};

// MTTR — avariyani bartaraf etish (daqiqa). Maqsad 45 daqiqa.
export const mttr = (mahallaId) => {
  const ms = inScope(mahallaId);
  const actual = Math.round(sum(ms, (m) => m.mttr * m.outages) / Math.max(1, sum(ms, (m) => m.outages)));
  return { actual, target: 45, worst: Math.max(...ms.map((m) => m.mttr)) };
};

// Tarmoq salomatligi — har mahalla transformator yuklamasi (heatmap uchun)
export const health = () =>
  MAHALLAS.map((m) => ({
    id: m.id,
    name: m.name,
    load: m.load,
    status: m.status,
    transformers: m.transformers,
    voltage: m.voltage,
  }));

// Mahalla kesimida to'liq ko'rsatkichlar (jadval uchun)
export const mahallaRows = () =>
  MAHALLAS.map((m) => ({
    id: m.id,
    name: m.name,
    label: m.label,
    load: m.load,
    status: m.status,
    transformers: m.transformers,
    households: m.households,
    voltage: m.voltage,
    askue: m.askue,
    losses: m.losses,
    consumption: m.consumption,
    solarHomes: m.solarHomes,
    solarKwh: m.solarKwh,
    outages: m.outages,
    mttr: m.mttr,
  }));

// Kuchlanish sifati — mahalla bo'yicha o'rtacha kuchlanish (220V me'yor)
export const voltage = () =>
  [...MAHALLAS]
    .sort((a, b) => a.voltage - b.voltage)
    .map((m) => ({ key: m.name, value: m.voltage, low: m.voltage < 200 }));

// ASKUE qamrovi (%) — aqlli hisoblagichlar
export const askue = (mahallaId) => summary(mahallaId).askue;

// Quyoshli xonadon dasturi
export const solar = (mahallaId) => {
  const s = summary(mahallaId);
  return { homes: s.solarHomes, kwh: s.solarKwh, trend: timeseries(mahallaId) };
};

// Iste'mol tarkibi (donut) — iste'molchi turi bo'yicha (mahalla: aholi ustuvor, 13 korxona)
export const breakdownByType = (mahallaId) => {
  const total = summary(mahallaId).consumption;
  return [
    { key: "maishiy", label: "Maishiy (aholi)", value: round(total * 0.68, 1) },
    { key: "tijorat", label: "Tijorat", value: round(total * 0.14, 1) },
    { key: "byudjet", label: "Byudjet tashkilotlari", value: round(total * 0.08, 1) },
    { key: "qishloq", label: "Qishloq xo'jaligi", value: round(total * 0.1, 1) },
  ];
};

// Uzilishlar ishonchliligi — SAIDI/SAIFI
export const reliability = (mahallaId) => {
  const ms = inScope(mahallaId);
  const outages = sum(ms, (m) => m.outages);
  return {
    saifi: round(outages / Math.max(1, ms.length), 1), // o'rtacha uzilishlar soni
    saidi: Math.round((outages * mttr(mahallaId).actual) / Math.max(1, ms.length)), // daq/abonent
    outages,
  };
};
