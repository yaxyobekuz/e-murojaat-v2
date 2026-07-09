import { z } from "zod";

const optStr = (max) => z.string().trim().max(max).optional().or(z.literal(""));
const optNum = z.coerce.number().min(0).optional().nullable();
const optBool = z.boolean().optional().nullable();

// Xonadon ma'lumotlari — panelda ko'rinadigan barcha bo'limlar tahrirlanadi, hammasi ixtiyoriy
export const upsertHouseSchema = z.object({
  // asosiy
  name: optStr(120),
  owner: optStr(120),
  phone: optStr(20),
  members: z.coerce.number().int().min(0).max(50).optional().nullable(),
  ownership: z.enum(["Xususiy", "Davlat", "Yuridik shaxs", ""]).optional(),
  address: optStr(200),
  notes: optStr(1000),
  // reyestr
  kind: optStr(80),
  area: optNum,
  floors: optNum,
  heightM: optNum,
  value: optNum,
  // soliq holati
  taxAnnual: optNum,
  taxDebt: optNum,
  mibDebt: optNum,
  // biriktirilgan xodim
  officerName: optStr(120),
  officerTitle: optStr(120),
  officerPhone: optStr(20),
  officerSector: optStr(40),
  // kommunal (null = namunaviy qiymat qoladi)
  utilGas: optBool,
  utilElectric: optBool,
  utilWater: optBool,
  utilInternet: optBool,
  // murojaat tabi — demografiya
  familiesCount: optNum,
  residentsCount: optNum,
  womenCount: optNum,
  menCount: optNum,
  youthLedger: optNum,
  womenLedger: optNum,
  employedCount: optNum,
  unemployedCount: optNum,
  gasCylinderFamilies: optNum,
  // murojaat tabi — biriktirilgan xodimlar
  appealOfficerName: optStr(120),
  appealOfficerTitle: optStr(120),
  appealOfficerSector: optStr(40),
  appealOfficerPhone: optStr(20),
  medicName: optStr(120),
  medicTitle: optStr(120),
  medicFacility: optStr(120),
  medicPhone: optStr(20),
  // xizmat tabi — internet
  internetConnected: optBool,
  internetSpeed: optNum,
  internetProvider: optStr(60),
  internetTech: optStr(60),
  internetQuality: z.coerce.number().min(0).max(100).optional().nullable(),
  // xizmat tabi — gaz
  gasType: z.enum(["natural", "lpg", ""]).optional().nullable(),
  gasMonthly: optNum,
  gasMeter: optStr(40),
  gasPressure: z.enum(["Normal", "Past", "Yuqori", ""]).optional().nullable(),
  gasLimit: optNum,
  gasYearly: optNum,
  // xizmat tabi — elektr
  elecMonthly: optNum,
  elecNorm: optNum,
  solarInstalled: optBool,
  // xizmat tabi — axlat
  trashLastPickup: optStr(40),
  trashSchedule: optStr(60),
  trashBins: optNum,
  // xizmat tabi — yong'in xavfsizligi
  fireRiskPct: z.coerce.number().min(0).max(100).optional().nullable(),
  fireFindings: optStr(300),
  fireInspection: optStr(40),
  fireOfficerName: optStr(120),
  fireOfficerTitle: optStr(120),
  fireOfficerDept: optStr(120),
  fireOfficerPhone: optStr(20),
  // xizmat tabi — jamoat xavfsizligi
  crimeClean: optBool,
  crimeNote: optStr(300),
  crimeOfficerName: optStr(120),
  crimeOfficerTitle: optStr(120),
  crimeOfficerPhone: optStr(20),
  // tomorqa tabi
  harvestsPerYear: z.coerce.number().int().min(0).max(6).optional().nullable(),
  gardenArea: optNum,
  cropName: optStr(60),
  cropYieldKg: optNum,
  cropPriceUzs: optNum,
  livestockCattle: optNum,
  livestockSheep: optNum,
  livestockPoultry: optNum,
});
