import { LayoutDashboard, Landmark, Trees, Users } from "lucide-react";

const ownerSidebar = [
  {
    key: "dashboard",
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    items: [{ title: "Bosh sahifa", url: "/owner/dashboard" }],
  },
  {
    key: "soliq",
    title: "Soliq",
    icon: Landmark,
    items: [{ title: "Bosh sahifa", url: "/owner/soliq" }],
  },
  {
    key: "obodonlashtirish",
    title: "Obodonlashtirish",
    icon: Trees,
    items: [{ title: "Bosh sahifa", url: "/owner/obodonlashtirish" }],
  },
  {
    key: "yoshlar",
    title: "Yoshlar",
    icon: Users,
    items: [{ title: "Bosh sahifa", url: "/owner/yoshlar" }],
  },
];

export default ownerSidebar;
