import { X } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import MskFilters from "../components/MskFilters";
import KpiStrip from "../components/KpiStrip";
import RowOverview from "../components/RowOverview";
import RowDemographics from "../components/RowDemographics";
import RowExecution from "../components/RowExecution";
import RowChannels from "../components/RowChannels";
import WorkerTable from "../components/WorkerTable";

const EMPTY = { category: "", status: "", gender: "", ageBucket: "", street: "", source: "", priority: "" };

const MskAnalyticsPage = () => {
  const { state, setField, resetState } = useObjectState(EMPTY);
  const { data: summary } = useMskAnalytics("summary", state);
  const { data: workers } = useMskAnalytics("workers", state);
  const hasFilter = Object.values(state).some(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">MSK — xizmat analitikasi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Sarnovul MFY · maishiy xizmat arizalari bo'yicha to'liq tahlil (filtrlarni aralashtiring)
          </p>
        </div>
        {hasFilter && (
          <button
            type="button"
            onClick={resetState}
            className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--card-border))] px-3 py-1.5 text-xs font-medium text-foreground/60 hover:text-foreground"
          >
            <X className="size-3.5" /> Filtrlarni tozalash
          </button>
        )}
      </div>

      <MskFilters value={state} onChange={setField} />

      <KpiStrip summary={summary} />
      <RowOverview filter={state} />
      <RowDemographics filter={state} />
      <RowExecution filter={state} />
      <RowChannels filter={state} />

      <GlassChartCard
        title="Mas'ul xodimlar samaradorligi"
        insight="Tayinlangan/bajarilgan ishlar, o'rtacha vaqt, baho va SLA bo'yicha reyting"
      >
        <WorkerTable rows={workers || []} />
      </GlassChartCard>
    </div>
  );
};

export default MskAnalyticsPage;
