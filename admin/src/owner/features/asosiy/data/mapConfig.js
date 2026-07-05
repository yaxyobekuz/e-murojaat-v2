// Asosiy modul 3D xaritasi — MapLibre GL + OpenStreetMap (OpenFreeMap) sozlamalari.
// Token kerak emas. Uylar real OSM ko'chalari bo'ylab 3D ko'tariladi.

// Chinobod shaharchasi markazi (Baliqchi tumani)
export const MAP_CENTER = { lat: 40.879317, lng: 71.934255 };
export const MAP_PLACE_LABEL = "Chinobod shaharchasi";

// OSM ma'lumot olinadigan hudud (~8×10km) — butun Chinobod shaharchasi + o'sish uchun zaxira.
// Snapshot va jonli Overpass fetch shu bbox'da ishlaydi.
export const MAP_BBOX = { s: 40.85, w: 71.89, n: 40.92, e: 72.01 };

export const BASEMAPS = [
  { id: "dark", label: "Tungi", style: "https://tiles.openfreemap.org/styles/dark" },
  { id: "light", label: "Kunduzgi", style: "https://tiles.openfreemap.org/styles/positron" },
];

export const INITIAL_VIEW = {
  // kamera OSM'da chizilgan hudud (shimoliy mahalla) markazidan boshlanadi
  center: [71.93235, 40.89249],
  zoom: 16.6,
  pitch: 58,
  maxPitch: 85, // MapLibre default maxPitch 60 — kattaroq og'ish uchun kengaytiramiz
  bearing: -20,
  antialias: true,
};

// Bino balandligi (m) bo'yicha rang shkala — legenda gradientini ham boshqaradi.
export const HEIGHT_RAMP = [
  { h: 3, color: "#34d399" },
  { h: 12, color: "#22d3ee" },
  { h: 25, color: "#6366f1" },
  { h: 50, color: "#a855f7" },
];
