// Xarita ustida suzuvchi loyihalar paneli — qatorni bossang xarita o'sha loyihaga
// uchadi. Filtr (statusFilter) va tanlov (activeId) bilan bog'langan.
import { cn } from "@/shared/utils/cn";
import { PROJECT_STATUS } from "../../mock/obod.projects";

const ObodProjectsPanel = ({ projects, activeId, onSelect }) => (
  <div className="surface-overlay flex max-h-[260px] w-80 flex-col rounded-xl p-2">
    <div className="flex items-center justify-between px-2 py-1.5">
      <h4 className="text-[13px] font-semibold">Loyihalar</h4>
      <span className="text-[11px] text-foreground/45">{projects.length} ta</span>
    </div>
    <div className="flex flex-col gap-0.5 overflow-y-auto pr-0.5">
      {projects.length === 0 && (
        <p className="px-2 py-4 text-center text-xs text-foreground/40">Loyiha yo'q</p>
      )}
      {projects.map((p) => {
        const st = PROJECT_STATUS[p.status];
        const isActive = activeId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(isActive ? null : p.id)}
            className={cn(
              "flex flex-col gap-1 rounded-lg px-2 py-1.5 text-left transition-colors",
              isActive ? "bg-card" : "hover:bg-card/60",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: st.color }} />
              <span className="flex-1 truncate text-[13px] font-medium">{p.name}</span>
              <span
                className="shrink-0 text-[12px] font-semibold tabular-nums"
                style={{ color: st.color }}
              >
                {p.info.progress}%
              </span>
            </div>
            <div className="ml-[18px] h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{ width: `${p.info.progress}%`, backgroundColor: st.color }}
              />
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default ObodProjectsPanel;
