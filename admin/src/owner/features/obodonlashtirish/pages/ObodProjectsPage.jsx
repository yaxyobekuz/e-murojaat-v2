import { formatMoney } from "@/shared/utils/formatMoney";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import { OBOD_PROJECTS, PROJECT_STATUS } from "../mock/obod.projects";

// Bajarilishi bo'yicha kamayish tartibida
const rows = [...OBOD_PROJECTS].sort((a, b) => b.info.progress - a.info.progress);

const columns = [
  { key: "name", header: "Loyiha", render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "type", header: "Turi", render: (r) => r.info.typeLabel },
  { key: "budget", header: "Byudjet", align: "right", render: (r) => formatMoney(r.info.budgetUzs) },
  { key: "spent", header: "Sarflangan", align: "right", render: (r) => formatMoney(r.info.spentUzs) },
  {
    key: "progress",
    header: "Bajarilishi",
    align: "right",
    render: (r) => (
      <span className="font-semibold" style={{ color: PROJECT_STATUS[r.status].color }}>
        {r.info.progress}%
      </span>
    ),
  },
  {
    key: "status",
    header: "Holati",
    render: (r) => (
      <GlassStatusBadge tone={PROJECT_STATUS[r.status].tone}>
        {PROJECT_STATUS[r.status].label}
      </GlassStatusBadge>
    ),
  },
];

const ObodProjectsPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Obodonlashtirish loyihalari</h1>
      <p className="mt-0.5 text-sm text-foreground/50">
        Barcha loyihalar — bajarilishi bo'yicha tartiblangan
      </p>
    </div>

    <GlassCard className="p-0">
      <div className="p-2">
        <DataTable variant="glass" columns={columns} rows={rows} getKey={(r) => r.id} />
      </div>
    </GlassCard>
  </div>
);

export default ObodProjectsPage;
