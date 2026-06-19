// FE labels + tones for the Murojaat module (citizen side; UI text in Uzbek)

export const APPEAL_TYPE_LABELS = {
  ariza: "Ariza",
  shikoyat: "Shikoyat",
  taklif: "Taklif",
};

export const CATEGORY_LABELS = {
  gaz: "Gaz ta'minoti",
  elektr: "Elektr ta'minoti",
  yer: "Yer va mol-mulk",
  yol: "Yo'l infratuzilmasi",
  talim: "Ta'lim",
  kommunal: "Kommunal xizmatlar",
  sogliq: "Sog'liqni saqlash",
  ekologiya: "Ekologiya",
  ijtimoiy: "Ijtimoiy himoya",
  boshqa: "Boshqa",
};

export const APPEAL_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  yonaltirildi: "Yo'naltirildi",
  javob_berildi: "Javob berildi",
  yopildi: "Yopildi",
};

export const APPEAL_RESULT_LABELS = {
  qanoatlantirildi: "Qanoatlantirildi",
  rad_etildi: "Rad etildi",
  tushuntirildi: "Tushuntirildi",
};

export const APPEAL_STATUS_TONE = {
  yangi: "bg-blue-50 text-blue-700 border-blue-200",
  korib_chiqilmoqda: "bg-amber-50 text-amber-700 border-amber-200",
  yonaltirildi: "bg-indigo-50 text-indigo-700 border-indigo-200",
  javob_berildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yopildi: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export const APPEAL_RESULT_TONE = {
  qanoatlantirildi: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rad_etildi: "bg-rose-50 text-rose-700 border-rose-200",
  tushuntirildi: "bg-amber-50 text-amber-700 border-amber-200",
};

export const APPEAL_TYPE_OPTIONS = Object.entries(APPEAL_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);
export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);
