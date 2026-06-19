import { LayoutDashboard, Landmark } from "lucide-react";

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
];

export default ownerSidebar;
