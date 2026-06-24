import { X } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { useGazAnalytics } from "../hooks/useGazAnalytics";
import GazHero from "../components/GazHero";
import GazFilters from "../components/GazFilters";
import KpiStrip from "../components/KpiStrip";
import SupplyHeatmap from "../components/SupplyHeatmap";
import RowSupply from "../components/RowSupply";
import RowStreets from "../components/RowStreets";
import RowPipeline from "../components/RowPipeline";

const EMPTY = { street: "", supplyType: "", status: "", adequacy: "" };

const GazAnalyticsPage = () => {
  const { state, setField, resetState } = useObjectState(EMPTY);
  const { data: summary } = useGazAnalytics("summary", state);
  const { data: heatmap } = useGazAnalytics("heatmap", state);
  const hasFilter = Object.values(state).some(Boolean);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Gaz ta'minoti analitikasi
          </h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Sarnovul MFY · gazlashtirish va gaz balon ta'minoti (ko'cha
            darajasida, mix)
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

      <GazHero summary={summary} />
      <GazFilters value={state} onChange={setField} />
      <KpiStrip summary={summary} />

      <GlassChartCard title="Ko'cha bo'yicha ta'minot holati">
        <SupplyHeatmap data={heatmap || []} />
      </GlassChartCard>

      <RowSupply filter={state} />
      <RowStreets filter={state} />
      <RowPipeline filter={state} />
    </div>
  );
};

export default GazAnalyticsPage;
