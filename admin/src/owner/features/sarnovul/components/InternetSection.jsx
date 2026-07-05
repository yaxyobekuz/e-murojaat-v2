import { Cable, Gauge, Radio, Wifi } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import RadialGauge from "@/shared/components/ui/chart/RadialGauge";
import SectionTitle from "./SectionTitle";
import { INTERNET } from "../data/sarnovul.data";

const InternetSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={Wifi}
      tone="cyan"
      title="Internet"
      subtitle="Qamrov darajasi va o'rtacha tezlik"
    />

    <div className="grid gap-4 sm:grid-cols-3">
      <GlassStatCard
        label="O'rtacha tezlik"
        value={INTERNET.avgSpeed}
        suffix=" Mbit/s"
        icon={Gauge}
        accent="cyan"
        delta={INTERNET.deltas.speed}
        glow
      />
      <GlassStatCard
        label="Optik tola ulangan xonadon"
        value={INTERNET.fiber}
        suffix=" ta"
        icon={Cable}
        accent="purple"
      />
      <GlassStatCard
        label="Simsiz (4G/5G) xonadon"
        value={INTERNET.wireless}
        suffix=" ta"
        icon={Radio}
        accent="yellow"
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(280px,1fr)_2fr]">
      <GlassChartCard
        title="Internet qamrovi"
        insight={`${INTERNET.covered} xonadon qamrovda, ${INTERNET.uncovered} tasi hali ulanmagan`}
        bodyClassName="grid place-items-center"
      >
        <RadialGauge
          value={INTERNET.coveragePct}
          size={190}
          stroke={14}
          color="#06b6d4"
          label="Xonadonlar qamrovi"
          sublabel={`Yillik o'sish +${INTERNET.deltas.coverage}%`}
        />
      </GlassChartCard>

      <GlassChartCard
        title="O'rtacha tezlik dinamikasi (12 oy)"
        insight={`Bir yilda 41 dan ${INTERNET.avgSpeed} Mbit/s ga oshdi — optik tola kengaymoqda`}
      >
        <TrendChart data={INTERNET.speedSeries} color="#06b6d4" unit="Mbit/s" height={260} />
      </GlassChartCard>
    </div>
  </div>
);

export default InternetSection;
