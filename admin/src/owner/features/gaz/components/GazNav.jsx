import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";

const ITEMS = [
  { to: "/owner/soliq/gaz", label: "Analitika", exact: true },
  { to: "/owner/soliq/gaz/abonentlar", label: "Abonentlar", exact: false },
  { to: "/owner/soliq/gaz/arizalar", label: "Arizalar", exact: false },
  { to: "/owner/soliq/gaz/tolovlar", label: "To'lovlar", exact: false },
  { to: "/owner/soliq/gaz/qarzdorlar", label: "Qarzdorlik", exact: false },
];

const GazNav = () => <TabsLinks items={ITEMS} className="mb-5" />;

export default GazNav;
