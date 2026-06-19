// FE labels + tones for the citizen Gaz views (UI text in Uzbek)

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
  EGHU: "EGHU (aqlli hisoblagich)",
  oddiy: "Oddiy hisoblagich",
};

export const PAYMENT_METHOD_LABELS = {
  click: "Click",
  payme: "Payme",
  uzcard: "UzCard",
  bank: "Bank o'tkazma",
};

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const SERVICE_TYPE_LABELS = {
  hisoblagich_ornatish: "Hisoblagich o'rnatish",
  hisoblagich_yechish: "Hisoblagichni yechish",
  ulanish: "Gaz tarmog'iga ulanish",
  taminot_toxtatish: "Ta'minotni to'xtatish",
  taminot_tiklash: "Ta'minotni qayta tiklash",
  nosozlik: "Gaz sizishi / ta'mirlash",
};

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  yonaltirildi: "Yo'naltirildi",
  bajarildi: "Bajarildi",
  rad_etildi: "Rad etildi",
};

export const REQUEST_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  yonaltirildi: "bg-indigo-50 text-indigo-700 border-indigo-200",
  bajarildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rad_etildi: "bg-rose-50 text-rose-700 border-rose-200",
};

export const GAZ_ACCENT = "#1E4FD8";
