// Normalizes a phone number to a single canonical format: 998XXXXXXXXX (12 digits)
export const normalizePhone = (raw) => {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D+/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (normalized.length === 9) normalized = `998${normalized}`;
  if (normalized.length === 12 && normalized.startsWith("998")) return normalized;

  return null;
};

export const isPhoneLike = (raw) => /^[\d+\-()\s]+$/.test(String(raw || ""));

export default normalizePhone;
