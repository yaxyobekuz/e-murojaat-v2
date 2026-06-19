// Permission keys (the seed writes the same keys to the DB)
export const PERMISSIONS = Object.freeze({
  USERS_READ: "users.read",
  ACTIVITY_LOGS_READ: "activity_logs.read",

  SOLIQ_READ: "soliq.read",
  SOLIQ_CREATE: "soliq.create",
  SOLIQ_UPDATE: "soliq.update",
  YER_READ: "yer.read",
  YER_MANAGE: "yer.manage",
  GAZ_READ: "gaz.read",
  GAZ_MANAGE: "gaz.manage",
  MUROJAAT_READ: "murojaat.read",
  MUROJAAT_MANAGE: "murojaat.manage",
  SVET_READ: "svet.read",
  SVET_MANAGE: "svet.manage",
});

export const PERMISSION_LABELS = {
  [PERMISSIONS.USERS_READ]: { label: "Foydalanuvchilarni ko'rish", group: "users" },
  [PERMISSIONS.ACTIVITY_LOGS_READ]: { label: "Faoliyat loglarini ko'rish", group: "audit" },

  [PERMISSIONS.SOLIQ_READ]: { label: "Soliqlarni ko'rish", group: "soliq" },
  [PERMISSIONS.SOLIQ_CREATE]: { label: "Soliq qo'shish", group: "soliq" },
  [PERMISSIONS.SOLIQ_UPDATE]: { label: "Soliqni tahrirlash", group: "soliq" },
  [PERMISSIONS.YER_READ]: { label: "Yer/Mol-mulkni ko'rish", group: "yer" },
  [PERMISSIONS.YER_MANAGE]: { label: "Yer/Mol-mulkni boshqarish", group: "yer" },
  [PERMISSIONS.GAZ_READ]: { label: "Gazni ko'rish", group: "gaz" },
  [PERMISSIONS.GAZ_MANAGE]: { label: "Gazni boshqarish", group: "gaz" },
  [PERMISSIONS.MUROJAAT_READ]: { label: "Murojaatlarni ko'rish", group: "murojaat" },
  [PERMISSIONS.MUROJAAT_MANAGE]: { label: "Murojaatlarni boshqarish", group: "murojaat" },
  [PERMISSIONS.SVET_READ]: { label: "Elektrni ko'rish", group: "svet" },
  [PERMISSIONS.SVET_MANAGE]: { label: "Elektrni boshqarish", group: "svet" },
};
