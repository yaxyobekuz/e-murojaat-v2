import { LayoutDashboard, Trees, Users, Home, Landmark, Map, GraduationCap, Shield, Flame, Store, TriangleAlert, Layers, Truck, Droplets, TreePine, Sparkles } from "lucide-react";

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
      { title: "Bosh sahifa", url: "/owner/obodonlashtirish", icon: Home },
      { title: "Axlat mashinasi", url: "/owner/obodonlashtirish/axlat", icon: Truck },
      { title: "Gaz mashinasi", url: "/owner/obodonlashtirish/assenizatsiya", icon: Droplets },
      { title: "Yashil makon", url: "/owner/obodonlashtirish/yashil-makon", icon: TreePine },
      { title: "Tozalov & hashar", url: "/owner/obodonlashtirish/hashar", icon: Sparkles },
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
];

export default ownerSidebar;
