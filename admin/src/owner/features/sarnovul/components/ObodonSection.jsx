import { Sprout, Trees, Truck } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import StackedBar from "@/shared/components/ui/chart/StackedBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import SectionTitle from "./SectionTitle";
import { OBODON } from "../data/sarnovul.data";

const ObodonSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={Trees}
      tone="emerald"
      title="Obodonlashtirish"
      subtitle="Chiqindi olib ketish va ko'kalamzorlashtirish"
    />

    <div className="grid gap-4 sm:grid-cols-2">
      <GlassStatCard
        label={OBODON.trashSchedule}
        value={OBODON.trashTrucks}
        suffix=" ta chiqindi mashinasi"
        icon={Truck}
        accent="cyan"
        glow
      />
      <GlassStatCard
        label="Ekilgan ko'chatlar (2025–2026 mavsumi)"
        value={OBODON.saplings}
        suffix=" tup"
        icon={Sprout}
        accent="emerald"
        delta={OBODON.deltas.saplings}
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard
        title="Ko'chat ekish dinamikasi (12 oy)"
        insight="Ekish cho'qqisi — mart: 520 tup (bahorgi hashar mavsumi)"
      >
        <StackedBar
          data={OBODON.plantedSeries}
          series={[{ key: "planted", label: "Ekilgan ko'chat", color: "#10b981" }]}
          unit="tup"
          height={270}
        />
      </GlassChartCard>

      <GlassChartCard
        title="Ko'chat turlari"
        insight="Eng katta ulush — mevali ko'chatlar: 720 tup (39%)"
      >
        <DonutChart
          data={OBODON.saplingTypes}
          labelMap={OBODON.saplingLabels}
          colors={["#10b981", "#34d399", "#0d9488"]}
          height={270}
        />
      </GlassChartCard>
    </div>
  </div>
);

export default ObodonSection;
