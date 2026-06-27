// Yuqori panel — 16 ta modul kartasi (2 qator × 8 ustun). Har biri bosiladi → modul sahifasi.
// Kichik shrift (10-12px), animatsiyali raqam, o'sish/kamayish strelkasi.
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";
import { TOP_CARDS } from "../data/mahallaData";

const nf = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");

function MetricCard({ c, i }) {
  const nav = useNavigate();
  const Icon = c.icon;
  // butun son uchun count-up; kasr (mlrd) uchun to'g'ridan-to'g'ri
  const isInt = Number.isInteger(c.value);
  const animated = useCountUp(isInt ? c.value : 0, 1100 + i * 30);
  const shown = isInt ? nf(animated) : c.value.toLocaleString("uz-UZ");
  const up = c.delta >= 0;

  return (
    <button
      type="button"
      onClick={() => nav(c.to)}
      title={`${c.title} · ${c.unit}`}
      style={{ "--ac": c.color, animationDelay: `${i * 30}ms` }}
      className="group asosiy-rise relative flex items-center gap-2 overflow-hidden rounded-lg border border-[rgb(var(--card-border))] bg-card/55 px-2 py-1.5 text-left backdrop-blur-md transition-all hover:border-[var(--ac)] hover:bg-card/80"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-md" style={{ background: `${c.color}22`, color: c.color }}>
        <Icon className="size-[15px]" strokeWidth={2.1} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-1">
          <span className="truncate text-[15px] font-semibold leading-none tracking-tight tabular-nums">{shown}</span>
          <span
            className={cn(
              "ml-auto flex shrink-0 items-center gap-px text-[9px] font-bold tabular-nums",
              up ? "text-emerald-400" : "text-red-400",
            )}
          >
            {up ? <ArrowUpRight className="size-2.5" /> : <ArrowDownRight className="size-2.5" />}
            {Math.abs(c.delta)}%
          </span>
        </div>
        <p className="mt-0.5 truncate text-[9.5px] font-medium leading-tight text-foreground/65">{c.title}</p>
      </div>
    </button>
  );
}

const TopBar = () => (
  <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
    {TOP_CARDS.map((c, i) => (
      <MetricCard key={c.key} c={c} i={i} />
    ))}
  </div>
);

export default TopBar;
