// Xarita ustida suzuvchi hududlar paneli — qatorni bossang xarita o'sha hududga
// uchadi (onSelect). Filtr (statusFilter) va tanlov (activeId) bilan bog'langan.
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import { TAX_STATUS } from "../../mock/soliq.mapAreas";

const SoliqZonesPanel = ({ zones, activeId, onSelect }) => (
  <div className="surface-overlay flex max-h-[240px] w-72 flex-col rounded-xl p-2">
    <div className="flex items-center justify-between px-2 py-1.5">
      <h4 className="text-[13px] font-semibold">Hududlar</h4>
      <span className="text-[11px] text-foreground/45">{zones.length} ta</span>
    </div>
    <div className="flex flex-col gap-0.5 overflow-y-auto pr-0.5">
      {zones.length === 0 && (
        <p className="px-2 py-4 text-center text-xs text-foreground/40">Hudud yo'q</p>
      )}
      {zones.map((a) => {
        const st = TAX_STATUS[a.status];
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
            <span className="shrink-0 text-[12px] tabular-nums text-foreground/55">
              {a.info.debtUzs > 0 ? formatMoney(a.info.debtUzs) : "—"}
            </span>
            <span
              className="shrink-0 text-[12px] font-semibold tabular-nums"
              style={{ color: st.color }}
            >
              {a.info.collectionRate}%
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default SoliqZonesPanel;
