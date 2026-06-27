// Suyultirilgan gaz — yetkazib beruvchi mashinalar (ballon almashtirish brigadalari).
// Har mashina o'z marshruti (route — koordinatalar zanjiri) va to'xtashlari (stops) bilan.
// Stops — MFY oldida ballon almashtirgan nuqta: kelgan/ketgan vaqt + almashtirilgan ballon soni.
// Markaz internet xaritasi bilan bir xil hudud (Andijon atrofi).

// "kelgan/ketgan" vaqtlar — bugungi smena (HH:MM). Demo statik.
export const TRUCKS = [
  {
    id: "t1",
    plate: "01 A 777 GA",
    driver: "Akmaljon Qodirov",
    color: "#06b6d4",
    status: "yo'lda",
    progress: 0.58, // marshrut bo'ylab joriy holat (0..1)
    route: [
      [71.8470, 40.8980],
      [71.8520, 40.9005],
      [71.8585, 40.9030],
      [71.8640, 40.9052],
      [71.8705, 40.9070],
      [71.8760, 40.9095],
    ],
    stops: [
      { id: "t1s1", street: "Sarnovul MFY", lng: 71.8520, lat: 40.9005, arrived: "08:12", left: "08:41", swapped: 64, done: true },
      { id: "t1s2", street: "Bog'ibo'ston MFY", lng: 71.8640, lat: 40.9052, arrived: "09:05", left: "09:38", swapped: 52, done: true },
      { id: "t1s3", street: "Yangiobod MFY", lng: 71.8760, lat: 40.9095, arrived: "10:20", left: null, swapped: 0, done: false },
    ],
  },
  {
    id: "t2",
    plate: "01 B 214 GA",
    driver: "Sherzod Tursunov",
    color: "#22c55e",
    status: "yo'lda",
    progress: 0.34,
    route: [
      [71.8820, 40.9120],
      [71.8770, 40.9085],
      [71.8710, 40.9048],
      [71.8650, 40.9010],
      [71.8590, 40.8975],
    ],
    stops: [
      { id: "t2s1", street: "Chamanzor MFY", lng: 71.8770, lat: 40.9085, arrived: "08:30", left: "09:02", swapped: 71, done: true },
      { id: "t2s2", street: "Navro'z MFY", lng: 71.8650, lat: 40.9010, arrived: "09:50", left: null, swapped: 0, done: false },
      { id: "t2s3", street: "Do'stlik MFY", lng: 71.8590, lat: 40.8975, arrived: null, left: null, swapped: 0, done: false },
    ],
  },
  {
    id: "t3",
    plate: "01 C 905 GA",
    driver: "Botir Eshonqulov",
    color: "#f59e0b",
    status: "to'xtashda",
    progress: 0.5,
    route: [
      [71.8500, 40.9150],
      [71.8560, 40.9125],
      [71.8625, 40.9100],
      [71.8690, 40.9078],
    ],
    stops: [
      { id: "t3s1", street: "Guliston MFY", lng: 71.8560, lat: 40.9125, arrived: "08:05", left: "08:44", swapped: 58, done: true },
      { id: "t3s2", street: "Qishloqobod MFY", lng: 71.8625, lat: 40.9100, arrived: "09:30", left: null, swapped: 0, done: false },
    ],
  },
  {
    id: "t4",
    plate: "01 D 442 GA",
    driver: "Jasur Aliyev",
    color: "#a855f7",
    status: "qaytishda",
    progress: 0.82,
    route: [
      [71.8900, 40.8980],
      [71.8835, 40.9010],
      [71.8770, 40.9035],
      [71.8705, 40.9055],
      [71.8635, 40.9072],
    ],
    stops: [
      { id: "t4s1", street: "Bog'ibo'ston MFY", lng: 71.8835, lat: 40.9010, arrived: "07:55", left: "08:30", swapped: 49, done: true },
      { id: "t4s2", street: "Sarnovul MFY", lng: 71.8705, lat: 40.9055, arrived: "09:15", left: "09:52", swapped: 67, done: true },
      { id: "t4s3", street: "Chamanzor MFY", lng: 71.8635, lat: 40.9072, arrived: "10:40", left: "11:18", swapped: 55, done: true },
    ],
  },
];

export const TRUCK_STATUS = {
  "yo'lda": { label: "Yo'lda", color: "#06b6d4" },
  "to'xtashda": { label: "To'xtashda (almashtirilmoqda)", color: "#f59e0b" },
  "qaytishda": { label: "Qaytishda", color: "#22c55e" },
};
