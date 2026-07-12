// Eski JSON fayllardagi ma'lumotni bir marta Mongo'ga ko'chiradi (kolleksiya bo'sh bo'lganda).
// Xonadonlarning avval kiritilgan ma'lumoti yo'qolmasligi uchun.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import House from "../models/House.js";
import Resident from "../models/Resident.js";
import Official from "../models/Official.js";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../data");

const readRows = (name) => {
  const file = join(DATA_DIR, name);
  if (!existsSync(file)) return [];
  try {
    return Object.values(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return [];
  }
};

const seedIfEmpty = async (Model, file, label) => {
  if ((await Model.estimatedDocumentCount()) > 0) return;
  const rows = readRows(file);
  if (!rows.length) return;
  await Model.insertMany(rows, { ordered: false }).catch(() => {});
  console.log(`Mongo'ga ko'chirildi: ${rows.length} ${label}`);
};

export const importLegacyJson = async () => {
  await seedIfEmpty(House, "houses.json", "xonadon");
  await seedIfEmpty(Resident, "residents.json", "fuqaro");
  await seedIfEmpty(Official, "officials.json", "yettilik a'zosi");
};
