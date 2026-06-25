// Axlat mashinasi — "Command Center". Ma'lumot o'sha-o'sha (axlat.data.js), faqat
// taqdimot: insight kartalar, ballar, kelmay qolgan ogohlantirish, oqim, reyestr.
import { Activity, AlertTriangle, Boxes, CheckCircle2, CreditCard, Gauge, Home, Package, ShieldCheck, Truck, Wallet } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { CmdRoot, CmdHeader, Panel, Donut, AreaSpark, BarRow, FeedList } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import {
  AXLAT_PLACE, AXLAT_ROUTES, AXLAT_BY_MAHALLA, AXLAT_OPERATOR_RATING,
  RATING_LABELS, ROUTE_STATUS, SCHEDULE_NORM, axlatSummary as s,
} from "../mock/axlat.data";
import { axlatImpact as im, axlatInsights, axlatTrends } from "../mock/insights";
import { InsightCard, ProgressRing, AIInsightPanel, TrendNarrative, ScoreMeter, Reveal } from "../components/insight/kit";

const ACCENT = "#22d3ee";

const donutData = AXLAT_OPERATOR_RATING.map((d, i) => ({
  name: RATING_LABELS[d.key], value: d.value, color: ["#16a34a", "#d97706", "#dc2626"][i],
}));

const missedFeed = im.missedRoutes.map((r) => ({
  title: `${r.name} — mashina kelmadi`, place: r.mahalla, time: formatDateUz(r.lastDate), color: "#ef4444", tag: "OGOH",
}));

const rows = [...AXLAT_ROUTES].sort((a, b) => ({ missed: 0, late: 1, done: 2 }[a.status] - { missed: 0, late: 1, done: 2 }[b.status]));
const columns = [
  { key: "name", header: "Marshrut", render: (r) => <span className="font-medium text-foreground">{r.name}</span> },
  { key: "mahalla", header: "Mahalla", render: (r) => r.mahalla },
  { key: "norm", header: "Norma", render: (r) => SCHEDULE_NORM[r.norm] },
  { key: "last", header: "Oxirgi kelgan", render: (r) => r.status === "missed" ? <span className="text-rose-400">Kelmadi</span> : <span>{formatDateUz(r.lastDate)} {r.lastArrival}{r.lateMin > 0 && <span className="text-amber-400"> (+{r.lateMin}d)</span>}</span> },
  { key: "next", header: "Keyingi reja", render: (r) => formatDateUz(r.nextPlanned) },
  { key: "volume", header: "Hajm (kelgan/reja)", align: "right", render: (r) => <span>{r.collectedVolume} / {r.plannedVolume} m³</span> },
  { key: "status", header: "Holat", align: "center", render: (r) => <StatusBadge tone={ROUTE_STATUS[r.status].tone}>{ROUTE_STATUS[r.status].label}</StatusBadge> },
];

const AxlatPage = () => (
  <CmdRoot accent={ACCENT} dark={false} system="Toza hudud — chiqindi boshqaruvi (demo)" place={AXLAT_PLACE}>
    <CmdHeader brand="AXLAT NAZORAT MARKAZI" place={AXLAT_PLACE} accent={ACCENT} nav={["Operativ", "Marshrutlar"]} active="Operativ" />

    {/* Insight kartalar */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <InsightCard i={0} icon={Boxes} label="To'plangan hajm (oy)" value={s.collectedVolume} suffix=" m³" accent={ACCENT}
        decimals={1} trend={{ dir: "up", text: "+4%" }}
        equivalents={[{ icon: Truck, text: `${im.trucks} ta to'la axlat mashinasi` }, { icon: Package, text: `Reja bajarilishi ${im.fulfillPct}%` }]} />
      <InsightCard i={1} icon={Truck} label="Bugungi marshrutlar" value={s.routes} accent={ACCENT}
        equivalents={[{ icon: CheckCircle2, text: `${s.done} keldi · ${s.late} kechikdi` }, { icon: Home, text: `${AXLAT_ROUTES.reduce((a, r) => a + r.houses, 0).toLocaleString("uz-UZ")} xonadon` }]} />
      <InsightCard i={2} icon={AlertTriangle} label="Kelmay qolgan" value={s.missed} accent="#ef4444"
        trend={{ dir: s.missed > 1 ? "down" : "flat", text: s.missed > 1 ? "e'tibor" : "nazorat" }}
        equivalents={[{ icon: AlertTriangle, text: `${im.missedRoutes.map((r) => r.mahalla).join(", ") || "yo'q"}` }]} />
      <InsightCard i={3} icon={Wallet} label="Tarif yig'imi (oy)" value={s.tariffRevenue} formatter={formatMoney} accent={ACCENT}
        equivalents={[{ icon: CreditCard, text: "7 840 so'm/kishi (2025)" }]} />
    </div>

    {/* Ballar + AI */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Marshrut salomatligi" icon={Gauge} accent={ACCENT}>
        <div className="grid grid-cols-2 items-center gap-2 p-2">
          <ProgressRing value={im.healthScore} target={100} label="Route Health" accent={ACCENT} forecast="barqaror" unit="" />
          <div className="space-y-2">
            <ScoreMeter score={im.reliabilityScore} label="Ishonchlilik" accent={ACCENT} hint="O'z vaqtida xizmat" />
            <ScoreMeter score={im.cleanlinessIndex} label="Tozalik indeksi" accent="#22c55e" hint="Hudud bo'yicha" />
          </div>
        </div>
      </Panel></Reveal>
      <Reveal i={1}><Panel title="AI tahlil" icon={Activity} accent={ACCENT}><AIInsightPanel insights={axlatInsights} accent={ACCENT} /></Panel></Reveal>
      <Reveal i={2}><Panel title="Tendensiya" icon={ShieldCheck} accent={ACCENT}><TrendNarrative items={axlatTrends} accent={ACCENT} /></Panel></Reveal>
    </div>

    {/* Oqim + reyting + ogohlantirish */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Chiqindi oqimi — 12 oy" icon={Boxes} accent={ACCENT} className="lg:col-span-2"><AreaSpark accent={ACCENT} seed={4} height={200} /></Panel></Reveal>
      <Reveal i={1}><Panel title="Operator reytingi (VM 648)" icon={ShieldCheck} accent={ACCENT}><div className="p-2"><Donut data={donutData} accent={ACCENT} height={196} /></div></Panel></Reveal>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Mahalla bo'yicha reyslar" icon={Truck} accent={ACCENT} className="lg:col-span-2">
        <div className="py-2">{[...AXLAT_BY_MAHALLA].sort((a, b) => b.value - a.value).slice(0, 7).map((m) => (
          <BarRow key={m.key} label={m.key} value={m.value} pct={(m.value / 32) * 100} accent={ACCENT} unit=" reys" />
        ))}</div>
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Kelmay qolish ogohlantirishi" icon={AlertTriangle} accent="#ef4444">
        {missedFeed.length ? <FeedList items={missedFeed} accent="#ef4444" /> : <div className="grid h-full place-items-center p-6 text-[11px] text-foreground/40">Barcha marshrutlar xizmat ko'rsatildi ✓</div>}
      </Panel></Reveal>
    </div>

    {/* Reyestr */}
    <Reveal i={0}><Panel title="Marshrutlar reyestri" icon={CheckCircle2} accent={ACCENT} bodyClass="p-2">
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} variant="glass" />
    </Panel></Reveal>
  </CmdRoot>
);

export default AxlatPage;
