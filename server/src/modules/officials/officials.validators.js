import { z } from "zod";

const optStr = (max) => z.string().trim().max(max).optional().or(z.literal(""));

// Mahalla yettiligi a'zosi — lavozim kodi URL param'da, F.I.O.dan boshqasi ixtiyoriy
export const upsertOfficialSchema = z.object({
  fullName: z.string().trim().min(1, "F.I.O. majburiy").max(160),
  phone: optStr(20),
  birthDate: optStr(20),
  appointedDate: optStr(20),
  education: z.enum(["Oliy", "Tugallanmagan oliy", "O'rta maxsus", "O'rta", "Boshlang'ich", ""]).optional(),
  receptionDays: optStr(120),
  office: optStr(160),
  telegram: optStr(60),
  notes: optStr(1000),
});
