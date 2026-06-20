import { useState } from "react";

import { formatMoney } from "@/shared/utils/formatMoney";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import { useYerAnalytics } from "../hooks/useYerAnalytics";
import SplineAreaChart from "./charts/SplineAreaChart";
import CapsuleBarChart from "./charts/CapsuleBarChart";
import RadialGauge from "./charts/RadialGauge";

const DashboardRowA = () => {
  const [range, setRange] = useState("12 oy");
  const { data: series } = useYerAnalytics("timeseries");
  const { data: completeness } = useYerAnalytics("cadasterCompleteness");
  const { data: monthly } = useYerAnalytics("monthlyRegistrations");

  const totalRevenue = (series || []).reduce((s, r) => s + r.tushum, 0);

  return (
    <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr_1.2fr]">
      {/* Hero spline */}
      <GlassChartCard
        title="Mulk solig'i tushumi va arizalar dinamikasi"
        value={formatMoney(totalRevenue * 1_000_000)}
        segments={["Hafta", "Oy", "12 oy"]}
        active={range}
        onSegment={setRange}
      >
        <SplineAreaChart data={series || []} />
      </GlassChartCard>

      {/* Completeness gauge */}
      <GlassCard className="flex flex-col">
        <h3 className="text-sm font-medium">Kadastr to'liqligi</h3>
        <p className="mt-0.5 text-xs text-foreground/45">Ro'yxatdan o'tgan obyektlar ulushi</p>
        <div className="mt-2 flex-1">
          <RadialGauge value={completeness || 0} label="to'liq" height={210} />
        </div>
      </GlassCard>

      {/* Capsule bars */}
      <GlassChartCard
        title="Oylik ro'yxatga olish"
        insight="Eng faol oylar ajratilgan"
      >
        <CapsuleBarChart data={monthly || []} dataKey="arizalar" />
      </GlassChartCard>
    </div>
  );
};

export default DashboardRowA;
