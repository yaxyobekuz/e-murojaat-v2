import {
  LayoutDashboard,
  Landmark,
  LandPlot,
  Home,
  FileSearch,
  FilePlus2,
  ScrollText,
  Zap,
  Gauge,
  Wallet,
  Inbox,
  Search,
  HelpCircle,
  Flame,
  CreditCard,
} from "lucide-react";

// Sidebar konfiguratsiyasi: ichma-ich (nested) tuzilma.
// - Top daraja: `icon` + `items` bilan guruh.
// - `items` ichida `items` bo'lsa -> kengayadigan ichki bo'lim (cheksiz chuqurlik).
// - `items` bo'lmasa -> `url` li havola (barg).
// - `permission` ixtiyoriy: faqat shu ruxsat bor foydalanuvchiga ko'rinadi (owner doim ko'radi).
//
// MUHIM: HAR BIR bo'lim oldida `icon` bo'lishi shart. Sidebar icon-holatga
// qisqarganda faqat icon ko'rinadi; iconsiz bo'lim bo'sh joy bo'lib qoladi.
const ownerSidebar = [
  {
    title: "Boshqaruv paneli",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Bosh sahifa",
        icon: LayoutDashboard,
        url: "/owner/dashboard",
      },
    ],
  },
  {
    key: "soliq",
    title: "Soliq",
    icon: Landmark,
    items: [
      {
        title: "Mening soliqlarim",
        icon: Landmark,
        url: "/owner/soliq",
      },
    ],
  },
  {
    key: "yer",
    title: "Yer / Mol-mulk",
    icon: LandPlot,
    items: [
      { title: "Mening mulklarim", icon: Home, url: "/owner/yer/mulklarim" },
      { title: "Reyestrdan ko'chirma", icon: FileSearch, url: "/owner/yer/reyestr" },
      { title: "Yangi ariza", icon: FilePlus2, url: "/owner/yer/ariza" },
      { title: "Arizalarim", icon: ScrollText, url: "/owner/yer/arizalarim" },
    ],
  },
  {
    key: "gaz",
    title: "Gaz",
    icon: Flame,
    items: [
      { title: "Mening hisobim", icon: Home, url: "/owner/gaz/hisobim" },
      { title: "Sarf monitoringi", icon: Gauge, url: "/owner/gaz/sarf" },
      { title: "To'lov qilish", icon: Wallet, url: "/owner/gaz/tolov" },
      { title: "To'lovlar tarixi", icon: CreditCard, url: "/owner/gaz/tolovlar" },
      { title: "Xizmatga ariza", icon: FilePlus2, url: "/owner/gaz/ariza" },
      { title: "Arizalarim", icon: ScrollText, url: "/owner/gaz/arizalarim" },
      { title: "Abonentni tekshirish", icon: Search, url: "/owner/gaz/tekshirish" },
    ],
  },
  {
    key: "elektr",
    title: "Elektr",
    icon: Zap,
    items: [
      { title: "Mening hisobim", icon: Home, url: "/owner/elektr/hisobim" },
      { title: "Sarf monitoringi", icon: Gauge, url: "/owner/elektr/sarf" },
      { title: "To'lov qilish", icon: Wallet, url: "/owner/elektr/tolov" },
      { title: "Yangi ariza", icon: FilePlus2, url: "/owner/elektr/ariza" },
      { title: "Arizalarim", icon: ScrollText, url: "/owner/elektr/arizalarim" },
    ],
  },
  {
    key: "murojaat",
    title: "Murojaatlar",
    icon: Inbox,
    items: [
      { title: "Yangi murojaat", icon: FilePlus2, url: "/owner/murojaat/yangi" },
      { title: "Mening murojaatlarim", icon: ScrollText, url: "/owner/murojaat/mening" },
      { title: "Holatni tekshirish", icon: Search, url: "/owner/murojaat/holat" },
      { title: "Savol-javob", icon: HelpCircle, url: "/owner/murojaat/faq" },
    ],
  },
];

export default ownerSidebar;
