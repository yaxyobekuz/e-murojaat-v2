// Xarita ustida suzuvchi ixcham KPI pillar qatori.
import { LayoutGrid, ShieldAlert, Video, Radio, Users } from "lucide-react";

const ACCENT = {
  cyan: "bg-cyan-500/15 text-cyan-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  rose: "bg-rose-500/15 text-rose-400",
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

const IibKpiOverlay = ({ summary }) => (
  <div className="flex flex-wrap gap-2.5">
    <Pill icon={LayoutGrid} label="Bloklar" value={summary.blocks} accent="cyan" />
    <Pill
      icon={ShieldAlert}
      label="Faol hodisa"
      value={summary.incidents}
      accent="rose"
      valueClass="text-rose-400"
    />
    <Pill icon={Video} label="Kamera onlayn" value={`${summary.camerasOnline}/${summary.cameras}`} accent="emerald" />
    <Pill icon={Users} label="Patrul" value={summary.patrols} accent="indigo" />
    <Pill icon={Radio} label="Hodisali blok" value={summary.activeBlocks} accent="amber" />
  </div>
);

export default IibKpiOverlay;
