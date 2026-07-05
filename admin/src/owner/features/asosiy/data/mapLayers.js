// Manba + qatlamlar. Barcha obyektlar OSM'dan: binolar (3D), landuse (dala/qabriston/sanoat...),
// yo'llar, suv. Statik snapshot darhol chiziladi, jonli OSM har 60s da almashtiradi.
// Snapshot'ni yangilash: node scripts/fetch-chinobod-osm.mjs
import { HEIGHT_RAMP } from "./mapConfig";
import { attachLiveOsm } from "./liveOsm";
import snapshotUrl from "./chinobodOsm.geojson?url";

export const OSM_SOURCE = "chinobod-osm";
export const LAYER = {
  buildings: "asosiy-buildings",
  landuse: "asosiy-landuse",
  landuseLine: "asosiy-landuse-line",
  roads: "asosiy-roads",
  waterway: "asosiy-waterway",
};

// fstatus feature-state: 0/yo'q = balandlik shkalasi, 1 = yashil, 2 = sariq, 3 = qizil
const buildingColor = [
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

// dala hisoblanadigan kategoriyalar (osmElement.FIELD_CATS bilan mos)
const FIELD_CATS = ["farmland", "farmyard", "orchard", "vineyard", "meadow", "grass", "grassland", "allotments", "greenhouse_horticulture"];

// landuse kategoriyasi bo'yicha rang (tungi fon ustida shaffof tint)
const landuseColor = [
  "match", ["get", "cat"],
  "farmland", "rgba(132,204,22,0.20)",
  "grassland", "rgba(132,204,22,0.16)",
  "farmyard", "rgba(217,180,80,0.13)",
  "orchard", "rgba(74,222,128,0.18)",
  "vineyard", "rgba(74,222,128,0.18)",
  "allotments", "rgba(132,204,22,0.16)",
  "greenhouse_horticulture", "rgba(94,234,212,0.15)",
  "meadow", "rgba(101,163,13,0.16)",
  "grass", "rgba(101,163,13,0.14)",
  "cemetery", "rgba(52,211,153,0.12)",
  "industrial", "rgba(168,85,247,0.18)",
  "residential", "rgba(148,163,184,0.07)",
  "water", "rgba(56,189,248,0.30)",
  "wetland", "rgba(56,189,248,0.18)",
  "wood", "rgba(34,197,94,0.16)",
  "park", "rgba(34,197,94,0.14)",
  "garden", "rgba(34,197,94,0.14)",
  "rgba(148,163,184,0.06)",
];
// tanlangan dala — shaffof yashil, boshqa landuse — oqish
const landuseSelectedColor = [
  "match", ["get", "cat"],
  FIELD_CATS, "rgba(134,239,172,0.45)",
  "rgba(255,255,255,0.28)",
];
const landuseHoverColor = [
  "match", ["get", "cat"],
  FIELD_CATS, "rgba(134,239,172,0.28)",
  "rgba(255,255,255,0.14)",
];
const landuseFill = [
  "case",
  ["boolean", ["feature-state", "selected"], false], landuseSelectedColor,
  ["boolean", ["feature-state", "hover"], false], landuseHoverColor,
  landuseColor,
];
const landuseLineColor = [
  "case",
  ["boolean", ["feature-state", "selected"], false], "#4ade80",
  "rgba(148,163,184,0.25)",
];

const roadColor = [
  "case",
  ["boolean", ["feature-state", "selected"], false],
  "#ffffff",
  ["match", ["get", "cls"],
    ["motorway", "trunk", "primary"], "#cbd5e1",
    ["secondary", "tertiary"], "#a3b0c2",
    ["residential", "living_street", "unclassified", "service"], "#64748b",
    "#4b5563",
  ],
];
const roadWidth = [
  "interpolate", ["linear"], ["zoom"],
  12, 0.6,
  15, ["match", ["get", "cls"], ["motorway", "trunk", "primary"], 3, ["secondary", "tertiary"], 2.2, 1.4],
  18, ["match", ["get", "cls"], ["motorway", "trunk", "primary"], 8, ["secondary", "tertiary"], 6, ["residential", "living_street", "unclassified", "service"], 4.5, 2.5],
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

// OSM obyektlari: landuse + yo'l + suv (yorliqlar ostida), binolar 3D (eng ustida)
export const addOsmLayers = (map) => {
  if (map.getLayer(LAYER.buildings)) return;
  if (!map.getSource(OSM_SOURCE)) {
    // generateId — feature-state (hover/selected/fstatus) uchun barqaror id beradi
    map.addSource(OSM_SOURCE, { type: "geojson", data: snapshotUrl, generateId: true });
  }
  // joy nomlari (symbol) qatlamlari ustda qolsin
  const firstSymbol = map.getStyle().layers.find((l) => l.type === "symbol")?.id;

  map.addLayer({
    id: LAYER.landuse,
    source: OSM_SOURCE,
    type: "fill",
    filter: ["==", ["get", "kind"], "landuse"],
    paint: { "fill-color": landuseFill },
  }, firstSymbol);
  map.addLayer({
    id: LAYER.landuseLine,
    source: OSM_SOURCE,
    type: "line",
    filter: ["==", ["get", "kind"], "landuse"],
    paint: {
      "line-color": landuseLineColor,
      "line-width": ["case", ["boolean", ["feature-state", "selected"], false], 2, 1],
    },
  }, firstSymbol);
  map.addLayer({
    id: LAYER.waterway,
    source: OSM_SOURCE,
    type: "line",
    filter: ["==", ["get", "kind"], "waterway"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "rgba(56,189,248,0.6)",
      "line-width": ["interpolate", ["linear"], ["zoom"], 12, 1, 18, 3],
    },
  }, firstSymbol);
  map.addLayer({
    id: LAYER.roads,
    source: OSM_SOURCE,
    type: "line",
    filter: ["==", ["get", "kind"], "road"],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": roadColor, "line-width": roadWidth, "line-opacity": 0.95 },
  }, firstSymbol);

  map.addLayer({
    id: LAYER.buildings,
    source: OSM_SOURCE,
    filter: ["==", ["get", "kind"], "building"],
    type: "fill-extrusion",
    minzoom: 5,
    paint: {
      "fill-extrusion-color": buildingColor,
      "fill-extrusion-height": ["max", ["get", "height"], 3],
      "fill-extrusion-base": ["coalesce", ["get", "min_height"], 0],
      "fill-extrusion-opacity": 0.92,
      "fill-extrusion-vertical-gradient": true,
    },
  });

  attachLiveOsm(map, OSM_SOURCE);
};

export const setupLayers = (map) => {
  addTerrainAndSky(map);
  addOsmLayers(map);
};
