import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";

const ITEMS = [
  { to: "/owner/soliq/elektr", label: "Analitika", exact: true },
  { to: "/owner/soliq/elektr/abonentlar", label: "Abonentlar", exact: false },
  { to: "/owner/soliq/elektr/arizalar", label: "Arizalar", exact: false },
  { to: "/owner/soliq/elektr/qoidabuzarliklar", label: "Qoidabuzarliklar", exact: false },
];

const SvetNav = () => <TabsLinks items={ITEMS} className="mb-5" />;

export default SvetNav;
