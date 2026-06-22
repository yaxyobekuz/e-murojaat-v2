// FVV — ATLAS COMMAND vaziyat markazi dashboardi.
import { CalendarDays, Flame, Building2, Truck, PhoneCall, Users, UserCog } from "lucide-react";
import SituationRoom from "@/shared/components/ui/situation/SituationRoom";

const DISTRICTS = [
  { name: "Andijon sh.", hot: true }, { name: "Asaka" }, { name: "Xonobod" }, { name: "Izboskan" },
  { name: "Qo'rg'ontepa" }, { name: "Baliqchi" }, { name: "Xo'jaobod", hot: true }, { name: "Ulug'nor" },
  { name: "Buloqboshi" }, { name: "Jalaquduq" }, { name: "Oltinko'l" }, { name: "Paxtaobod" },
  { name: "Shahrixon" }, { name: "Marhamat" }, { name: "Bo'z" }, { name: "Andijon t." },
];
const RATINGS = ["Ulug'nor 97.1", "Bo'z 96.3", "Oltinko'l 95.5", "Buloqboshi 94.6", "Paxtaobod 93.8", "Baliqchi 92.9", "Marhamat 92.0", "Izboskan 90.8", "Asaka 89.2", "Xo'jaobod 86.9", "Andijon sh. 85.0", "Shahrixon 83.7"]
  .map((s) => { const p = s.split(" "); return { label: p.slice(0, -1).join(" "), pct: Number(p.at(-1)) }; });

const config = {
  brand: { title: "ATLAS COMMAND", subtitle: "FVV SITUATSION MARKAZI" },
  accent: "#fb923c", mapAccent: "#f97316",
  nav: ["Markaziy bo'lim", "Tezkor qidiruv", "Chaqiruvlar", "Brigadalar", "Hodisalar"],
  kpis: [
    { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
    { label: "Bartaraf etish", value: "96.0%", icon: Flame },
    { label: "Qismlar", value: "6", icon: Building2 },
    { label: "Brigadalar", value: "24", icon: Truck },
    { label: "Chaqiruvlar", value: "3 240", icon: PhoneCall, highlight: true },
    { label: "Xodimlar", value: "312", icon: Users },
  ],
  hierarchy: {
    title: "Shaxsiy tarkib", icon: UserCog,
    items: [
      { label: "Boshliq", sub: "Rahbariyat", value: 1 },
      { label: "O'rinbosarlar", sub: "Bo'limlar", value: 3 },
      { label: "Bo'lim boshliqlari", sub: "Qismlar", value: 12 },
      { label: "Qutqaruvchilar", sub: "Operativ", value: 180 },
      { label: "Haydovchilar", sub: "Texnika", value: 48 },
      { label: "Navbatchi", sub: "101", value: 24 },
      { label: "Boshqa xodimlar", sub: "—", value: 44 },
    ],
  },
  efficiency: {
    title: "Tizim samaradorligi",
    items: [
      { label: "O'rtacha javob", value: "6 daq", pct: 74 },
      { label: "Suv ta'minoti", value: "88", unit: "%", pct: 88 },
      { label: "Texnika tayyorligi", value: "94", unit: "%", pct: 94 },
      { label: "Hudud qamrovi", value: "82", unit: "%", pct: 82 },
    ],
  },
  mapTitle: "ANDIJON VILOYATI", districts: DISTRICTS,
  dynamicsTitle: "Chaqiruvlar dinamikasi",
  ratings: { title: "Hududiy reyting", items: RATINGS },
  cohorts: {
    title: "Hodisa toifalari",
    items: [
      { label: "Yong'in", value: "46", unit: "%", pct: 46 },
      { label: "Qutqaruv", value: "30", unit: "%", pct: 30 },
      { label: "Tabiiy ofat", value: "24", unit: "%", pct: 24 },
    ],
  },
};

const FvvDashboardPage = () => <SituationRoom config={config} />;
export default FvvDashboardPage;
