// Ta'lim — ATLAS COMMAND vaziyat markazi dashboardi.
import { CalendarDays, Activity, School, LayoutGrid, Users, GraduationCap, UserCog } from "lucide-react";
import SituationRoom from "@/shared/components/ui/situation/SituationRoom";

const DISTRICTS = [
  { name: "Xonobod", hot: true }, { name: "Andijon sh." }, { name: "Qo'rg'ontepa" }, { name: "Izboskan" },
  { name: "Asaka" }, { name: "Baliqchi" }, { name: "Xo'jaobod" }, { name: "Ulug'nor" },
  { name: "Buloqboshi" }, { name: "Jalaquduq" }, { name: "Oltinko'l", hot: true }, { name: "Paxtaobod" },
  { name: "Shahrixon" }, { name: "Marhamat" }, { name: "Bo'z" }, { name: "Andijon t." },
];
const RATINGS = ["Xonobod 95.8", "Andijon 95.6", "Qo'rg'ontepa 94.2", "Izboskan 94.1", "Asaka 93.1", "Baliqchi 91.5", "Xo'jaobod 91.5", "Ulug'nor 91.4", "Buloqboshi 90.4", "Jalaquduq 90.3", "Oltinko'l 89.8", "Paxtaobod 89.1"]
  .map((s) => { const p = s.split(" "); return { label: p.slice(0, -1).join(" "), pct: Number(p.at(-1)) }; });

const config = {
  brand: { title: "ATLAS COMMAND", subtitle: "TA'LIM SITUATSION MARKAZI" },
  accent: "#22d3ee", mapAccent: "#ec4899",
  nav: ["Markaziy bo'lim", "Tezkor qidiruv", "O'quvchilar", "O'qituvchilar", "Xodimlar"],
  kpis: [
    { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
    { label: "O'rtacha davomat", value: "95.0%", icon: Activity },
    { label: "Maktablar", value: "16", icon: School },
    { label: "Sinflar", value: "763", icon: LayoutGrid },
    { label: "O'quvchilar", value: "554 762", icon: Users, highlight: true },
    { label: "O'qituvchilar", value: "969", icon: GraduationCap },
  ],
  hierarchy: {
    title: "Kadrlar iyerarxiyasi", icon: UserCog,
    items: [
      { label: "Direktor", sub: "Rahbariyat", value: 16 },
      { label: "O'rinbosar", sub: "Ta'lim / Tarbiya", value: 42 },
      { label: "Metodist", sub: "Amaliyot", value: 64 },
      { label: "O'qituvchilar", sub: "Pedagog", value: 969 },
      { label: "Xizmat ko'rsatuvchi", sub: "Yordamchi", value: 210 },
      { label: "Texnik xodimlar", sub: "Ta'minot", value: 86 },
      { label: "Boshqa xodimlar", sub: "—", value: 13 },
    ],
  },
  efficiency: {
    title: "Tizim samaradorligi",
    items: [
      { label: "Maktab yuklamasi", value: "596", pct: 78 },
      { label: "Pedagogik yuklama", value: "469.3", pct: 64 },
      { label: "Texnik ta'minot", value: "34 981", pct: 88 },
      { label: "Kadrlar saloxiyati", value: "92", unit: "%", pct: 92 },
    ],
  },
  mapTitle: "ANDIJON VILOYATI", districts: DISTRICTS,
  dynamicsTitle: "O'quvchilar dinamikasi",
  ratings: { title: "Hududiy reyting", items: RATINGS },
  cohorts: {
    title: "Kogorta tahlili",
    items: [
      { label: "Sinflar 1-4", value: "88", unit: "%", pct: 88 },
      { label: "Sinflar 5-9", value: "92", unit: "%", pct: 92 },
      { label: "Sinflar 10-11", value: "85", unit: "%", pct: 85 },
    ],
  },
};

const TalimDashboardPage = () => <SituationRoom config={config} />;
export default TalimDashboardPage;
