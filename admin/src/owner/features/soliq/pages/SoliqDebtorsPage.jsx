import { formatMoney } from "@/shared/utils/formatMoney";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import { MAHALLA_AREAS, TAX_STATUS } from "../mock/soliq.mapAreas";

// Faqat qarzi borlar, qarz bo'yicha kamayish tartibida
const rows = MAHALLA_AREAS.filter((a) => a.info.debtUzs > 0).sort(
  (a, b) => b.info.debtUzs - a.info.debtUzs,
);

const columns = [
  { key: "name", header: "Hudud", render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "households", header: "Xonadonlar", render: (r) => r.info.households.toLocaleString("uz-UZ") },
  { key: "assessed", header: "Hisoblangan", align: "right", render: (r) => formatMoney(r.info.assessedUzs) },
  {
    key: "debt",
    header: "Qarz",
    align: "right",
    render: (r) => <span className="font-semibold text-rose-400">{formatMoney(r.info.debtUzs)}</span>,
  },
  {
    key: "rate",
    header: "Yig'ilish",
    align: "right",
    render: (r) => (
      <span style={{ color: TAX_STATUS[r.status].color }}>{r.info.collectionRate}%</span>
    ),
  },
  {
    key: "status",
    header: "Holati",
    render: (r) => (
      <GlassStatusBadge tone={TAX_STATUS[r.status].tone}>
        {TAX_STATUS[r.status].label}
      </GlassStatusBadge>
    ),
  },
];

const SoliqDebtorsPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Qarzdor hududlar</h1>
      <p className="mt-0.5 text-sm text-foreground/50">
        Soliq qarzi bo'yicha hududlar ro'yxati — eng katta qarzdan boshlab
      </p>
    </div>

    <GlassCard className="p-0">
      <div className="p-2">
        <DataTable variant="glass" columns={columns} rows={rows} getKey={(r) => r.id} />
      </div>
    </GlassCard>
  </div>
);

export default SoliqDebtorsPage;
