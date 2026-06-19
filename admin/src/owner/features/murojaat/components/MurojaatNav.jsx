import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";

const ITEMS = [
  { to: "/owner/murojaat", label: "Analitika", exact: true },
  { to: "/owner/murojaat/inbox", label: "Murojaatlar", exact: false },
  { to: "/owner/murojaat/tashkilotlar", label: "Tashkilotlar", exact: false },
];

const MurojaatNav = () => <TabsLinks items={ITEMS} className="mb-5" />;

export default MurojaatNav;
