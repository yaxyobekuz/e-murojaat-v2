// Demo center + notable government objects — Andijon shahar markazi (real bino
// qoplamasi zich joy). Koordinatalar shahar markazi atrofida.
export const MAP_CENTER = { lat: 40.7821, lng: 72.3442 };
export const MAP_PLACE_LABEL = "Andijon shahar markazi";

export const CADASTRE_MARKERS = [
  {
    id: "shahar-hokimligi",
    title: "Andijon shahar hokimligi",
    position: { lat: 40.78055, lng: 72.34605 },
    info: {
      cadastreNumber: "UZ:03:01:01:0000007",
      type: "Davlat boshqaruv binosi",
      typeLabel: "Davlat boshqaruv binosi",
      areaM2: 3200,
      valueUzs: 12_400_000_000,
      status: "royxatda",
    },
  },
  {
    id: "mfy-binosi",
    title: "Bobur MFY binosi",
    position: { lat: 40.78315, lng: 72.34555 },
    info: {
      cadastreNumber: "UZ:03:01:04:0000112",
      type: "Mahalla ma'muriy binosi",
      typeLabel: "Mahalla ma'muriy binosi",
      areaM2: 850,
      valueUzs: 1_900_000_000,
      status: "royxatda",
    },
  },
  {
    id: "turar-joy-massiv",
    title: "Bo'ston turar-joy massivi",
    position: { lat: 40.78405, lng: 72.34185 },
    info: {
      cadastreNumber: "UZ:03:01:04:0001543",
      type: "Ko'p qavatli turar-joy",
      typeLabel: "Ko'p qavatli turar-joy",
      areaM2: 5400,
      valueUzs: 8_700_000_000,
      status: "jarayonda",
    },
  },
];
