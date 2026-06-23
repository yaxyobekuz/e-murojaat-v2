// Yoshlar agentligi loyihalari — real dasturlar asosida (yoshlar.gov.uz platformasi).
// Har loyiha: kategoriya, qisqa tavsif, qamrov statistikasi, progress, holat, accent rang.
import {
  Languages, BrainCircuit, Rocket, GraduationCap, BookOpen,
  Crown, Trophy, HeartPulse, Code2, Globe2, Palette, Music4,
} from "lucide-react";

// Loyiha logosini rasmiy domeni favikonidan oladi (Google favicon servisi — barqaror, CORS yo'q).
// Logo yuklanmasa, karta `icon` (lucide) ga qaytadi.
export const projectLogo = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Loyiha kategoriyalari (filtr uchun)
export const PROJECT_CATEGORIES = {
  education: { key: "education", label: "Ta'lim", color: "#22c55e" },
  it: { key: "it", label: "IT / Texnologiya", color: "#22d3ee" },
  startup: { key: "startup", label: "Tadbirkorlik", color: "#34d399" },
  language: { key: "language", label: "Til o'rganish", color: "#60a5fa" },
  women: { key: "women", label: "Qizlar / Ayollar", color: "#f472b6" },
  culture: { key: "culture", label: "Madaniyat / Sport", color: "#fbbf24" },
};

export const PROJECT_STATUS = {
  active: { key: "active", label: "Faol", tone: "done" },
  recruiting: { key: "recruiting", label: "Qabul ochiq", tone: "new" },
  upcoming: { key: "upcoming", label: "Tez orada", tone: "progress" },
};

