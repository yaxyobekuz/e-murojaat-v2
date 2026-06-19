import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";

const ITEMS = [
  { to: "/owner/soliq/yer", label: "Analitika", exact: true },
  { to: "/owner/soliq/yer/reyestr", label: "Reyestr", exact: false },
  { to: "/owner/soliq/yer/arizalar", label: "Arizalar", exact: false },
];

const YerNav = () => <TabsLinks items={ITEMS} className="mb-5" />;

export default YerNav;
