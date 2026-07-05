// Manba + qatlamlar. Uylar: statik GeoJSON (darhol chiziladi) + OSM'dan jonli binolar
// (Overpass, har 60s). 3D ko'tariladi, balandlik bo'yicha rang shkalasi bilan bo'yaladi.
// Statik GeoJSON'ni yangilash: node scripts/generate-chinobod-buildings.mjs
import { HEIGHT_RAMP } from "./mapConfig";
import { attachLiveBuildings } from "./liveBuildings";
import buildingsUrl from "./chinobodBuildings.geojson?url";

export const LAYER = { buildings: "asosiy-buildings" };
export const BUILDINGS_SOURCE = "chinobod-buildings";

// fstatus feature-state: 0/yo'q = balandlik shkalasi, 1 = yashil, 2 = sariq, 3 = qizil
const colorExpr = [
  "case",
  ["boolean", ["feature-state", "selected"], false],
  "#ffffff",
  ["boolean", ["feature-state", "hover"], false],
  "#e0f2fe",
  // filter faol bo'lsa — status rangi
  ["==", ["feature-state", "fstatus"], 1], "#22c55e",
  ["==", ["feature-state", "fstatus"], 2], "#f59e0b",
  ["==", ["feature-state", "fstatus"], 3], "#ef4444",
  // filter yo'q — balandlik bo'yicha shkala
  [
    "interpolate", ["linear"], ["get", "height"],
    HEIGHT_RAMP[0].h, HEIGHT_RAMP[0].color,
    HEIGHT_RAMP[1].h, HEIGHT_RAMP[1].color,
    HEIGHT_RAMP[2].h, HEIGHT_RAMP[2].color,
    HEIGHT_RAMP[3].h, HEIGHT_RAMP[3].color,
  ],
];

export const addTerrainAndSky = (map) => {
  if (!map.getSource("terrain-dem")) {
    map.addSource("terrain-dem", {
      type: "raster-dem",
      tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 13,
    });
  }
  map.setTerrain({ source: "terrain-dem", exaggeration: 1.1 });
  // MapLibre'da osmon alohida layer emas — style'ning sky xossasi
  map.setSky?.({
    "sky-color": "#0b1220",
    "horizon-color": "#1b2a4a",
    "fog-color": "#0a0f1c",
    "sky-horizon-blend": 0.6,
  });
};

// Real bino izlari (OSM GeoJSON) 3D ko'tariladi + balandlik bo'yicha bo'yaladi.
export const addBuildings = (map) => {
  if (map.getLayer(LAYER.buildings)) return;
  if (!map.getSource(BUILDINGS_SOURCE)) {
    // generateId — feature-state (hover/selected/fstatus) uchun barqaror id beradi
    map.addSource(BUILDINGS_SOURCE, { type: "geojson", data: buildingsUrl, generateId: true });
  }
  map.addLayer({
    id: LAYER.buildings,
    source: BUILDINGS_SOURCE,
    type: "fill-extrusion",
    minzoom: 5,
    paint: {
      "fill-extrusion-color": colorExpr,
      "fill-extrusion-height": ["max", ["get", "height"], 3],
      "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
      "fill-extrusion-opacity": 0.92,
      "fill-extrusion-vertical-gradient": true,
    },
  });
  attachLiveBuildings(map, BUILDINGS_SOURCE, buildingsUrl);
};

export const setupLayers = (map) => {
  addTerrainAndSky(map);
  addBuildings(map);
};
