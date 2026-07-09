// JSON faylga asoslangan ombor — MongoDB o'rnatilmagan demo muhit uchun.
// Interfeys saqlangan: keyin Mongoose modelga almashtirish oson.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../../data");
const FILE = join(DATA_DIR, "houses.json");

const load = () => {
  if (!existsSync(FILE)) return {};
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return {};
  }
};

let houses = load();

const persist = () => {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(houses, null, 2));
};

export const store = {
  all: () => Object.values(houses),
  get: (osmId) => houses[osmId] || null,
  upsert: (osmId, data) => {
    houses[osmId] = { ...(houses[osmId] || {}), ...data, osmId, updatedAt: new Date().toISOString() };
    persist();
    return houses[osmId];
  },
  remove: (osmId) => {
    const existed = Boolean(houses[osmId]);
    delete houses[osmId];
    persist();
    return existed;
  },
};
