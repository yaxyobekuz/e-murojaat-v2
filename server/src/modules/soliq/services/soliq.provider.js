// Mock soliq provider — kelajakda real Davlat soliq qo'mitasi hisob-kitob API bilan almashtiriladi.
// Interfeys saqlanadi: chaqiruvchi kod o'zgarmaydi, faqat shu fayl real implementatsiyaga o'tadi.

export const TAX_TYPE_LABELS = {
  mol_mulk: "Mol-mulk solig'i",
  yer: "Yer solig'i",
  daromad: "Daromad solig'i (JShDS)",
  aylanma: "Aylanma solig'i",
};

// 2024–2025 davri stavkalari (demo). 2026 islohotida bu jadval almashtiriladi.
export const TAX_RATES = {
  mol_mulk: 0.34, // ≤200 m² uy uchun (%)
  yer: 0.3, // turar joy yer (%)
  daromad: 12, // JShDS yagona stavka (%)
  aylanma: 4, // YaTT/kichik biznes (%)
};

// Kechikkanlik penyasi: kuniga 0.033%.
const PENYA_RATE_PER_DAY = 0.00033;

// Hisoblangan soliq summasi (baza × stavka).
export const computeTaxAmount = (taxType, baseValue) => {
  const rate = TAX_RATES[taxType] ?? 0;
  return Math.round((baseValue * rate) / 100);
};

// Penya: to'lanmagan qism × 0.033% × kechikkan kun.
export const computePenya = (unpaidAmount, dueDate, asOf = new Date()) => {
  if (unpaidAmount <= 0) return 0;
  const overdueDays = Math.floor((asOf - new Date(dueDate)) / 86400000);
  if (overdueDays <= 0) return 0;
  return Math.round(unpaidAmount * PENYA_RATE_PER_DAY * overdueDays);
};

// Demo: real provider'dan kelishi kerak bo'lgan to'lov tasdig'i (har doim muvaffaqiyatli).
export const confirmPayment = async ({ amount_uzs, method }) => ({
  ok: true,
  reference: `MOCK-${method}-${amount_uzs}`,
});
