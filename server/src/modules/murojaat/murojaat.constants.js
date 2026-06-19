// Appeal kinds
export const APPEAL_TYPES = Object.freeze({
  REQUEST: "ariza",
  COMPLAINT: "shikoyat",
  SUGGESTION: "taklif",
});

export const APPEAL_TYPE_VALUES = Object.values(APPEAL_TYPES);

export const APPEAL_TYPE_LABELS = Object.freeze({
  [APPEAL_TYPES.REQUEST]: "Ariza",
  [APPEAL_TYPES.COMPLAINT]: "Shikoyat",
  [APPEAL_TYPES.SUGGESTION]: "Taklif",
});

// Subject area (soha) — which domain the appeal touches
export const CATEGORIES = Object.freeze({
  GAS: "gaz",
  ELECTRICITY: "elektr",
  LAND: "yer",
  ROAD: "yol",
  EDUCATION: "talim",
  UTILITIES: "kommunal",
  HEALTH: "sogliq",
  ECOLOGY: "ekologiya",
  SOCIAL: "ijtimoiy",
  OTHER: "boshqa",
});

export const CATEGORY_VALUES = Object.values(CATEGORIES);

export const CATEGORY_LABELS = Object.freeze({
  [CATEGORIES.GAS]: "Gaz ta'minoti",
  [CATEGORIES.ELECTRICITY]: "Elektr ta'minoti",
  [CATEGORIES.LAND]: "Yer va mol-mulk",
  [CATEGORIES.ROAD]: "Yo'l infratuzilmasi",
  [CATEGORIES.EDUCATION]: "Ta'lim",
  [CATEGORIES.UTILITIES]: "Kommunal xizmatlar",
  [CATEGORIES.HEALTH]: "Sog'liqni saqlash",
  [CATEGORIES.ECOLOGY]: "Ekologiya",
  [CATEGORIES.SOCIAL]: "Ijtimoiy himoya",
  [CATEGORIES.OTHER]: "Boshqa",
});

// Organization kinds (the body that answers an appeal)
export const ORGANIZATION_TYPES = Object.freeze({
  HOKIMLIK: "hokimlik",
  VAZIRLIK: "vazirlik",
  ENTERPRISE: "korxona",
});

export const ORGANIZATION_TYPE_VALUES = Object.values(ORGANIZATION_TYPES);

// Appeal workflow status
export const APPEAL_STATUSES = Object.freeze({
  NEW: "yangi",
  REVIEW: "korib_chiqilmoqda",
  FORWARDED: "yonaltirildi",
  ANSWERED: "javob_berildi",
  CLOSED: "yopildi",
});

export const APPEAL_STATUS_VALUES = Object.values(APPEAL_STATUSES);

export const APPEAL_STATUS_LABELS = Object.freeze({
  [APPEAL_STATUSES.NEW]: "Yangi",
  [APPEAL_STATUSES.REVIEW]: "Ko'rib chiqilmoqda",
  [APPEAL_STATUSES.FORWARDED]: "Yo'naltirildi",
  [APPEAL_STATUSES.ANSWERED]: "Javob berildi",
  [APPEAL_STATUSES.CLOSED]: "Yopildi",
});

// Statuses still in the operator's queue (not yet answered)
export const OPEN_STATUSES = [
  APPEAL_STATUSES.NEW,
  APPEAL_STATUSES.REVIEW,
  APPEAL_STATUSES.FORWARDED,
];

// Once closed it cannot transition further
export const TERMINAL_STATUSES = [APPEAL_STATUSES.CLOSED];

// Final outcome of the appeal
export const APPEAL_RESULTS = Object.freeze({
  SATISFIED: "qanoatlantirildi",
  REJECTED: "rad_etildi",
  EXPLAINED: "tushuntirildi",
});

export const APPEAL_RESULT_VALUES = Object.values(APPEAL_RESULTS);

export const APPEAL_RESULT_LABELS = Object.freeze({
  [APPEAL_RESULTS.SATISFIED]: "Qanoatlantirildi",
  [APPEAL_RESULTS.REJECTED]: "Rad etildi",
  [APPEAL_RESULTS.EXPLAINED]: "Tushuntirildi",
});

// Default review deadline (days) per administrative regulation
export const DEADLINE_DAYS = 15;
