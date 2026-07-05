// OSM'dan jonli ma'lumot (Overpass) — binolar, landuse (dala/qabriston/sanoat...),
// yo'llar va suv obyektlari. Har 60s da yangilanadi: OSM editor'da chizilgan obyekt
// ~1-2 daqiqada xaritada paydo bo'ladi. Faqat real chizilgan ma'lumot ko'rsatiladi.
// eslatma: import'lar .js kengaytma bilan — bu fayl node skriptdan ham ishlatiladi
import { overpassQuery } from "../../../../shared/lib/overpass.js";
import { MAP_BBOX } from "./mapConfig.js";

const REFRESH_MS = 60_000;

// balandlik: height tagi > qavat soni × 3 > bino turiga qarab default
const TYPE_HEIGHT = {
  apartments: 12, commercial: 8, retail: 6, industrial: 7, warehouse: 7,
  school: 8, university: 10, hospital: 10, mosque: 8, office: 10, hotel: 12,
};
const heightOf = (tags = {}) => {
  const h = parseFloat(tags.height);
  if (h > 0) return Math.round(h * 10) / 10;
  const lv = parseFloat(tags["building:levels"]);
  if (lv > 0) return lv * 3;
  return TYPE_HEIGHT[tags.building] || 4;
};

const round6 = (n) => Math.round(n * 1e6) / 1e6;

const NATURAL_CATS = new Set(["water", "wood", "scrub", "grassland", "wetland"]);
const LEISURE_CATS = new Set(["park", "garden", "pitch", "playground"]);

// Overpass elementlarini bitta GeoJSON to'plamiga aylantiradi (kind: building|landuse|road|waterway)
export const osmToFeatures = (elements) => {
  const feats = [];
  for (const el of elements) {
    if (el.type !== "way" || !el.geometry || el.geometry.length < 2) continue;
    const t = el.tags || {};
    const coords = el.geometry.map((p) => [round6(p.lon), round6(p.lat)]);

    if (t.building === "greenhouse") {
      // issiqxona — 3D bino emas, dala kabi shaffof yashil poligon
      if (coords.length < 4) continue;
      const props = { kind: "landuse", cat: "greenhouse_horticulture" };
      if (t.name) props.name = t.name;
      feats.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: props });
    } else if (t.building) {
      if (coords.length < 4) continue;
      const levels = parseFloat(t["building:levels"]) || 0;
      const height = heightOf(t);
      const props = {
        kind: "building",
        btype: t.building,
        height,
        levels: levels || Math.max(1, Math.round(height / 3)),
      };
      if (t.name) props.name = t.name;
      const mh = parseFloat(t.min_height);
      if (mh > 0) props.min_height = mh;
      feats.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: props });
    } else if (t.landuse || NATURAL_CATS.has(t.natural) || LEISURE_CATS.has(t.leisure) || t.amenity === "grave_yard") {
      if (coords.length < 4) continue;
      const props = { kind: "landuse", cat: t.landuse || t.natural || t.leisure || "cemetery" };
      if (t.name) props.name = t.name;
      feats.push({ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: props });
    } else if (t.highway) {
      const props = { kind: "road", cls: t.highway };
      if (t.name) props.name = t.name;
      feats.push({ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: props });
    } else if (t.waterway) {
      const props = { kind: "waterway" };
      if (t.name) props.name = t.name;
      feats.push({ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: props });
    }
  }
  return feats;
};

// bbox ichidagi barcha kerakli obyektlarni Overpass'dan oladi (brauzer va node'da ishlaydi)
export const fetchOsm = async () => {
  const b = `${MAP_BBOX.s},${MAP_BBOX.w},${MAP_BBOX.n},${MAP_BBOX.e}`;
  const q = `[out:json][timeout:25];(
    way["building"](${b});
    way["landuse"](${b});
    way["natural"](${b});
    way["leisure"](${b});
    way["amenity"="grave_yard"](${b});
    way["highway"](${b});
    way["waterway"](${b});
  );out geom;`;
  const elements = await overpassQuery(q);
  return elements ? osmToFeatures(elements) : null;
};

export const attachLiveOsm = (map, sourceId) => {
  if (map.__liveOsm) return;
  map.__liveOsm = true;

  let signature = null;

  const refresh = async () => {
    if (document.hidden) return;
    const features = await fetchOsm();
    if (!features) return;
    const sig = `${features.length}:${JSON.stringify(features).length}`;
    if (sig === signature) return; // OSM'da o'zgarish yo'q
    const src = map.getSource(sourceId);
    if (!src) return;
    signature = sig;
    map.removeFeatureState({ source: sourceId });
    src.setData({ type: "FeatureCollection", features });
    map.fire("buildings:refreshed");
    console.info(`OSM jonli yangilandi: ${features.length} obyekt`);
  };

  refresh();
  const timer = setInterval(refresh, REFRESH_MS);
  map.on("remove", () => clearInterval(timer));
};
