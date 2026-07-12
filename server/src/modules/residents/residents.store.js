// JSON faylga asoslangan ombor — aholi (fuqaro) yozuvlari, har biri unikal id bilan.
// Interfeys saqlangan: keyin Mongoose modelga almashtirish oson.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../data");
const FILE = join(DATA_DIR, "residents.json");

const load = () => {
  if (!existsSync(FILE)) return {};
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
};

let residents = load();

const persist = () => {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(residents, null, 2));
};

export const store = {
  // eng yangi yozuv birinchi
  all: () => Object.values(residents).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
  get: (id) => residents[id] || null,
  create: (data) => {
    const id = randomUUID();
    const now = new Date().toISOString();
    residents[id] = { ...data, id, createdAt: now, updatedAt: now };
    persist();
    return residents[id];
  },
  update: (id, data) => {
    if (!residents[id]) return null;
    residents[id] = { ...residents[id], ...data, id, updatedAt: new Date().toISOString() };
    persist();
    return residents[id];
  },
  remove: (id) => {
    const existed = Boolean(residents[id]);
    delete residents[id];
    persist();
    return existed;
  },
};
