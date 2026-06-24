// Quvur qatori: muammolar dinamikasi + uptime gauge + yetkazib beruvchilar.
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { useGazAnalytics } from "../hooks/useGazAnalytics";
import { G } from "./charts/chartTheme";
import RepairGauge from "./charts/RepairGauge";

const RowPipeline = ({ filter }) => {
  const { data: incidents } = useGazAnalytics("incidentsTrend", filter);
  const { data: repair } = useGazAnalytics("repair", filter);
  const { data: suppliers } = useGazAnalytics("suppliers", filter);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr_1.2fr]">
      <GlassChartCard title="Quvur muammolari dinamikasi" insight="Oylar bo'yicha gaz quvurdagi nosozliklar (qishda ko'proq)">
        <TrendChart data={incidents || []} color={G.red} unit="ta" height={260} />
      </GlassChartCard>

      <GlassCard className="flex flex-col">
        <h3 className="text-sm font-medium">Quvur ishlash davri (uptime)</h3>
        <p className="mt-0.5 text-xs text-foreground/45">O'rtacha tiklash vaqti va ochiq muammolar</p>
        <div className="mt-2 flex-1">
          <RepairGauge uptime={repair?.uptimePct || 0} repairH={repair?.avgRepairH || 0} openIncidents={repair?.openIncidents || 0} height={200} />
        </div>
      </GlassCard>

      <GlassChartCard title="Yetkazib beruvchilar ulushi" insight="Doimiy ta'minlovchilar (yetkazilgan balon bo'yicha)">
        <DonutChart data={suppliers || []} height={260} />
      </GlassChartCard>
    </div>
  );
};

export default RowPipeline;
