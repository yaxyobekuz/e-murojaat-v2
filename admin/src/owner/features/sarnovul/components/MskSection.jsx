import { ClipboardList, UserRound, Wrench } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import SectionTitle from "./SectionTitle";
import { MSK } from "../data/sarnovul.data";

const MskSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={Wrench}
      tone="purple"
      title="MSK (Servis)"
      subtitle="Mahalla servis kompaniyasidagi joriy ishlar"
    />

    <div className="grid gap-4 sm:grid-cols-3">
      <GlassStatCard
        label="Hozirgi jami ishlar"
        value={MSK.activeJobs}
        suffix=" ta"
        icon={ClipboardList}
        accent="purple"
        delta={MSK.deltas.jobs}
        glow
      />
      <GlassStatCard
        label={`Erkaklar bajarayotgan — ${Math.round((MSK.male / MSK.activeJobs) * 100)}%`}
        value={MSK.male}
        suffix=" ta ish"
        icon={UserRound}
        accent="cyan"
      />
      <GlassStatCard
        label={`Ayollar bajarayotgan — ${Math.round((MSK.female / MSK.activeJobs) * 100)}%`}
        value={MSK.female}
        suffix=" ta ish"
        icon={UserRound}
        accent="yellow"
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard
        title="Ishlar taqsimoti: erkak / ayol"
        insight={`${MSK.activeJobs} ta ishning ${MSK.male} tasini erkaklar, ${MSK.female} tasini ayollar bajarmoqda`}
      >
        <DonutChart
          data={MSK.genderSplit}
          labelMap={MSK.genderLabels}
          colors={["#06b6d4", "#f59e0b"]}
          height={270}
        />
      </GlassChartCard>

      <GlassChartCard
        title="Yo'nalishlar bo'yicha ishlar"
        insight="Eng ko'p talab — elektr montaj: 12 ta ish"
      >
        <BreakdownBar
          data={MSK.categories}
          labelMap={MSK.categoryLabels}
          color="#8b5cf6"
          height={270}
        />
      </GlassChartCard>
    </div>
  </div>
);

export default MskSection;
