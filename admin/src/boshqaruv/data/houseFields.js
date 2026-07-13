// Rol -> tahrirlaydigan house-maydonlari (server houses.fields.js ning ko'zgusi) + FormField deskriptorlari.
const BOOL_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "ha", label: "Ha" },
  { value: "yoq", label: "Yo'q" },
];
const sel = (values) => [{ value: "", label: "Belgilanmagan" }, ...values.map((v) => ({ value: v, label: v }))];
const bool = { type: "bool", options: BOOL_OPTIONS };

export const HOUSE_FIELD_DEFS = {
  // chairman
  name: { label: "Xonadon nomi", type: "text", full: true },
  owner: { label: "Egasi (F.I.O.)", type: "text", full: true },
  phone: { label: "Telefon", type: "text" },
  members: { label: "A'zolar soni", type: "number" },
  ownership: { label: "Mulkchilik", type: "select", options: sel(["Xususiy", "Davlat", "Yuridik shaxs"]) },
  address: { label: "Manzil", type: "text", full: true },
  kind: { label: "Turi", type: "text" },
  area: { label: "Maydon (m²)", type: "number" },
  floors: { label: "Qavatlar", type: "number" },
  heightM: { label: "Balandlik (m)", type: "number" },
  value: { label: "Qiymati (so'm)", type: "number" },
  notes: { label: "Izoh", type: "textarea", full: true },
  familiesCount: { label: "Oilalar soni", type: "number" },
  residentsCount: { label: "Fuqarolar soni", type: "number" },
  menCount: { label: "Erkaklar", type: "number" },
  // tax_inspector
  taxAnnual: { label: "Yillik soliq (so'm)", type: "number" },
  taxDebt: { label: "Soliq qarzdorligi (so'm)", type: "number" },
  mibDebt: { label: "MIB qarzdorligi (so'm)", type: "number" },
  officerName: { label: "Xodim F.I.O.", type: "text" },
  officerTitle: { label: "Xodim lavozimi", type: "text" },
  officerPhone: { label: "Xodim telefoni", type: "text" },
  officerSector: { label: "Sektor", type: "text" },
  // prevention_inspector
  fireRiskPct: { label: "Yong'in xavfi (%)", type: "number" },
  fireFindings: { label: "Inspektor xulosasi", type: "text", full: true },
  fireInspection: { label: "Tekshiruv sanasi", type: "date" },
  fireOfficerName: { label: "Yong'in inspektori F.I.O.", type: "text" },
  fireOfficerTitle: { label: "Lavozimi", type: "text" },
  fireOfficerDept: { label: "Bo'lim", type: "text" },
  fireOfficerPhone: { label: "Telefon", type: "text" },
  crimeClean: { label: "Jamoat xavfsizligi toza", ...bool },
  crimeNote: { label: "Izoh (holat)", type: "text", full: true },
  crimeOfficerName: { label: "Profilaktika inspektori F.I.O.", type: "text" },
  crimeOfficerTitle: { label: "Lavozimi", type: "text" },
  crimeOfficerPhone: { label: "Telefon", type: "text" },
  // bank_officer (kommunal)
  utilGas: { label: "Gaz", ...bool },
  utilElectric: { label: "Elektr", ...bool },
  utilWater: { label: "Suv", ...bool },
  utilInternet: { label: "Internet", ...bool },
  gasType: { label: "Gaz turi", type: "select", options: sel(["natural", "lpg"]) },
  gasMonthly: { label: "Gaz oylik (m³)", type: "number" },
  gasYearly: { label: "Gaz yillik (m³)", type: "number" },
  gasMeter: { label: "Gaz hisoblagich", type: "text" },
  gasPressure: { label: "Bosim", type: "select", options: sel(["Normal", "Past", "Yuqori"]) },
  gasLimit: { label: "Yillik limit (m³)", type: "number" },
  gasCylinderFamilies: { label: "Ballon oilalar", type: "number" },
  elecMonthly: { label: "Elektr oylik (kVt)", type: "number" },
  elecNorm: { label: "Norma (kVt)", type: "number" },
  solarInstalled: { label: "Quyosh paneli", ...bool },
  internetConnected: { label: "Internet ulangan", ...bool },
  internetSpeed: { label: "Tezlik (Mbit/s)", type: "number" },
  internetProvider: { label: "Provayder", type: "text" },
  internetTech: { label: "Texnologiya", type: "text" },
  internetQuality: { label: "Sifat (%)", type: "number" },
  // youth_leader
  youthLedger: { label: "Yoshlar daftari", type: "number" },
  // women_activist
  womenCount: { label: "Ayollar soni", type: "number" },
  womenLedger: { label: "Ayollar daftari", type: "number" },
  medicName: { label: "Tibbiyot xodimi F.I.O.", type: "text" },
  medicTitle: { label: "Lavozimi", type: "text" },
  medicFacility: { label: "Muassasa", type: "text" },
  medicPhone: { label: "Telefon", type: "text" },
  // hokim_assistant
  employedCount: { label: "Ishlaydiganlar", type: "number" },
  unemployedCount: { label: "Ishsizlar", type: "number" },
  appealOfficerName: { label: "Murojaat xodimi F.I.O.", type: "text" },
  appealOfficerTitle: { label: "Lavozimi", type: "text" },
  appealOfficerSector: { label: "Sektor", type: "text" },
  appealOfficerPhone: { label: "Telefon", type: "text" },
  trashLastPickup: { label: "Oxirgi axlat olib ketildi", type: "date" },
  trashSchedule: { label: "Axlat jadvali", type: "text" },
  trashBins: { label: "Konteyner soni", type: "number" },
  harvestsPerYear: { label: "Yiliga hosil", type: "number" },
  gardenArea: { label: "Tomorqa (sotix)", type: "number" },
  cropName: { label: "Ekin nomi", type: "text" },
  cropYieldKg: { label: "Hosil (kg)", type: "number" },
  cropPriceUzs: { label: "Narx (so'm/kg)", type: "number" },
  livestockCattle: { label: "Qoramol", type: "number" },
  livestockSheep: { label: "Qo'y / echki", type: "number" },
  livestockPoultry: { label: "Parranda", type: "number" },
};

