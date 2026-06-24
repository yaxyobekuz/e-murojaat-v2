// Obodonlashtirish analitikasi — xarita to'liq fon. Default: faqat qurilish
// (jarayonda) joylari animatsiyali marker bilan. "Yashil maydonlar" tugmasi
// bosilganda yashil zonalar + daraxt soni qo'shiladi.
import { TreePine } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import useObjectState from "@/shared/hooks/useObjectState";
import { OBOD_PROJECTS, isConstruction, obodSummary } from "../mock/obod.projects";
import ObodMapBackground from "../components/map/ObodMapBackground";
import ObodKpiOverlay from "../components/overlay/ObodKpiOverlay";
import ObodProjectsPanel from "../components/overlay/ObodProjectsPanel";

// Pastki panel — qurilish ketayotgan loyihalar (asosiy diqqat)
const constructionProjects = OBOD_PROJECTS.filter(isConstruction);

const ObodDashboardPage = () => {
  const { showGreen, activeId, setField } = useObjectState({
    showGreen: false,
    activeId: null,
  });

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      <div className="absolute inset-0">
        <ObodMapBackground
          showGreen={showGreen}
          activeId={activeId}
          onSelect={(id) => setField("activeId", id)}
        />
      </div>

      {/* Tepa overlay — sarlavha + KPI + yashil maydon tugmasi */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div className="surface-overlay rounded-xl px-3 py-2">
            <h1 className="text-sm font-semibold tracking-tight">Obodonlashtirish analitikasi</h1>
            <p className="text-[11px] text-foreground/55">Baliqchi tumani, Andijon</p>
          </div>
          <button
            type="button"
            onClick={() => setField("showGreen", !showGreen)}
            aria-pressed={showGreen}
            className={cn(
              "pointer-events-auto flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-medium transition-colors",
              showGreen
                ? "border-transparent bg-emerald-600 text-foreground"
                : "surface-overlay text-foreground/75 hover:text-foreground",
            )}
          >
            <TreePine className="size-4" />
            {showGreen ? "Yashil maydonlar yoqilgan" : "Yashil maydonlarni ko'rish"}
          </button>
        </div>
        <div className="pointer-events-auto">
          <ObodKpiOverlay summary={obodSummary} />
        </div>
      </div>

      {/* Pastki overlay — qurilish loyihalari paneli */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-4">
        <div className="pointer-events-auto">
          <ObodProjectsPanel
            title="Qurilish ketayotgan joylar"
            projects={constructionProjects}
            activeId={activeId}
            onSelect={(id) => setField("activeId", id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ObodDashboardPage;
