// Yashil makon — ko'chat ekish hisoboti. Nechta ekildi vs reja, qayerga ekildi,
// mavsum (bahor/kuz), yashilmakon.eco ga kiritilgan %, tirik qolish, ko'kalamzorlik %.
import { TreePine, Target, Database, Sprout, Leaf } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import ChartCard from "@/shared/components/ui/chart/ChartCard";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import DataTable from "@/shared/components/ui/table/DataTable";
import ObodPageHeader from "../components/ObodPageHeader";
import {
  YM_PLACE,
  YM_PLANTINGS,
  YM_SEASON_TREND,
  YM_SEASON_SERIES,
  YM_BY_MAHALLA,
  YM_BY_TYPE,
  TREE_TYPE,
  SEASON,
  ymSummary as s,
} from "../mock/yashilMakon.data";

const rows = [...YM_PLANTINGS].sort((a, b) => b.count - a.count);

const columns = [
  { key: "mahalla", header: "Mahalla", render: (r) => <span className="font-medium">{r.mahalla}</span> },
  { key: "site", header: "Joy", render: (r) => r.site },
  { key: "coords", header: "Koordinata", render: (r) => <span className="tabular-nums text-xs text-foreground/60">{r.coords}</span> },
  { key: "type", header: "Turi", render: (r) => TREE_TYPE[r.type] },
  {
    key: "season",
    header: "Mavsum",
    align: "center",
    render: (r) => <StatusBadge tone={r.season === "spring" ? "done" : "progress"}>{SEASON[r.season]}</StatusBadge>,
  },
  { key: "count", header: "Soni", align: "right", render: (r) => <span className="tabular-nums font-semibold">{r.count.toLocaleString("uz-UZ")}</span> },
  {
    key: "entered",
    header: "yashilmakon.eco",
    align: "center",
    render: (r) =>
      r.entered ? (
        <StatusBadge tone="done">Kiritilgan</StatusBadge>
      ) : (
        <StatusBadge tone="danger">Kiritilmagan</StatusBadge>
      ),
  },
  { key: "survival", header: "Tirik qolgan", align: "right", render: (r) => <span className="tabular-nums">{r.survivalPct}%</span> },
];

const YashilMakonPage = () => (
  <div className="flex flex-col gap-5">
    <ObodPageHeader
      title="Yashil makon — ko'chat ekish"
      subtitle={`Daraxt ekish hisoboti · bahor/kuz mavsumi · ${YM_PLACE}`}
      legal="Asos: Yashil makon dasturi (yillik 200 mln) · platforma yashilmakon.eco · PF-47 → 30% ko'kalamzorlik · demo"
    />

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <GlassStatCard label="Ekilgan ko'chat" value={s.planted} icon={TreePine} accent="emerald" glow />
      <GlassStatCard label="Yillik rejaga" value={s.completionPct} suffix="%" icon={Target} accent="cyan" />
      <GlassStatCard label="Tizimga kiritilgan" value={s.enteredPct} suffix="%" icon={Database} accent="yellow" />
      <GlassStatCard label="Tirik qolgan" value={s.survivalPct} suffix="%" icon={Sprout} accent="emerald" />
      <GlassStatCard label="Ko'kalamzorlik" value={s.greenCoverage} suffix="%" icon={Leaf} accent="purple" />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="Mavsumiy ekish — bahor / kuz"
        insight={`Reja: ${s.yearPlan.toLocaleString("uz-UZ")} · Ekildi: ${s.planted.toLocaleString("uz-UZ")} (${s.completionPct}%)`}
      >
        <StackedBar data={YM_SEASON_TREND} series={YM_SEASON_SERIES} unit="ta" />
      </ChartCard>

      <ChartCard
        title="Ko'chat turlari"
        insight="Manzarali, mevali, ignabargli va buta nisbati"
      >
        <DonutChart data={YM_BY_TYPE} labelMap={TREE_TYPE} colors={["#16a34a", "#d97706", "#0891b2", "#84cc16"]} />
      </ChartCard>
    </div>

    <ChartCard
      title="Mahalla bo'yicha ekilgan ko'chatlar"
      insight={`Tizimga kiritilgan: ${s.enteredPct}% · qolgan qismi yashilmakon.eco ga kiritilishi kerak`}
    >
      <BreakdownBar data={[...YM_BY_MAHALLA].sort((a, b) => b.value - a.value)} color="#16a34a" />
    </ChartCard>

    <ChartCard title="Ekish yozuvlari — qayerga ekildi" insight={`${YM_PLANTINGS.length} ekish nuqtasi · koordinata bilan`}>
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} />
    </ChartCard>
  </div>
);

export default YashilMakonPage;
