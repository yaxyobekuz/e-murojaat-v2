import { LayoutDashboard, Trees, Users, Home, Landmark, Map } from "lucide-react";

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
    items: [{ title: "Soliq xaritasi", url: "/owner/soliq", icon: Map }],
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
