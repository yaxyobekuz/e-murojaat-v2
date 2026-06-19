import { Users, Zap, Wallet, TrendingDown } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import ComboChart from "@/shared/components/ui/chart/ComboChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import SvetNav from "../components/SvetNav";
import {
  useSvetSummary,
  useSvetTimeseries,
  useSvetBreakdown,
} from "../hooks/useSvetAnalytics";
import {
  REGION_OPTIONS,
  SUBSCRIBER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  VIOLATION_TYPE_LABELS,
  SVET_ACCENT,
} from "../constants/svet.ui";

const KPI_ICONS = {
  totalSubscribers: Users,
  monthUsage: Zap,
  monthRevenue: Wallet,
  totalDebt: TrendingDown,
};

const MONEY_KEYS = ["monthRevenue", "totalDebt"];

const topInsight = (rows, labelMap = {}, suffix = "ta") => {
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

const NORM_SERIES = [
  { key: "within", label: "Norma ichida", color: "#10b981" },
  { key: "over", label: "Normadan tashqari", color: "#f59e0b" },
];

const SvetDashboardPage = () => {
  const { state, setField } = useObjectState({ region: "", from: "", to: "" });
  const params = state;

  const { data: summary } = useSvetSummary(params);
  const { data: usage } = useSvetTimeseries("usage", params);
  const { data: norm } = useSvetTimeseries("norm", params);
  const { data: revenue } = useSvetTimeseries("revenue", params);
  const { data: byRegion } = useSvetBreakdown("region", params);
  const { data: byType } = useSvetBreakdown("type", params);
  const { data: byMethod } = useSvetBreakdown("method", params);
  const { data: byViolation } = useSvetBreakdown("violationType", params);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Elektr — Analitika</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Abonentlar, sarf va tushum bo'yicha umumiy ko'rsatkichlar
        </p>
      </div>

      <SvetNav />

      {/* Filter panel */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[2px] border bg-white p-3">
        <Select
          value={state.region}
          onChange={(v) => setField("region", v)}
          placeholder="Viloyat"
          triggerClassName="w-48"
          options={[{ value: "", label: "Barcha viloyatlar" }, ...REGION_OPTIONS]}
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
            isMoney={MONEY_KEYS.includes(kpi.key)}
            suffix={kpi.key === "monthUsage" ? " kVt·soat" : ""}
          />
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Oylik elektr sarfi (12 oy)"
          insight="So'nggi 12 oydagi iste'mol dinamikasi"
        >
          <TrendChart data={usage || []} color={SVET_ACCENT} unit="kVt·soat" />
        </ChartCard>

        <ChartCard
          title="Norma ichida vs normadan tashqari"
          insight="Ijtimoiy norma chegarasidagi va undan ortiq sarf"
        >
          <StackedBar data={norm || []} series={NORM_SERIES} unit="kVt·soat" />
        </ChartCard>

        <ChartCard
          title="Tushum vs qarzdorlik dinamikasi"
          insight="Oylik to'lovlar oqimi"
        >
          <ComboChart
            data={revenue || []}
            barKey="revenue"
            barLabel="Tushum"
            barColor={SVET_ACCENT}
          />
        </ChartCard>

        <ChartCard
          title="Viloyatlar kesimida abonentlar"
          insight={topInsight(byRegion)}
        >
          <BreakdownBar data={byRegion || []} />
        </ChartCard>

        <ChartCard
          title="Abonent turlari"
          insight={topInsight(byType, SUBSCRIBER_TYPE_LABELS)}
        >
          <DonutChart data={byType || []} labelMap={SUBSCRIBER_TYPE_LABELS} />
        </ChartCard>

        <ChartCard
          title="To'lov usullari"
          insight={topInsight(byMethod, PAYMENT_METHOD_LABELS)}
        >
          <DonutChart data={byMethod || []} labelMap={PAYMENT_METHOD_LABELS} />
        </ChartCard>

        <ChartCard
          title="Qoidabuzarliklar (e-dalolatnoma) turlari"
          insight={topInsight(byViolation, VIOLATION_TYPE_LABELS)}
        >
          <BreakdownBar
            data={byViolation || []}
            labelMap={VIOLATION_TYPE_LABELS}
            color={SVET_ACCENT}
          />
        </ChartCard>
      </div>
    </div>
  );
};

export default SvetDashboardPage;
