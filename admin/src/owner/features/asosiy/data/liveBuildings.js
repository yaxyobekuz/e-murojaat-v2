// OSM'dan jonli binolar (Overpass) — har 60s da yangilanadi, OSM'da chizilgan bino
// ~1-2 daqiqada xaritada paydo bo'ladi. Statik GeoJSON to'ldiruvchi bo'lib qoladi:
// real OSM binosiga yaqin (25m) generatsiya uylari olib tashlanadi.
import { MAP_BBOX } from "./mapConfig";

const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const REFRESH_MS = 60_000;

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

const fetchLive = async () => {
  const q = `[out:json][timeout:25];(way["building"](${MAP_BBOX.s},${MAP_BBOX.w},${MAP_BBOX.n},${MAP_BBOX.e}););out geom;`;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, { method: "POST", body: "data=" + encodeURIComponent(q) });
      if (!res.ok) continue;
      const { elements } = await res.json();
      return elements
        .filter((el) => el.type === "way" && el.geometry?.length >= 4)
        .map((el) => {
          const ring = el.geometry.map((p) => [round6(p.lon), round6(p.lat)]);
          const props = { height: heightOf(el.tags) };
          const mh = parseFloat(el.tags?.min_height);
          if (mh > 0) props.min_height = mh;
          return { type: "Feature", geometry: { type: "Polygon", coordinates: [ring] }, properties: props };
        });
    } catch {
      // keyingi endpoint sinaladi
    }
  }
  return null;
};

const centroidOf = (f) => {
  const r = f.geometry.coordinates[0];
  let x = 0, y = 0;
  for (const p of r) { x += p[0]; y += p[1]; }
  return [x / r.length, y / r.length];
};

// ~25m (gradusda) — shu radius ichidagi generatsiya uylari real OSM binosiga o'rin bo'shatadi
const NEAR_LNG = 25 / 84200;
const NEAR_LAT = 25 / 110540;

const mergeBuildings = (staticFeatures, liveFeatures) => {
  const liveC = liveFeatures.map(centroidOf);
  const filler = staticFeatures.filter((f) => {
    const [x, y] = centroidOf(f);
    return !liveC.some(([lx, ly]) => Math.abs(lx - x) < NEAR_LNG && Math.abs(ly - y) < NEAR_LAT);
  });
  return [...liveFeatures, ...filler];
};

export const attachLiveBuildings = (map, sourceId, staticUrl) => {
  if (map.__liveBuildings) return;
  map.__liveBuildings = true;

  let staticFeatures = null;
  let signature = null;

  const refresh = async () => {
    if (document.hidden) return;
    const live = await fetchLive();
    if (!live) return;
    const sig = `${live.length}:${JSON.stringify(live).length}`;
    if (sig === signature) return; // OSM'da o'zgarish yo'q
    if (!staticFeatures) {
      try {
        staticFeatures = (await (await fetch(staticUrl)).json()).features;
      } catch {
        staticFeatures = [];
      }
    }
    const src = map.getSource(sourceId);
    if (!src) return;
    signature = sig;
    map.removeFeatureState({ source: sourceId });
    src.setData({ type: "FeatureCollection", features: mergeBuildings(staticFeatures, live) });
    map.fire("buildings:refreshed");
    console.info(`OSM jonli binolar yangilandi: ${live.length} ta real bino`);
  };

  refresh();
  const timer = setInterval(refresh, REFRESH_MS);
  map.on("remove", () => clearInterval(timer));
};
