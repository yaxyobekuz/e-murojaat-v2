// IIB — Sarnovul MFY operativ markaz. Hodisa-feed markazli, CCTV o'ng ustunda (boshqa tuzilma).
import { CalendarDays, ShieldCheck, Radio, Car, PhoneCall, Users, MapPin, Activity, Siren, Cpu, Camera, Video } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, Donut, AreaSpark, FeedList, MahallaMap, CameraGrid, makeCams } from "@/shared/components/ui/command/primitives";

const A = "#b794f6";
const PLACE = "SARNOVUL MFY · BALIQCHI · ANDIJON";

const FEED = [
  { title: "Begona avto kirdi — 95 A 472 KM", time: "03:14", place: "Sanoat zonasi", tag: "AVTO", color: "#ef4444" },
  { title: "102 chaqiruv — janjal", time: "02:51", place: "Bozor atrofi", tag: "102", color: "#f59e0b" },
  { title: "Shubhali shaxs aniqlandi", time: "02:03", place: "Eski shahar", tag: "DIQQAT", color: "#eab308" },
  { title: "Tezlik nazorati qoidabuzarlik", time: "01:42", place: "Markaziy ko'cha", tag: "YPX", color: "#06b6d4" },
  { title: "Profilaktika tekshiruvi", time: "23:27", place: "Yangi daha", tag: "OK", color: "#22c55e" },
  { title: "Patrul navbatchilik almashinuvi", time: "22:00", place: "MFY posti", tag: "PPX", color: A },
];
const CRIME = [{ name: "Mayda bezorilik", value: 38, color: A }, { name: "Mulkiy", value: 26, color: "#06b6d4" }, { name: "YHQ", value: 20, color: "#f59e0b" }, { name: "Boshqa", value: 16, color: "#64748b" }];
const BLOCKS = [
  { name: "Markaziy", metric: "tinch", color: "#22c55e", detail: "Patrul faol" },
  { name: "Bozor atrofi", metric: "diqqat", color: "#f59e0b", detail: "102 signali" },
  { name: "Maktab-7", metric: "tinch", color: "#22c55e", detail: "Kamera 4" },
  { name: "Sanoat zonasi", metric: "hodisa", color: "#ef4444", detail: "Begona avto" },
  { name: "Bog' mahalla", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Avtostansiya", metric: "diqqat", color: "#f59e0b", detail: "Tranzit nazorat" },
  { name: "Eski shahar", metric: "hodisa", color: "#ef4444", detail: "Shubhali shaxs" },
  { name: "Yangi daha", metric: "tinch", color: "#22c55e", detail: "Profilaktika" },
  { name: "Stadion", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Chekka", metric: "diqqat", color: "#f59e0b", detail: "Kam yoritilgan" },
  { name: "Park", metric: "tinch", color: "#22c55e", detail: "—" },
  { name: "Temir yo'l", metric: "diqqat", color: "#f59e0b", detail: "O'tkagich" },
];
const CAMS = makeCams(["MFY posti", "Markaziy ko'cha", "Bozor kirishi", "Maktab-7", "Avtostansiya", "Sanoat darvoza"], 4242);

const KPIS = [
  { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
  { label: "Jamoat xavfsizligi", value: "94%", icon: ShieldCheck },
  { label: "Patrul ekipaj", value: "4", icon: Car },
  { label: "Chaqiruvlar (oy)", value: "486", icon: PhoneCall, highlight: true },
  { label: "Kameralar", value: "28", icon: Video },
  { label: "Xodimlar", value: "32", icon: Users },
];

const IibDashboardPage = () => (
  <CmdRoot accent={A} system="IIB yagona AT — 102" place="Sarnovul MFY, Baliqchi tumani">
    <CmdHeader brand="ATLAS COMMAND" place={`${PLACE} · IIB`} nav={["Markaziy bo'lim", "Tezkor qidiruv", "Chaqiruvlar", "Patrullar", "Jinoyatlar"]} accent={A} />
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{KPIS.map((k, i) => <StatTile key={i} {...k} accent={A} />)}</div>

    <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "calc(100vh - 14rem)" }}>
      {/* chap — jonli hodisalar + jinoyat turlari */}
      <div className="flex flex-col gap-3 xl:col-span-4">
        <Panel title="Jonli hodisalar" icon={Siren} accent={A} right="REAL-TIME" source="102 chaqiruv markazi" className="flex-1" bodyClass="min-h-0"><FeedList items={FEED} accent={A} /></Panel>
        <Panel title="Jinoyat turlari" icon={Activity} accent={A} source="Yagona jinoyat reyestri" clickToSource><Donut data={CRIME} accent={A} height={200} /></Panel>
      </div>

      {/* markaz — operativ xarita + chaqiruvlar */}
      <div className="flex flex-col gap-3 xl:col-span-5">
        <Panel title="Sarnovul MFY — operativ xarita" icon={MapPin} accent={A} right="LIVE" source="MFY GIS · operativ" className="flex-1" bodyClass="relative">
          <MahallaMap blocks={BLOCKS} accent={A} legend={[{ label: "Tinch", color: "#22c55e" }, { label: "Diqqat", color: "#f59e0b" }, { label: "Hodisa", color: "#ef4444" }]} />
        </Panel>
        <Panel title="Chaqiruvlar dinamikasi (24s)" icon={Activity} accent={A} source="102 — chaqiruvlar oqimi" clickToSource><AreaSpark accent={A} seed={3} /></Panel>
      </div>

      {/* o'ng — patrul + system + CCTV */}
      <div className="flex flex-col gap-3 xl:col-span-3">
        <Panel title="Patrul holati" icon={Radio} accent={A} source="Patrul boshqaruv tizimi">
          <div className="flex flex-col py-1.5">
            <BarRow label="Patrul qamrovi" value="86" unit="%" pct={86} accent={A} />
            <BarRow label="Aniqlanish" value="92" unit="%" pct={92} accent={A} />
            <BarRow label="Javob vaqti" value="7 daq" pct={70} accent={A} />
            <BarRow label="Kamera qamrovi" value="78" unit="%" pct={78} accent={A} />
          </div>
        </Panel>
        <Panel title="CCTV — jonli" icon={Camera} accent={A} source="IIB CCTV tarmog'i" className="flex-1"><CameraGrid items={CAMS} accent={A} cols="lg:grid-cols-2" /></Panel>
      </div>
    </div>
  </CmdRoot>
);

export default IibDashboardPage;
