import { LayoutDashboard, Trees, Users, Home, Landmark, Map, GraduationCap, Shield, Flame, Store, TriangleAlert, Layers, Zap, Wrench, ClipboardList, Fuel, Route as RouteIcon } from "lucide-react";

const ownerSidebar = [
  {
    key: "dashboard",
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    items: [{ title: "Bosh sahifa", url: "/owner/dashboard", icon: Home }],
  },
  {
    key: "talim",
    title: "Ta'lim",
    icon: GraduationCap,
    items: [{ title: "Ta'lim tahlili", url: "/owner/talim", icon: Home }],
  },
  {
    key: "iib",
    title: "IIB",
    icon: Shield,
    items: [{ title: "Xavfsizlik tahlili", url: "/owner/iib", icon: Home }],
  },
  {
    key: "fvv",
    title: "FVV",
    icon: Flame,
    items: [{ title: "Favqulodda tahlil", url: "/owner/fvv", icon: Home }],
  },
  {
    key: "soliq",
    title: "Soliq",
    icon: Landmark,
    items: [
      { title: "Soliq xaritasi", url: "/owner/soliq", icon: Map },
      { title: "Bizneslar", url: "/owner/soliq/bizneslar", icon: Store },
      { title: "Qarzdorlar", url: "/owner/soliq/qarzdorlar", icon: TriangleAlert },
    ],
  },
  {
    key: "obodonlashtirish",
    title: "Obodonlashtirish",
    icon: Trees,
    items: [
      { title: "Obodonlashtirish", url: "/owner/obodonlashtirish", icon: Home },
    ],
  },
  {
    key: "yoshlar",
    title: "Yoshlar",
    icon: Users,
    items: [
      { title: "Analitika", url: "/owner/yoshlar", icon: Home },
      { title: "Loyihalar", url: "/owner/yoshlar/loyihalar", icon: Layers },
    ],
  },
  {
    key: "elektr",
    title: "Elektr energiya",
    icon: Zap,
    items: [{ title: "Analitika", url: "/owner/elektr", icon: Home }],
  },
  {
    key: "msk",
    title: "MSK (Servis)",
    icon: Wrench,
    items: [
      { title: "Analitika", url: "/owner/msk", icon: Home },
      { title: "Arizalar", url: "/owner/msk/arizalar", icon: ClipboardList },
    ],
  },
  {
    key: "gaz",
    title: "Gaz ta'minoti",
    icon: Fuel,
    items: [
      { title: "Analitika", url: "/owner/gaz", icon: Home },
      { title: "Ko'chalar", url: "/owner/gaz/kochalar", icon: RouteIcon },
    ],
  },
];

export default ownerSidebar;
