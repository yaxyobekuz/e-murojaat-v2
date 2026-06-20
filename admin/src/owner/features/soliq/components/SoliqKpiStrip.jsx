// Mahalla bo'yicha soliq KPI kartalar qatori.
import { Home, Coins, Wallet, Percent } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import { mahallaSummary } from "../mock/soliq.mapAreas";

const SoliqKpiStrip = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <GlassStatCard
      label="Jami xonadonlar"
      value={mahallaSummary.households}
      icon={Home}
      accent="cyan"
    />
    <GlassStatCard
      label="Hisoblangan soliq"
      value={mahallaSummary.assessedUzs}
      icon={Coins}
      isMoney
      accent="purple"
    />
    <GlassStatCard
      label="Yig'ilgan soliq"
      value={mahallaSummary.collectedUzs}
      icon={Wallet}
      isMoney
      accent="emerald"
      glow
    />
    <GlassStatCard
      label="Yig'ilish darajasi"
      value={mahallaSummary.collectionRate}
      icon={Percent}
      suffix="%"
      accent="yellow"
    />
  </div>
);

export default SoliqKpiStrip;
