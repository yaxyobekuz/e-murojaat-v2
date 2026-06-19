import {
  Inbox,
  FilePlus2,
  Hourglass,
  CheckCircle2,
  AlertTriangle,
  Clock4,
} from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import StatCard from "@/shared/components/ui/card/StatCard";
import Card from "@/shared/components/ui/card/Card";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import MurojaatNav from "../components/MurojaatNav";
import {
  useMurojaatSummary,
  useMurojaatTimeseries,
  useMurojaatBreakdown,
} from "../hooks/useMurojaatAnalytics";
import {
  REGION_OPTIONS,
  APPEAL_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  APPEAL_TYPE_LABELS,
  CATEGORY_LABELS,
  APPEAL_STATUS_LABELS,
  APPEAL_RESULT_LABELS,
  MUROJAAT_ACCENT,
} from "../constants/murojaat.ui";

const KPI_META = {
  total: { icon: Inbox },
  newThisMonth: { icon: FilePlus2 },
  inReview: { icon: Hourglass },
  satisfactionRate: { icon: CheckCircle2, suffix: "%", tone: "positive" },
  overdue: { icon: AlertTriangle, tone: "negative" },
  avgResponseDays: { icon: Clock4, suffix: " kun" },
};

const topInsight = (rows, labelMap, suffix = "ta") => {
  if (!rows?.length) return "Ma'lumot yo'q";
  const top = [...rows].sort((a, b) => b.value - a.value)[0];
  return `Eng ko'p — ${labelMap[top.key] || top.key}: ${top.value} ${suffix}`;
};

const slowestInsight = (rows) => {
  if (!rows?.length) return "Ma'lumot yo'q";
  const top = [...rows].sort((a, b) => b.value - a.value)[0];
  return `Eng sekin — ${top.key}: ${top.value} kun`;
};

const ChartCard = ({ title, insight, children }) => (
  <Card>
    <h3 className="mb-1 font-semibold text-zinc-900">{title}</h3>
    <p className="mb-3 text-xs text-zinc-500">{insight}</p>
    {children}
  </Card>
);

const MurojaatDashboardPage = () => {
  const { state, setField } = useObjectState({ region: "", type: "", category: "", from: "", to: "" });
  const params = state;

  const { data: summary } = useMurojaatSummary(params);
  const { data: timeseries } = useMurojaatTimeseries(params);
  const { data: byType } = useMurojaatBreakdown("type", params);
  const { data: byCategory } = useMurojaatBreakdown("category", params);
  const { data: byRegion } = useMurojaatBreakdown("region", params);
  const { data: byStatus } = useMurojaatBreakdown("status", params);
  const { data: byResult } = useMurojaatBreakdown("result", params);
  const { data: byOrg } = useMurojaatBreakdown("organization", params);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Murojaatlar — Analitika</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Murojaatlar oqimi, sohalar va tashkilotlar bo'yicha ko'rsatkichlar
        </p>
      </div>

      <MurojaatNav />

      {/* Filter panel */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[2px] border bg-white p-3">
        <Select
          value={state.region}
          onChange={(v) => setField("region", v)}
          placeholder="Viloyat"
          triggerClassName="w-44"
          options={[{ value: "", label: "Barcha viloyatlar" }, ...REGION_OPTIONS]}
        />
        <Select
          value={state.type}
          onChange={(v) => setField("type", v)}
          placeholder="Tur"
          triggerClassName="w-40"
          options={[{ value: "", label: "Barcha turlar" }, ...APPEAL_TYPE_OPTIONS]}
        />
        <Select
          value={state.category}
          onChange={(v) => setField("category", v)}
          placeholder="Soha"
          triggerClassName="w-44"
          options={[{ value: "", label: "Barcha sohalar" }, ...CATEGORY_OPTIONS]}
        />
        <Input type="date" value={state.from} onChange={(e) => setField("from", e.target.value)} className="w-40" />
        <Input type="date" value={state.to} onChange={(e) => setField("to", e.target.value)} className="w-40" />
      </div>

      {/* KPI cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {(summary || []).map((kpi) => {
          const meta = KPI_META[kpi.key] || {};
          return (
            <StatCard
              key={kpi.key}
              label={kpi.label}
              value={kpi.value}
              icon={meta.icon}
              suffix={meta.suffix || ""}
              tone={meta.tone || "default"}
            />
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartCard title="Oylik murojaatlar dinamikasi" insight="So'nggi 12 oydagi murojaatlar oqimi">
          <TrendChart data={timeseries || []} color={MUROJAAT_ACCENT} />
        </ChartCard>

        <ChartCard title="Murojaat turlari ulushi" insight={topInsight(byType, APPEAL_TYPE_LABELS)}>
          <DonutChart data={byType || []} labelMap={APPEAL_TYPE_LABELS} />
        </ChartCard>

        <ChartCard title="Sohalar bo'yicha murojaatlar" insight={topInsight(byCategory, CATEGORY_LABELS)}>
          <BreakdownBar data={byCategory || []} labelMap={CATEGORY_LABELS} color={MUROJAAT_ACCENT} />
        </ChartCard>

        <ChartCard title="Viloyatlar kesimida murojaatlar" insight={topInsight(byRegion, {})}>
          <BreakdownBar data={byRegion || []} color={MUROJAAT_ACCENT} />
        </ChartCard>

        <ChartCard title="Holat taqsimoti" insight={topInsight(byStatus, APPEAL_STATUS_LABELS)}>
          <DonutChart data={byStatus || []} labelMap={APPEAL_STATUS_LABELS} />
        </ChartCard>

        <ChartCard title="Natija taqsimoti" insight={topInsight(byResult, APPEAL_RESULT_LABELS)}>
          <DonutChart data={byResult || []} labelMap={APPEAL_RESULT_LABELS} />
        </ChartCard>

        <ChartCard title="Tashkilotlar reytingi (o'rtacha javob, kun)" insight={slowestInsight(byOrg)}>
          <BreakdownBar data={byOrg || []} color={MUROJAAT_ACCENT} />
        </ChartCard>
      </div>
    </div>
  );
};

export default MurojaatDashboardPage;
