import {
  LayoutDashboard,
  Landmark,
  Trees,
  Users,
  Flame,
  Zap,
  LandPlot,
  Home,
  Inbox,
  BarChart3,
  Building2,
  ReceiptText,
  AlertTriangle,
  GraduationCap,
  Shield,
  FlameKindling,
} from "lucide-react";

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
    items: [{ title: "Bosh sahifa", url: "/owner/talim", icon: Home }],
  },
  {
    key: "iib",
    title: "IIB",
    icon: Shield,
    items: [{ title: "Bosh sahifa", url: "/owner/iib", icon: Home }],
  },
  {
    key: "fvv",
    title: "FVV",
    icon: FlameKindling,
    items: [{ title: "Bosh sahifa", url: "/owner/fvv", icon: Home }],
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
      { title: "Gaz", url: "/owner/soliq/gaz", icon: Flame, permission: "gaz.read" },
      { title: "Elektr", url: "/owner/soliq/elektr", icon: Zap, permission: "svet.read" },
      { title: "Yer", url: "/owner/soliq/yer", icon: LandPlot, permission: "yer.read" },
    ],
  },
  {
    key: "murojaat",
    title: "Murojaatlar",
    icon: Inbox,
    permission: "murojaat.read",
    items: [
      { title: "Analitika", url: "/owner/murojaat", icon: BarChart3 },
      { title: "Murojaatlar navbati", url: "/owner/murojaat/inbox", icon: Inbox },
      { title: "Tashkilotlar", url: "/owner/murojaat/tashkilotlar", icon: Building2 },
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
