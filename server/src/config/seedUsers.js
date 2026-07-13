import User from "../models/User.js";
import { hash } from "../utils/password.js";

// Faqat owner bootstrap — User kolleksiyasi bo'sh bo'lsa env creds bilan owner yaratiladi.
// Yettilik hisoblarini owner "Hisoblar" sahifasida qo'lda yaratadi.
export const seedUsers = async () => {
  if ((await User.estimatedDocumentCount()) > 0) return;
  const username = (process.env.OWNER_USERNAME || "owner").toLowerCase();
  const password = process.env.OWNER_PASSWORD || "owner123";
  await User.create({ username, passwordHash: await hash(password), role: "owner", fullName: "Administrator", active: true });
  console.log(`Owner hisobi yaratildi: ${username}`);
};
