// Soliq monitoringi — bizneslar xaritasi (to'liq ekran fon). Tepada KPI + filtr,
// pastda rejim paneli (Xarita/Ro'yxat/Issiqlik/Klaster) + legenda, biznes tanlansa
// o'ngda statistika paneli. Filtr/rejim/tanlov barcha qismlarni bog'laydi.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAHALLA_AREAS } from "../mock/soliq.mapAreas";
import {
  BUSINESSES,
  businessSummary,
  blockSummary,
  filterBusinesses,
} from "../mock/soliq.businesses";
import BusinessMapBackground from "../components/map/BusinessMapBackground";
import SoliqKpiRow from "../components/SoliqKpiRow";
import BusinessFilters from "../components/BusinessFilters";
import BusinessLegend from "../components/BusinessLegend";
import BusinessDetailPanel from "../components/BusinessDetailPanel";
import BlockDetailPanel from "../components/BlockDetailPanel";
import SoliqBottomBar from "../components/SoliqBottomBar";
import BusinessListOverlay from "../components/BusinessListOverlay";

const SoliqDashboardPage = () => {
  const { filters, mode, activeId, activeBlockId, setField, setFields } = useObjectState({
    filters: { large: false, debtor: false, isNew: false },
    mode: "map",
    activeId: null,
    activeBlockId: null,
  });

  const businesses = useMemo(() => filterBusinesses(BUSINESSES, filters), [filters]);
  const summary = useMemo(() => businessSummary(businesses), [businesses]);
  const active = useMemo(() => businesses.find((b) => b.id === activeId) || null, [businesses, activeId]);

  // tanlangan hudud yig'indisi (joriy filtrdagi bizneslar bo'yicha)
  const activeBlock = useMemo(() => {
    if (!activeBlockId) return null;
    const area = MAHALLA_AREAS.find((a) => a.id === activeBlockId);
    return area ? blockSummary(area.id, area.name, businesses) : null;
  }, [activeBlockId, businesses]);

  // biznes tanlash → hudud panelini yopadi; hudud tanlash → biznes panelini yopadi
  const selectBusiness = (id) => setFields({ activeId: id === activeId ? null : id, activeBlockId: null });
  const selectBlock = (id) => setFields({ activeBlockId: id === activeBlockId ? null : id, activeId: null });

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      {/* Fon — bizneslar xaritasi */}
      <div className="absolute inset-0">
        <BusinessMapBackground
          businesses={businesses}
          mode={mode === "list" ? "map" : mode}
          activeId={activeId}
          activeBlockId={activeBlockId}
          onSelect={selectBusiness}
          onSelectBlock={selectBlock}
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

      {/* Pastki chap — legenda (ro'yxat rejimida ro'yxat egallaydi, legenda yashiriladi) */}
      {mode !== "list" && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10">
          <div className="pointer-events-auto">
            <BusinessLegend />
          </div>
        </div>
      )}

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

      {/* O'ng — hudud statistikasi (hudud bosilganda; biznes paneli bilan birga chiqmaydi) */}
      {activeBlock && (
        <div className="pointer-events-none absolute right-4 top-4 z-20 max-h-[calc(100%-2rem)] overflow-y-auto">
          <div className="pointer-events-auto">
            <BlockDetailPanel
              summary={activeBlock}
              onClose={() => setField("activeBlockId", null)}
              onSelectBusiness={selectBusiness}
            />
          </div>
        </div>
      )}

      {/* Ro'yxat rejimi — chapda, filtr panelidan past boshlanadi (o'ngdagi detail bilan kesishmaydi) */}
      {mode === "list" && (
        <div className="pointer-events-none absolute bottom-20 left-4 top-[230px] z-10">
          <div className="pointer-events-auto h-full">
            <BusinessListOverlay
              businesses={businesses}
              activeId={activeId}
              onSelect={selectBusiness}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SoliqDashboardPage;
