// Permission keys (the seed writes the same keys to the DB)
export const PERMISSIONS = Object.freeze({
  USERS_READ: "users.read",
  ACTIVITY_LOGS_READ: "activity_logs.read",

  SOLIQ_READ: "soliq.read",
  SOLIQ_CREATE: "soliq.create",
  SOLIQ_UPDATE: "soliq.update",
});

export const PERMISSION_LABELS = {
  [PERMISSIONS.USERS_READ]: { label: "Foydalanuvchilarni ko'rish", group: "users" },
  [PERMISSIONS.ACTIVITY_LOGS_READ]: { label: "Faoliyat loglarini ko'rish", group: "audit" },

  [PERMISSIONS.SOLIQ_READ]: { label: "Soliqlarni ko'rish", group: "soliq" },
  [PERMISSIONS.SOLIQ_CREATE]: { label: "Soliq qo'shish", group: "soliq" },
  [PERMISSIONS.SOLIQ_UPDATE]: { label: "Soliqni tahrirlash", group: "soliq" },
};
