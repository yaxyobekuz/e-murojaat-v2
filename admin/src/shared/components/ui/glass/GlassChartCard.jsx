import { cn } from "@/shared/utils/cn";
import GlassCard from "@/shared/components/ui/glass/GlassCard";

// Chart container: title + optional value/insight + optional segmented toggle
const GlassChartCard = ({
  title,
  value,
  insight,
  segments,
  active,
  onSegment,
  right,
  className = "",
  bodyClassName = "",
  children,
}) => (
  <GlassCard className={cn("flex flex-col", className)}>
    <div className="flex items-start justify-between gap-3">
      <div>
        {value !== undefined && (
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        )}
        <h3 className={cn("font-medium", value !== undefined ? "mt-0.5 text-[13px] text-foreground/55" : "text-sm")}>
          {title}
        </h3>
      </div>

      {segments ? (
        <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-[rgb(var(--card-border))] bg-card/50 p-0.5">
          {segments.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSegment?.(s)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                s === active ? "bg-white text-zinc-900" : "text-foreground/55 hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      ) : (
        right
      )}
    </div>

    {insight && <p className="mt-1 text-xs text-foreground/45">{insight}</p>}

    <div className={cn("mt-4 flex-1", bodyClassName)}>{children}</div>
  </GlassCard>
);

export default GlassChartCard;
