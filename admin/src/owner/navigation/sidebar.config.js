import { LayoutDashboard, LayoutGrid, Trees, Users, Home, Landmark, Map, GraduationCap, Shield, Flame, Store, TriangleAlert, Layers, Zap, Wrench, ClipboardList, Fuel, Route as RouteIcon, Network, Wifi, Container, Building2 } from "lucide-react";

const ownerSidebar = [
  {
    key: "asosiy",
    title: "Asosiy",
    icon: LayoutGrid,
    items: [{ title: "Umumiy ko'rinish", url: "/owner/asosiy", icon: Home }],
  },
  {
    key: "sarnovul",
    title: "Sarnovul MFY",
    icon: Building2,
    items: [{ title: "Mahalla pasporti", url: "/owner/sarnovul", icon: Home }],
  },
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
    key: "yoshlar",
    title: "Yoshlar",
    icon: Users,
    items: [
      { title: "Analitika", url: "/owner/yoshlar", icon: Home },
      { title: "Loyihalar", url: "/owner/yoshlar/loyihalar", icon: Layers },
    ],
  },
  {
    key: "infratuzilma",
    title: "Infratuzilma xizmatlari",
    icon: Network,
    items: [
      { title: "Elektr energiya", url: "/owner/elektr", icon: Zap },
      { title: "Suyultirilgan gaz", url: "/owner/suyuq-gaz", icon: Container },
      { title: "Internet", url: "/owner/internet", icon: Wifi },
      {
        title: "Gaz ta'minoti",
        url: "/owner/gaz",
        icon: Fuel,
        children: [
          { title: "Analitika", url: "/owner/gaz", icon: Home },
          { title: "Ko'chalar", url: "/owner/gaz/kochalar", icon: RouteIcon },
        ],
      },
      {
        title: "Obodonlashtirish",
        url: "/owner/obodonlashtirish",
        icon: Trees,
        children: [
          { title: "Bajarilish", url: "/owner/obodonlashtirish", icon: Home },
          { title: "Xarita", url: "/owner/obodonlashtirish/xarita", icon: Map },
          { title: "Loyihalar", url: "/owner/obodonlashtirish/loyihalar", icon: Layers },
          { title: "Axlat", url: "/owner/obodonlashtirish/axlat", icon: ClipboardList },
          { title: "Assenizatsiya", url: "/owner/obodonlashtirish/assenizatsiya", icon: ClipboardList },
          { title: "Yashil makon", url: "/owner/obodonlashtirish/yashil-makon", icon: Trees },
          { title: "Hashar", url: "/owner/obodonlashtirish/hashar", icon: Users },
        ],
      },
      {
        title: "MSK (Servis)",
        url: "/owner/msk",
        icon: Wrench,
        children: [
          { title: "Analitika", url: "/owner/msk", icon: Home },
          { title: "Arizalar", url: "/owner/msk/arizalar", icon: ClipboardList },
        ],
      },
    ],
  },
];

export default ownerSidebar;
