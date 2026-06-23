// Source + layer builders. The cadastre layer is now Mapbox's REAL building
// footprints, extruded by real height and colored by a height ramp.
import { HEIGHT_RAMP } from "./mapConfig";

export const LAYER = { buildings: "cad-buildings" };

const colorExpr = [
  "case",
  ["boolean", ["feature-state", "selected"], false],
  "#ffffff",
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
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });
  if (!map.getLayer("sky")) {
    map.addLayer({
      id: "sky",
      type: "sky",
      paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 12 },
    });
  }
};

// Real building footprints extruded + colored by height (classic styles).
export const addBuildings = (map) => {
  if (!map.getSource("composite") || map.getLayer(LAYER.buildings)) return;
  map.addLayer({
    id: LAYER.buildings,
    source: "composite",
    "source-layer": "building",
    filter: ["==", ["get", "extrude"], "true"],
    type: "fill-extrusion",
    minzoom: 13,
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
