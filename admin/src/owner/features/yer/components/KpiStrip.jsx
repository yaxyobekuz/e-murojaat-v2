import { Landmark, Coins, FileClock, MapPinned } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard
        label="Jami yer uchastkalari"
        value={s.totalPlots}
        delta={d.totalPlots}
        icon={Landmark}
        accent="purple"
        glow
      />
      <GlassStatCard
        label="Mulk solig'i tushumi"
        value={s.taxRevenueUzs}
        delta={d.taxRevenueUzs}
        icon={Coins}
        accent="yellow"
        isMoney
      />
      <GlassStatCard
        label="Kutilayotgan kadastr"
        value={s.pendingCadaster}
        delta={d.pendingCadaster}
        icon={FileClock}
        accent="cyan"
      />
      <GlassStatCard
        label="Bu oy ro'yxatdan o'tgan"
        value={s.registeredThisMonth}
        delta={d.registeredThisMonth}
        icon={MapPinned}
        accent="emerald"
      />
    </div>
  );
};

export default KpiStrip;
