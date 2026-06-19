import {
  LayoutDashboard,
  Landmark,
  Trees,
  Users,
  Home,
  BarChart3,
  ReceiptText,
  AlertTriangle,
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
      { title: "Analitika", url: "/owner/soliq", icon: BarChart3 },
      { title: "Soliq to'lovchilar", url: "/owner/soliq/taxpayers", icon: Users },
      { title: "Soliqlar", url: "/owner/soliq/assessments", icon: ReceiptText },
      { title: "Qarzdorlik", url: "/owner/soliq/debtors", icon: AlertTriangle },
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
