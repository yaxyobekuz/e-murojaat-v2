import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import DeltaPill from "@/shared/components/ui/glass/DeltaPill";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";

// KPI card: accent icon chip + big tabular figure + green ▲ delta pill
const GlassStatCard = ({
  label,
  value,
  icon: Icon,
  delta,
  suffix = "",
  isMoney = false,
  accent = "purple",
  glow = false,
}) => {
  const chip = {
    purple: "bg-brand-purple/15 text-brand-purple",
    yellow: "bg-brand-yellow/15 text-brand-yellow",
    cyan: "bg-brand-cyan/15 text-brand-cyan",
    emerald: "bg-emerald-500/15 text-emerald-400",
  }[accent];

  return (
    <GlassCard glow={glow} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {Icon && (
          <span className={cn("grid size-9 place-items-center rounded-xl", chip)}>
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
        )}
        {typeof delta === "number" && <DeltaPill value={delta} />}
      </div>

      <div>
        <AnimatedCounter
          value={Number.isFinite(value) ? value : 0}
          formatter={isMoney ? formatMoney : undefined}
          suffix={suffix}
          className="text-2xl font-semibold tracking-tight tabular-nums"
        />
        <p className="mt-1 text-[13px] text-foreground/55">{label}</p>
      </div>
    </GlassCard>
  );
};

export default GlassStatCard;
