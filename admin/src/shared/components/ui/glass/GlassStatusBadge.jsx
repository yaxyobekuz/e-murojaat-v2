import { cn } from "@/shared/utils/cn";

// Dark/light-aware status badge. Same tone keys as shared StatusBadge.
const TONES = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  progress: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  danger: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  neutral: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const GlassStatusBadge = ({ tone = "neutral", children, className = "" }) => (
  <span
    className={cn(
      "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
      TONES[tone] || TONES.neutral,
      className,
    )}
  >
    {children}
  </span>
);

export default GlassStatusBadge;
