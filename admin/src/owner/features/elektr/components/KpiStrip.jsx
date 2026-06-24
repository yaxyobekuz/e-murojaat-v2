import { Zap, TriangleAlert, Gauge, Sun } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard
        label="Oylik iste'mol (MVt·soat)"
        value={s.consumption}
        delta={d.consumption}
        icon={Zap}
        accent="yellow"
        glow
      />
      <GlassStatCard
        label="Energiya yo'qotishlari"
        value={s.lossPct}
        delta={d.lossPct}
        suffix="%"
        icon={TriangleAlert}
        accent="cyan"
      />
      <GlassStatCard
        label="ASKUE qamrovi (smart)"
        value={s.askue}
        delta={d.askue}
        suffix="%"
        icon={Gauge}
        accent="purple"
      />
      <GlassStatCard
        label="Quyosh generatsiyasi (kVt·soat)"
        value={s.solarKwh}
        delta={d.solarKwh}
        icon={Sun}
        accent="emerald"
      />
    </div>
  );
};

export default KpiStrip;
