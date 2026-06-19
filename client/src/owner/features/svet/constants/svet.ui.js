// FE labels + tones for the citizen Svet (Elektr) views (UI text in Uzbek)

export const SERVICE_TYPE_LABELS = {
  hisoblagich_ornatish: "Hisoblagich o'rnatish",
  hisoblagich_yechish: "Hisoblagich yechish",
  ulanish: "Elektr tarmog'iga ulanish",
  uzish_tiklash: "Ta'minotni to'xtatish / tiklash",
  tamirlash: "Nosozlik / ta'mirlash",
};

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  olchov: "Tekshiruv",
  tolov: "To'lov",
  bajarildi: "Bajarildi",
  rad_etildi: "Rad etildi",
};

export const REQUEST_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  olchov: "bg-indigo-50 text-indigo-700 border-indigo-200",
  tolov: "bg-amber-50 text-amber-700 border-amber-200",
  bajarildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rad_etildi: "bg-rose-50 text-rose-700 border-rose-200",
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

export const PAYMENT_METHOD_LABELS = {
  click: "Click",
  payme: "Payme",
  uzcard: "UzCard",
  bank: "Bank",
  naqd: "Naqd",
};

export const PAYMENT_METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const METER_TYPE_LABELS = {
  aqlli: "Aqlli hisoblagich",
  oddiy: "Oddiy",
};

export const SVET_ACCENT = "#f59e0b";
