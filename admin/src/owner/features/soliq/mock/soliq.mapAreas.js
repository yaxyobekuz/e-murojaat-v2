// Soliq xaritasi — Sarnovul MFY, Baliqchi tumani, Andijon (prototip, demo).
// Mahalla bir nechta blokga bo'lingan. Har blok soliq holatiga qarab bo'yaladi:
//   paid    = yashil  (to'liq to'lagan)
//   partial = sariq   (yarim to'lagan)
//   unpaid  = qizil   (qarzdor)
// Koordinatalar Baliqchi markazi atrofida (taxminiy, demo uchun).

export const MAP_CENTER = { lat: 40.9044, lng: 71.8528 };
export const MAP_PLACE_LABEL = "Sarnovul MFY, Baliqchi tumani, Andijon";

// Soliq holati ranglari — rules/02 holat rang xaritasi
export const TAX_STATUS = {
  paid: { label: "To'liq to'lagan", color: "#16a34a", tone: "done" },
  partial: { label: "Yarim to'lagan", color: "#d97706", tone: "progress" },
  unpaid: { label: "Qarzdor", color: "#dc2626", tone: "danger" },
};

// Mahalla bloklari — har biri ko'p nuqtali tabiiy chegara (ko'cha bo'ylab egiluvchi),
// to'rtburchak quti emas. Google Polygon o'zi yopadi. path -> [{lat,lng}, ...]
export const MAHALLA_AREAS = [
  {
    id: "sarnovul-blok-1",
    name: "Sarnovul 1-blok",
    status: "paid",
    info: {
      households: 142,
      assessedUzs: 318_400_000,
      collectedUzs: 318_400_000,
      debtUzs: 0,
      collectionRate: 100,
    },
    path: [
      { lat: 40.9074, lng: 71.8491 },
      { lat: 40.9078, lng: 71.8512 },
      { lat: 40.9075, lng: 71.8531 },
      { lat: 40.9063, lng: 71.8538 },
      { lat: 40.9054, lng: 71.8534 },
      { lat: 40.9050, lng: 71.8519 },
      { lat: 40.9051, lng: 71.8502 },
      { lat: 40.9060, lng: 71.8492 },
    ],
  },
  {
    id: "sarnovul-blok-2",
    name: "Sarnovul 2-blok",
    status: "partial",
    info: {
      households: 168,
      assessedUzs: 401_200_000,
      collectedUzs: 252_700_000,
      debtUzs: 148_500_000,
      collectionRate: 63,
    },
    path: [
      { lat: 40.9063, lng: 71.8538 },
      { lat: 40.9075, lng: 71.8531 },
      { lat: 40.9079, lng: 71.8552 },
      { lat: 40.9077, lng: 71.8573 },
      { lat: 40.9068, lng: 71.8585 },
      { lat: 40.9057, lng: 71.8582 },
      { lat: 40.9052, lng: 71.8566 },
      { lat: 40.9054, lng: 71.8548 },
    ],
  },
  {
    id: "sarnovul-blok-3",
    name: "Sarnovul 3-blok",
    status: "unpaid",
    info: {
      households: 121,
      assessedUzs: 289_900_000,
      collectedUzs: 64_300_000,
      debtUzs: 225_600_000,
      collectionRate: 22,
    },
    path: [
      { lat: 40.9050, lng: 71.8519 },
      { lat: 40.9054, lng: 71.8534 },
      { lat: 40.9054, lng: 71.8548 },
      { lat: 40.9048, lng: 71.8560 },
      { lat: 40.9035, lng: 71.8562 },
      { lat: 40.9026, lng: 71.8551 },
      { lat: 40.9024, lng: 71.8532 },
      { lat: 40.9030, lng: 71.8518 },
      { lat: 40.9040, lng: 71.8513 },
    ],
  },
  {
    id: "sarnovul-blok-4",
    name: "Sarnovul 4-blok",
    status: "paid",
    info: {
      households: 95,
      assessedUzs: 214_800_000,
      collectedUzs: 207_300_000,
      debtUzs: 7_500_000,
      collectionRate: 97,
    },
    path: [
      { lat: 40.9048, lng: 71.8560 },
      { lat: 40.9057, lng: 71.8582 },
      { lat: 40.9055, lng: 71.8602 },
      { lat: 40.9044, lng: 71.8612 },
      { lat: 40.9031, lng: 71.8608 },
      { lat: 40.9026, lng: 71.8592 },
      { lat: 40.9028, lng: 71.8573 },
      { lat: 40.9035, lng: 71.8562 },
    ],
  },
];

// Dashboard KPI uchun yig'indi
export const mahallaSummary = MAHALLA_AREAS.reduce(
  (acc, a) => {
    acc.households += a.info.households;
    acc.assessedUzs += a.info.assessedUzs;
    acc.collectedUzs += a.info.collectedUzs;
    acc.debtUzs += a.info.debtUzs;
    return acc;
  },
  { households: 0, assessedUzs: 0, collectedUzs: 0, debtUzs: 0 }
);
mahallaSummary.collectionRate = Math.round(
  (mahallaSummary.collectedUzs / mahallaSummary.assessedUzs) * 100
);
