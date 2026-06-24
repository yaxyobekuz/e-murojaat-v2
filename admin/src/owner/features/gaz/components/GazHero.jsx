// Gaz effektli hero — ko'k-siyohrang gradient + alanga (flicker) + balon vizuali.
import { Flame, Cylinder, Droplets } from "lucide-react";

import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";

const Mini = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
    <Icon className="size-5 text-white/80" />
    <div className="leading-tight">
      <div className="text-lg font-semibold tabular-nums text-white">{value}</div>
      <div className="text-[11px] text-white/65">{label}</div>
    </div>
  </div>
);

const GazHero = ({ summary }) => {
  const s = summary || {};
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#1E4FD8] to-[#0891b2] p-6 text-white shadow-lg">
      {/* yumshoq gaz nurlanishi */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 size-48 rounded-full bg-blue-300/15 blur-3xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="gaz-flame grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Flame className="size-8 text-amber-300" strokeWidth={2} />
          </span>
          <div>
            <p className="text-sm font-medium text-white/70">Sarnovul MFY — gazlashtirish darajasi</p>
            <div className="flex items-end gap-2">
              <AnimatedCounter value={s.gasifiedPct || 0} suffix="%" className="text-4xl font-bold tabular-nums" />
              <span className="mb-1.5 text-sm text-white/65">xonadonlar quvur gazi bilan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Mini icon={Cylinder} label="Oylik balon" value={(s.cylindersMonth || 0).toLocaleString("uz-UZ")} />
          <Mini icon={Flame} label="Doimiy ta'minlangan" value={`${s.regularPct || 0}%`} />
          <Mini icon={Droplets} label="O'rt. yetkazish" value={`${s.avgCycle || 0} kun`} />
        </div>
      </div>
    </div>
  );
};

export default GazHero;
