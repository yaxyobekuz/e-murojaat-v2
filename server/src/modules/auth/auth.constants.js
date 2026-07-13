import { OFFICIAL_ROLES } from "../officials/officials.constants.js";

// Barcha tizim rollari — owner (super-admin) + mahalla yettiligining 7 lavozimi
export const APP_ROLES = ["owner", ...OFFICIAL_ROLES];

export const isOwner = (role) => role === "owner";
