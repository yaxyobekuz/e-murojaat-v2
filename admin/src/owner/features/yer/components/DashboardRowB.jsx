import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { useYerAnalytics } from "../hooks/useYerAnalytics";
import { LAND_USE_LABELS } from "../mock/yer.data";
import Terrain3D from "./Terrain3D";
import BubbleChart from "./charts/BubbleChart";
import RegionDotMap from "./charts/RegionDotMap";

const DashboardRowB = () => {
  const { data: landUse } = useYerAnalytics("landUse");
  const { data: byRegion } = useYerAnalytics("breakdown:region");

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr_1.6fr]">
      <Terrain3D />

      <GlassChartCard
        title="Yerdan foydalanish turlari"
        insight="Toifalar bo'yicha ulush"
      >
        <BubbleChart data={landUse || []} labelMap={LAND_USE_LABELS} />
      </GlassChartCard>

      <GlassChartCard
        title="Viloyatlar bo'yicha obyektlar"
        insight="Eng ko'p ro'yxatga olingan hududlar"
      >
        <RegionDotMap data={byRegion || []} />
      </GlassChartCard>
    </div>
  );
};

export default DashboardRowB;
