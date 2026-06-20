import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/shared/utils/cn";

// Green ▲ / red ▼ percentage pill (reference look)
const DeltaPill = ({ value = 0, className = "" }) => {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        up
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-rose-500/15 text-rose-400",
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {Math.abs(value)}%
    </span>
  );
};

export default DeltaPill;
