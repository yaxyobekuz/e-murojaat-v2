import { useNavigate } from "react-router-dom";
import { Users, ReceiptText, AlertTriangle, Percent } from "lucide-react";

import StatCard from "@/shared/components/ui/card/StatCard";
import ChartCard from "@/shared/components/ui/chart/ChartCard";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DataTable from "@/shared/components/ui/table/DataTable";
import { Skeleton } from "@/shared/components/shadcn/skeleton";
import { formatMoney } from "@/shared/utils/formatMoney";
import { mahallaLabel } from "@/shared/data/regions";

import { useMahallaOverviewQuery } from "../hooks/useSoliqQueries";
import { taxTypeLabel, statusLabel, STATUS_TONE } from "../utils/soliq.constants";

const KPI_ICONS = { taxpayers: Users, assessed: ReceiptText, debt: AlertTriangle, collectionRate: Percent };
const KPI_TONE = { taxpayers: "info", assessed: "default", debt: "negative", collectionRate: "default" };

// Donut uchun status rangi (rules/02 xaritasi).
const STATUS_COLORS = { tolandi: "#10B981", qisman: "#F59E0B", qarzdor: "#EF4444", hisoblandi: "#1E4FD8" };

const MahallaOverview = ({ mahalla }) => {
  const navigate = useNavigate();
  const { data, isLoading } = useMahallaOverviewQuery(mahalla);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!data) return null;

  const { kpis, statusBreakdown, taxTypeBreakdown, debtors, debtorsCount } = data;

  const debtorColumns = [
    {
      key: "name",
      header: "F.I.Sh / Tashkilot",
      render: (r) => <span className="font-medium">{r.taxpayer?.fullName || "—"}</span>,
    },
    { key: "stir", header: "STIR", render: (r) => r.taxpayer?.stir || "—" },
    { key: "taxType", header: "Yo'nalish", render: (r) => taxTypeLabel(r.taxType) },
    { key: "penya_uzs", header: "Penya", align: "right", render: (r) => formatMoney(r.penya_uzs) },
    {
      key: "debt",
      header: "Qarz",
      align: "right",
      render: (r) => <span className="font-semibold text-rose-600">{formatMoney(r.debt_uzs)}</span>,
    },
    { key: "phone", header: "Telefon", render: (r) => r.taxpayer?.phone || "—" },
  ];

  // Donut rangini status tartibiga moslab beramiz.
  const statusColors = statusBreakdown.map((s) => STATUS_COLORS[s.key] || "#a1a1aa");

  return (
    <div className="space-y-4 rounded-[2px] border-2 border-primary/20 bg-primary/[0.02] p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mahallaLabel(mahalla)} — soliq holati
        </h2>
        <span className="text-sm text-rose-600 font-medium">
          {debtorsCount} ta soliq to'lamagan
        </span>
      </div>

      {/* Mahalla KPI kartalari */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <StatCard
            key={k.key}
            label={k.label}
            value={k.value}
            suffix={k.suffix || ""}
            isMoney={!!k.isMoney}
            icon={KPI_ICONS[k.key]}
            tone={KPI_TONE[k.key] || "default"}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="To'lov holati" insight="To'langan / qisman / qarzdor nisbati">
          <DonutChart
            data={statusBreakdown}
            labelOf={statusLabel}
            colors={statusColors}
            height={240}
          />
        </ChartCard>

        <ChartCard title="Yo'nalish (soliq turi) bo'yicha" insight="Qaysi soliq turi bo'yicha qancha hisoblangan">
          <BreakdownBar
            data={taxTypeBreakdown}
            labelOf={taxTypeLabel}
            color="#1E4FD8"
            isMoney
            height={240}
          />
        </ChartCard>
      </div>

      {/* Soliq to'lamaganlar ro'yxati */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Soliq to'lamaganlar</h3>
        <DataTable
          columns={debtorColumns}
          rows={debtors}
          onRowClick={(r) => r.taxpayer?._id && navigate(`/owner/soliq/taxpayers/${r.taxpayer._id}`)}
          emptyText="Bu mahallada qarzdor yo'q"
        />
      </div>
    </div>
  );
};

export default MahallaOverview;
