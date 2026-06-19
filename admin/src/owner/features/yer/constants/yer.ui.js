// FE labels + tones for the Yer module (mirrors server enums; UI text in Uzbek)

export const PROPERTY_TYPE_LABELS = {
  uy: "Uy",
  kvartira: "Kvartira",
  yer: "Yer uchastkasi",
  noturar: "Noturar obyekt",
};

export const OWNERSHIP_TYPE_LABELS = {
  xususiy: "Xususiy",
  davlat: "Davlat",
  ulushli: "Ulushli",
};

export const PROPERTY_STATUS_LABELS = {
  royxatda: "Ro'yxatda",
  jarayonda: "Jarayonda",
  nizoli: "Nizoli",
};

export const SERVICE_TYPE_LABELS = {
  kadastr_pasport: "Kadastr pasporti",
  malumot_tahrir: "Ma'lumot tahrirlash",
  ijara_royxat: "Ijara ro'yxati",
  servitut_royxat: "Servitut ro'yxati",
};

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  olchov: "O'lchov",
  tolov: "To'lov",
  bajarildi: "Bajarildi",
  rad_etildi: "Rad etildi",
};

// Badge tone classes per status (design rule: new=blue, progress=amber, done=green, rejected=red)
export const REQUEST_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  olchov: "bg-indigo-50 text-indigo-700 border-indigo-200",
  tolov: "bg-amber-50 text-amber-700 border-amber-200",
  bajarildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rad_etildi: "bg-rose-50 text-rose-700 border-rose-200",
};

export const PROPERTY_STATUS_TONE = {
  royxatda: "bg-emerald-50 text-emerald-700 border-emerald-200",
  jarayonda: "bg-amber-50 text-amber-700 border-amber-200",
  nizoli: "bg-rose-50 text-rose-700 border-rose-200",
};

// Dropdown options
export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const REQUEST_STATUS_OPTIONS = Object.entries(REQUEST_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

// Module accent color (Yer = emerald per design system)
export const YER_ACCENT = "#10b981";

// Ordered transitions an operator can move a request to
export const NEXT_STATUS_OPTIONS = [
  { value: "korib_chiqilmoqda", label: "Ko'rib chiqilmoqda" },
  { value: "olchov", label: "O'lchov" },
  { value: "tolov", label: "To'lov" },
  { value: "bajarildi", label: "Bajarildi" },
  { value: "rad_etildi", label: "Rad etildi" },
];

// Uzbek region list for filters
export const REGION_OPTIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Samarqand",
  "Buxoro",
  "Qashqadaryo",
  "Surxondaryo",
  "Xorazm",
  "Navoiy",
  "Jizzax",
  "Sirdaryo",
].map((r) => ({ value: r, label: r }));
