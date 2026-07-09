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
});
