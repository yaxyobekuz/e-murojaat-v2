// FVV operativ xarita — yo'llar chizilgan shahar, Pajar mashinasi doimiy harakatda.
// Tepada joriy missiya (qaysi honadonga, nima maqsadda). Honadon bosilsa — ma'lumot.
import useObjectState from "@/shared/hooks/useObjectState";
import { MAP_PLACE_LABEL, getHousehold, HOUSEHOLDS } from "../mock/fvv.cityMap";
import FvvCityMap from "../components/map/FvvCityMap";
import FvvHouseholdCard from "../components/map/FvvHouseholdCard";
import FvvMissionBanner from "../components/overlay/FvvMissionBanner";

const FvvMapPage = () => {
  const { activeHouseId, mission, eta, setField } = useObjectState({
    activeHouseId: null,
    mission: null,
    eta: null,
  });

  const activeHouse = getHousehold(activeHouseId);

  return (
    <div className="relative h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card">
      {/* Fon — animatsiyali shahar xaritasi */}
      <div className="absolute inset-0">
        <FvvCityMap
          activeHouseId={activeHouseId}
          onSelectHouse={(id) => setField("activeHouseId", id === activeHouseId ? null : id)}
          onMission={(m) => setField("mission", m)}
          onEta={(sec) => setField("eta", sec)}
        />
      </div>

      {/* Tepa overlay — sarlavha + joriy missiya */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-4">
        <div className="pointer-events-auto flex flex-wrap items-start justify-between gap-3">
          <div className="surface-overlay rounded-xl px-3 py-2">
            <h1 className="text-sm font-semibold tracking-tight">FVV — operativ xarita</h1>
            <p className="text-[11px] text-foreground/55">{MAP_PLACE_LABEL}</p>
          </div>
          <div className="pointer-events-auto max-w-[340px]">
            <FvvMissionBanner mission={mission} eta={eta} />
          </div>
        </div>
      </div>

      {/* Pastki overlay — honadonlar ro'yxati (tez tanlash) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-start p-4">
        <div className="surface-overlay pointer-events-auto flex max-h-[200px] w-64 flex-col rounded-xl p-2">
          <div className="px-2 py-1.5 text-[13px] font-semibold">Honadonlar</div>
          <div className="flex flex-col gap-0.5 overflow-y-auto pr-0.5">
            {HOUSEHOLDS.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setField("activeHouseId", h.id === activeHouseId ? null : h.id)}
                className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  activeHouseId === h.id ? "bg-card" : "hover:bg-card/60"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium">{h.head}</span>
                  <span className="block truncate text-[10.5px] text-foreground/45">{h.address}</span>
                </span>
                <span className="shrink-0 text-[11px] tabular-nums text-cyan-300">{h.residents}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tanlangan honadon — ma'lumot kartasi */}
      <FvvHouseholdCard household={activeHouse} onClose={() => setField("activeHouseId", null)} />
    </div>
  );
};

export default FvvMapPage;
