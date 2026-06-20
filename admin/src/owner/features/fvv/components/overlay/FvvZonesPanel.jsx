// Xarita ustida suzuvchi bloklar paneli — qatorni bossang kamera kuzatuvi ochiladi.
import { Video, Flame } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { FIRE_STATUS } from "../../mock/fvv.mapAreas";

const FvvZonesPanel = ({ zones, activeId, onSelect }) => (
  <div className="surface-overlay flex max-h-[260px] w-72 flex-col rounded-xl p-2">
    <div className="flex items-center justify-between px-2 py-1.5">
      <h4 className="text-[13px] font-semibold">Bloklar</h4>
      <span className="text-[11px] text-foreground/45">{zones.length} ta</span>
    </div>
    <div className="flex flex-col gap-0.5 overflow-y-auto pr-0.5">
      {zones.length === 0 && <p className="px-2 py-4 text-center text-xs text-foreground/40">Blok yo'q</p>}
      {zones.map((a) => {
        const st = FIRE_STATUS[a.status];
        const isActive = activeId === a.id;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(isActive ? null : a.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors",
              isActive ? "bg-card" : "hover:bg-card/60",
            )}
          >
            <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: st.color }} />
            <span className="flex-1 truncate text-[13px] font-medium">{a.name}</span>
            {a.info.fires > 0 && (
              <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-rose-400">
                <Flame className="size-3" /> {a.info.fires}
              </span>
            )}
            <span className="flex shrink-0 items-center gap-0.5 text-[11px] tabular-nums text-foreground/50">
              <Video className="size-3" /> {a.info.camerasOnline}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default FvvZonesPanel;
