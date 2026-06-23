// Tozalov & umumiy hashar — admin analitikasi. Tadbirlar, ishtirokchilar,
// tozalangan maydon, hasharda ekilgan daraxt, "Eng toza mahalla" reytingi.
import { Sparkles, Users, Ruler, TreePine, Trophy } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import ChartCard from "@/shared/components/ui/chart/ChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import DataTable from "@/shared/components/ui/table/DataTable";
import ObodPageHeader from "../components/ObodPageHeader";
import {
  HASHAR_PLACE,
  HASHAR_EVENTS,
  HASHAR_TREND,
  HASHAR_RANKING,
  HASHAR_BY_TYPE,
  EVENT_TYPE,
  hasharSummary as s,
} from "../mock/hashar.data";

const TYPE_TONE = { cleanup: "new", greening: "done", sanitation: "progress", repair: "neutral" };
const rows = [...HASHAR_EVENTS].sort((a, b) => b.date.localeCompare(a.date));

const columns = [
  { key: "date", header: "Sana", render: (r) => formatDateUz(r.date) },
  { key: "mahalla", header: "Mahalla", render: (r) => <span className="font-medium">{r.mahalla}</span> },
  {
    key: "type",
    header: "Tur",
    render: (r) => <StatusBadge tone={TYPE_TONE[r.type]}>{EVENT_TYPE[r.type]}</StatusBadge>,
  },
  { key: "participants", header: "Ishtirokchi", align: "right", render: (r) => <span className="tabular-nums">{r.participants}</span> },
  { key: "area", header: "Maydon", align: "right", render: (r) => <span className="tabular-nums">{r.areaHa} ga</span> },
  { key: "trees", header: "Ekilgan daraxt", align: "right", render: (r) => <span className="tabular-nums">{r.treesPlanted || "—"}</span> },
  { key: "result", header: "Natija", render: (r) => r.result },
];

const HasharPage = () => (
  <div className="flex flex-col gap-5">
    <ObodPageHeader
      title="Tozalov & umumiy hashar"
      subtitle={`Sanitar tozalash, hashar tadbirlari va mahalla reytingi · ${HASHAR_PLACE}`}
      legal="Asos: PQ-234 (25.06.2024) — mahalla obodonlashtirish, «Eng toza mahalla» reytingi · demo"
    />

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <GlassStatCard label="Tadbirlar" value={s.events} icon={Sparkles} accent="cyan" />
      <GlassStatCard label="Ishtirokchilar" value={s.participants} icon={Users} accent="purple" />
      <GlassStatCard label="Tozalangan maydon" value={s.area} suffix=" ga" icon={Ruler} accent="emerald" />
      <GlassStatCard label="Ekilgan daraxt" value={s.trees} icon={TreePine} accent="emerald" />
      <GlassStatCard label="Reyting o'rni" value={s.rank} suffix="-o'rin" icon={Trophy} accent="yellow" glow />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="Hashar tadbirlari — 12 oy"
        insight="Bahor va kuz mavsumida faollik yuqori"
      >
        <TrendChart data={HASHAR_TREND} color="#7c3aed" unit="ta" />
      </ChartCard>

      <ChartCard
        title="Tadbir turlari"
        insight="Tozalash, ko'kalamzorlashtirish, sanitar va ta'mir"
      >
        <DonutChart data={HASHAR_BY_TYPE} labelMap={EVENT_TYPE} colors={["#2563eb", "#16a34a", "#d97706", "#64748b"]} />
      </ChartCard>
    </div>

    <ChartCard
      title="«Eng toza mahalla» reytingi"
      insight={`Yetakchi: ${s.topMahalla.key} (${s.topMahalla.value} ball)`}
    >
      <BreakdownBar data={HASHAR_RANKING} color="#7c3aed" />
    </ChartCard>

    <ChartCard title="Tadbirlar jurnali" insight={`${s.events} tadbir · ${s.participants.toLocaleString("uz-UZ")} ishtirokchi · yangilari yuqorida`}>
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} />
    </ChartCard>
  </div>
);

export default HasharPage;
