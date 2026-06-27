// Tozalov & hashar — Command Center. Ma'lumot o'zgarmagan. Jamoatchilik bali,
// faol mahallalar, volontyor o'sishi, chempionat reytingi, nishonlar.
import { Activity, Award, Calendar, Flag, Ruler, Sparkles, Sprout, TreePine, TrendingUp, Trophy, Users, Volleyball } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import { CmdRoot, CmdHeader, Panel, Donut, AreaSpark, FeedList } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import {
  HASHAR_PLACE, HASHAR_EVENTS, HASHAR_BY_TYPE, EVENT_TYPE, hasharSummary as s,
} from "../mock/hashar.data";
import { hasharImpact as im, hasharInsights, hasharTrends, obodBadges } from "../mock/insights";
import { InsightCard, ProgressRing, AIInsightPanel, TrendNarrative, ScoreMeter, Leaderboard, BadgeStrip, SectionTitle, Reveal } from "../components/insight/kit";

const ACCENT = "#b794f6";
const TYPE_COLORS = { cleanup: "#3b82f6", greening: "#22c55e", sanitation: "#f59e0b", repair: "#94a3b8" };
const donutData = HASHAR_BY_TYPE.map((d) => ({ name: EVENT_TYPE[d.key], value: d.value, color: TYPE_COLORS[d.key] }));

const TYPE_TONE = { cleanup: "new", greening: "done", sanitation: "progress", repair: "neutral" };
const recentFeed = [...HASHAR_EVENTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
  .map((e) => ({ title: `${EVENT_TYPE[e.type]} — ${e.mahalla}`, place: `${e.participants} ishtirokchi`, time: formatDateUz(e.date), color: TYPE_COLORS[e.type] }));

const rows = [...HASHAR_EVENTS].sort((a, b) => b.date.localeCompare(a.date));
const columns = [
  { key: "date", header: "Sana", render: (r) => formatDateUz(r.date) },
  { key: "mahalla", header: "Ko'cha", render: (r) => <span className="font-medium text-foreground">{r.mahalla}</span> },
  { key: "type", header: "Tur", render: (r) => <StatusBadge tone={TYPE_TONE[r.type]}>{EVENT_TYPE[r.type]}</StatusBadge> },
  { key: "participants", header: "Ishtirokchi", align: "right", render: (r) => r.participants },
  { key: "area", header: "Maydon", align: "right", render: (r) => `${r.areaHa} ga` },
  { key: "trees", header: "Daraxt", align: "right", render: (r) => r.treesPlanted || "—" },
  { key: "result", header: "Natija", render: (r) => r.result },
];

const HasharPage = () => (
  <CmdRoot accent={ACCENT} dark={false} system="Mahalla obodonlashtirish — PQ-234 (demo)" place={HASHAR_PLACE}>
    <CmdHeader brand="HASHAR & TOZALOV MARKAZI" place={HASHAR_PLACE} accent={ACCENT} nav={["Jamoatchilik", "Tadbirlar"]} active="Jamoatchilik" />

    {/* Nishonlar — yutuqlar */}
    <Reveal i={0}><Panel title="Yutuq nishonlari" icon={Award} accent={ACCENT}><BadgeStrip badges={obodBadges} /></Panel></Reveal>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <InsightCard i={0} icon={Sparkles} label="Tadbirlar" value={s.events} accent={ACCENT}
        trend={{ dir: "up", text: "faol" }}
        equivalents={[{ icon: Calendar, text: "So'nggi 6 oy" }, { icon: Users, text: `${s.participants.toLocaleString("uz-UZ")} ishtirokchi` }]} />
      <InsightCard i={1} icon={Ruler} label="Tozalangan maydon" value={s.area} suffix=" ga" accent={ACCENT} decimals={1}
        equivalents={[{ icon: Volleyball, text: `${im.fields} ta futbol maydoni` }]} />
      <InsightCard i={2} icon={Users} label="Ishtirokchilar" value={s.participants} accent={ACCENT}
        trend={{ dir: "up", text: "+12%" }}
        equivalents={[{ icon: TrendingUp, text: `O'rtacha ${Math.round(s.participants / s.events)} kishi/tadbir` }]} />
      <InsightCard i={3} icon={TreePine} label="Ekilgan daraxt" value={s.trees} accent="#22c55e"
        equivalents={[{ icon: Sprout, text: "Hashar davomida" }]} />
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Jamoatchilik faolligi" icon={Flag} accent={ACCENT}>
        <div className="grid grid-cols-2 items-center gap-2 p-2">
          <ProgressRing value={im.engagement} target={100} label="Engagement" accent={ACCENT} forecast="o'smoqda" />
          <div className="space-y-2">
            <ScoreMeter score={im.engagement} label="Faollik bali" accent={ACCENT} hint="Ishtirok darajasi" />
            <ScoreMeter score={s.topMahalla.value} label="Top ko'cha" accent="#fbbf24" hint={s.topMahalla.key} />
          </div>
        </div>
      </Panel></Reveal>
      <Reveal i={1}><Panel title="AI tahlil" icon={Activity} accent={ACCENT}><AIInsightPanel insights={hasharInsights} accent={ACCENT} /></Panel></Reveal>
      <Reveal i={2}><Panel title="Tendensiya" icon={Sparkles} accent={ACCENT}><TrendNarrative items={hasharTrends} accent={ACCENT} /></Panel></Reveal>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="«Eng toza ko'cha» chempionati" icon={Trophy} accent={ACCENT} className="lg:col-span-2">
        <Leaderboard items={im.leaderboard} accent={ACCENT} unit=" ball" />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Tadbir turlari" icon={Sparkles} accent={ACCENT}><div className="p-2"><Donut data={donutData} accent={ACCENT} height={196} /></div></Panel></Reveal>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Volontyorlar o'sishi — 12 oy" icon={Users} accent={ACCENT} className="lg:col-span-2"><AreaSpark accent={ACCENT} seed={3} height={190} /></Panel></Reveal>
      <Reveal i={1}><Panel title="So'nggi tadbirlar" icon={Activity} accent={ACCENT}><FeedList items={recentFeed} accent={ACCENT} /></Panel></Reveal>
    </div>

    <Reveal i={0}><Panel title="Tadbirlar jurnali" icon={Sparkles} accent={ACCENT} bodyClass="p-2">
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} variant="glass" />
    </Panel></Reveal>
  </CmdRoot>
);

export default HasharPage;
