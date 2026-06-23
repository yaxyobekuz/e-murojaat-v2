import { Map, Landmark, Trees, GraduationCap, Shield, Flame, Users } from "lucide-react";

// TopBar modullari (drill-in). Har modul: key (kod), title (UI), icon, base (root url),
// items[] (ichki bo'limlar). Modulga bosilsa TopBar shu modul ichiga almashadi.
// Yangi modul = shu yerga obyekt + routes/index.jsx ga marshrut.
const topbarModules = [
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
    key: "obodonlashtirish",
    title: "Obodonlashtirish",
    icon: Trees,
    base: "/owner/obodonlashtirish",
    items: [
      { title: "Analitika", url: "/owner/obodonlashtirish", end: true },
      { title: "Loyihalar", url: "/owner/obodonlashtirish/loyihalar" },
      { title: "Axlat mashinasi", url: "/owner/obodonlashtirish/axlat" },
      { title: "Gaz mashinasi", url: "/owner/obodonlashtirish/assenizatsiya" },
      { title: "Yashil makon", url: "/owner/obodonlashtirish/yashil-makon" },
      { title: "Tozalov & hashar", url: "/owner/obodonlashtirish/hashar" },
    ],
  },
  {
    key: "talim",
    title: "Ta'lim",
    icon: GraduationCap,
    base: "/owner/talim",
    items: [{ title: "Analitika", url: "/owner/talim", end: true }],
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
];

export default topbarModules;
