// Demo markaz + diqqatga sazovor obyektlar — Sarnovul MFY markazi (Baliqchi tumani,
// Andijon). Koordinatalar mahalla markazi atrofida.
export const MAP_CENTER = { lat: 40.9034, lng: 71.8604 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

export const CADASTRE_MARKERS = [
  {
    id: "mfy-binosi",
    title: "Sarnovul MFY binosi",
    position: { lat: 40.90345, lng: 71.86065 },
    info: {
      cadastreNumber: "UZ:40:08:01:0000007",
      type: "Mahalla ma'muriy binosi",
      typeLabel: "Mahalla ma'muriy binosi",
      areaM2: 850,
      valueUzs: 1_900_000_000,
      status: "royxatda",
    },
  },
  {
    id: "navoiy-kochasi",
    title: "Navoiy ko'chasi turar-joy",
    position: { lat: 40.90415, lng: 71.86015 },
    info: {
      cadastreNumber: "UZ:40:08:04:0000112",
      type: "Ko'p qavatli turar-joy",
      typeLabel: "Ko'p qavatli turar-joy",
      areaM2: 5400,
      valueUzs: 8_700_000_000,
      status: "jarayonda",
    },
  },
  {
    id: "bobur-massiv",
    title: "Bobur ko'chasi massivi",
    position: { lat: 40.90265, lng: 71.86185 },
    info: {
      cadastreNumber: "UZ:40:08:04:0001543",
      type: "Ko'p qavatli turar-joy",
      typeLabel: "Ko'p qavatli turar-joy",
      areaM2: 5400,
      valueUzs: 8_700_000_000,
      status: "jarayonda",
    },
  },
];
