// Yo'qotishlar qatori: Waterfall + kuchlanish sifati + iste'mol tarkibi.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { useElektrAnalytics } from "../hooks/useElektrAnalytics";
import LossesWaterfall from "./charts/LossesWaterfall";
import VoltageBars from "./charts/VoltageBars";

const RowLosses = ({ mahallaId }) => {
  const p = { mahallaId };
  const { data: waterfall } = useElektrAnalytics("lossesWaterfall", p);
  const { data: voltage } = useElektrAnalytics("voltage");
  const { data: byType } = useElektrAnalytics("breakdownType", p);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <GlassChartCard
        title="Yo'qotishlar tahlili (stansiyadan aholigacha)"
        insight="Texnik + tijoriy yo'qotish: o'g'irlik va qochqinlar qizil ustunda"
      >
        <LossesWaterfall data={waterfall || []} height={300} />
      </GlassChartCard>

      <GlassChartCard
        title="Kuchlanish sifati (ko'cha bo'yicha)"
        insight="200V dan past — maishiy texnika ishlamaydi"
      >
        <VoltageBars data={voltage || []} height={300} />
      </GlassChartCard>

      <GlassChartCard
        title="Iste'mol tarkibi"
        insight="Iste'molchi turi bo'yicha taqsimot (MVt·soat)"
      >
        <DonutChart
          data={byType || []}
          labelOf={(k) => (byType || []).find((d) => d.key === k)?.label || k}
          colors={["#f59e0b", "#22d3ee", "#8b5cf6", "#10b981"]}
          height={300}
        />
      </GlassChartCard>
    </div>
  );
};

export default RowLosses;
