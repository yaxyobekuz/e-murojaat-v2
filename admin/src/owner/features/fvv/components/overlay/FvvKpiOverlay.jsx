// Xarita ustida suzuvchi ixcham KPI pillar qatori.
import { LayoutGrid, Flame, Video, Truck, Radio } from "lucide-react";

const ACCENT = {
  cyan: "bg-cyan-500/15 text-cyan-400",
  rose: "bg-rose-500/15 text-rose-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  amber: "bg-amber-500/15 text-amber-400",
};

const Pill = ({ icon: Icon, label, value, accent = "indigo", valueClass = "" }) => (
  <div className="surface-overlay flex items-center gap-2.5 rounded-xl px-3 py-2">
    <span className={`grid size-8 place-items-center rounded-lg ${ACCENT[accent]}`}>
      <Icon className="size-4" strokeWidth={2} />
    </span>
    <div className="leading-tight">
      <div className={`text-[15px] font-semibold tabular-nums ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-foreground/55">{label}</div>
    </div>
  </div>
);

const FvvKpiOverlay = ({ summary }) => (
  <div className="flex flex-wrap gap-2.5">
    <Pill icon={LayoutGrid} label="Bloklar" value={summary.blocks} accent="cyan" />
    <Pill icon={Flame} label="Faol yong'in" value={summary.fires} accent="rose" valueClass="text-rose-400" />
    <Pill icon={Video} label="Kamera onlayn" value={`${summary.camerasOnline}/${summary.cameras}`} accent="emerald" />
    <Pill icon={Truck} label="Brigada" value={summary.brigades} accent="indigo" />
    <Pill icon={Radio} label="Yong'inli blok" value={summary.fireBlocks} accent="amber" />
  </div>
);

export default FvvKpiOverlay;
