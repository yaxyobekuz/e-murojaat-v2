import { Users, PackageCheck, Container, TriangleAlert } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard
        label="Xizmat ko'rsatilgan xonadon"
        value={s.served}
        delta={d.served}
        icon={Users}
        accent="cyan"
        glow
      />
      <GlassStatCard
        label="Yetkazilgan ballon (oylik)"
        value={s.delivered}
        delta={d.delivered}
        icon={PackageCheck}
        accent="emerald"
      />
      <GlassStatCard
        label="Talab qondirish darajasi"
        value={s.fulfillment}
        delta={d.fulfillment}
        suffix="%"
        icon={Container}
        accent="purple"
      />
      <GlassStatCard
        label="Umumiy qarzdorlik"
        value={s.debt}
        delta={d.debt}
        icon={TriangleAlert}
        accent="yellow"
        isMoney
      />
    </div>
  );
};

export default KpiStrip;