// Real yoshlar agentligi loyihalari
export const PROJECTS = [
  {
    id: "ibrat-farzandlari",
    name: "Ibrat Farzandlari",
    tagline: "Chet tillarini bepul o'rganish dasturi",
    category: "language",
    icon: Languages,
    logo: "ibratfarzandlari.uz",
    glow: "96,165,250",
    status: "active",
    description:
      "Yoshlarga ingliz, nemis, koreys va boshqa chet tillarini bepul o'rgatadi. Mahalla markazlarida o'qituvchilar va onlayn resurslar bilan.",
    participants: 412_000,
    mentors: 3200,
    centers: 208,
    progress: 78,
    yearStarted: 2021,
    tags: ["Til", "Sertifikat", "Onlayn"],
  },
  {
    id: "ustoz-ai",
    name: "Ustoz AI",
    tagline: "Zamonaviy kasblar va AI ta'limi",
    category: "it",
    icon: BrainCircuit,
    logo: "gov.uz",
    glow: "34,211,238",
    status: "recruiting",
    description:
      "Sun'iy intellekt yordamida shaxsiy ta'lim yo'nalishi. Dasturlash, dizayn va zamonaviy kasblarni o'rgatuvchi AI mentor.",
    participants: 156_000,
    mentors: 540,
    centers: 64,
    progress: 64,
    yearStarted: 2023,
    tags: ["AI", "Dasturlash", "Mentor"],
  },
  {
    id: "uzcombinator",
    name: "UzCombinator",
    tagline: "Startap akselerator va investitsiya",
    category: "startup",
    icon: Rocket,
    logo: "uzcombinator.uz",
    glow: "52,211,153",
    status: "active",
    description:
      "Yosh tadbirkorlarning startaplarini akseleratsiya qiladi: mentorlik, grant va investorlar bilan bog'lash.",
    participants: 8400,
    mentors: 120,
    centers: 12,
    progress: 55,
    yearStarted: 2022,
    tags: ["Startap", "Grant", "Investor"],
  },
  {
    id: "qizlar-akademiyasi",
    name: "Qizlar Akademiyasi",
    tagline: "Qizlar uchun ko'nikma va liderlik",
    category: "women",
    icon: Crown,
    logo: "gov.uz",
    glow: "244,114,182",
    status: "active",
    description:
      "Qizlarni kasbiy ko'nikma, raqamli savodxonlik va liderlikka o'rgatuvchi akademiya. Mentorlik va amaliyot bilan.",
    participants: 94_000,
    mentors: 860,
    centers: 96,
    progress: 71,
    yearStarted: 2022,
    tags: ["Liderlik", "Ko'nikma", "Mentorlik"],
  },
  {
    id: "mutolaa",
    name: "Mutolaa",
    tagline: "Raqamli savodxonlik va kitobxonlik",
    category: "education",
    icon: BookOpen,
    logo: "mutolaa.com",
    glow: "34,197,94",
    status: "active",
    description:
      "Audiokitob va elektron kitoblar platformasi. Yoshlarda mutolaa madaniyatini va raqamli savodxonlikni oshiradi.",
    participants: 1_200_000,
    mentors: 0,
    centers: 0,
    progress: 88,
    yearStarted: 2021,
    tags: ["Kitob", "Audiokitob", "Platforma"],
  },
  {
    id: "uzchess",
    name: "UzChess",
    tagline: "Shaxmat va intellektual rivojlanish",
    category: "culture",
    icon: Trophy,
    logo: "uzchesss.uz",
    glow: "250,204,21",
    status: "active",
    description:
      "Xalqaro shaxmat maktabi. Yoshlarda mantiqiy fikrlash va strategik tafakkurni rivojlantiradi.",
    participants: 220_000,
    mentors: 1400,
    centers: 152,
    progress: 82,
    yearStarted: 2020,
    tags: ["Shaxmat", "Intellekt", "Maktab"],
  },
  {
    id: "it-akademiya",
    name: "Bir million dasturchi",
    tagline: "IT mutaxassislar tayyorlash dasturi",
    category: "it",
    icon: Code2,
    logo: "uzbekcoders.uz",
    glow: "34,211,238",
    status: "recruiting",
    description:
      "Yoshlarni dasturlash, web va mobil ishlab chiqishga o'rgatadi. Bootcamp + amaliyot + ish bilan ta'minlash.",
    participants: 340_000,
    mentors: 2100,
    centers: 180,
    progress: 60,
    yearStarted: 2019,
    tags: ["IT", "Bootcamp", "Ish"],
  },
  {
    id: "yoshlar-daftari",
    name: "Yoshlar daftari",
    tagline: "Ehtiyojmand yoshlarni qo'llab-quvvatlash",
    category: "education",
    icon: HeartPulse,
    logo: "yoshlardaftari.uz",
    glow: "248,113,113",
    status: "active",
    description:
      "Ishsiz va ijtimoiy himoyaga muhtoj yoshlarni ro'yxatga oladi, ish va ta'lim bilan ta'minlashga yo'naltiradi.",
    participants: 78_000,
    mentors: 0,
    centers: 552,
    progress: 49,
    yearStarted: 2021,
    tags: ["Ijtimoiy", "Ro'yxat", "Yordam"],
  },
  {
    id: "5-tashabbus",
    name: "Beshta tashabbus",
    tagline: "Madaniyat, sport, IT, kitobxonlik, bandlik",
    category: "culture",
    icon: Music4,
    logo: "yoshlar.gov.uz",
    glow: "192,132,252",
    status: "active",
    description:
      "Yoshlarni madaniyat, san'at, sport, raqamli iqtisodiyot va ma'naviyatga jalb etuvchi beshta yo'nalishli dastur.",
    participants: 2_400_000,
    mentors: 0,
    centers: 0,
    progress: 75,
    yearStarted: 2019,
    tags: ["Madaniyat", "Sport", "San'at"],
  },
  {
    id: "talaba-talim-grant",
    name: "Ta'lim grantlari",
    tagline: "Kontrakt va olimpiada qo'llab-quvvatlash",
    category: "education",
    icon: GraduationCap,
    logo: "yoshlar.gov.uz",
    glow: "34,197,94",
    status: "recruiting",
    description:
      "Iqtidorli yoshlarga kontrakt to'lovi, xalqaro olimpiada va chet el ta'limi uchun grantlar ajratadi.",
    participants: 36_000,
    mentors: 0,
    centers: 0,
    progress: 67,
    yearStarted: 2020,
    tags: ["Grant", "Kontrakt", "Olimpiada"],
  },
  {
    id: "yosh-tadbirkor",
    name: "Yosh tadbirkor",
    tagline: "Tadbirkorlikka kirish va mikrogrant",
    category: "startup",
    icon: Globe2,
    logo: "yoshlar.gov.uz",
    glow: "52,211,153",
    status: "upcoming",
    description:
      "Yoshlar uchun tadbirkorlik asoslari, biznes-reja va mikrogrant dasturi. Mahalliy biznes yaratishga ko'maklashadi.",
    participants: 21_000,
    mentors: 340,
    centers: 28,
    progress: 32,
    yearStarted: 2024,
    tags: ["Biznes", "Mikrogrant", "Reja"],
  },
  {
    id: "ijod-maktabi",
    name: "Ijod maktabi",
    tagline: "Dizayn, san'at va kreativ kasblar",
    category: "culture",
    icon: Palette,
    logo: "yoshlar.gov.uz",
    glow: "251,191,36",
    status: "active",
    description:
      "Yoshlarni grafik dizayn, raqamli san'at va kreativ industriyaga tayyorlaydi. Portfolio va amaliyot bilan.",
    participants: 64_000,
    mentors: 420,
    centers: 44,
    progress: 58,
    yearStarted: 2023,
    tags: ["Dizayn", "San'at", "Portfolio"],
  },
];

