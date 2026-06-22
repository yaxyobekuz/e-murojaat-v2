// FVV — Sarnovul MFY favqulodda markaz. Xarita yuqorida keng, gauge-markazli (boshqa tuzilma).
import { CalendarDays, Flame, Truck, PhoneCall, Users, MapPin, Activity, Droplets, Camera, Wrench, ShieldAlert } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, RadialGauge, Donut, AreaSpark, MahallaMap, CameraGrid, makeCams } from "@/shared/components/ui/command/primitives";

const A = "#f59e0b";
const PLACE = "SARNOVUL MFY · BALIQCHI · ANDIJON";

const BLOCKS = [
  { name: "Markaziy", metric: "tinch", color: "#22c55e", detail: "Xavf past" },
  { name: "Bozor atrofi", metric: "xavf", color: A, detail: "Elektr yuklama" },
  { name: "Maktab-7", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Sanoat zonasi", metric: "yong'in", color: "#ef4444", detail: "Faol yong'in" },
  { name: "Bog' mahalla", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Gaz taqsimlagich", metric: "yong'in", color: "#ef4444", detail: "Portlash xavfi" },
  { name: "Eski shahar", metric: "xavf", color: A, detail: "Tor ko'cha" },
  { name: "Yangi qurilish", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Stadion", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Chekka daha", metric: "xavf", color: A, detail: "Suv uzoq" },
  { name: "Park", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Transformator", metric: "yong'in", color: "#ef4444", detail: "Qisqa tutashuv" },
];
const HODISA = [{ name: "Yong'in", value: 46, color: "#ef4444" }, { name: "Qutqaruv", value: 30, color: "#06b6d4" }, { name: "Tabiiy ofat", value: 14, color: A }, { name: "Boshqa", value: 10, color: "#64748b" }];
const CAMS = makeCams(["Qism kirishi", "Sanoat darvoza", "Gaz shoxobcha", "Bozor", "Suv ombori", "Markaziy ko'cha"], 5566);

const KPIS = [
  { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
  { label: "Bartaraf etish", value: "96%", icon: Flame },
  { label: "Brigadalar", value: "3", icon: Truck },
  { label: "Chaqiruvlar (oy)", value: "184", icon: PhoneCall, highlight: true },
  { label: "Texnika", value: "5", icon: Wrench },
  { label: "Xodimlar", value: "48", icon: Users },
];

const FvvDashboardPage = () => (
  <CmdRoot accent={A}>
    <CmdHeader brand="ATLAS COMMAND" place={`${PLACE} · FVV`} nav={["Markaziy bo'lim", "Tezkor qidiruv", "Chaqiruvlar", "Brigadalar", "Hodisalar"]} accent={A} />
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{KPIS.map((k, i) => <StatTile key={i} {...k} accent={A} />)}</div>

    {/* 1-qator: keng xarita + brigada gaugelari */}
    <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "26rem" }}>
      <Panel title="Sarnovul MFY — yong'in xavfi xaritasi" icon={MapPin} accent={A} right="LIVE" className="xl:col-span-8" bodyClass="relative">
        <MahallaMap blocks={BLOCKS} accent={A} legend={[{ label: "Tinch", color: "#22c55e" }, { label: "Xavf", color: A }, { label: "Yong'in", color: "#ef4444" }]} />
      </Panel>
      <div className="flex flex-col gap-3 xl:col-span-4">
        <Panel title="Brigadalar tayyorligi" icon={ShieldAlert} accent={A}>
          <div className="flex items-center justify-around py-1">
            <RadialGauge value={100} label="Brigada-1" sub="navbatda" accent="#22c55e" size={84} />
            <RadialGauge value={100} label="Brigada-2" sub="navbatda" accent="#22c55e" size={84} />
            <RadialGauge value={60} label="Brigada-3" sub="chaqiruvda" accent={A} size={84} />
          </div>
        </Panel>
        <Panel title="Texnika tayyorligi" icon={Wrench} accent={A} className="flex-1">
          <div className="flex flex-col py-1.5">
            <BarRow label="Avtotsisterna" value="2/2" pct={100} accent="#22c55e" />
            <BarRow label="Avtonarvon" value="1/1" pct={100} accent="#22c55e" />
            <BarRow label="Qutqaruv mashina" value="1/2" pct={50} accent={A} />
            <BarRow label="Suv ta'minoti" value="88" unit="%" pct={88} accent={A} />
          </div>
        </Panel>
      </div>
    </div>

    {/* 2-qator: hodisa turlari + dinamika + suv */}
    <div className="grid gap-3 xl:grid-cols-12">
      <Panel title="Hodisa toifalari" icon={Activity} accent={A} className="xl:col-span-3"><Donut data={HODISA} accent={A} height={190} /></Panel>
      <Panel title="Chaqiruvlar dinamikasi" icon={Activity} accent={A} className="xl:col-span-5"><AreaSpark accent={A} seed={5} height={190} /></Panel>
      <Panel title="Suv ta'minoti" icon={Droplets} accent={A} className="xl:col-span-4"><div className="grid place-items-center py-1"><RadialGauge value={88} label="Gidrant qamrovi" sub="14/16 faol" accent="#06b6d4" size={120} /></div></Panel>
    </div>

    {/* kamera */}
    <Panel title="Kamera kuzatuvi — jonli" icon={Camera} accent={A}><CameraGrid items={CAMS} accent={A} /></Panel>
  </CmdRoot>
);

export default FvvDashboardPage;
