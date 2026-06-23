// FVV — "Smart Operation Center" (Hightopo uslubi). Markazda HAQIQIY interaktiv 3D xarita
// (Sarnovul MFY binolari, aylantirish/zoom). Atrofda command panellar.
import { Flame, Droplets, LifeBuoy, Truck, Video, Activity, MapPin, Gauge, Radio, ShieldAlert } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, BarRow, RatingList, hexA } from "@/shared/components/ui/command/primitives";
import Ops3DMap from "@/shared/components/ui/command/Ops3DMap";

const A = "#f59e0b";
const CY = "#22d3ee";

const BigStat = ({ icon: Icon, label, value, accent, subs, source }) => (
  <Panel title={label} icon={Icon} accent={accent} source={source}>
    <div className="px-3 py-3">
      <div className="font-mono text-[28px] font-bold leading-none tabular-nums" style={{ color: accent, textShadow: `0 0 18px ${hexA(accent, 0.6)}` }}>{value}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {subs.map((s, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-foreground/40">{s.k}</div>
            <div className="font-mono text-[15px] font-semibold tabular-nums text-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

const NET = [
  { icon: Droplets, label: "Gidrantlar", value: 16, c: CY },
  { icon: ShieldAlert, label: "Qism", value: 1, c: A },
  { icon: Truck, label: "Texnika", value: 5, c: A },
  { icon: Droplets, label: "Suv ombori", value: 2, c: CY },
  { icon: Video, label: "Kameralar", value: 28, c: "#22c55e" },
  { icon: Radio, label: "Brigadalar", value: 3, c: A },
];
const RATINGS = [["Markaziy", 98], ["Bog' mahalla", 96], ["Maktab-7", 95], ["Park", 94], ["Stadion", 92], ["Yangi qurilish", 90], ["Bozor atrofi", 84], ["Sanoat zonasi", 71]].map(([label, pct]) => ({ label, pct }));

const FvvDashboardPage = () => (
  <CmdRoot accent={A} system="FVV operativ AT — 101" place="Sarnovul MFY, Baliqchi tumani">
    <CmdHeader brand="FVV SMART CENTER" place="SARNOVUL MFY · FAVQULODDA OPERATSIYALAR MARKAZI" nav={["Umumiy", "Hodisalar", "Brigadalar", "Texnika", "Profilaktika"]} accent={A} />

    {/* tepa ribbon — kunlik yig'indilar */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Panel title="Bugungi chaqiruvlar" icon={Activity} accent={CY} source="101 chaqiruv markazi">
        <div className="flex items-end justify-between px-4 py-3">
          <div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: CY, textShadow: `0 0 18px ${hexA(CY, 0.6)}` }}>18</div>
          <div className="text-right text-[11px] text-foreground/50"><div>Yong'in 6 · Gaz 4</div><div>Qutqaruv 5 · Boshqa 3</div></div>
        </div>
      </Panel>
      <Panel title="Hodisalar holati" icon={Flame} accent={A} source="101 — hodisa reyestri">
        <div className="flex items-end justify-between px-4 py-3">
          <div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: A, textShadow: `0 0 18px ${hexA(A, 0.6)}` }}>96%</div>
          <div className="text-right text-[11px] text-foreground/50"><div>Bartaraf etildi 17</div><div>Jarayonda 1</div></div>
        </div>
      </Panel>
      <Panel title="Aholi qamrovi" icon={MapPin} accent="#22c55e" source="MFY reyestri">
        <div className="flex items-end justify-between px-4 py-3">
          <div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#22c55e", textShadow: "0 0 18px rgba(34,197,94,0.55)" }}>4 860</div>
          <div className="text-right text-[11px] text-foreground/50"><div>Honadon 1 120</div><div>Bino 142</div></div>
        </div>
      </Panel>
    </div>

    {/* asosiy — chap stat / markaz 3D / o'ng reyting */}
    <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "30rem" }}>
      <div className="flex flex-col gap-3 xl:col-span-3">
        <BigStat icon={Flame} label="Yong'in" value="1 732" accent="#ef4444" source="101 — yong'in" subs={[{ k: "Faol", v: 6 }, { k: "Bartaraf", v: 184 }, { k: "O'rtacha javob", v: "6 daq" }, { k: "Zarar", v: "past" }]} />
        <BigStat icon={Droplets} label="Gaz / suv" value="2 162" accent={CY} source="Gidrant reyestri" subs={[{ k: "Gidrant", v: 16 }, { k: "Faol", v: 14 }, { k: "Gaz signal", v: 4 }, { k: "Qamrov", v: "88%" }]} />
      </div>

      <div className="flex flex-col gap-3 xl:col-span-6">
        <Panel title="Sarnovul MFY — 3D operativ xarita" icon={MapPin} accent={A} right="REAL 3D · LIVE" source="FVV GIS · 3D footage" className="flex-1" bodyClass="relative">
          <Ops3DMap height={430} />
          <div className="pointer-events-none absolute bottom-2 left-3 rounded bg-black/55 px-2 py-1 text-[9.5px] text-white/70 backdrop-blur">Sichqoncha: aylantirish · Scroll: yaqinlashtirish</div>
        </Panel>
      </div>

      <div className="flex flex-col gap-3 xl:col-span-3">
        <Panel title="Hududiy xavfsizlik reytingi" icon={Gauge} accent={A} source="FVV tahlil moduli" className="flex-1" bodyClass="min-h-0"><RatingList items={RATINGS} accent={A} /></Panel>
        <Panel title="Texnika tayyorligi" icon={Truck} accent={A} source="Texnika reyestri">
          <div className="flex flex-col py-1.5">
            <BarRow label="Avtotsisterna" value="2/2" pct={100} accent="#22c55e" />
            <BarRow label="Avtonarvon" value="1/1" pct={100} accent="#22c55e" />
            <BarRow label="Qutqaruv mashina" value="1/2" pct={50} accent={A} />
            <BarRow label="Suv ta'minoti" value="88" unit="%" pct={88} accent={CY} />
          </div>
        </Panel>
      </div>
    </div>

    {/* past — fizik tarmoq */}
    <Panel title="Fizik tarmoq — Sarnovul MFY" icon={LifeBuoy} accent={CY} source="FVV infratuzilma reyestri">
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-6">
        {NET.map((n, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
            <span className="grid size-9 place-items-center rounded-lg" style={{ background: hexA(n.c, 0.14), color: n.c }}><n.icon className="size-4" /></span>
            <div className="leading-tight"><div className="font-mono text-[18px] font-bold tabular-nums text-foreground">{n.value}</div><div className="text-[10px] text-foreground/45">{n.label}</div></div>
          </div>
        ))}
      </div>
    </Panel>
  </CmdRoot>
);

export default FvvDashboardPage;
