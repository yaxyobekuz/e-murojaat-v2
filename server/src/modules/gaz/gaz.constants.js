// Gas subscriber kind
export const SUBSCRIBER_TYPES = Object.freeze({
  INDIVIDUAL: "jismoniy",
  LEGAL: "yuridik",
});

export const SUBSCRIBER_TYPE_VALUES = Object.values(SUBSCRIBER_TYPES);

// Subscriber supply status
export const SUBSCRIBER_STATUSES = Object.freeze({
  ACTIVE: "faol",
  DEBTOR: "qarzdor",
  CUTOFF: "uzilgan",
});

export const SUBSCRIBER_STATUS_VALUES = Object.values(SUBSCRIBER_STATUSES);

// Gas meter kind
export const METER_TYPES = Object.freeze({
  SMART: "EGHU",
  REGULAR: "oddiy",
});

export const METER_TYPE_VALUES = Object.values(METER_TYPES);

// Mock payment channels (Click/Payme/UzCard/bank)
export const PAYMENT_METHODS = Object.freeze({
  CLICK: "click",
  PAYME: "payme",
  UZCARD: "uzcard",
  BANK: "bank",
});

export const PAYMENT_METHOD_VALUES = Object.values(PAYMENT_METHODS);

// Gas service request types the citizen can apply for
export const SERVICE_TYPES = Object.freeze({
  METER_INSTALL: "hisoblagich_ornatish",
  METER_REMOVE: "hisoblagich_yechish",
  CONNECT: "ulanish",
  SUSPEND: "taminot_toxtatish",
  RESTORE: "taminot_tiklash",
  LEAK: "nosozlik",
});

export const SERVICE_TYPE_VALUES = Object.values(SERVICE_TYPES);

export const SERVICE_TYPE_LABELS = Object.freeze({
  [SERVICE_TYPES.METER_INSTALL]: "Hisoblagich o'rnatish",
  [SERVICE_TYPES.METER_REMOVE]: "Hisoblagichni yechish",
  [SERVICE_TYPES.CONNECT]: "Gaz tarmog'iga ulanish",
  [SERVICE_TYPES.SUSPEND]: "Ta'minotni to'xtatish",
  [SERVICE_TYPES.RESTORE]: "Ta'minotni qayta tiklash",
  [SERVICE_TYPES.LEAK]: "Gaz sizishi / ta'mirlash",
});

// Request workflow status (shared platform pattern)
export const REQUEST_STATUSES = Object.freeze({
  NEW: "yangi",
  REVIEW: "korib_chiqilmoqda",
  ASSIGNED: "yonaltirildi",
  DONE: "bajarildi",
  REJECTED: "rad_etildi",
});

export const REQUEST_STATUS_VALUES = Object.values(REQUEST_STATUSES);

export const REQUEST_STATUS_LABELS = Object.freeze({
  [REQUEST_STATUSES.NEW]: "Yangi",
  [REQUEST_STATUSES.REVIEW]: "Ko'rib chiqilmoqda",
  [REQUEST_STATUSES.ASSIGNED]: "Yo'naltirildi",
  [REQUEST_STATUSES.DONE]: "Bajarildi",
  [REQUEST_STATUSES.REJECTED]: "Rad etildi",
});

// Terminal statuses cannot transition further
export const TERMINAL_STATUSES = [
  REQUEST_STATUSES.DONE,
  REQUEST_STATUSES.REJECTED,
];
