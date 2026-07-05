import { Baby, GraduationCap, School, Users } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import RadialGauge from "@/shared/components/ui/chart/RadialGauge";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import SectionTitle from "./SectionTitle";
import { TALIM } from "../data/sarnovul.data";

const TalimSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={GraduationCap}
      tone="indigo"
      title="Ta'lim"
      subtitle="Maktablar, bog'chalar va qamrov darajasi"
    />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <GlassStatCard label="Maktablar" value={TALIM.schools} suffix=" ta" icon={School} accent="purple" glow />
      <GlassStatCard
        label="Maktab o'quvchilari"
        value={TALIM.schoolStudents}
        suffix=" nafar"
        icon={Users}
        accent="cyan"
      />
      <GlassStatCard label="Bog'chalar" value={TALIM.kindergartens} suffix=" ta" icon={Baby} accent="yellow" />
      <GlassStatCard
        label="Bog'cha tarbiyalanuvchilari"
        value={TALIM.kgChildren}
        suffix=" nafar"
        icon={Users}
        accent="emerald"
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      <GlassChartCard
        title="Bog'cha turlari bo'yicha bolalar"
        insight="6 bog'chadan 3 tasi — uy (oilaviy) bog'cha"
      >
        <DonutChart
          data={TALIM.kgTypes}
          labelMap={TALIM.kgTypeLabels}
          colors={["#6366f1", "#8b5cf6", "#f59e0b"]}
          height={260}
        />
      </GlassChartCard>

      <GlassChartCard
        title="Ta'lim qamrovi"
        insight={`Maktab yoshidagi ${TALIM.schoolAgeTotal} boladan ${TALIM.schoolStudents} tasi o'qiydi`}
        bodyClassName="flex items-center justify-around gap-4"
      >
        <RadialGauge value={TALIM.schoolCoveragePct} size={140} color="#6366f1" label="Maktab qamrovi" />
        <RadialGauge value={TALIM.kgCoveragePct} size={140} color="#f59e0b" label="Bog'cha qamrovi" />
      </GlassChartCard>

      <GlassChartCard
        title="Muassasalar bo'yicha o'quvchilar"
        insight="Eng yirik muassasa — 66-son maktab: 668 o'quvchi"
      >
        <BreakdownBar
          data={TALIM.institutions}
          labelMap={TALIM.institutionLabels}
          color="#6366f1"
          height={260}
        />
      </GlassChartCard>
    </div>
  </div>
);

export default TalimSection;
