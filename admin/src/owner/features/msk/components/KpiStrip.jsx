import { ClipboardList, CheckCircle2, Timer, Target } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard
        label="Jami arizalar"
        value={s.total}
        delta={d.total}
        icon={ClipboardList}
        accent="purple"
        glow
      />
      <GlassStatCard
        label="Bajarilish darajasi"
        value={s.completionRate}
        delta={d.completionRate}
        suffix="%"
        icon={CheckCircle2}
        accent="emerald"
      />
      <GlassStatCard
        label="O'rtacha ijro vaqti"
        value={s.avgDurationH}
        delta={d.avgDurationH}
        suffix=" soat"
        icon={Timer}
        accent="yellow"
      />
      <GlassStatCard
        label="Muddatida bajarish (SLA)"
        value={s.slaPct}
        delta={d.slaPct}
        suffix="%"
        icon={Target}
        accent="cyan"
      />
    </div>
  );
};

export default KpiStrip;
