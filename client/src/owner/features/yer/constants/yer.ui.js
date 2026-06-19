// FE labels + tones for the citizen Yer views (UI text in Uzbek)

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
  kadastr_pasport: "Kadastr pasportini rasmiylashtirish",
  malumot_tahrir: "Mulk ma'lumotlarini tahrirlash",
  ijara_royxat: "Ijara shartnomasini ro'yxatdan o'tkazish",
  servitut_royxat: "Servitut ro'yxatdan o'tkazish",
};

export const REQUEST_STATUS_LABELS = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  olchov: "O'lchov",
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

export const PROPERTY_STATUS_TONE = {
  royxatda: "bg-emerald-50 text-emerald-700 border-emerald-200",
  jarayonda: "bg-amber-50 text-amber-700 border-amber-200",
  nizoli: "bg-rose-50 text-rose-700 border-rose-200",
};

export const SERVICE_TYPE_OPTIONS = Object.entries(SERVICE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const PROPERTY_TYPE_ICON_TONE = {
  uy: "from-emerald-400 to-emerald-600",
  kvartira: "from-blue-400 to-blue-600",
  yer: "from-lime-400 to-green-600",
  noturar: "from-amber-400 to-amber-600",
};
