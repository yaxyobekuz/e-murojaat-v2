// Chinobod OSM snapshot — xarita ochilganda darhol chiziladigan boshlang'ich ma'lumot.
// Jonli yangilanish liveOsm.js orqali (har 60s); bu fayl faqat birinchi renderni tezlashtiradi.
// Ishga tushirish: node scripts/fetch-chinobod-osm.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchOsm } from "../src/owner/features/asosiy/data/liveOsm.js";

const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/owner/features/asosiy/data/chinobodOsm.geojson",
);

const features = await fetchOsm();
if (!features) throw new Error("Overpass javob bermadi");
writeFileSync(OUT, JSON.stringify({ type: "FeatureCollection", features }));
console.log(`✓ ${features.length} obyekt → ${OUT}`);
