// Tepa KPI qatori — 5 ta pillar (jami bizneslar / hisoblangan / yig'ilgan / qarz / faol).
import { Store, Coins, Wallet, TriangleAlert, Briefcase } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";

const ACCENT = {
  blue: "bg-blue-500/15 text-blue-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  teal: "bg-teal-500/15 text-teal-400",
  amber: "bg-amber-500/15 text-amber-400",
  violet: "bg-violet-500/15 text-violet-400",
};

// 18 700 000 000 -> "18.7 mlrd so'm"
const shortSom = (n) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd so'm`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln so'm`;
  return formatMoney(n);
};

const Card = ({ icon: Icon, label, value, sub, accent = "blue", valueClass = "" }) => (
  <div className="surface-overlay flex flex-1 items-center gap-3 rounded-2xl px-4 py-3">
    <span className={`grid size-11 shrink-0 place-items-center rounded-full ${ACCENT[accent]}`}>
      <Icon className="size-5" strokeWidth={2} />
    </span>
    <div className="min-w-0 leading-tight">
      <div className="truncate text-[12px] text-foreground/55">{label}</div>
      <div className={`text-xl font-semibold tabular-nums ${valueClass}`}>{value}</div>
      {sub && <div className="mt-0.5 truncate text-[11px] text-foreground/45">{sub}</div>}
    </div>
  </div>
);

const SoliqKpiRow = ({ summary }) => (
  <div className="flex flex-wrap gap-3">
    <Card
      icon={Store}
      label="Jami bizneslar"
      value={summary.total.toLocaleString("uz-UZ")}
      sub={`+${summary.newCount} (yangi)`}
      accent="blue"
    />
    <Card
      icon={Coins}
      label="Hisoblangan soliq"
      value={shortSom(summary.assessed)}
      accent="emerald"
    />
    <Card
      icon={Wallet}
      label="Yig'ilgan soliq"
      value={shortSom(summary.collected)}
      sub={`${summary.collectionRate}%`}
      accent="teal"
    />
    <Card
      icon={TriangleAlert}
      label="Qarzdorlik"
      value={shortSom(summary.debt)}
      sub={`${summary.debtors} ta qarzdor`}
      accent="amber"
      valueClass="text-amber-400"
    />
    <Card
      icon={Briefcase}
      label="Faoliyat yuritayotgan"
      value={summary.active.toLocaleString("uz-UZ")}
      sub={`${summary.total ? Math.round((summary.active / summary.total) * 100) : 0}%`}
      accent="violet"
    />
  </div>
);

export default SoliqKpiRow;
