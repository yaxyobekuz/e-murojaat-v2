// IIB operativ xarita — xarita to'liq fon, ustida suzuvchi panellar (KPI + filtr
// tepada, bloklar paneli pastda). Blok tanlanganda — kamera yozuvlari paneli.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAHALLA_AREAS, MAP_PLACE_LABEL, summarize } from "../mock/iib.mapAreas";
import IibOperativeMap from "../components/map/IibOperativeMap";
import IibCameraPanel from "../components/map/IibCameraPanel";
import IibStatusFilter from "../components/IibStatusFilter";
import IibKpiOverlay from "../components/overlay/IibKpiOverlay";
import IibZonesPanel from "../components/overlay/IibZonesPanel";

const IibMapPage = () => {
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

  const zones = useMemo(
    () =>
      statusFilter.length === 0
        ? MAHALLA_AREAS
        : MAHALLA_AREAS.filter((a) => statusFilter.includes(a.status)),
    [statusFilter],
  );
  const summary = useMemo(() => summarize(zones), [zones]);
  const activeArea = useMemo(
    () => MAHALLA_AREAS.find((a) => a.id === activeId) || null,
    [activeId],
  );

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      {/* Fon — xarita */}
      <div className="absolute inset-0">
        <IibOperativeMap
          statusFilter={statusFilter}
          activeId={activeId}
          onSelect={(id) => setField("activeId", id)}
        />
      </div>

      {/* Tepa overlay — sarlavha + KPI + filtr */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div className="surface-overlay rounded-xl px-3 py-2">
            <h1 className="text-sm font-semibold tracking-tight">IIB — operativ xarita</h1>
            <p className="text-[11px] text-foreground/55">{MAP_PLACE_LABEL}</p>
          </div>
          <div className="pointer-events-auto">
            <IibStatusFilter active={statusFilter} onToggle={toggleStatus} />
          </div>
        </div>
        <div className="pointer-events-auto">
          <IibKpiOverlay summary={summary} />
        </div>
      </div>

      {/* Pastki overlay — bloklar paneli */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-4">
        <div className="pointer-events-auto">
          <IibZonesPanel
            zones={zones}
            activeId={activeId}
            onSelect={(id) => setField("activeId", id)}
          />
        </div>
      </div>

      {/* Tanlangan blok — kamera yozuvlari */}
      <IibCameraPanel area={activeArea} onClose={() => setField("activeId", null)} />
    </div>
  );
};

export default IibMapPage;
