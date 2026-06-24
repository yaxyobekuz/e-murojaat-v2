// Ta'minot qatori: balon dinamikasi (kerakli vs yetkazilgan) + holat + ta'minot turi.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import ComboChart from "@/shared/components/ui/chart/ComboChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { useGazAnalytics } from "../hooks/useGazAnalytics";
import { STATUS, SUPPLY } from "../mock/gaz.data";
import { G } from "./charts/chartTheme";

const STATUS_COLORS = ["#10b981", "#f59e0b", "#ef4444", "#1f2937"];
const SUPPLY_COLORS = ["#1E4FD8", "#06b6d4", "#8b5cf6", "#64748b"];

const RowSupply = ({ filter }) => {
  const { data: trend } = useGazAnalytics("deliveryTrend", filter);
  const { data: status } = useGazAnalytics("byStatus", filter);
  const { data: supply } = useGazAnalytics("bySupplyType", filter);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr_1fr]">
      <GlassChartCard title="Balon yetkazish dinamikasi" insight="Kerakli (chiziq) va yetkazilgan (ustun) balonlar — qishda talab yuqori">
        <ComboChart
          data={trend || []}
          barKey="yetkazilgan" barLabel="Yetkazilgan"
          lineKey="kerakli" lineLabel="Kerakli"
          barColor={G.cyan} lineColor={G.blue}
          height={260}
        />
      </GlassChartCard>

      <GlassChartCard title="Ta'minot holati" insight="Ko'chalar bo'yicha (yashil/sariq/qizil/qora)">
        <DonutChart data={status || []} labelOf={(k) => STATUS[k]?.label} colors={STATUS_COLORS} height={260} />
      </GlassChartCard>

      <GlassChartCard title="Ta'minot turi" insight="Xonadonlar bo'yicha qoplama">
        <DonutChart data={supply || []} labelOf={(k) => SUPPLY[k]?.label} colors={SUPPLY_COLORS} height={260} />
      </GlassChartCard>
    </div>
  );
};

export default RowSupply;
