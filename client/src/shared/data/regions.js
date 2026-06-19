// O'zbekiston viloyatlari (backend regions.helper.js bilan bir xil key'lar).
export const REGIONS = [
  { key: "toshkent_shahri", label: "Toshkent shahri" },
  { key: "toshkent", label: "Toshkent viloyati" },
  { key: "andijon", label: "Andijon" },
  { key: "fargona", label: "Farg'ona" },
  { key: "namangan", label: "Namangan" },
  { key: "samarqand", label: "Samarqand" },
  { key: "buxoro", label: "Buxoro" },
  { key: "navoiy", label: "Navoiy" },
  { key: "qashqadaryo", label: "Qashqadaryo" },
  { key: "surxondaryo", label: "Surxondaryo" },
  { key: "jizzax", label: "Jizzax" },
  { key: "sirdaryo", label: "Sirdaryo" },
  { key: "xorazm", label: "Xorazm" },
  { key: "qoraqalpogiston", label: "Qoraqalpog'iston Respublikasi" },
];

export const regionLabel = (key) =>
  REGIONS.find((r) => r.key === key)?.label || key || "—";

// SelectField uchun options ("Barchasi" bilan).
export const regionOptions = [
  { label: "Barcha viloyatlar", value: "" },
  ...REGIONS.map((r) => ({ label: r.label, value: r.key })),
];
