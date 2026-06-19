// FE labels + tones for the Gaz module (mirrors server enums; UI text in Uzbek)

export const SUBSCRIBER_TYPE_LABELS = {
  jismoniy: "Jismoniy shaxs",
  yuridik: "Yuridik shaxs",
};

export const SUBSCRIBER_STATUS_LABELS = {
  faol: "Faol",
  qarzdor: "Qarzdor",
  uzilgan: "Uzilgan",
};

export const SUBSCRIBER_STATUS_TONE = {
  faol: "bg-emerald-50 text-emerald-700 border-emerald-200",
  qarzdor: "bg-amber-50 text-amber-700 border-amber-200",
  uzilgan: "bg-rose-50 text-rose-700 border-rose-200",
};

export const METER_TYPE_LABELS = {
  EGHU: "EGHU (aqlli)",
  oddiy: "Oddiy",
};

export const PAYMENT_METHOD_LABELS = {
  click: "Click",
  payme: "Payme",
  uzcard: "UzCard",
  bank: "Bank o'tkazma",
};

export const SERVICE_TYPE_LABELS = {
  hisoblagich_ornatish: "Hisoblagich o'rnatish",
  hisoblagich_yechish: "Hisoblagichni yechish",
  ulanish: "Gaz tarmog'iga ulanish",
  taminot_toxtatish: "Ta'minotni to'xtatish",
  taminot_tiklash: "Ta'minotni qayta tiklash",
  nosozlik: "Gaz sizishi / ta'mirlash",
};

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  yonaltirildi: "Yo'naltirildi",
  bajarildi: "Bajarildi",
  rad_etildi: "Rad etildi",
};

// Badge tone classes per status (design rule: new=blue, progress=amber, done=green, rejected=red)
export const REQUEST_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  yonaltirildi: "bg-indigo-50 text-indigo-700 border-indigo-200",
  bajarildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rad_etildi: "bg-rose-50 text-rose-700 border-rose-200",
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

// Module accent color (Gaz = blue per design system)
export const GAZ_ACCENT = "#1E4FD8";

// Ordered transitions an operator can move a request to
export const NEXT_STATUS_OPTIONS = [
  { value: "korib_chiqilmoqda", label: "Ko'rib chiqilmoqda" },
  { value: "yonaltirildi", label: "Yo'naltirildi" },
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
