// Demo markaz + diqqatga sazovor obyektlar — Sarnovul MFY markazi (Baliqchi tumani,
// Andijon). Koordinatalar mahalla markazi atrofida. Mahalladagi ijtimoiy obyektlar
// (kanonik): 2 maktab (66-son, 67-son), 6 bog'cha, 1 poliklinika, 3 masjid.
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
      areaM2: 320,
      valueUzs: 650_000_000,
      status: "royxatda",
    },
  },
  {
    id: "maktab-66",
    title: "66-son umumta'lim maktabi",
    position: { lat: 40.90415, lng: 71.86015 },
    info: {
      cadastreNumber: "UZ:40:08:04:0000112",
      type: "Ta'lim muassasasi (maktab)",
      typeLabel: "Ta'lim muassasasi (maktab)",
      areaM2: 2350,
      valueUzs: 3_100_000_000,
      status: "royxatda",
    },
  },
  {
    id: "maktab-67",
    title: "67-son umumta'lim maktabi",
    position: { lat: 40.90265, lng: 71.86185 },
    info: {
      cadastreNumber: "UZ:40:08:04:0001543",
      type: "Ta'lim muassasasi (maktab)",
      typeLabel: "Ta'lim muassasasi (maktab)",
      areaM2: 1980,
      valueUzs: 2_600_000_000,
      status: "royxatda",
    },
  },
];
