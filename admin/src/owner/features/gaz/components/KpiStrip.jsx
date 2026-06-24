import { Cylinder, CalendarClock, ShieldCheck, TriangleAlert } from "lucide-react";

import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";

const KpiStrip = ({ summary }) => {
  const s = summary || {};
  const d = s.deltas || {};

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <GlassStatCard label="Oylik yetkazilgan balon" value={s.cylindersMonth} delta={d.cylindersMonth} icon={Cylinder} accent="cyan" glow />
      <GlassStatCard label="O'rtacha yetkazish davri" value={s.avgCycle} delta={d.avgCycle} suffix=" kun" icon={CalendarClock} accent="purple" />
      <GlassStatCard label="Doimiy ta'minlangan" value={s.regularPct} delta={d.regularPct} suffix="%" icon={ShieldCheck} accent="emerald" />
      <GlassStatCard label="Muammoli ko'chalar (qizil/qora)" value={s.problemStreets} icon={TriangleAlert} accent="yellow" />
    </div>
  );
};

export default KpiStrip;
