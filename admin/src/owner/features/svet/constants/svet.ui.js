// FE labels + tones for the Svet (Elektr) module (mirrors server enums; UI text in Uzbek)

export const SUBSCRIBER_TYPE_LABELS = {
  jismoniy: "Jismoniy shaxs",
  yuridik: "Yuridik shaxs",
};

export const SUBSCRIBER_STATUS_LABELS = {
  faol: "Faol",
  uzilgan: "Uzilgan",
  qarzdor: "Qarzdor",
};

export const SUBSCRIBER_STATUS_TONE = {
  faol: "bg-emerald-50 text-emerald-700 border-emerald-200",
  uzilgan: "bg-zinc-100 text-zinc-600 border-zinc-200",
  qarzdor: "bg-rose-50 text-rose-700 border-rose-200",
};

export const METER_TYPE_LABELS = {
  aqlli: "Aqlli hisoblagich",
  oddiy: "Oddiy",
};

export const PAYMENT_METHOD_LABELS = {
  click: "Click",
  payme: "Payme",
  uzcard: "UzCard",
  bank: "Bank",
  naqd: "Naqd",
};

export const SERVICE_TYPE_LABELS = {
  hisoblagich_ornatish: "Hisoblagich o'rnatish",
  hisoblagich_yechish: "Hisoblagich yechish",
  ulanish: "Elektr tarmog'iga ulanish",
  uzish_tiklash: "Ta'minotni to'xtatish / tiklash",
  tamirlash: "Nosozlik / ta'mirlash",
};

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  olchov: "Tekshiruv",
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

export const VIOLATION_TYPE_LABELS = {
  aylanib_otish: "Hisoblagichni aylanib o'tish",
  ogirlik: "Elektr o'g'irligi",
  muhr_buzish: "Muhrni buzish",
  ruxsatsiz_ulanish: "Ruxsatsiz ulanish",
};

export const VIOLATION_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  jarima_yozildi: "Jarima yozildi",
  yopildi: "Yopildi",
};

export const VIOLATION_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  jarima_yozildi: "bg-violet-50 text-violet-700 border-violet-200",
  yopildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// Dropdown options
export const SUBSCRIBER_TYPE_OPTIONS = Object.entries(SUBSCRIBER_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const SUBSCRIBER_STATUS_OPTIONS = Object.entries(SUBSCRIBER_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const REQUEST_STATUS_OPTIONS = Object.entries(REQUEST_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const VIOLATION_TYPE_OPTIONS = Object.entries(VIOLATION_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const VIOLATION_STATUS_OPTIONS = Object.entries(VIOLATION_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

// Module accent color (Svet/Elektr = amber per design system)
export const SVET_ACCENT = "#f59e0b";

// Ordered transitions an operator can move a request to
export const NEXT_STATUS_OPTIONS = [
  { value: "korib_chiqilmoqda", label: "Ko'rib chiqilmoqda" },
  { value: "olchov", label: "Tekshiruv" },
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
