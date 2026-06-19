import { Building2, FileClock, Clock4, Hourglass } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import YerNav from "../components/YerNav";
import {
  useYerSummary,
  useYerTimeseries,
  useYerBreakdown,
} from "../hooks/useYerAnalytics";
import {
  REGION_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_TYPE_LABELS,
  REQUEST_STATUS_LABELS,
  SERVICE_TYPE_LABELS,
  YER_ACCENT,
} from "../constants/yer.ui";

const KPI_ICONS = {
  totalProperties: Building2,
  newRequests: FileClock,
  pending: Hourglass,
  avgReviewDays: Clock4,
};

const topInsight = (rows, labelMap, suffix = "ta") => {
  if (!rows?.length) return "Ma'lumot yo'q";
  const top = [...rows].sort((a, b) => b.value - a.value)[0];
  return `Eng ko'p — ${labelMap[top.key] || top.key}: ${top.value} ${suffix}`;
};

const ChartCard = ({ title, insight, children }) => (
  <Card>
    <h3 className="mb-1 font-semibold text-zinc-900">{title}</h3>
    <p className="mb-3 text-xs text-zinc-500">{insight}</p>
    {children}
  </Card>
);

const YerDashboardPage = () => {
  const { state, setField } = useObjectState({ region: "", type: "", from: "", to: "" });
  const params = state;

  const { data: summary } = useYerSummary(params);
  const { data: timeseries } = useYerTimeseries(params);
  const { data: byType } = useYerBreakdown("type", params);
  const { data: byRegion } = useYerBreakdown("region", params);
  const { data: byStatus } = useYerBreakdown("status", params);
  const { data: byService } = useYerBreakdown("serviceType", params);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Yer/Mol-mulk — Analitika</h1>
        <p className="mt-1 text-sm text-zinc-500">Reyestr va arizalar bo'yicha umumiy ko'rsatkichlar</p>
      </div>

      <YerNav />

      {/* Filter panel */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[2px] border bg-white p-3">
        <Select
          value={state.region}
          onChange={(v) => setField("region", v)}
          placeholder="Viloyat"
          triggerClassName="w-48"
          options={[{ value: "", label: "Barcha viloyatlar" }, ...REGION_OPTIONS]}
        />
        <Select
          value={state.type}
          onChange={(v) => setField("type", v)}
          placeholder="Obyekt turi"
          triggerClassName="w-44"
          options={[{ value: "", label: "Barcha turlar" }, ...PROPERTY_TYPE_OPTIONS]}
        />
        <Input
          type="date"
          value={state.from}
          onChange={(e) => setField("from", e.target.value)}
          className="w-40"
        />
        <Input
          type="date"
          value={state.to}
          onChange={(e) => setField("to", e.target.value)}
          className="w-40"
        />
      </div>

      {/* KPI cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(summary || []).map((kpi) => (
          <StatCard
            key={kpi.key}
            label={kpi.label}
            value={kpi.value}
            icon={KPI_ICONS[kpi.key]}
            suffix={kpi.key === "avgReviewDays" ? " kun" : ""}
          />
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Oylik arizalar dinamikasi"
          insight="So'nggi 12 oydagi arizalar oqimi"
        >
          <TrendChart data={timeseries || []} color={YER_ACCENT} />
        </ChartCard>

        <ChartCard
          title="Obyekt turlari ulushi"
          insight={topInsight(byType, PROPERTY_TYPE_LABELS)}
        >
          <DonutChart data={byType || []} labelMap={PROPERTY_TYPE_LABELS} />
        </ChartCard>

        <ChartCard
          title="Viloyatlar kesimida obyektlar"
          insight={topInsight(byRegion, {})}
        >
          <BreakdownBar data={byRegion || []} color={YER_ACCENT} />
        </ChartCard>

        <ChartCard
          title="Xizmat turlari bo'yicha arizalar"
          insight={topInsight(byService, SERVICE_TYPE_LABELS)}
        >
          <BreakdownBar data={byService || []} labelMap={SERVICE_TYPE_LABELS} />
        </ChartCard>

        <ChartCard
          title="Arizalar holati taqsimoti"
          insight={topInsight(byStatus, REQUEST_STATUS_LABELS)}
        >
          <DonutChart data={byStatus || []} labelMap={REQUEST_STATUS_LABELS} />
        </ChartCard>
      </div>
    </div>
  );
};

export default YerDashboardPage;
