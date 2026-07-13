import { OFFICIAL_ROLES } from "../officials/officials.constants.js";

// Dashboard domenlari -> mas'ul rol. Har domen bitta rolga tegishli (owner hammasiga).
export const DOMAIN_OWNER = {
  population: "chairman",
  education: "chairman",
  utilities: "chairman",
  tax: "tax_inspector",
  finance: "bank_officer",
  safety: "prevention_inspector",
  youth: "youth_leader",
  women: "women_activist",
  land: "hokim_assistant",
  appeals: "hokim_assistant",
};

export const DOMAINS = Object.keys(DOMAIN_OWNER);

// rol -> [domenlar] (nav va guard uchun)
export const ROLE_DOMAINS = OFFICIAL_ROLES.reduce((acc, role) => {
  acc[role] = DOMAINS.filter((d) => DOMAIN_OWNER[d] === role);
  return acc;
}, {});
