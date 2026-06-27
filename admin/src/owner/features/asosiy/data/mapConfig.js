// Asosiy modul 3D xaritasi — Mapbox sozlamalari. Markaz: Andijon shahri.
// Uylar Mapbox'ning real bino izlari (footprint) sifatida 3D ko'tariladi.
export const MAPBOX_TOKEN =
  "pk.eyJ1IjoieWF4eW9iZWsiLCJhIjoiY21xcXVyMnN5MDJ0YTJzczhmZGhoMGh5bCJ9.C66cPZikWv2zNvjXHNrp5g";

// Andijon shahri markazi
export const MAP_CENTER = { lat: 40.7821, lng: 72.3442 };
export const MAP_PLACE_LABEL = "Andijon shahri";

export const BASEMAPS = [
  { id: "dark", label: "Tungi", style: "mapbox://styles/mapbox/dark-v11" },
  { id: "satellite", label: "Sun'iy yo'ldosh", style: "mapbox://styles/mapbox/satellite-streets-v12" },
  { id: "light", label: "Kunduzgi", style: "mapbox://styles/mapbox/light-v11" },
];

export const INITIAL_VIEW = {
  center: [MAP_CENTER.lng, MAP_CENTER.lat],
  zoom: 18,
  pitch: 62,
  bearing: -22,
  antialias: true,
};

// Bino balandligi (m) bo'yicha rang shkala — legenda gradientini ham boshqaradi.
export const HEIGHT_RAMP = [
  { h: 3, color: "#34d399" },
  { h: 12, color: "#22d3ee" },
  { h: 25, color: "#6366f1" },
  { h: 50, color: "#a855f7" },
];
