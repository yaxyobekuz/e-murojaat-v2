// Umumiy qator: tushgan vs bajarilgan dinamika + holatlar donut + xizmatlar reytingi.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import ComboChart from "@/shared/components/ui/chart/ComboChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import { STATUS, catLabel } from "../mock/msk.data";
import { M } from "./charts/chartTheme";

const STATUS_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#94a3b8", "#ef4444"];

const RowOverview = ({ filter }) => {
  const { data: ts } = useMskAnalytics("timeseries", filter);
  const { data: status } = useMskAnalytics("byStatus", filter);
  const { data: cats } = useMskAnalytics("byCategory", filter);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr_1.3fr]">
      <GlassChartCard
        title="Arizalar dinamikasi"
        insight="Oylar bo'yicha tushgan va bajarilgan arizalar"
      >
        <ComboChart
          data={ts || []}
          barKey="received" barLabel="Tushgan"
          lineKey="completed" lineLabel="Bajarilgan"
          barColor={M.rose} lineColor={M.emerald}
          height={260}
        />
      </GlassChartCard>

      <GlassChartCard title="Holatlar taqsimoti" insight="Arizalar qaysi bosqichda">
        <DonutChart
          data={status || []}
          labelOf={(k) => STATUS[k]?.label || k}
          colors={STATUS_COLORS}
          height={260}
        />
      </GlassChartCard>

      <GlassChartCard title="Eng ko'p so'ralgan xizmatlar" insight="Kategoriya bo'yicha ariza soni">
        <BreakdownBar data={(cats || []).slice(0, 9)} labelOf={catLabel} color={M.rose} height={260} />
      </GlassChartCard>
    </div>
  );
};

export default RowOverview;