export const projectTotals = (list = PROJECTS) =>
  list.reduce(
    (s, p) => {
      s.participants += p.participants;
      s.mentors += p.mentors;
      s.centers += p.centers;
      if (p.status === "recruiting") s.recruiting += 1;
      return s;
    },
    { participants: 0, mentors: 0, centers: 0, recruiting: 0, count: list.length },
  );

// Batafsil ma'lumot (yon panel uchun): kengaytirilgan tavsif, maqsadlar, natijalar,
// yo'nalishlar va yillik o'sish. Loyiha `id` bo'yicha bog'lanadi.
export const PROJECT_DETAILS = {
  "ibrat-farzandlari": {
    about:
      "Prezident tashabbusi bilan tashkil etilgan davlat dasturi. Yoshlarga ingliz, nemis, koreys, arab, xitoy va boshqa chet tillarini mutlaqo bepul o'rgatadi. Mahalla o'quv markazlari, malakali o'qituvchilar va \"Ibrat Academy\" mobil ilovasi orqali oflayn va onlayn ta'lim birlashtirilgan.",
    goals: [
      "Har uchinchi maktab o'quvchisini kamida bitta chet tilini o'rganishga jalb etish",
      "Mobil ilovaga 3000+ darslik va milliy o'quv qo'llanmalarini joylash",
      "Mahallalarda til o'rganishni hamma uchun tekin va qulay qilish",
    ],
    outcomes: [
      { label: "Bitiruvchi", value: "118 ming" },
      { label: "Til yo'nalishi", value: "9 ta" },
      { label: "Mamnunlik", value: "94%" },
    ],
    directions: ["Ingliz", "Nemis", "Koreys", "Arab", "Xitoy", "Rus"],
    growth: [
      { year: "2021", v: 60 },
      { year: "2022", v: 145 },
      { year: "2023", v: 260 },
      { year: "2024", v: 350 },
      { year: "2025", v: 412 },
    ],
  },
  "ustoz-ai": {
    about:
      "Yoshlar ishlari agentligi va Turonbank hamkorligida tashkil etilgan video-ta'lim platformasi. Sun'iy intellekt yordamida har bir foydalanuvchiga shaxsiy ta'lim yo'nalishi tuziladi: dasturlash, dizayn, marketing va boshqa zamonaviy kasblar AI-mentor orqali o'rgatiladi.",
    goals: [
      "1000 ta video darslik tayyorlash va mobil ilovani ishga tushirish",
      "250 ming yoshni zamonaviy va talab yuqori kasblarga o'rgatish",
      "YouTube'da 15 mln ko'rishga va 250 ming obunachiga erishish",
    ],
    outcomes: [
      { label: "Video dars", value: "300+" },
      { label: "Faol o'quvchi", value: "156 ming" },
      { label: "Yo'nalish", value: "12 ta" },
    ],
    directions: ["AI mentor", "Dasturlash", "Dizayn", "Marketing", "Kasb-hunar"],
    growth: [
      { year: "2023", v: 40 },
      { year: "2024", v: 110 },
      { year: "2025", v: 156 },
    ],
  },
  uzcombinator: {
    about:
      "O'zbekiston va Markaziy Osiyo yosh tadbirkorlari uchun startap akselerator. 45 kunlik intensiv dastur Product, Growth, Go-To-Market va Fundraising bosqichlaridan iborat. Maqsad — mahalliy startaplarni global, jumladan AQSh bozoriga olib chiqish.",
    goals: [
      "Yosh jamoalarni mentorlik va investorlar bilan bog'lash",
      "Startaplarni global bozorga tayyorlash va grant ajratish",
      "Markaziy Osiyoda startap ekotizimini rivojlantirish",
    ],
    outcomes: [
      { label: "Akseleratsiya", value: "120+ startap" },
      { label: "Jalb etilgan", value: "$8 mln" },
      { label: "Mentor", value: "120 ta" },
    ],
    directions: ["Akseleratsiya", "Grant", "Investor", "Global bozor"],
    growth: [
      { year: "2022", v: 2.1 },
      { year: "2023", v: 4.6 },
      { year: "2024", v: 6.8 },
      { year: "2025", v: 8.4 },
    ],
  },
  "qizlar-akademiyasi": {
    about:
      "Prezidentning 2024-yil 21-fevraldagi farmoni asosida tashkil etilgan platforma. Xotin-qizlarni shaxsiy, kasbiy va intellektual rivojlantirishga, bilim olish hamda ishga joylashish imkoniyatlarini yaratishga qaratilgan. 8 ta moduldan iborat.",
    goals: [
      "Qizlarni kasbiy ko'nikma va raqamli savodxonlikka o'rgatish",
      "Liderlik, huquq, psixologiya va tadbirkorlik ko'nikmalarini berish",
      "Ayol-qizlarning ishga joylashish va daromad topishini ta'minlash",
    ],
    outcomes: [
      { label: "Qatnashchi", value: "210 ming+" },
      { label: "Modul", value: "8 ta" },
      { label: "Mentor", value: "860 ta" },
    ],
    directions: ["Huquq", "Psixologiya", "IT & media", "Tadbirkorlik", "Hunarmandchilik"],
    growth: [
      { year: "2024", v: 38 },
      { year: "2025", v: 94 },
    ],
  },
  mutolaa: {
    about:
      "O'zbek tilidagi eng yirik mobil kutubxona. 3000+ elektron va 500+ audiokitob professional aktyorlar ovozida yozilgan. Loyiha ma'rifatparvar Mahmudxo'ja Behbudiyning 1908-yilda Samarqandda ochgan \"Mutolaaxona\"sidan ilhomlangan.",
    goals: [
      "Yoshlarda mutolaa madaniyati va raqamli savodxonlikni oshirish",
      "O'zbek va jahon adabiyotini audioformatda keng tarqatish",
      "Kitobxonlikni rag'batlantirish (eng faol kitobxonlarga sovg'alar)",
    ],
    outcomes: [
      { label: "Kitob fondi", value: "3000+" },
      { label: "Audiokitob", value: "500+" },
      { label: "Foydalanuvchi", value: "1.2 mln" },
    ],
    directions: ["Elektron kitob", "Audiokitob", "Mobil ilova", "Adabiyot"],
    growth: [
      { year: "2021", v: 180 },
      { year: "2022", v: 420 },
      { year: "2023", v: 720 },
      { year: "2024", v: 980 },
      { year: "2025", v: 1200 },
    ],
  },
  uzchess: {
    about:
      "Yoshlar ishlari agentligining shaxmatni rivojlantirish loyihasi. Yoshlar shaxmatni noldan, mutlaqo bepul o'rganadi: video darslar, AI raqib, interaktiv masalalar, kitoblar va xalqaro turnirlar jonli efiri bir ilovada jamlangan.",
    goals: [
      "Yoshlarda mantiqiy fikrlash va strategik tafakkurni rivojlantirish",
      "Shaxmatni har bir maktab va mahallaga olib kirish",
      "Iqtidorli shaxmatchilarni aniqlash va xalqaro darajaga tayyorlash",
    ],
    outcomes: [
      { label: "O'quvchi", value: "220 ming" },
      { label: "Video dars", value: "1200+" },
      { label: "Markaz", value: "152 ta" },
    ],
    directions: ["Video dars", "AI raqib", "Masalalar", "Turnirlar"],
    growth: [
      { year: "2020", v: 45 },
      { year: "2021", v: 90 },
      { year: "2022", v: 140 },
      { year: "2023", v: 185 },
      { year: "2024", v: 220 },
    ],
  },
  "it-akademiya": {
    about:
      "\"Bir million o'zbek dasturchilari\" — yoshlarni dasturlashga o'rgatuvchi yirik milliy dastur. Full-Stack, Frontend, Android va Data Analytics yo'nalishlari bo'yicha bepul onlayn kurslar. IT-Park, Inha universiteti va Coursera bilan hamkorlikda.",
    goals: [
      "1 mln yoshni dasturlash va raqamli kasblarga o'rgatish",
      "Bitiruvchilarni amaliyot va ish bilan ta'minlash",
      "\"5 mln sun'iy intellekt yetakchilari\" dasturiga zamin yaratish",
    ],
    outcomes: [
      { label: "Ro'yxatdan o'tgan", value: "340 ming" },
      { label: "Yo'nalish", value: "8 ta" },
      { label: "Coursera litsenziya", value: "10 ming" },
    ],
    directions: ["Full-Stack", "Frontend", "Android", "Data Analytics"],
    growth: [
      { year: "2021", v: 95 },
      { year: "2022", v: 170 },
      { year: "2023", v: 250 },
      { year: "2024", v: 305 },
      { year: "2025", v: 340 },
    ],
  },
  "yoshlar-daftari": {
    about:
      "Mahalla, tuman va viloyat darajasida ishsiz hamda ijtimoiy himoyaga muhtoj yoshlarni yagona ro'yxatga oluvchi tizim. Har bir yoshga ijtimoiy, huquqiy, psixologik yordam, ta'lim va ish bilan ta'minlash bo'yicha aniq yo'l xaritasi tuziladi.",
    goals: [
      "Ehtiyojmand yoshlarni aniqlash va manzilli qo'llab-quvvatlash",
      "Ularni kasb-hunar va ish bilan ta'minlash",
      "Ijtimoiy himoya va moliyaviy yordamni manzilli yetkazish",
    ],
    outcomes: [
      { label: "Ro'yxatga olingan", value: "78 ming" },
      { label: "Ishga joylashgan", value: "31 ming" },
      { label: "Qamrov", value: "552 MFY" },
    ],
    directions: ["Ro'yxat", "Bandlik", "Kasb-hunar", "Ijtimoiy yordam"],
    growth: [
      { year: "2021", v: 22 },
      { year: "2022", v: 41 },
      { year: "2023", v: 58 },
      { year: "2024", v: 78 },
    ],
  },
  "5-tashabbus": {
    about:
      "Prezidentning beshta muhim tashabbusi asosidagi keng qamrovli dastur. Yoshlarni madaniyat va san'at, jismoniy tarbiya va sport, axborot texnologiyalari, kitobxonlik hamda xotin-qizlar bandligi yo'nalishlarida qamrab oladi.",
    goals: [
      "Yoshlarni bo'sh vaqtini mazmunli o'tkazishga jalb etish",
      "Madaniyat, sport va IT'ga ommaviy qiziqishni oshirish",
      "Iqtidorli yoshlarni aniqlash va qo'llab-quvvatlash",
    ],
    outcomes: [
      { label: "Qamrov", value: "2.4 mln" },
      { label: "Yo'nalish", value: "5 ta" },
      { label: "To'garak", value: "12 ming+" },
    ],
    directions: ["Madaniyat", "Sport", "IT", "Kitobxonlik", "Bandlik"],
    growth: [
      { year: "2019", v: 900 },
      { year: "2021", v: 1500 },
      { year: "2023", v: 2000 },
      { year: "2025", v: 2400 },
    ],
  },
  "talaba-talim-grant": {
    about:
      "Iqtidorli yoshlarga oliy ta'lim kontrakti to'lovi, xalqaro fan olimpiadalari va chet el ta'limi uchun grantlar ajratuvchi dastur. Moliyaviy imkoni cheklangan, ammo qobiliyatli yoshlarning ta'lim olish huquqini ta'minlaydi.",
    goals: [
      "Iqtidorli, ammo ehtiyojmand yoshlarga ta'lim grantini berish",
      "Xalqaro olimpiada g'oliblarini rag'batlantirish",
      "Chet el yetakchi universitetlarida o'qish imkonini yaratish",
    ],
    outcomes: [
      { label: "Grant egasi", value: "36 ming" },
      { label: "Xalqaro olimpiada", value: "240+ g'olib" },
      { label: "Chet el granti", value: "1 800" },
    ],
    directions: ["Kontrakt grant", "Olimpiada", "Chet el ta'limi", "Stipendiya"],
    growth: [
      { year: "2020", v: 8 },
      { year: "2022", v: 19 },
      { year: "2024", v: 30 },
      { year: "2025", v: 36 },
    ],
  },
  "yosh-tadbirkor": {
    about:
      "Yoshlarni tadbirkorlik asoslari, biznes-reja tuzish va moliyaviy savodxonlikka o'rgatuvchi dastur. Eng yaxshi g'oyalar uchun mikrogrant ajratiladi va mahalliy biznes yaratishga amaliy ko'mak beriladi.",
    goals: [
      "Yoshlarda tadbirkorlik ko'nikmalarini shakllantirish",
      "Eng yaxshi biznes-g'oyalarga mikrogrant ajratish",
      "Mahallalarda yangi ish o'rinlari yaratishga ko'maklashish",
    ],
    outcomes: [
      { label: "Tinglovchi", value: "21 ming" },
      { label: "Mikrogrant", value: "640 loyiha" },
      { label: "Mentor", value: "340 ta" },
    ],
    directions: ["Biznes asoslari", "Biznes-reja", "Mikrogrant", "Moliyaviy savod"],
    growth: [
      { year: "2024", v: 9 },
      { year: "2025", v: 21 },
    ],
  },
  "ijod-maktabi": {
    about:
      "Yoshlarni grafik dizayn, raqamli san'at, animatsiya va kreativ industriyaga tayyorlovchi maktab. Har bir o'quvchi amaliy loyihalar va portfolio bilan bitiradi, eng iqtidorlilari ijodiy industriyada ishga joylashtiriladi.",
    goals: [
      "Yoshlarni kreativ va raqamli kasblarga tayyorlash",
      "Portfolio va amaliyot orqali real ko'nikma berish",
      "Ijodiy industriyada yangi iste'dodlarni aniqlash",
    ],
    outcomes: [
      { label: "O'quvchi", value: "64 ming" },
      { label: "Portfolio", value: "12 ming+" },
      { label: "Markaz", value: "44 ta" },
    ],
    directions: ["Grafik dizayn", "Raqamli san'at", "Animatsiya", "Portfolio"],
    growth: [
      { year: "2023", v: 24 },
      { year: "2024", v: 48 },
      { year: "2025", v: 64 },
    ],
  },
};
