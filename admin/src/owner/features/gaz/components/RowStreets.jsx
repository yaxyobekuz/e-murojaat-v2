// Ko'cha qatori: yetkazilgan balon + yetkazish davri + oilaga o'rtacha + yetarlilik.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { useGazAnalytics } from "../hooks/useGazAnalytics";
import { ADEQUACY } from "../mock/gaz.data";
import { G } from "./charts/chartTheme";

const ADEQ_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const RowStreets = ({ filter }) => {
  const { data: cyl } = useGazAnalytics("cylindersByStreet", filter);
  const { data: cycle } = useGazAnalytics("cycleByStreet", filter);
  const { data: perFamily } = useGazAnalytics("perFamily", filter);
  const { data: adequacy } = useGazAnalytics("adequacy", filter);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard title="Ko'cha bo'yicha yetkazilgan balon" insight="Eng ko'p va eng kam ta'minlangan ko'chalar">
        <BreakdownBar data={cyl || []} color={G.cyan} height={260} />
      </GlassChartCard>

      <GlassChartCard title="O'rtacha yetkazish davri (kun)" insight="Eng uzoq davr — eng muammoli ko'chalar (yuqorida)">
        <BreakdownBar data={cycle || []} color={G.amber} height={260} />
      </GlassChartCard>

      <GlassChartCard title="Oilaga o'rtacha balon (oy)" insight="Ko'cha bo'yicha xonadonga o'rtacha balon">
        <BreakdownBar data={perFamily || []} color={G.violet} height={250} />
      </GlassChartCard>

      <GlassChartCard title="Ta'minot yetarliligi" insight="Yetarli / kam / deyarli yo'q ko'chalar">
        <DonutChart data={adequacy || []} labelOf={(k) => ADEQUACY[k]} colors={ADEQ_COLORS} height={250} />
      </GlassChartCard>
    </div>
  );
};

export default RowStreets;
