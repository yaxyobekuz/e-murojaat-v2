// Property object types
export const PROPERTY_TYPES = Object.freeze({
  HOUSE: "uy",
  APARTMENT: "kvartira",
  LAND: "yer",
  NON_RESIDENTIAL: "noturar",
});

export const PROPERTY_TYPE_VALUES = Object.values(PROPERTY_TYPES);

// Ownership kind
export const OWNERSHIP_TYPES = Object.freeze({
  PRIVATE: "xususiy",
  STATE: "davlat",
  SHARED: "ulushli",
});

export const OWNERSHIP_TYPE_VALUES = Object.values(OWNERSHIP_TYPES);

// Property registry status
export const PROPERTY_STATUSES = Object.freeze({
  REGISTERED: "royxatda",
  PENDING: "jarayonda",
  DISPUTED: "nizoli",
});

export const PROPERTY_STATUS_VALUES = Object.values(PROPERTY_STATUSES);

// Cadastre service types the citizen can apply for
export const SERVICE_TYPES = Object.freeze({
  CADASTRE_PASSPORT: "kadastr_pasport",
  EDIT_PROPERTY: "malumot_tahrir",
  LEASE_REGISTER: "ijara_royxat",
  SERVITUDE_REGISTER: "servitut_royxat",
});

export const SERVICE_TYPE_VALUES = Object.values(SERVICE_TYPES);

export const SERVICE_TYPE_LABELS = Object.freeze({
  [SERVICE_TYPES.CADASTRE_PASSPORT]: "Kadastr pasportini rasmiylashtirish",
  [SERVICE_TYPES.EDIT_PROPERTY]: "Mulk ma'lumotlarini tahrirlash",
  [SERVICE_TYPES.LEASE_REGISTER]: "Ijara shartnomasini ro'yxatdan o'tkazish",
  [SERVICE_TYPES.SERVITUDE_REGISTER]: "Servitut ro'yxatdan o'tkazish",
});

// Request workflow status (shared platform pattern)
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
  [REQUEST_STATUSES.MEASURE]: "O'lchov",
  [REQUEST_STATUSES.PAYMENT]: "To'lov",
  [REQUEST_STATUSES.DONE]: "Bajarildi",
  [REQUEST_STATUSES.REJECTED]: "Rad etildi",
});

// Terminal statuses cannot transition further
export const TERMINAL_STATUSES = [
  REQUEST_STATUSES.DONE,
  REQUEST_STATUSES.REJECTED,
];
