// Electric subscriber kind
export const SUBSCRIBER_TYPES = Object.freeze({
  INDIVIDUAL: "jismoniy",
  LEGAL: "yuridik",
});

export const SUBSCRIBER_TYPE_VALUES = Object.values(SUBSCRIBER_TYPES);

// Subscriber account status
export const SUBSCRIBER_STATUSES = Object.freeze({
  ACTIVE: "faol",
  SUSPENDED: "uzilgan",
  DEBTOR: "qarzdor",
});

export const SUBSCRIBER_STATUS_VALUES = Object.values(SUBSCRIBER_STATUSES);

// Smart electric meter vs ordinary
export const METER_TYPES = Object.freeze({
  SMART: "aqlli",
  ORDINARY: "oddiy",
});

export const METER_TYPE_VALUES = Object.values(METER_TYPES);

// Mock payment methods
export const PAYMENT_METHODS = Object.freeze({
  CLICK: "click",
  PAYME: "payme",
  UZCARD: "uzcard",
  BANK: "bank",
  CASH: "naqd",
});

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHODS);

export const PAYMENT_METHOD_LABELS = Object.freeze({
  [PAYMENT_METHODS.CLICK]: "Click",
  [PAYMENT_METHODS.PAYME]: "Payme",
  [PAYMENT_METHODS.UZCARD]: "UzCard",
  [PAYMENT_METHODS.BANK]: "Bank",
  [PAYMENT_METHODS.CASH]: "Naqd",
});

// Electric service request types the citizen can apply for
export const SERVICE_TYPES = Object.freeze({
  METER_INSTALL: "hisoblagich_ornatish",
  METER_REMOVE: "hisoblagich_yechish",
  CONNECTION: "ulanish",
  SUSPEND_RESTORE: "uzish_tiklash",
  REPAIR: "tamirlash",
});

export const SERVICE_TYPE_VALUES = Object.values(SERVICE_TYPES);

export const SERVICE_TYPE_LABELS = Object.freeze({
  [SERVICE_TYPES.METER_INSTALL]: "Hisoblagich o'rnatish",
  [SERVICE_TYPES.METER_REMOVE]: "Hisoblagich yechish",
  [SERVICE_TYPES.CONNECTION]: "Elektr tarmog'iga ulanish",
  [SERVICE_TYPES.SUSPEND_RESTORE]: "Ta'minotni to'xtatish / tiklash",
  [SERVICE_TYPES.REPAIR]: "Nosozlik / ta'mirlash",
});

// Shared request workflow (same pattern as every module)
export const REQUEST_STATUSES = Object.freeze({
  NEW: "yangi",
  REVIEW: "korib_chiqilmoqda",
  MEASURE: "olchov",
  PAYMENT: "tolov",
  DONE: "bajarildi",
  REJECTED: "rad_etildi",
});

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUSES);

export const REQUEST_STATUS_LABELS = Object.freeze({
  [REQUEST_STATUSES.NEW]: "Yangi",
  [REQUEST_STATUSES.REVIEW]: "Ko'rib chiqilmoqda",
  [REQUEST_STATUSES.MEASURE]: "Tekshiruv",
  [REQUEST_STATUSES.PAYMENT]: "To'lov",
  [REQUEST_STATUSES.DONE]: "Bajarildi",
  [REQUEST_STATUSES.REJECTED]: "Rad etildi",
});

export const TERMINAL_STATUSES = [
  REQUEST_STATUSES.DONE,
  REQUEST_STATUSES.REJECTED,
];

// E-dalolatnoma (violation act) types — Svet-specific
export const VIOLATION_TYPES = Object.freeze({
  BYPASS: "aylanib_otish",
  THEFT: "ogirlik",
  SEAL_BREAK: "muhr_buzish",
  ILLEGAL: "ruxsatsiz_ulanish",
});

export const VIOLATION_TYPE_VALUES = Object.values(VIOLATION_TYPES);

export const VIOLATION_TYPE_LABELS = Object.freeze({
  [VIOLATION_TYPES.BYPASS]: "Hisoblagichni aylanib o'tish",
  [VIOLATION_TYPES.THEFT]: "Elektr o'g'irligi",
  [VIOLATION_TYPES.SEAL_BREAK]: "Muhrni buzish",
  [VIOLATION_TYPES.ILLEGAL]: "Ruxsatsiz ulanish",
});

// Violation act status
export const VIOLATION_STATUSES = Object.freeze({
  NEW: "yangi",
  REVIEW: "korib_chiqilmoqda",
  FINED: "jarima_yozildi",
  CLOSED: "yopildi",
});

export const VIOLATION_STATUS_VALUES = Object.values(VIOLATION_STATUSES);

export const VIOLATION_STATUS_LABELS = Object.freeze({
  [VIOLATION_STATUSES.NEW]: "Yangi",
  [VIOLATION_STATUSES.REVIEW]: "Ko'rib chiqilmoqda",
  [VIOLATION_STATUSES.FINED]: "Jarima yozildi",
  [VIOLATION_STATUSES.CLOSED]: "Yopildi",
});
