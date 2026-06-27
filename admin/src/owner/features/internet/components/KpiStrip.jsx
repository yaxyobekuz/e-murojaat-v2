import { Wifi, Gauge, Activity, MessageSquareWarning } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard
        label="Internet qamrovi"
        value={s.coverage}
        delta={d.coverage}
        suffix="%"
        icon={Wifi}
        accent="cyan"
        glow
      />
      <GlassStatCard
        label="O'rtacha tezlik (Mbit/s)"
        value={s.avgSpeed}
        delta={d.avgSpeed}
        icon={Gauge}
        accent="purple"
      />
      <GlassStatCard
        label="Tarmoq barqarorligi (uptime)"
        value={s.uptime}
        delta={d.uptime}
        suffix="%"
        icon={Activity}
        accent="emerald"
      />
      <GlassStatCard
        label="Shikoyatlar (oylik)"
        value={s.complaints}
        delta={d.complaints}
        icon={MessageSquareWarning}
        accent="yellow"
      />
    </div>
  );
};

export default KpiStrip;
