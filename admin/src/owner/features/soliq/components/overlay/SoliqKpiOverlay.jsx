// Xarita ustida suzuvchi ixcham KPI pillar qatori (katta kartalar emas).
import { Home, Coins, Wallet, TrendingDown, Percent } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";

// Statik klass xaritasi (Tailwind dinamik klassni purge qiladi)
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

const SoliqKpiOverlay = ({ summary }) => (
  <div className="flex flex-wrap gap-2.5">
    <Pill icon={Home} label="Xonadonlar" value={summary.households.toLocaleString("uz-UZ")} accent="cyan" />
    <Pill icon={Coins} label="Hisoblangan" value={formatMoney(summary.assessedUzs)} accent="indigo" />
    <Pill icon={Wallet} label="Yig'ilgan" value={formatMoney(summary.collectedUzs)} accent="emerald" />
    <Pill
      icon={TrendingDown}
      label="Qarz"
      value={formatMoney(summary.debtUzs)}
      accent="rose"
      valueClass="text-rose-400"
    />
    <Pill icon={Percent} label="Yig'ilish" value={`${summary.collectionRate}%`} accent="amber" />
  </div>
);

export default SoliqKpiOverlay;
