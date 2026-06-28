// Manba + qatlamlar. Uylar = Mapbox'ning real bino izlari, real balandlikka 3D ko'tariladi,
// balandlik bo'yicha rang shkalasi bilan bo'yaladi.
import { HEIGHT_RAMP } from "./mapConfig";

export const LAYER = { buildings: "asosiy-buildings" };

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
  if (!map.getSource("mapbox-dem")) {
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14,
    });
  }
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.1 });
  if (!map.getLayer("sky")) {
    map.addLayer({
      id: "sky",
      type: "sky",
      paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 12 },
    });
  }
};

// Real bino izlari 3D ko'tariladi + balandlik bo'yicha bo'yaladi.
export const addBuildings = (map) => {
  if (!map.getSource("composite") || map.getLayer(LAYER.buildings)) return;
  map.addLayer({
    id: LAYER.buildings,
    source: "composite",
    "source-layer": "building",
    filter: ["==", ["get", "extrude"], "true"],
    type: "fill-extrusion",
    minzoom: 5,
    paint: {
      "fill-extrusion-color": colorExpr,
      "fill-extrusion-height": ["max", ["get", "height"], 3],
      "fill-extrusion-base": ["get", "min_height"],
      "fill-extrusion-opacity": 0.92,
      "fill-extrusion-vertical-gradient": true,
    },
  });
};

export const setupLayers = (map) => {
  addTerrainAndSky(map);
  addBuildings(map);
};
