// Gaz mashinasi (assenizatsiya) — Command Center. Ma'lumot o'zgarmagan.
// SLA heat reyting, eng tez hududlar, kechikkan timeline, samaradorlik metri.
import { Droplets, ListChecks, Clock, Boxes, Zap, Activity, Gauge, MapPin } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import { CmdRoot, CmdHeader, Panel, Donut, AreaSpark, FeedList } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import {
  ASSEN_PLACE, ASSEN_ORDERS, ASSEN_BY_STATUS, STATUS_LABELS, ORDER_STATUS, assenSummary as s,
} from "../mock/assenizatsiya.data";
import { assenImpact as im, assenInsights, assenTrends } from "../mock/insights";
import { InsightCard, ProgressRing, AIInsightPanel, TrendNarrative, ScoreMeter, Leaderboard, Reveal } from "../components/insight/kit";

const ACCENT = "#3b82f6";
const STATUS_COLORS = { new: "#3b82f6", dispatched: "#f59e0b", done: "#22c55e", rejected: "#ef4444" };

const donutData = ASSEN_BY_STATUS.map((d) => ({ name: STATUS_LABELS[d.key], value: d.value, color: STATUS_COLORS[d.key] }));

// SLA heat reyting (tezroq = yashilroq) — pct teskari (tez xizmat yuqori ball)
const heatItems = im.heat.map((h) => ({ label: h.label, value: `${h.avg} kun`, pct: Math.max(20, 100 - h.avg * 22) }));

// Kechikkan/kutilayotgan timeline
const delayedFeed = ASSEN_ORDERS.filter((o) => o.status === "new" || o.status === "dispatched")
  .map((o) => ({ title: `${o.number} — ${ORDER_STATUS[o.status].label}`, place: o.address, time: formatDateUz(o.createdDate), color: STATUS_COLORS[o.status], tag: o.status === "new" ? "YANGI" : "YO'LDA" }));

const order = { new: 0, dispatched: 1, done: 2, rejected: 3 };
const rows = [...ASSEN_ORDERS].sort((a, b) => order[a.status] - order[b.status]);
const columns = [
  { key: "number", header: "Buyurtma", render: (r) => <span className="font-medium text-foreground">{r.number}</span> },
  { key: "address", header: "Manzil", render: (r) => r.address },
  { key: "created", header: "Yuborilgan", render: (r) => formatDateUz(r.createdDate) },
  { key: "completed", header: "Bajarilgan", render: (r) => r.completedDate ? formatDateUz(r.completedDate) : "—" },
  { key: "sla", header: "SLA", align: "center", render: (r) => r.slaDays != null ? `${r.slaDays} kun` : "—" },
  { key: "volume", header: "Hajm", align: "right", render: (r) => r.volume ? `${r.volume} m³` : "—" },
  { key: "status", header: "Holat", align: "center", render: (r) => <StatusBadge tone={ORDER_STATUS[r.status].tone}>{ORDER_STATUS[r.status].label}</StatusBadge> },
];

const AssenizatsiyaPage = () => (
  <CmdRoot accent={ACCENT} dark={false} system="Assenizatsiya dispetcherligi (demo)" place={ASSEN_PLACE}>
    <CmdHeader brand="ASSENIZATSIYA MARKAZI" place={ASSEN_PLACE} accent={ACCENT} nav={["Dispetcher", "Buyurtmalar"]} active="Dispetcher" />

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <InsightCard i={0} icon={ListChecks} label="Jami buyurtma" value={s.total} accent={ACCENT}
        equivalents={[{ icon: "✅", text: `${s.done} bajarildi` }, { icon: "⏳", text: `${s.inProgress} jarayonda` }]} />
      <InsightCard i={1} icon={Clock} label="O'rtacha SLA" value={s.avgSla} suffix=" kun" accent={ACCENT} decimals={1}
        trend={{ dir: s.avgSla <= 2 ? "up" : "flat", text: s.avgSla <= 2 ? "tez" : "o'rta" }}
        equivalents={[{ icon: "⚡", text: im.heat[0] ? `Eng tez: ${im.heat[0].label}` : "—" }]} />
      <InsightCard i={2} icon={Boxes} label="Bo'shatilgan hajm" value={s.volume} suffix=" m³" accent={ACCENT}
        equivalents={[{ icon: "🛢️", text: `${Math.round(s.volume / 8)} ta sisterna (8 m³)` }]} />
      <InsightCard i={3} icon={Droplets} label="Bajarildi" value={s.done} accent="#22c55e"
        equivalents={[{ icon: "❌", text: `${s.rejected} rad etilgan` }]} />
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Samaradorlik metri" icon={Gauge} accent={ACCENT}>
        <div className="grid grid-cols-2 items-center gap-2 p-2">
          <ProgressRing value={im.efficiency} target={100} label="Service Efficiency" accent={ACCENT} forecast="kuzatuvda" />
          <div className="space-y-2">
            <ScoreMeter score={Math.max(0, 100 - Math.round(s.avgSla * 18))} label="Tezlik bali" accent={ACCENT} hint="SLA asosida" />
            <ScoreMeter score={Math.round((s.done / s.total) * 100)} label="Bajarilish %" accent="#22c55e" hint="Yopilgan buyurtma" />
          </div>
        </div>
      </Panel></Reveal>
      <Reveal i={1}><Panel title="AI tahlil" icon={Activity} accent={ACCENT}><AIInsightPanel insights={assenInsights} accent={ACCENT} /></Panel></Reveal>
      <Reveal i={2}><Panel title="Tendensiya" icon={Zap} accent={ACCENT}><TrendNarrative items={assenTrends} accent={ACCENT} /></Panel></Reveal>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="SLA heat reyting — eng tez hududlar" icon={MapPin} accent={ACCENT} className="lg:col-span-2">
        <Leaderboard items={heatItems} accent={ACCENT} />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Holat taqsimoti" icon={ListChecks} accent={ACCENT}><div className="p-2"><Donut data={donutData} accent={ACCENT} height={196} /></div></Panel></Reveal>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Buyurtmalar oqimi — 12 oy" icon={Droplets} accent={ACCENT} className="lg:col-span-2"><AreaSpark accent={ACCENT} seed={7} height={190} /></Panel></Reveal>
      <Reveal i={1}><Panel title="Kechikkan / kutilayotgan" icon={Clock} accent="#f59e0b">
        {delayedFeed.length ? <FeedList items={delayedFeed} accent="#f59e0b" /> : <div className="grid h-full place-items-center p-6 text-[11px] text-foreground/40">Navbat bo'sh ✓</div>}
      </Panel></Reveal>
    </div>

    <Reveal i={0}><Panel title="Buyurtmalar reyestri" icon={ListChecks} accent={ACCENT} bodyClass="p-2">
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} variant="glass" />
    </Panel></Reveal>
  </CmdRoot>
);

export default AssenizatsiyaPage;
