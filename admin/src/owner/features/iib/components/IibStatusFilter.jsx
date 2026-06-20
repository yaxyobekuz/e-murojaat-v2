// Xavfsizlik holati bo'yicha filtr — Tinch / Diqqat / Hodisa toggle pill.
import { cn } from "@/shared/utils/cn";
import { SECURITY_STATUS } from "../mock/iib.mapAreas";

const ORDER = ["calm", "alert", "incident"];

const IibStatusFilter = ({ active = [], onToggle }) => (
  <div className="flex flex-wrap items-center gap-2">
    {ORDER.map((key) => {
      const st = SECURITY_STATUS[key];
      const on = active.includes(key);
      const dimmed = active.length > 0 && !on;
      return (
        <button
          key={key}
          type="button"
          onClick={() => onToggle(key)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
            on
              ? "border-transparent text-white"
              : "border-[rgb(var(--card-border))] text-foreground/70 hover:text-foreground",
            dimmed && "opacity-50",
          )}
          style={on ? { backgroundColor: st.color } : undefined}
          aria-pressed={on}
        >
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: on ? "rgba(255,255,255,0.9)" : st.color }}
          />
          {st.label}
        </button>
      );
    })}
  </div>
);

export default IibStatusFilter;
