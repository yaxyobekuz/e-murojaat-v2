// Mapbox setup: token, basemap styles + initial 3D camera over the demo center.
import { MAP_CENTER } from "../../mock/yer.mapMarkers";

export const MAPBOX_TOKEN = "pk.eyJ1IjoieWF4eW9iZWsiLCJhIjoiY21xcXVyMnN5MDJ0YTJzczhmZGhoMGh5bCJ9.C66cPZikWv2zNvjXHNrp5g";

// Switchable basemaps (UI labels in Uzbek, ids in English).
export const BASEMAPS = [
  { id: "satellite", label: "Sun'iy yo'ldosh", style: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "light", label: "Kunduzgi", style: "mapbox://styles/mapbox/light-v11" },
  { id: "dark", label: "Tungi", style: "mapbox://styles/mapbox/dark-v11" },
];

export const INITIAL_VIEW = {
  center: [MAP_CENTER.lng, MAP_CENTER.lat],
  zoom: 17.6,
  pitch: 62,
  bearing: -24,
  antialias: true,
};

// Building color ramp by real height (m). Also drives the legend gradient.
export const HEIGHT_RAMP = [
  { h: 3, color: "#34d399" },
  { h: 12, color: "#22d3ee" },
  { h: 25, color: "#6366f1" },
  { h: 50, color: "#a855f7" },
];
