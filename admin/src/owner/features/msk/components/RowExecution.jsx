// Ijro qatori: ijro vaqti taqsimoti + kategoriya bo'yicha o'rtacha vaqt + SLA + mamnuniyat.
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import { catLabel } from "../mock/msk.data";
import { M } from "./charts/chartTheme";

const SLA_SERIES = [
  { key: "met", label: "Muddatida", color: M.emerald },
  { key: "missed", label: "Kechikkan", color: M.rose },
];

const RowExecution = ({ filter }) => {
  const { data: hist } = useMskAnalytics("durationHist", filter);
  const { data: durCat } = useMskAnalytics("durationByCategory", filter);
  const { data: sla } = useMskAnalytics("sla", filter);
  const { data: satisfaction } = useMskAnalytics("satisfaction", filter);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard title="Ijro vaqti taqsimoti" insight="Qancha vaqtda ish yakunlanyapti">
        <BreakdownBar data={hist || []} color={M.sky} height={260} />
      </GlassChartCard>

      <GlassChartCard title="Xizmat bo'yicha o'rtacha ijro vaqti (soat)" insight="Qaysi ishlar uzoq davom etadi">
        <BreakdownBar data={(durCat || []).slice(0, 9)} labelOf={catLabel} color={M.amber} height={260} />
      </GlassChartCard>

      <GlassChartCard title="SLA — muddatida vs kechikkan" insight="Oylar bo'yicha ijro intizomi">
        <StackedBar data={sla || []} series={SLA_SERIES} height={260} />
      </GlassChartCard>

      <GlassChartCard title="Fuqaro mamnuniyati dinamikasi" insight="O'rtacha baho (5 balli) oylar bo'yicha">
        <TrendChart data={satisfaction || []} color={M.emerald} unit="★" height={260} />
      </GlassChartCard>
    </div>
  );
};

export default RowExecution;
