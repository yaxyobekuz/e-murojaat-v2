import { cn } from "@/shared/utils/cn";

// Yagona status rang xaritasi (rules/02). tone: new|progress|done|danger|neutral
const TONES = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  progress: "bg-amber-50 text-amber-700 border-amber-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  neutral: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const StatusBadge = ({ tone = "neutral", children, className = "" }) => (
  <span
    className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-[2px] border text-xs font-medium whitespace-nowrap",
      TONES[tone] || TONES.neutral,
      className,
    )}
  >
    {children}
  </span>
);

export default StatusBadge;
