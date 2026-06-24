// Kanal/mavsum qatori: mavsumiylik (oy×xizmat) + manba + ustuvorlik + ko'cha bo'yicha.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import { SOURCE, PRIORITY } from "../mock/msk.data";
import { M } from "./charts/chartTheme";

const PRIO_COLORS = ["#ef4444", "#f59e0b", "#0ea5e9", "#94a3b8"];

const RowChannels = ({ filter }) => {
  const { data: seasonal } = useMskAnalytics("seasonal", filter);
  const { data: source } = useMskAnalytics("bySource", filter);
  const { data: priority } = useMskAnalytics("byPriority", filter);
  const { data: street } = useMskAnalytics("byStreet", filter);

  return (
    <>
      <GlassChartCard
        title="Mavsumiylik — qaysi xizmat qaysi faslda"
        insight="Top xizmatlar oylar bo'yicha (qor tozalash qishda, ariq/obodonlashtirish bahor-yozda)"
      >
        <StackedBar data={seasonal?.data || []} series={seasonal?.series || []} height={280} />
      </GlassChartCard>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassChartCard title="Ariza manbalari" insight="Qaysi kanal orqali tushyapti">
          <DonutChart data={source || []} labelOf={(k) => SOURCE[k]} height={250} />
        </GlassChartCard>

        <GlassChartCard title="Ustuvorlik taqsimoti" insight="Shoshilinch arizalar ulushi">
          <DonutChart data={priority || []} labelOf={(k) => PRIORITY[k]?.label} colors={PRIO_COLORS} height={250} />
        </GlassChartCard>

        <GlassChartCard title="Ko'chalar bo'yicha 'issiq nuqtalar'" insight="Eng ko'p ariza tushgan ko'chalar">
          <BreakdownBar data={(street || []).slice(0, 8)} labelOf={(k) => `${k} ko'chasi`} color={M.roseLight} height={250} />
        </GlassChartCard>
      </div>
    </>
  );
};

export default RowChannels;
