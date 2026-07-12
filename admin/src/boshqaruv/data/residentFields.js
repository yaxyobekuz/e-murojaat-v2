// Aholi formasi maydonlari — server validator (residents.validators.js) bilan mos.
// Bir joyda ta'riflab, drawer shu konfiguratsiyadan formani hosil qiladi.

const BOOL_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "ha", label: "Ha" },
  { value: "yoq", label: "Yo'q" },
];

const sel = (values) => [{ value: "", label: "Belgilanmagan" }, ...values.map((v) => ({ value: v, label: v }))];

export const RESIDENT_SECTIONS = [
  {
    title: "Shaxsiy ma'lumotlar",
    fields: [
      { key: "fullName", label: "F.I.O.", type: "text", required: true, full: true, placeholder: "Familiya Ism Otasining ismi" },
      { key: "jshshir", label: "JSHSHIR", type: "text", placeholder: "14 raqam" },
      { key: "birthDate", label: "Tug'ilgan sana", type: "date" },
      { key: "gender", label: "Jinsi", type: "select", options: sel(["Erkak", "Ayol"]) },
      { key: "nationality", label: "Millati", type: "text", placeholder: "O'zbek" },
      { key: "phone", label: "Telefon", type: "text", placeholder: "+998 90 123-45-67" },
      { key: "passportSeries", label: "Passport / ID", type: "text", placeholder: "AB1234567" },
    ],
  },
  {
    title: "Manzil va ro'yxat",
    fields: [
      { key: "address", label: "Manzil", type: "text", full: true, placeholder: "Ko'cha, uy raqami" },
      { key: "registrationType", label: "Ro'yxat turi", type: "select", options: sel(["Doimiy", "Vaqtinchalik"]) },
    ],
  },
  {
    title: "Ijtimoiy holat",
    fields: [
      { key: "maritalStatus", label: "Oilaviy holati", type: "select", options: sel(["Uylanmagan", "Uylangan", "Ajrashgan", "Beva"]) },
      { key: "education", label: "Ma'lumoti", type: "select", options: sel(["Oliy", "Tugallanmagan oliy", "O'rta maxsus", "O'rta", "Boshlang'ich"]) },
      { key: "employment", label: "Bandligi", type: "select", options: sel(["Ishlaydi", "Ishsiz", "Talaba", "O'quvchi", "Pensioner", "Nogiron", "Uy bekasi"]) },
      { key: "workplace", label: "Ish / o'qish joyi", type: "text", placeholder: "Tashkilot nomi" },
      { key: "position", label: "Lavozimi", type: "text", placeholder: "—" },
      { key: "monthlyIncome", label: "Oylik daromadi (so'm)", type: "number", placeholder: "—" },
    ],
  },
  {
    title: "Hisobga olish (daftarlar)",
    fields: [
      { key: "disability", label: "Nogironlik", type: "select", options: sel(["Yo'q", "1-guruh", "2-guruh", "3-guruh", "Bolalikdan"]) },
      { key: "militaryStatus", label: "Harbiy hisob", type: "select", options: sel(["Hisobda", "Hisobda emas", "Muddatli xizmatda", "Zaxirada"]) },
      { key: "pensioner", label: "Pensioner", type: "bool", options: BOOL_OPTIONS },
      { key: "ironNotebook", label: "Temir daftar", type: "bool", options: BOOL_OPTIONS },
      { key: "womenNotebook", label: "Ayollar daftari", type: "bool", options: BOOL_OPTIONS },
      { key: "youthNotebook", label: "Yoshlar daftari", type: "bool", options: BOOL_OPTIONS },
    ],
  },
  {
    title: "Qo'shimcha",
    fields: [{ key: "notes", label: "Izoh", type: "textarea", full: true, placeholder: "Qo'shimcha ma'lumot..." }],
  },
];

export const RESIDENT_FIELDS = RESIDENT_SECTIONS.flatMap((s) => s.fields);
const BOOL_KEYS = RESIDENT_FIELDS.filter((f) => f.type === "bool").map((f) => f.key);
const NUM_KEYS = RESIDENT_FIELDS.filter((f) => f.type === "number").map((f) => f.key);

const toBool = (v) => (v === "" || v == null ? null : v === "ha");
const fromBool = (v) => (v == null ? "" : v ? "ha" : "yoq");
const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

// bo'sh forma holati
export const emptyResident = () => Object.fromEntries(RESIDENT_FIELDS.map((f) => [f.key, ""]));

// server yozuvi -> forma holati
export const residentToForm = (resident) =>
  Object.fromEntries(
    RESIDENT_FIELDS.map((f) => {
      const raw = resident?.[f.key];
      if (f.type === "bool") return [f.key, fromBool(raw)];
      return [f.key, raw ?? ""];
    }),
  );

// forma holati -> server body (bool va son maydonlarini konvertatsiya)
export const formToBody = (state) => {
  const body = { ...state };
  BOOL_KEYS.forEach((k) => (body[k] = toBool(state[k])));
  NUM_KEYS.forEach((k) => (body[k] = numOrNull(state[k])));
  return body;
};
