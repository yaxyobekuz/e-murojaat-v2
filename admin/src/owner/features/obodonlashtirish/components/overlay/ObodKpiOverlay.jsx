// Xarita ustida suzuvchi ixcham KPI pillar qatori.
import { Hammer, Coins, Wallet, CheckCircle2, Activity } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";

const ACCENT = {
  teal: "bg-teal-500/15 text-teal-400",
  indigo: "bg-indigo-500/15 text-indigo-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  amber: "bg-amber-500/15 text-amber-400",
  blue: "bg-blue-500/15 text-blue-400",
};

const Pill = ({ icon: Icon, label, value, accent = "teal" }) => (
  <div className="surface-overlay flex items-center gap-2.5 rounded-xl px-3 py-2">
    <span className={`grid size-8 place-items-center rounded-lg ${ACCENT[accent]}`}>
      <Icon className="size-4" strokeWidth={2} />
    </span>
    <div className="leading-tight">
      <div className="text-[15px] font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] text-foreground/55">{label}</div>
    </div>
  </div>
);

const ObodKpiOverlay = ({ summary }) => (
  <div className="flex flex-wrap gap-2.5">
    <Pill icon={Hammer} label="Loyihalar" value={summary.count} accent="teal" />
    <Pill icon={Coins} label="Byudjet" value={formatMoney(summary.budgetUzs)} accent="indigo" />
    <Pill icon={Wallet} label="Sarflangan" value={formatMoney(summary.spentUzs)} accent="emerald" />
    <Pill icon={Activity} label="Jarayonda" value={summary.ongoing} accent="amber" />
    <Pill icon={CheckCircle2} label="Yakunlangan" value={summary.done} accent="blue" />
  </div>
);

export default ObodKpiOverlay;
