import { BookOpenCheck, Briefcase, UserX, Users } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import RadialGauge from "@/shared/components/ui/chart/RadialGauge";
import SectionTitle from "./SectionTitle";
import SplitBar from "./SplitBar";
import { YOSHLAR } from "../data/sarnovul.data";

const YoshlarSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={Users}
      tone="orange"
      title="Yoshlar"
      subtitle="14–30 yoshdagi yoshlar bandligi va yoshlar daftari"
    />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <GlassStatCard label="Jami yoshlar" value={YOSHLAR.total} suffix=" nafar" icon={Users} accent="yellow" glow />
      <GlassStatCard
        label="Ish bilan ta'minlangan"
        value={YOSHLAR.employed}
        suffix=" nafar"
        icon={Briefcase}
        accent="emerald"
        delta={YOSHLAR.deltas.employed}
      />
      <GlassStatCard
        label="Ishsiz yoshlar"
        value={YOSHLAR.unemployed}
        suffix=" nafar"
        icon={UserX}
        accent="purple"
        delta={YOSHLAR.deltas.unemployed}
      />
      <GlassStatCard
        label="Yoshlar daftarida"
        value={YOSHLAR.notebook}
        suffix=" nafar"
        icon={BookOpenCheck}
        accent="cyan"
        delta={YOSHLAR.deltas.notebook}
      />
    </div>

    <GlassChartCard
      title="Yoshlar bandligi tarkibi"
      insight={`${YOSHLAR.total} yoshdan ${YOSHLAR.employed} tasi band, ${YOSHLAR.students} tasi o'qiydi, ${YOSHLAR.unemployed} tasi ishsiz`}
    >
      <div className="flex flex-col items-center gap-6 pt-2 md:flex-row">
        <RadialGauge
          value={YOSHLAR.employmentPct}
          color="#10b981"
          label="Bandlik darajasi"
          sublabel="O'qimaydigan yoshlar orasida"
        />
        <div className="w-full flex-1">
          <SplitBar segments={YOSHLAR.composition} unit="nafar" />
        </div>
      </div>
    </GlassChartCard>
  </div>
);

export default YoshlarSection;
