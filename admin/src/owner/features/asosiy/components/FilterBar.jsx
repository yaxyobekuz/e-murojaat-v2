// Xarita filtri — 6 ta grid option. Birini tanlab xonadonlarni status rangiga bo'yaydi.
import { Coins, Sprout, Zap, FlameKindling, Trash2, Flame, X } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { MAP_FILTERS, STATUS_TONES } from "../data/elementData";

const ICONS = { Coins, Sprout, Zap, FlameKindling, Trash2, Flame };

const FilterBar = ({ active, onChange }) => {
  const current = MAP_FILTERS.find((f) => f.key === active);

  return (
    <div className="surface-overlay rounded-xl p-2 backdrop-blur-md">
      <div className="mb-1.5 flex items-center gap-2 px-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-foreground/45">Xarita filtri</p>
        {current && (
          <>
            {/* faol filter legendasi */}
            <div className="ml-1 flex items-center gap-2">
              {Object.entries(current.legend).map(([tone, label]) => (
                <span key={tone} className="flex items-center gap-1 text-[9.5px] text-foreground/55">
                  <span className="size-2 rounded-full" style={{ background: STATUS_TONES[tone].color }} />
                  {label}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="ml-auto flex items-center gap-1 rounded-md border border-[rgb(var(--card-border))] px-1.5 py-0.5 text-[9.5px] text-foreground/55 transition-colors hover:text-foreground"
            >
              <X className="size-3" /> Tozalash
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {MAP_FILTERS.map((f) => {
          const Icon = ICONS[f.icon] || Coins;
          const on = f.key === active;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onChange(on ? null : f.key)}
              title={f.label}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 text-center transition-all",
                on
                  ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200 shadow-[0_0_12px_-2px_rgba(34,211,238,0.5)]"
                  : "border-[rgb(var(--card-border))] bg-card/40 text-foreground/55 hover:bg-card/70 hover:text-foreground/80",
              )}
            >
              <Icon className={cn("size-4 shrink-0", on && "text-cyan-300")} />
              <span className="max-w-full truncate text-[9.5px] font-medium leading-tight">{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
