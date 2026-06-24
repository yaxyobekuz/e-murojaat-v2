// Dinamika qatori: iste'mol vs quyosh generatsiyasi + MTTR gauge + energiya balansi.
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import ComboChart from "@/shared/components/ui/chart/ComboChart";
import { useElektrAnalytics } from "../hooks/useElektrAnalytics";
import MttrGauge from "./charts/MttrGauge";
import EnergyBalance from "./charts/EnergyBalance";

const RowDynamics = ({ mahallaId }) => {
  const p = { mahallaId };
  const { data: series } = useElektrAnalytics("timeseries", p);
  const { data: mttr } = useElektrAnalytics("mttr", p);
  const { data: balance } = useElektrAnalytics("energyBalance", p);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr_1.3fr]">
      <GlassChartCard
        title="Iste'mol va quyosh generatsiyasi dinamikasi"
        insight="Iste'mol qishda, quyosh generatsiyasi yozda cho'qqida"
      >
        <ComboChart
          data={series || []}
          barKey="consumption"
          barLabel="Iste'mol (MVt·soat)"
          lineKey="generation"
          lineLabel="Quyosh (MVt·soat)"
          barColor="#f59e0b"
          lineColor="#10b981"
          height={260}
        />
      </GlassChartCard>

      <GlassCard className="flex flex-col">
        <h3 className="text-sm font-medium">Avariyani bartaraf etish (MTTR)</h3>
        <p className="mt-0.5 text-xs text-foreground/45">Dispetcher xizmati tezkorligi</p>
        <div className="mt-2 flex-1">
          <MttrGauge actual={mttr?.actual || 0} target={mttr?.target || 45} height={210} />
        </div>
      </GlassCard>

      <GlassChartCard
        title="Energiya balansi"
        insight="Kirim: tarmoq + quyosh. Chiqim: foydali iste'mol va yo'qotishlar"
      >
        <EnergyBalance balance={balance} />
      </GlassChartCard>
    </div>
  );
};

export default RowDynamics;
