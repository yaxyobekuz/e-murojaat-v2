import { z } from "zod";

const optStr = (max) => z.string().trim().max(max).optional().or(z.literal(""));
const optNum = z.coerce.number().min(0).optional().nullable();
const optBool = z.boolean().optional().nullable();

// aholi (fuqaro) yozuvi — F.I.O.dan boshqa barcha maydonlar ixtiyoriy
const base = {
  jshshir: optStr(14),
  birthDate: optStr(20),
  gender: z.enum(["Erkak", "Ayol", ""]).optional(),
  nationality: optStr(60),
  phone: optStr(20),
  passportSeries: optStr(20),
  address: optStr(200),
  registrationType: z.enum(["Doimiy", "Vaqtinchalik", ""]).optional(),
  maritalStatus: z.enum(["Uylanmagan", "Uylangan", "Ajrashgan", "Beva", ""]).optional(),
  education: z.enum(["Oliy", "Tugallanmagan oliy", "O'rta maxsus", "O'rta", "Boshlang'ich", ""]).optional(),
  employment: z.enum(["Ishlaydi", "Ishsiz", "Talaba", "O'quvchi", "Pensioner", "Nogiron", "Uy bekasi", ""]).optional(),
  workplace: optStr(160),
  position: optStr(120),
  monthlyIncome: optNum,
  disability: z.enum(["Yo'q", "1-guruh", "2-guruh", "3-guruh", "Bolalikdan", ""]).optional(),
  militaryStatus: z.enum(["Hisobda", "Hisobda emas", "Muddatli xizmatda", "Zaxirada", ""]).optional(),
  pensioner: optBool,
  ironNotebook: optBool,
  womenNotebook: optBool,
  youthNotebook: optBool,
  notes: optStr(1000),
};

export const createResidentSchema = z.object({
  fullName: z.string().trim().min(1, "F.I.O. majburiy").max(160),
  ...base,
});

export const updateResidentSchema = z.object({
  fullName: z.string().trim().min(1, "F.I.O. bo'sh bo'lishi mumkin emas").max(160).optional(),
  ...base,
});
