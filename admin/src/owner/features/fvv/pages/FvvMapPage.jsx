// FVV operativ xarita — IIB blok SHAKLI + honadon/bino markerlari + yo'llar (blok
// chegaralaridan). Yong'in mashinasi real tezlikda yuradi (holat + ETA tepada).
// Blok bosilsa — yaqin kameralar; honadon bosilsa — bino ma'lumoti.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAHALLA_AREAS, MAP_PLACE_LABEL, summarize, getHousehold } from "../mock/fvv.mapAreas";
import FvvAreaMap from "../components/map/FvvAreaMap";
import FvvCameraPanel from "../components/map/FvvCameraPanel";
import FvvHouseholdCard from "../components/map/FvvHouseholdCard";
import FvvStatusFilter from "../components/FvvStatusFilter";
import FvvKpiOverlay from "../components/overlay/FvvKpiOverlay";
import FvvTruckStatus from "../components/overlay/FvvTruckStatus";

const FvvMapPage = () => {
  const { statusFilter, activeId, houseId, truck, setField } = useObjectState({
    statusFilter: [],
    activeId: null,
    houseId: null,
    truck: null,
  });

  const toggleStatus = (key) =>
    setField("statusFilter", statusFilter.includes(key) ? statusFilter.filter((s) => s !== key) : [...statusFilter, key]);

  const zones = useMemo(
    () => (statusFilter.length === 0 ? MAHALLA_AREAS : MAHALLA_AREAS.filter((a) => statusFilter.includes(a.status))),
    [statusFilter],
  );
  const summary = useMemo(() => summarize(zones), [zones]);
  const activeArea = useMemo(() => MAHALLA_AREAS.find((a) => a.id === activeId) || null, [activeId]);
  const activeHouse = getHousehold(houseId);

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      {/* Fon — xarita */}
      <div className="absolute inset-0 p-2">
        <FvvAreaMap
          active={activeArea}
          statusFilter={statusFilter}
          onSelect={(a) => setField("activeId", a.id === activeId ? null : a.id)}
          onSelectHouse={(id) => setField("houseId", id === houseId ? null : id)}
          onStatus={(s) => setField("truck", s)}
        />
      </div>

      {/* Tepa overlay — sarlavha + truck holati + KPI + filtr */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div className="surface-overlay rounded-xl px-3 py-2">
            <h1 className="text-sm font-semibold tracking-tight">FVV — operativ xarita</h1>
            <p className="text-[11px] text-foreground/55">{MAP_PLACE_LABEL}</p>
          </div>
          <div className="pointer-events-auto">
            <FvvStatusFilter active={statusFilter} onToggle={toggleStatus} />
          </div>
        </div>
        <div className="pointer-events-auto flex flex-wrap items-start gap-3">
          <FvvTruckStatus status={truck} />
          <FvvKpiOverlay summary={summary} />
        </div>
      </div>

      {/* Tanlangan blok — yaqin kameralar */}
      <FvvCameraPanel area={activeArea} onClose={() => setField("activeId", null)} />
      {/* Tanlangan honadon — bino ma'lumoti */}
      <FvvHouseholdCard household={activeHouse} onClose={() => setField("houseId", null)} />
    </div>
  );
};

export default FvvMapPage;
