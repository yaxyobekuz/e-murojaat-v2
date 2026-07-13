import bcrypt from "bcryptjs";

// Parol hash — algoritm bitta joyda (keyin almashtirish oson)
export const hash = (plain) => bcrypt.hash(String(plain), 10);
export const verify = (plain, hashed) => bcrypt.compare(String(plain), hashed || "");
