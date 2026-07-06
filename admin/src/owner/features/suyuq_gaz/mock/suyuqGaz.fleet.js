// Suyultirilgan gaz — yetkazib beruvchi mashinalar (ballon almashtirish brigadalari).
// Har mashina o'z marshruti (route — koordinatalar zanjiri) va to'xtashlari (stops) bilan.
// Stops — ko'cha oldida ballon almashtirgan nuqta: kelgan/ketgan vaqt + almashtirilgan ballon soni.
// Hudud — Sarnovul MFY (Baliqchi tumani, Andijon) atrofi; ballon soni gaz moduli
// yetkazish davriga mos (oylik hajm / oyiga 2-3 tashrif — bir tashrifda ~50-60 balon).

// "kelgan/ketgan" vaqtlar — bugungi smena (HH:MM). Demo statik.
export const TRUCKS = [
  {
    id: "t1",
    plate: "60 A 512 BA",
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
      { id: "t1s1", street: "Maslahat ko'chasi", lng: 71.8520, lat: 40.9005, arrived: "08:12", left: "08:41", swapped: 54, done: true },
      { id: "t1s2", street: "Amir Temur ko'chasi", lng: 71.8640, lat: 40.9052, arrived: "09:05", left: "09:38", swapped: 60, done: true },
      { id: "t1s3", street: "Istiqlol ko'chasi", lng: 71.8760, lat: 40.9095, arrived: "10:20", left: null, swapped: 0, done: false },
    ],
  },
  {
    id: "t2",
    plate: "60 B 214 CA",
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
      { id: "t2s1", street: "Mustaqillik ko'chasi", lng: 71.8770, lat: 40.9085, arrived: "08:30", left: "09:02", swapped: 53, done: true },
      { id: "t2s2", street: "Chinor ko'chasi", lng: 71.8650, lat: 40.9010, arrived: "09:50", left: null, swapped: 0, done: false },
      { id: "t2s3", street: "Guliston ko'chasi", lng: 71.8590, lat: 40.8975, arrived: null, left: null, swapped: 0, done: false },
    ],
  },
  {
    id: "t3",
    plate: "60 C 905 DA",
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
      { id: "t3s1", street: "Ulug'vor ko'chasi", lng: 71.8560, lat: 40.9125, arrived: "08:05", left: "08:44", swapped: 51, done: true },
      { id: "t3s2", street: "Urganji ko'chasi", lng: 71.8625, lat: 40.9100, arrived: "09:30", left: null, swapped: 0, done: false },
    ],
  },
];

export const TRUCK_STATUS = {
  "yo'lda": { label: "Yo'lda", color: "#06b6d4" },
  "to'xtashda": { label: "To'xtashda (almashtirilmoqda)", color: "#f59e0b" },
  "qaytishda": { label: "Qaytishda", color: "#22c55e" },
};
