// Pastki markazda suzuvchi rejim paneli — Xarita / Ro'yxat / Issiqlik xaritasi / Klasterlar.
import { Map, List, Flame, Boxes } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const MAP_MODES = [
  { key: "map", label: "Xarita", icon: Map },
  { key: "list", label: "Ro'yxat", icon: List },
  { key: "heatmap", label: "Issiqlik xaritasi", icon: Flame },
  { key: "clusters", label: "Klasterlar", icon: Boxes },
];

const SoliqBottomBar = ({ mode, onChange }) => (
  <div className="surface-overlay flex items-center gap-1 rounded-2xl p-1.5">
    {MAP_MODES.map((m) => {
      const Icon = m.icon;
      const active = mode === m.key;
      return (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors",
            active ? "bg-blue-600 text-white" : "text-foreground/65 hover:bg-card/60 hover:text-foreground",
          )}
        >
          <Icon className="size-4" strokeWidth={2} />
          {m.label}
        </button>
      );
    })}
  </div>
);

export default SoliqBottomBar;
