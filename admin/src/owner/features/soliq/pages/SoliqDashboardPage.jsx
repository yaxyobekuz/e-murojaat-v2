// Soliq monitoringi — bizneslar xaritasi (to'liq ekran fon). Tepada KPI + filtr,
// pastda rejim paneli (Xarita/Ro'yxat/Issiqlik/Klaster) + legenda, biznes tanlansa
// o'ngda statistika paneli. Filtr/rejim/tanlov barcha qismlarni bog'laydi.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { BUSINESSES, businessSummary, filterBusinesses } from "../mock/soliq.businesses";
import BusinessMapBackground from "../components/map/BusinessMapBackground";
import SoliqKpiRow from "../components/SoliqKpiRow";
import BusinessFilters from "../components/BusinessFilters";
import BusinessLegend from "../components/BusinessLegend";
import BusinessDetailPanel from "../components/BusinessDetailPanel";
import SoliqBottomBar from "../components/SoliqBottomBar";
import BusinessListOverlay from "../components/BusinessListOverlay";

const SoliqDashboardPage = () => {
  const { filters, mode, activeId, setField } = useObjectState({
    filters: { large: false, debtor: false, isNew: false },
    mode: "map",
    activeId: null,
  });

  const businesses = useMemo(() => filterBusinesses(BUSINESSES, filters), [filters]);
  const summary = useMemo(() => businessSummary(businesses), [businesses]);
  const active = useMemo(() => businesses.find((b) => b.id === activeId) || null, [businesses, activeId]);

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      {/* Fon — bizneslar xaritasi */}
      <div className="absolute inset-0">
        <BusinessMapBackground
          businesses={businesses}
          mode={mode === "list" ? "map" : mode}
          activeId={activeId}
          onSelect={(id) => setField("activeId", id === activeId ? null : id)}
        />
      </div>

      {/* Tepa overlay — sarlavha + KPI + filtr */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto surface-overlay w-fit rounded-xl px-3 py-2">
          <h1 className="text-sm font-semibold tracking-tight">Soliq monitoringi</h1>
          <p className="text-[11px] text-foreground/55">Sarnovul MFY, Baliqchi tumani, Andijon</p>
        </div>
        <div className="pointer-events-auto">
          <SoliqKpiRow summary={summary} />
        </div>
        <div className="pointer-events-auto w-fit">
          <BusinessFilters filters={filters} onChange={(f) => setField("filters", f)} />
        </div>
      </div>

      {/* Pastki chap — legenda */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10">
        <div className="pointer-events-auto">
          <BusinessLegend />
        </div>
      </div>

      {/* Pastki markaz — rejim paneli */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center">
        <div className="pointer-events-auto">
          <SoliqBottomBar mode={mode} onChange={(m) => setField("mode", m)} />
        </div>
      </div>

      {/* O'ng — biznes statistikasi (tanlanganda) */}
      {active && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 max-h-[calc(100%-2rem)] overflow-y-auto">
          <div className="pointer-events-auto">
            <BusinessDetailPanel business={active} onClose={() => setField("activeId", null)} />
          </div>
        </div>
      )}

      {/* Ro'yxat rejimi — xarita ustida panel */}
      {mode === "list" && (
        <div className="pointer-events-none absolute inset-0 z-30 flex justify-end p-4 pt-[230px]">
          <div className="pointer-events-auto">
            <BusinessListOverlay
              businesses={businesses}
              activeId={activeId}
              onSelect={(id) => setField("activeId", id)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoliqDashboardPage;
