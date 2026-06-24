// Demografiya qatori: jins (ariza & bandlik) + yosh + yosh×kategoriya heatmap.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import { GENDER } from "../mock/msk.data";
import { M } from "./charts/chartTheme";
import AgeCategoryHeatmap from "./charts/AgeCategoryHeatmap";

const GENDER_COLORS = [M.sky, M.rose];

const RowDemographics = ({ filter }) => {
  const { data: gender } = useMskAnalytics("byGender", filter);
  const { data: wGender } = useMskAnalytics("workerGender", filter);
  const { data: age } = useMskAnalytics("byAge", filter);
  const { data: ageCat } = useMskAnalytics("ageCategory", filter);

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        <GlassChartCard title="Arizachilar jinsi" insight="Kim ko'proq ariza beryapti">
          <DonutChart data={gender || []} labelOf={(k) => GENDER[k]} colors={GENDER_COLORS} height={240} />
        </GlassChartCard>

        <GlassChartCard title="Ish bilan bandlik (xodim jinsi)" insight="Tayinlangan ishlar bo'yicha">
          <DonutChart data={wGender || []} labelOf={(k) => GENDER[k]} colors={GENDER_COLORS} height={240} />
        </GlassChartCard>

        <GlassChartCard title="Yosh kesimida arizalar" insight="Qaysi yoshdagilar faolroq">
          <BreakdownBar data={age || []} color={M.violet} height={240} />
        </GlassChartCard>
      </div>

      <GlassChartCard
        title="Yosh × xizmat turi (issiqlik matritsasi)"
        insight="Qaysi yoshdagilar qaysi xizmatni ko'proq so'raydi — to'q rang = ko'p ariza"
      >
        <AgeCategoryHeatmap data={ageCat} />
      </GlassChartCard>
    </>
  );
};

export default RowDemographics;
