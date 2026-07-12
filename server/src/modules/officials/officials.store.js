// JSON faylga asoslangan ombor — mahalla yettiligi, kalit = lavozim kodi (role).
// Har lavozim yagona bo'lgani uchun houses'dagi upsert-by-key patterni ishlatiladi.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../data");
const FILE = join(DATA_DIR, "officials.json");

const load = () => {
  if (!existsSync(FILE)) return {};
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
};

let officials = load();

const persist = () => {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(officials, null, 2));
};

export const store = {
  all: () => Object.values(officials),
  get: (role) => officials[role] || null,
  upsert: (role, data) => {
    officials[role] = { ...(officials[role] || {}), ...data, role, updatedAt: new Date().toISOString() };
    persist();
    return officials[role];
  },
  remove: (role) => {
    const existed = Boolean(officials[role]);
    delete officials[role];
    persist();
    return existed;
  },
};