export const ROLE_HOUSE_FIELDS = {
  chairman: ["name", "owner", "phone", "members", "ownership", "address", "kind", "area", "floors", "heightM", "value", "notes", "familiesCount", "residentsCount", "menCount"],
  tax_inspector: ["taxAnnual", "taxDebt", "mibDebt", "officerName", "officerTitle", "officerPhone", "officerSector"],
  prevention_inspector: ["fireRiskPct", "fireFindings", "fireInspection", "fireOfficerName", "fireOfficerTitle", "fireOfficerDept", "fireOfficerPhone", "crimeClean", "crimeNote", "crimeOfficerName", "crimeOfficerTitle", "crimeOfficerPhone"],
  bank_officer: ["utilGas", "utilElectric", "utilWater", "utilInternet", "gasType", "gasMonthly", "gasYearly", "gasMeter", "gasPressure", "gasLimit", "gasCylinderFamilies", "elecMonthly", "elecNorm", "solarInstalled", "internetConnected", "internetSpeed", "internetProvider", "internetTech", "internetQuality"],
  youth_leader: ["youthLedger"],
  women_activist: ["womenCount", "womenLedger", "medicName", "medicTitle", "medicFacility", "medicPhone"],
  hokim_assistant: ["employedCount", "unemployedCount", "appealOfficerName", "appealOfficerTitle", "appealOfficerSector", "appealOfficerPhone", "trashLastPickup", "trashSchedule", "trashBins", "harvestsPerYear", "gardenArea", "cropName", "cropYieldKg", "cropPriceUzs", "livestockCattle", "livestockSheep", "livestockPoultry"],
};

export const houseFieldsForRole = (role) => (ROLE_HOUSE_FIELDS[role] || []).map((k) => ({ key: k, ...HOUSE_FIELD_DEFS[k] }));

const BOOL_KEYS = new Set(Object.entries(HOUSE_FIELD_DEFS).filter(([, d]) => d.type === "bool").map(([k]) => k));
const NUM_KEYS = new Set(Object.entries(HOUSE_FIELD_DEFS).filter(([, d]) => d.type === "number").map(([k]) => k));

const toBool = (v) => (v === "" || v == null ? null : v === "ha");
const fromBool = (v) => (v == null ? "" : v ? "ha" : "yoq");
const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

export const houseToForm = (house, role) =>
  Object.fromEntries(houseFieldsForRole(role).map((f) => [f.key, f.type === "bool" ? fromBool(house?.[f.key]) : house?.[f.key] ?? ""]));

export const formToHouseBody = (state, role) =>
  Object.fromEntries(
    houseFieldsForRole(role).map((f) => {
      if (BOOL_KEYS.has(f.key)) return [f.key, toBool(state[f.key])];
      if (NUM_KEYS.has(f.key)) return [f.key, numOrNull(state[f.key])];
      return [f.key, state[f.key]];
    }),
  );
