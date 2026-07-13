// Static role values (stored as-is in the DB).
// Only `owner` is hard-coded. Other roles come from the DB dynamically.
export const ROLES = Object.freeze({
  OWNER: "owner",
});

export const ROLE_LABELS = Object.freeze({
  owner: "Ega",
  chairman: "Mahalla raisi",
  hokim_assistant: "Hokim yordamchisi",
  prevention_inspector: "Profilaktika inspektori",
  tax_inspector: "Soliq inspektori",
  bank_officer: "Bank xodimi",
  youth_leader: "Yoshlar yetakchisi",
  women_activist: "Xotin-qizlar faoli",
});

export const roleLabel = (role) => ROLE_LABELS[role] || role;

// Login select uchun — owner'dan tashqari 7 lavozim
export const ASSIGNABLE_ROLES = Object.keys(ROLE_LABELS);

export const ALL_ROLES = Object.values(ROLES);

// Default landing route per role. Dynamic roles fall back to `/`.
export const ROLE_HOME = Object.freeze({
  owner: "/owner",
});
