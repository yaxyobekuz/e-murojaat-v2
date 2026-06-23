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
