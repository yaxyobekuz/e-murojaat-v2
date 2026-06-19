import { LayoutDashboard, Landmark, Trees, Users } from "lucide-react";

const ownerSidebar = [
  {
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Bosh sahifa",
        url: "/owner/dashboard",
      },
    ],
  },
  {
    title: "Soliq",
    icon: Landmark,
    items: [
      {
        title: "Bosh sahifa",
        url: "/owner/soliq",
      },
    ],
  },
  {
    title: "Obodonlashtirish",
    icon: Trees,
    items: [
      {
        title: "Bosh sahifa",
        url: "/owner/obodonlashtirish",
      },
    ],
  },
  {
    title: "Yoshlar",
    icon: Users,
    items: [
      {
        title: "Bosh sahifa",
        url: "/owner/yoshlar",
      },
    ],
  },
];

export default ownerSidebar;
