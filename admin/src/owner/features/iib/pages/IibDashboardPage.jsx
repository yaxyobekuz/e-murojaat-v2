// IIB — ATLAS COMMAND vaziyat markazi dashboardi.
import { CalendarDays, ShieldCheck, Building2, Car, PhoneCall, Users, UserCog } from "lucide-react";
import SituationRoom from "@/shared/components/ui/situation/SituationRoom";

const DISTRICTS = [
  { name: "Andijon sh.", hot: true }, { name: "Asaka" }, { name: "Xonobod" }, { name: "Izboskan" },
  { name: "Qo'rg'ontepa" }, { name: "Baliqchi" }, { name: "Xo'jaobod" }, { name: "Ulug'nor" },
  { name: "Buloqboshi" }, { name: "Jalaquduq", hot: true }, { name: "Oltinko'l" }, { name: "Paxtaobod" },
  { name: "Shahrixon" }, { name: "Marhamat" }, { name: "Bo'z" }, { name: "Andijon t." },
];
const RATINGS = ["Bo'z 96.2", "Ulug'nor 95.4", "Oltinko'l 94.8", "Baliqchi 94.0", "Buloqboshi 93.3", "Paxtaobod 92.6", "Marhamat 91.9", "Izboskan 90.7", "Asaka 88.9", "Andijon sh. 86.2", "Jalaquduq 84.5", "Shahrixon 83.1"]
  .map((s) => { const p = s.split(" "); return { label: p.slice(0, -1).join(" "), pct: Number(p.at(-1)) }; });

const config = {
  brand: { title: "ATLAS COMMAND", subtitle: "IIB SITUATSION MARKAZI" },
  accent: "#fb7185", mapAccent: "#ef4444",
  nav: ["Markaziy bo'lim", "Tezkor qidiruv", "Chaqiruvlar", "Patrullar", "Jinoyatlar"],
  kpis: [
    { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
    { label: "Jamoat xavfsizligi", value: "94.0%", icon: ShieldCheck },
    { label: "Bo'limlar", value: "12", icon: Building2 },
    { label: "Patrul ekipaj", value: "38", icon: Car },
    { label: "Chaqiruvlar", value: "12 480", icon: PhoneCall, highlight: true },
    { label: "Xodimlar", value: "540", icon: Users },
  ],
  hierarchy: {
    title: "Shaxsiy tarkib", icon: UserCog,
    items: [
      { label: "Boshliq", sub: "Rahbariyat", value: 1 },
      { label: "O'rinbosarlar", sub: "Bo'limlar", value: 4 },
      { label: "Tergovchilar", sub: "Tergov", value: 64 },
      { label: "Inspektorlar", sub: "Profilaktika", value: 120 },
      { label: "Patrul-post", sub: "PPX", value: 240 },
      { label: "Navbatchi", sub: "102", value: 36 },
      { label: "Boshqa xodimlar", sub: "—", value: 75 },
    ],
  },
  efficiency: {
    title: "Tizim samaradorligi",
    items: [
      { label: "Patrul qamrovi", value: "86", unit: "%", pct: 86 },
      { label: "Aniqlanish darajasi", value: "92", unit: "%", pct: 92 },
      { label: "O'rtacha javob", value: "7 daq", pct: 70 },
      { label: "Kamera qamrovi", value: "78", unit: "%", pct: 78 },
    ],
  },
  mapTitle: "ANDIJON VILOYATI", districts: DISTRICTS,
  dynamicsTitle: "Chaqiruvlar dinamikasi",
  ratings: { title: "Hududiy reyting", items: RATINGS },
  cohorts: {
    title: "Jinoyat toifalari",
    items: [
      { label: "Og'ir", value: "12", unit: "%", pct: 12 },
      { label: "O'rta og'ir", value: "34", unit: "%", pct: 34 },
      { label: "Yengil", value: "54", unit: "%", pct: 54 },
    ],
  },
};

const IibDashboardPage = () => <SituationRoom config={config} />;
export default IibDashboardPage;
