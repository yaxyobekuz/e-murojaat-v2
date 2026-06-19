import { Users, Flame, Wallet, TrendingDown } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import ComboChart from "@/shared/components/ui/chart/ComboChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import GazNav from "../components/GazNav";
import {
  useGazSummary,
  useGazTimeseries,
  useGazBreakdown,
} from "../hooks/useGazAnalytics";
import {
  REGION_OPTIONS,
  SUBSCRIBER_TYPE_OPTIONS,
  SUBSCRIBER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  METER_TYPE_LABELS,
  GAZ_ACCENT,
} from "../constants/gaz.ui";

const KPI = {
  totalSubscribers: { icon: Users },
  monthUsageM3: { icon: Flame, suffix: " m³" },
  monthRevenue: { icon: Wallet, isMoney: true },
  totalDebt: { icon: TrendingDown, isMoney: true, tone: "negative" },
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

const GazDashboardPage = () => {
  const { state, setField } = useObjectState({ region: "", type: "", from: "", to: "" });
  const params = state;

  const { data: summary } = useGazSummary(params);
  const { data: timeseries } = useGazTimeseries(params);
  const { data: byRegion } = useGazBreakdown("region", params);
  const { data: byType } = useGazBreakdown("type", params);
  const { data: byMethod } = useGazBreakdown("method", params);
  const { data: byMeter } = useGazBreakdown("meterType", params);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Gaz ta'minoti — Analitika</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Abonentlar, sarf, tushum va qarzdorlik bo'yicha umumiy ko'rsatkichlar
        </p>
      </div>

      <GazNav />

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
          placeholder="Abonent turi"
          triggerClassName="w-44"
          options={[{ value: "", label: "Barcha turlar" }, ...SUBSCRIBER_TYPE_OPTIONS]}
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
        {(summary || []).map((kpi) => {
          const meta = KPI[kpi.key] || {};
          return (
            <StatCard
              key={kpi.key}
              label={kpi.label}
              value={kpi.value}
              icon={meta.icon}
              suffix={meta.suffix || ""}
              isMoney={!!meta.isMoney}
              tone={meta.tone || "default"}
            />
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard
          title="Oylik gaz sarfi (m³)"
          insight="So'nggi 12 oy — qishda yuqori, yozda past"
        >
          <TrendChart data={timeseries || []} color={GAZ_ACCENT} unit="m³" />
        </ChartCard>

        <ChartCard
          title="Tushum va hisoblangan summa"
          insight="So'nggi 12 oy bo'yicha to'langan va hisoblangan summa (so'm)"
        >
          <ComboChart
            data={timeseries || []}
            barKey="revenue"
            barLabel="Tushum"
            lineKey="charged"
            lineLabel="Hisoblangan"
            barColor={GAZ_ACCENT}
            lineColor="#f59e0b"
          />
        </ChartCard>

        <ChartCard
          title="Viloyatlar kesimida abonentlar"
          insight={topInsight(byRegion, {})}
        >
          <BreakdownBar data={byRegion || []} color={GAZ_ACCENT} />
        </ChartCard>

        <ChartCard
          title="Abonent turlari ulushi"
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
          title="Hisoblagich turlari"
          insight={topInsight(byMeter, METER_TYPE_LABELS)}
        >
          <DonutChart data={byMeter || []} labelMap={METER_TYPE_LABELS} />
        </ChartCard>
      </div>
    </div>
  );
};

export default GazDashboardPage;
