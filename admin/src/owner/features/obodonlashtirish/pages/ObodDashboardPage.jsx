// Obodonlashtirish analitikasi — xarita to'liq fon, ustida suzuvchi panellar
// (KPI + filtr tepada, loyihalar paneli pastda). Filtr va tanlov hammasini bog'laydi.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { OBOD_PROJECTS, summarize } from "../mock/obod.projects";
import ObodMapBackground from "../components/map/ObodMapBackground";
import ObodStatusFilter from "../components/ObodStatusFilter";
import ObodKpiOverlay from "../components/overlay/ObodKpiOverlay";
import ObodProjectsPanel from "../components/overlay/ObodProjectsPanel";

const ObodDashboardPage = () => {
  const { statusFilter, activeId, setField } = useObjectState({
    statusFilter: [],
    activeId: null,
  });

  const toggleStatus = (key) =>
    setField(
      "statusFilter",
      statusFilter.includes(key)
        ? statusFilter.filter((s) => s !== key)
        : [...statusFilter, key],
    );

  const projects = useMemo(
    () =>
      statusFilter.length === 0
        ? OBOD_PROJECTS
        : OBOD_PROJECTS.filter((p) => statusFilter.includes(p.status)),
    [statusFilter],
  );
  const summary = useMemo(() => summarize(projects), [projects]);

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      <div className="absolute inset-0">
        <ObodMapBackground
          statusFilter={statusFilter}
          activeId={activeId}
          onSelect={(id) => setField("activeId", id)}
        />
      </div>

      {/* Tepa overlay — sarlavha + KPI + filtr */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div className="surface-overlay rounded-xl px-3 py-2">
            <h1 className="text-sm font-semibold tracking-tight">Obodonlashtirish analitikasi</h1>
            <p className="text-[11px] text-foreground/55">Baliqchi tumani, Andijon</p>
          </div>
          <div className="pointer-events-auto">
            <ObodStatusFilter active={statusFilter} onToggle={toggleStatus} />
          </div>
        </div>
        <div className="pointer-events-auto">
          <ObodKpiOverlay summary={summary} />
        </div>
      </div>

      {/* Pastki overlay — loyihalar paneli */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-4">
        <div className="pointer-events-auto">
          <ObodProjectsPanel
            projects={projects}
            activeId={activeId}
            onSelect={(id) => setField("activeId", id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ObodDashboardPage;
