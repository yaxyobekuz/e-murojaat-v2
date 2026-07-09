import { Map, Landmark, GraduationCap, Shield, Flame, Users, Network, LayoutGrid, Building2, Cctv, Settings } from "lucide-react";

// TopBar modullari (drill-in). Har modul: key (kod), title (UI), icon, base (root url),
// items[] (ichki bo'limlar). Modulga bosilsa TopBar shu modul ichiga almashadi.
// Yangi modul = shu yerga obyekt + routes/index.jsx ga marshrut.
const topbarModules = [
  {
    key: "asosiy",
    title: "Asosiy",
    icon: LayoutGrid,
    base: "/owner/asosiy",
    items: [{ title: "Umumiy ko'rinish", url: "/owner/asosiy", end: true }],
  },
  {
    key: "sarnovul",
    title: "Sarnovul MFY",
    icon: Building2,
    base: "/owner/sarnovul",
    items: [{ title: "Mahalla pasporti", url: "/owner/sarnovul", end: true }],
  },
  {
    key: "kameralar",
    title: "Kameralar",
    icon: Cctv,
    base: "/owner/kameralar",
    items: [{ title: "Kamera qo'shish", url: "/owner/kameralar", end: true }],
  },
  {
    key: "yer",
    title: "Yer kadastri",
    icon: Map,
    base: "/owner/yer",
    items: [
      { title: "Analitika", url: "/owner/yer", end: true },
      { title: "Reyestr", url: "/owner/yer/reyestr" },
      { title: "Arizalar", url: "/owner/yer/arizalar" },
    ],
  },
  {
    key: "soliq",
    title: "Soliq",
    icon: Landmark,
    base: "/owner/soliq",
    items: [
      { title: "Analitika", url: "/owner/soliq", end: true },
      { title: "Bizneslar", url: "/owner/soliq/bizneslar" },
      { title: "Qarzdorlar", url: "/owner/soliq/qarzdorlar" },
    ],
  },
  {
    key: "talim",
    title: "Ta'lim",
    icon: GraduationCap,
    base: "/owner/talim",
    items: [
      { title: "Analitika", url: "/owner/talim", end: true },
      { title: "Umumiy ma'lumotlar", url: "/owner/talim/malumotlar" },
    ],
  },
  {
    key: "iib",
    title: "IIB (Xavfsizlik)",
    icon: Shield,
    base: "/owner/iib",
    items: [
      { title: "Analitika", url: "/owner/iib", end: true },
      { title: "Operativ xarita", url: "/owner/iib/xarita" },
    ],
  },
  {
    key: "fvv",
    title: "FVV (Favqulodda)",
    icon: Flame,
    base: "/owner/fvv",
    items: [
      { title: "Analitika", url: "/owner/fvv", end: true },
      { title: "Operativ xarita", url: "/owner/fvv/xarita" },
    ],
  },
  {
    key: "yoshlar",
    title: "Yoshlar",
    icon: Users,
    base: "/owner/yoshlar",
    items: [
      { title: "Analitika", url: "/owner/yoshlar", end: true },
      { title: "Loyihalar", url: "/owner/yoshlar/loyihalar" },
    ],
  },
  {
    key: "infratuzilma",
    title: "Infratuzilma xizmatlari",
    icon: Network,
    base: "/owner/infratuzilma",
    // Bir nechta marshrutni qamraydi — moduleForPath shu bases ro'yxati orqali aniqlaydi
    bases: [
      "/owner/elektr",
      "/owner/suyuq-gaz",
      "/owner/internet",
      "/owner/gaz",
      "/owner/obodonlashtirish",
      "/owner/msk",
    ],
    items: [
      { title: "Elektr energiya", url: "/owner/elektr", end: true },
      { title: "Suyultirilgan gaz", url: "/owner/suyuq-gaz" },
      { title: "Internet", url: "/owner/internet" },
      { title: "Gaz ta'minoti", url: "/owner/gaz" },
      { title: "Obodonlashtirish", url: "/owner/obodonlashtirish" },
      { title: "MSK (Servis)", url: "/owner/msk" },
    ],
  },
  {
    key: "boshqaruv",
    title: "Boshqaruv",
    icon: Settings,
    base: "/boshqaruv",
    items: [
      { title: "Xarita tahrirlash", url: "/boshqaruv", end: true },
      { title: "Xonadonlar jadvali", url: "/boshqaruv/jadval" },
    ],
  },
];

export default topbarModules;
