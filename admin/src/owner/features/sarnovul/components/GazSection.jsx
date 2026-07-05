import { CheckCircle2, Cylinder, Flame, Home } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import RadialGauge from "@/shared/components/ui/chart/RadialGauge";
import SectionTitle from "./SectionTitle";
import SplitBar from "./SplitBar";
import { GAZ, PASSPORT } from "../data/sarnovul.data";

const GazSection = () => (
  <div className="flex flex-col gap-4">
    <SectionTitle
      icon={Flame}
      tone="blue"
      title="Gaz ta'minoti"
      subtitle="Quvur gazi va suyultirilgan gaz (balon) bo'yicha ta'minot holati"
    />

    <div className="grid gap-4 sm:grid-cols-3">
      <GlassStatCard
        label="Yetkazilgan ballon (iyun)"
        value={GAZ.cylindersDelivered}
        suffix=" ta"
        icon={Cylinder}
        accent="cyan"
        delta={GAZ.deltas.delivered}
        glow
      />
      <GlassStatCard
        label="Xizmat ko'rsatilgan xonadon"
        value={GAZ.servedHouseholds}
        suffix=" ta"
        icon={Home}
        accent="purple"
        delta={GAZ.deltas.served}
      />
      <GlassStatCard
        label={`Talab qondirish — ${GAZ.cylindersDemand.toLocaleString("uz-UZ")} talabdan`}
        value={GAZ.fulfillmentPct}
        suffix="%"
        icon={CheckCircle2}
        accent="emerald"
        delta={GAZ.deltas.fulfillment}
      />
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <GlassChartCard
        title="Xonadonlar gaz ta'minoti"
        insight={`${PASSPORT.households} xonadondan ${GAZ.supply[0].value + GAZ.supply[1].value} tasi ta'minlangan`}
      >
        <div className="flex flex-col items-center gap-6 pt-2 md:flex-row md:items-center">
          <RadialGauge
            value={GAZ.suppliedPct}
            color="#06b6d4"
            label="Ta'minlanish"
            sublabel="Quvur yoki balon orqali"
          />
          <div className="w-full flex-1">
            <SplitBar segments={GAZ.supply} unit="xonadon" />
          </div>
        </div>
      </GlassChartCard>

      <GlassChartCard
        title="Ballon yetkazish dinamikasi (12 oy)"
        insight="Qish oylarida talab yozga nisbatan ~40% yuqori"
      >
        <TrendChart data={GAZ.cylindersSeries} color="#3b82f6" unit="ta" height={280} />
      </GlassChartCard>
    </div>
  </div>
);

export default GazSection;
