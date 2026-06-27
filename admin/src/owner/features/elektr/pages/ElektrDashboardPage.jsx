import useObjectState from "@/shared/hooks/useObjectState";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { useElektrAnalytics } from "../hooks/useElektrAnalytics";
import ElektrFilters from "../components/ElektrFilters";
import KpiStrip from "../components/KpiStrip";
import RowDynamics from "../components/RowDynamics";
import HealthHeatmap from "../components/HealthHeatmap";
import RowLosses from "../components/RowLosses";
import MahallaTable from "../components/MahallaTable";

const ElektrDashboardPage = () => {
  const { state, setField } = useObjectState({ mahallaId: "" });
  const { data: summary } = useElektrAnalytics("summary", { mahallaId: state.mahallaId });
  const { data: health } = useElektrAnalytics("health");
  const { data: mahallaRows } = useElektrAnalytics("mahallaRows");

  const critical = summary?.critical ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Elektr energiya analitikasi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Sarnovul MFY — ko'cha darajasida tarmoq salomatligi, yo'qotishlar va yashil energiya
          </p>
        </div>
        <ElektrFilters value={state} onChange={setField} />
      </div>

      <KpiStrip summary={summary} />
      <RowDynamics mahallaId={state.mahallaId} />

      <GlassChartCard
        title="Ko'cha tarmoq salomatligi (Infrastructure Health Index)"
        insight={
          critical
            ? `${critical} ta ko'chada transformatorlar kritik yuklamada — birinchi navbatda almashtirish kerak`
            : "Barcha transformatorlar me'yoriy yuklamada"
        }
      >
        <HealthHeatmap data={health || []} />
      </GlassChartCard>

      <RowLosses mahallaId={state.mahallaId} />

      <GlassChartCard
        title="Ko'cha kesimida to'liq ko'rsatkichlar"
        insight="Qatorni bosib ko'chani tanlang — yuqoridagi tahlillar shu ko'cha bo'yicha filtrlanadi"
      >
        <MahallaTable
          rows={mahallaRows || []}
          selectedId={state.mahallaId}
          onSelect={(id) => setField("mahallaId", id)}
        />
      </GlassChartCard>
    </div>
  );
};

export default ElektrDashboardPage;
