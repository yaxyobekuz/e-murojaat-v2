// Soliq domeni uchun yagona label va rang xaritalari (UI o'zbekcha, kod inglizcha).

export const TAX_TYPE_LABELS = {
  mol_mulk: "Mol-mulk solig'i",
  yer: "Yer solig'i",
  daromad: "Daromad solig'i",
  aylanma: "Aylanma solig'i",
};

export const TAXPAYER_TYPE_LABELS = {
  jismoniy: "Jismoniy shaxs",
  yatt: "YaTT",
  yuridik: "Yuridik shaxs",
};

export const STATUS_LABELS = {
  hisoblandi: "Hisoblandi",
  qisman: "Qisman to'langan",
  tolandi: "To'langan",
  qarzdor: "Qarzdor",
};

// Status → StatusBadge tone (rules/02 rang xaritasi).
export const STATUS_TONE = {
  hisoblandi: "new",
  qisman: "progress",
  tolandi: "done",
  qarzdor: "danger",
};

export const METHOD_LABELS = {
  click: "Click",
  payme: "Payme",
  uzum: "Uzum",
  bank: "Bank",
};

export const taxTypeLabel = (k) => TAX_TYPE_LABELS[k] || k;
export const taxpayerTypeLabel = (k) => TAXPAYER_TYPE_LABELS[k] || k;
export const statusLabel = (k) => STATUS_LABELS[k] || k;
export const methodLabel = (k) => METHOD_LABELS[k] || k;

// SelectField options
export const taxTypeOptions = [
  { label: "Barcha soliqlar", value: "" },
  ...Object.entries(TAX_TYPE_LABELS).map(([value, label]) => ({ label, value })),
];

export const taxpayerTypeOptions = [
  { label: "Barcha turlar", value: "" },
  ...Object.entries(TAXPAYER_TYPE_LABELS).map(([value, label]) => ({ label, value })),
];

export const statusOptions = [
  { label: "Barcha holatlar", value: "" },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ label, value })),
];
