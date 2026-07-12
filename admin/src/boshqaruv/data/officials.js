// Mahalla yettiligi — 7 kanonik lavozim (kod inglizcha, nomi o'zbekcha) + forma maydonlari.
import { Crown, Briefcase, ShieldAlert, Landmark, Banknote, Rocket, HeartHandshake } from "lucide-react";

export const MAHALLA_SEVEN = [
  { role: "chairman", label: "Mahalla raisi", icon: Crown, accent: "text-amber-400" },
  { role: "hokim_assistant", label: "Hokim yordamchisi", icon: Briefcase, accent: "text-blue-400" },
  { role: "prevention_inspector", label: "Profilaktika inspektori", icon: ShieldAlert, accent: "text-red-400" },
  { role: "tax_inspector", label: "Soliq inspektori", icon: Landmark, accent: "text-indigo-400" },
  { role: "bank_officer", label: "Bank xodimi", icon: Banknote, accent: "text-emerald-400" },
  { role: "youth_leader", label: "Yoshlar yetakchisi", icon: Rocket, accent: "text-orange-400" },
  { role: "women_activist", label: "Xotin-qizlar faoli", icon: HeartHandshake, accent: "text-violet-400" },
];

export const roleMeta = (role) => MAHALLA_SEVEN.find((r) => r.role === role) || { role, label: role, icon: Crown, accent: "text-foreground/60" };

const sel = (values) => [{ value: "", label: "Belgilanmagan" }, ...values.map((v) => ({ value: v, label: v }))];

export const OFFICIAL_FIELDS = [
  { key: "fullName", label: "F.I.O.", type: "text", required: true, full: true, placeholder: "Familiya Ism Otasining ismi" },
  { key: "phone", label: "Telefon", type: "text", placeholder: "+998 90 123-45-67" },
  { key: "birthDate", label: "Tug'ilgan sana", type: "date" },
  { key: "appointedDate", label: "Lavozimga tayinlangan", type: "date" },
  { key: "education", label: "Ma'lumoti", type: "select", options: sel(["Oliy", "Tugallanmagan oliy", "O'rta maxsus", "O'rta", "Boshlang'ich"]) },
  { key: "receptionDays", label: "Qabul kunlari", type: "text", placeholder: "Dushanba–Juma, 9:00–13:00" },
  { key: "office", label: "Qabulxona / xona", type: "text", full: true, placeholder: "Mahalla binosi, 2-xona" },
  { key: "telegram", label: "Telegram", type: "text", placeholder: "@username" },
  { key: "notes", label: "Izoh", type: "textarea", full: true, placeholder: "Qo'shimcha ma'lumot..." },
];

export const emptyOfficial = () => Object.fromEntries(OFFICIAL_FIELDS.map((f) => [f.key, ""]));
export const officialToForm = (o) => Object.fromEntries(OFFICIAL_FIELDS.map((f) => [f.key, o?.[f.key] ?? ""]));
