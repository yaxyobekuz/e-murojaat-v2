import {
  LayoutDashboard,
  Landmark,
  Trees,
  Users,
  Flame,
  Droplet,
  Zap,
  LandPlot,
  Home,
} from "lucide-react";

const ownerSidebar = [
  {
    key: "dashboard",
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    items: [{ title: "Bosh sahifa", url: "/owner/dashboard", icon: Home }],
  },
  {
    key: "soliq",
    title: "Soliq",
    icon: Landmark,
    items: [
      { title: "Bosh sahifa", url: "/owner/soliq", icon: Home },
      { title: "Gaz", url: "/owner/soliq/gaz", icon: Flame },
      { title: "Suv", url: "/owner/soliq/suv", icon: Droplet },
      { title: "Elektr", url: "/owner/soliq/elektr", icon: Zap },
      { title: "Yer", url: "/owner/soliq/yer", icon: LandPlot },
    ],
  },
  {
    key: "obodonlashtirish",
    title: "Obodonlashtirish",
    icon: Trees,
    items: [{ title: "Bosh sahifa", url: "/owner/obodonlashtirish", icon: Home }],
  },
  {
    key: "yoshlar",
    title: "Yoshlar",
    icon: Users,
    items: [{ title: "Bosh sahifa", url: "/owner/yoshlar", icon: Home }],
  },
];

export default ownerSidebar;
