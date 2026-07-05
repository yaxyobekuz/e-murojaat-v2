import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/shared/utils/cn";

// Interaktiv segmentli bar — hover qilinganda segment ajralib turadi
const SplitBar = ({ segments = [], unit = "" }) => {
  const [active, setActive] = useState(null);
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const pct = (v) => Math.round((v / total) * 100);

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex h-9 w-full overflow-hidden rounded-full bg-card/40">
        {segments.map((s) => (
          <motion.div
            key={s.key}
            initial={{ width: 0 }}
            whileInView={{ width: `${(s.value / total) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onMouseEnter={() => setActive(s.key)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "h-full cursor-pointer transition-all duration-200",
              active && active !== s.key && "opacity-30",
              active === s.key && "scale-y-110",
            )}
            style={{ background: s.color }}
            title={`${s.label}: ${s.value.toLocaleString("uz-UZ")} ${unit}`.trim()}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {segments.map((s) => (
          <div
            key={s.key}
            onMouseEnter={() => setActive(s.key)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "flex cursor-default items-center gap-2 transition-opacity",
              active && active !== s.key && "opacity-40",
            )}
          >
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-foreground/60">{s.label}</span>
            <span className="text-sm font-semibold tabular-nums">
              {s.value.toLocaleString("uz-UZ")}
            </span>
            <span className="text-[11px] tabular-nums text-foreground/40">({pct(s.value)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SplitBar;
