// Ta'lim — Sarnovul MFY vaziyat markazi (command center). Maktab-markazli tuzilma.
import { CalendarDays, Activity, School, LayoutGrid, Users, GraduationCap, Camera, MapPin, BarChart3, BookOpen } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, RadialGauge, AreaSpark, RatingList, MahallaMap, CameraGrid, makeCams, hexA } from "@/shared/components/ui/command/primitives";

const A = "#22d3ee";
const PLACE = "SARNOVUL MFY · BALIQCHI · ANDIJON";

const SCHOOLS = [
  { name: "41-umumiy o'rta maktab", pupils: 1840, att: 95 },
  { name: "7-IDUM", pupils: 1320, att: 92 },
  { name: "12-maktab", pupils: 1700, att: 96 },
  { name: "15-bolalar bog'chasi", pupils: 0, att: 0, kg: true, kids: 210 },
];
const att = (v) => (v >= 94 ? "#22c55e" : v >= 88 ? A : "#f59e0b");
const BLOCKS = [
  { name: "Markaziy", metric: "96%", color: "#22c55e", detail: "41-maktab · davomat 96%" },
  { name: "41-maktab", metric: "95%", color: "#22c55e", detail: "1840 o'quvchi" },
  { name: "Bozor atrofi", metric: "88%", color: A, detail: "7-IDUM · 1320 o'quvchi" },
  { name: "Stadion", metric: "91%", color: A, detail: "Sport majmuasi" },
  { name: "Bog' mahalla", metric: "97%", color: "#22c55e", detail: "Bog'cha-15 · 210 bola" },
  { name: "Yangi daha", metric: "84%", color: "#f59e0b", detail: "Yo'l-transport" },
  { name: "12-maktab", metric: "96%", color: "#22c55e", detail: "1700 o'quvchi" },
  { name: "Chekka", metric: "82%", color: "#f59e0b", detail: "Uzoq hudud" },
  { name: "Park", metric: "93%", color: "#22c55e", detail: "Yashil zona" },
  { name: "Sanoat", metric: "86%", color: "#f59e0b", detail: "Ishchi oilalar" },
  { name: "Avtostansiya", metric: "89%", color: A, detail: "Tranzit" },
  { name: "Tibbiyot", metric: "94%", color: "#22c55e", detail: "Oilaviy poliklinika" },
];
const RATINGS = [["41-maktab", 96], ["12-maktab", 96], ["Markaziy", 95], ["Tibbiyot", 94], ["Park", 93], ["7-IDUM", 92], ["Stadion", 91], ["Avtostansiya", 89]].map(([label, pct]) => ({ label, pct }));
const CAMS = makeCams(["41-maktab kirishi", "7-IDUM hovlisi", "12-maktab", "Sport zali", "Bog'cha-15", "Markaziy ko'cha", "Stadion", "Bozor burchak"], 7788);

const KPIS = [
  { label: "Hisobot davri", value: "YAN 2026", icon: CalendarDays, highlight: true },
  { label: "Maktablar", value: "3", icon: School },
  { label: "O'quvchilar", value: "4 860", icon: Users, highlight: true },
  { label: "Sinflar", value: "142", icon: LayoutGrid },
  { label: "O'qituvchilar", value: "286", icon: GraduationCap },
  { label: "O'rtacha davomat", value: "94.2%", icon: Activity },
];

const TalimDashboardPage = () => (
  <CmdRoot accent={A}>
    <CmdHeader brand="ATLAS COMMAND" place={`${PLACE} · TA'LIM`} nav={["Markaziy bo'lim", "Tezkor qidiruv", "O'quvchilar", "O'qituvchilar", "Xodimlar"]} accent={A} />
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{KPIS.map((k, i) => <StatTile key={i} {...k} accent={A} />)}</div>

    <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "calc(100vh - 22rem)" }}>
      {/* chap — maktablar + bosqichlar */}
      <div className="flex flex-col gap-3 xl:col-span-3">
        <Panel title="Maktablar" icon={School} accent={A} right="LIVE" className="flex-1">
          <div className="flex flex-col">
            {SCHOOLS.map((s, i) => (
              <div key={i} className="px-3 py-2" style={{ borderBottom: i < SCHOOLS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div className="flex items-center justify-between text-[11px]"><span className="truncate font-medium text-foreground/85">{s.name}</span><span className="font-mono text-foreground/60">{s.kg ? `${s.kids} bola` : s.pupils}</span></div>
                {!s.kg && <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-foreground/5"><div className="h-full rounded-full" style={{ width: `${s.att}%`, background: att(s.att), boxShadow: `0 0 6px ${hexA(att(s.att), 0.6)}` }} /></div>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Sinf bosqichlari" icon={BookOpen} accent={A}>
          <div className="flex flex-col py-1.5">
            <BarRow label="Boshlang'ich (1-4)" value="88" unit="%" pct={88} accent={A} />
            <BarRow label="O'rta (5-9)" value="92" unit="%" pct={92} accent={A} />
            <BarRow label="Yuqori (10-11)" value="85" unit="%" pct={85} accent={A} />
          </div>
        </Panel>
      </div>

      {/* markaz — xarita + dinamika */}
      <div className="flex flex-col gap-3 xl:col-span-6">
        <Panel title="Sarnovul MFY — ta'lim xaritasi" icon={MapPin} accent={A} right="DAVOMAT · LIVE" className="flex-1" bodyClass="relative">
          <MahallaMap blocks={BLOCKS} accent={A} legend={[{ label: "Yuqori", color: "#22c55e" }, { label: "O'rta", color: A }, { label: "Past", color: "#f59e0b" }]} />
        </Panel>
        <Panel title="O'quvchilar dinamikasi" icon={Activity} accent={A}><AreaSpark accent={A} seed={2} /></Panel>
      </div>

      {/* o'ng — davomat + reyting */}
      <div className="flex flex-col gap-3 xl:col-span-3">
        <Panel title="Bugungi davomat" icon={Activity} accent={A}><div className="grid place-items-center py-2"><RadialGauge value={94} label="Keldi" sub="4 578 / 4 860" accent={A} size={120} /></div></Panel>
        <Panel title="Hududiy reyting" icon={BarChart3} accent={A} className="flex-1" bodyClass="min-h-0"><RatingList items={RATINGS} accent={A} /></Panel>
      </div>
    </div>

    {/* kamera */}
    <Panel title="Kamera kuzatuvi — jonli" icon={Camera} accent={A}><CameraGrid items={CAMS} accent={A} /></Panel>
  </CmdRoot>
);

export default TalimDashboardPage;
