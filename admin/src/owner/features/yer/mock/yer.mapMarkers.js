// Davlat/kadastr obyektlari — Andijon viloyati, Baliqchi tumani, Sarnovul mahallasi.
// Koordinatalar Baliqchi tumani markazi atrofida (demo).
// 3 ta markerning markazi (centroid) — kamera shu nuqta atrofida aylanadi
export const MAP_CENTER = { lat: 40.9044, lng: 71.8528 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

export const CADASTRE_MARKERS = [
  {
    id: "mfy-binosi",
    title: "Sarnovul MFY binosi",
    position: { lat: 40.90455, lng: 71.85225, altitude: 25 },
    info: {
      cadastreNumber: "UZ:03:07:04:0000112",
      type: "Mahalla ma'muriy binosi",
      areaM2: 850,
      valueUzs: 1_900_000_000,
      status: "royxatda",
    },
  },
  {
    id: "tuman-hokimiyat",
    title: "Baliqchi tuman hokimligi",
    position: { lat: 40.90210, lng: 71.85640, altitude: 25 },
    info: {
      cadastreNumber: "UZ:03:07:01:0000007",
      type: "Davlat boshqaruv binosi",
      areaM2: 3200,
      valueUzs: 12_400_000_000,
      status: "royxatda",
    },
  },
  {
    id: "turar-joy-massiv",
    title: "Sarnovul turar-joy massivi",
    position: { lat: 40.90650, lng: 71.84980, altitude: 25 },
    info: {
      cadastreNumber: "UZ:03:07:04:0001543",
      type: "Yakka tartibdagi turar-joy",
      areaM2: 5400,
      valueUzs: 8_700_000_000,
      status: "jarayonda",
    },
  },
];
