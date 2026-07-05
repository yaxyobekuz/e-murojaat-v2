import { BookOpenCheck, Briefcase, Languages, Laptop, Plane, Star, UserX, Users } from "lucide-react";

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
      subtitle="14–30 yoshdagi yoshlar bandligi, yoshlar daftari va «5 tashabbus»"
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
      <GlassStatCard label="Yoshlar daftarida" value={YOSHLAR.notebook} suffix=" nafar" icon={BookOpenCheck} accent="cyan" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <GlassStatCard label="Til o'rganuvchilar" value={YOSHLAR.langLearners} suffix=" nafar" icon={Languages} accent="cyan" />
      <GlassStatCard label="Iqtidorli yoshlar" value={YOSHLAR.talented} suffix=" nafar" icon={Star} accent="yellow" />
      <GlassStatCard label="IT o'rganuvchilar" value={YOSHLAR.itLearners} suffix=" nafar" icon={Laptop} accent="purple" />
      <GlassStatCard label="Migratsiyadagi yoshlar" value={YOSHLAR.migration} suffix=" nafar" icon={Plane} accent="emerald" />
    </div>

    <GlassChartCard
      title="Yoshlar bandligi tarkibi"
      insight={`${YOSHLAR.total} yoshdan ${YOSHLAR.employed} tasi band (${YOSHLAR.entrepreneurs} tadbirkor), ${YOSHLAR.students} tasi o'qiydi, ${YOSHLAR.unemployed} tasi ishsiz`}
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

    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard
        title="«5 tashabbus» yo'nalishlarida qatnashuv"
        insight="Eng ommaviy yo'nalish — sport (620 nafar), keyin kitobxonlik (165 nafar)"
      >
        <SplitBar segments={YOSHLAR.initiatives} unit="nafar" />
      </GlassChartCard>
      <GlassChartCard
        title="Ishsiz yoshlar — ko'chalar kesimida"
        insight={`Jami ${YOSHLAR.unemployed} ishsiz yoshning ${YOSHLAR.unemployedByStreet[0].value} tasi ${YOSHLAR.unemployedByStreet[0].label}da`}
      >
        <SplitBar segments={YOSHLAR.unemployedByStreet} unit="nafar" />
      </GlassChartCard>
    </div>
  </div>
);

export default YoshlarSection;
