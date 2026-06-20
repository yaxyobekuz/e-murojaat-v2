import { Map, Landmark, Trees, GraduationCap, Shield, Flame } from "lucide-react";

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
    items: [{ title: "Analitika", url: "/owner/fvv", end: true }],
  },
];

export default topbarModules;
