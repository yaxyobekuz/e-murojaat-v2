// AI yorlig'i — pulslangan nuqta + "AI" matni. AI tahlil natijalari ustida ishlatiladi.
import { Sparkles } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const AIBadge = ({ label = "AI", className = "" }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-300",
      className,
    )}
  >
    <Sparkles className="size-3 animate-pulse" />
    {label}
  </span>
);

export default AIBadge;
