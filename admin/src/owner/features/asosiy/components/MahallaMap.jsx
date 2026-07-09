// Sarnovul mahallasi 3D xaritasi (MapLibre GL + OpenStreetMap) — uylar bino izlari sifatida 3D ko'tariladi.
// Binoni bosib ma'lumotini ko'rish mumkin. Erkin zoom/pan/orbit. Tanlangan bino oqaradi.
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, MapPinned, Maximize, Crosshair, Orbit } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import useObjectState from "@/shared/hooks/useObjectState";
import { INITIAL_VIEW, BASEMAPS } from "../data/mapConfig";
import { LAYER, OSM_SOURCE, setupLayers } from "../data/mapLayers";
import { attachInteractions } from "../data/mapInteractions";
import { useHousesQuery } from "../hooks/useHousesQuery";

const styleOf = (id) => BASEMAPS.find((b) => b.id === id)?.style;

// showEntered — kiritilgan uylarni oltin rangda belgilash (faqat boshqaruv editorida true)
const MahallaMap = ({ selectedId, activeFilter, onSelect, onHover, showEntered = false }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const interactRef = useRef(null);
  const wiredRef = useRef(false);
  const { state, setField } = useObjectState({
    status: "loading",
  });

  useEffect(() => {
    if (!hostRef.current) return;

    const map = new maplibregl.Map({
      container: hostRef.current,
      ...INITIAL_VIEW,
      style: styleOf("dark"),
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("style.load", () => {
      setupLayers(map);
      if (!wiredRef.current) {
        wiredRef.current = true;
        interactRef.current = attachInteractions(map, { onPick: onSelect, onHover });
        setField("status", "ready");
      }
    });
    map.on("error", (e) => {
      console.error("Xarita xato:", e?.error || e);
      // style hali yuklanmagan bo'lsa — xarita ochilmadi deb hisoblaymiz
      if (!wiredRef.current) setField("status", "error");
    });

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tashqaridan tanlov bekor qilinsa — bino holatini ham tozalaymiz
  useEffect(() => {
    if (!selectedId && interactRef.current) interactRef.current.clearSelection();
  }, [selectedId]);

  // server'da ma'lumoti bor xonadonlarni oltin rangda belgilaymiz (faqat editor rejimida)
  const { data: houses } = useHousesQuery({ enabled: showEntered });
  useEffect(() => {
    const map = mapRef.current;
    if (!showEntered || state.status !== "ready" || !map) return;
    const ids = new Set((houses || []).map((h) => String(h.osmId)));
    const applied = new Set();
    // o'chirilgan yozuvlar tozalansin — maplibre'da key bo'yicha ommaviy remove yo'q, id talab qiladi
    if (map.getSource(OSM_SOURCE)) {
      for (const f of map.querySourceFeatures(OSM_SOURCE)) {
        if (f.id != null) map.removeFeatureState({ source: OSM_SOURCE, id: f.id }, "real");
      }
    }
    const apply = () => {
      if (!map.getSource(OSM_SOURCE)) return;
      for (const f of map.querySourceFeatures(OSM_SOURCE)) {
        if (f.id == null || applied.has(f.id)) continue;
        if (f.properties?.osmId && ids.has(String(f.properties.osmId))) {
          map.setFeatureState({ source: OSM_SOURCE, id: f.id }, { real: true });
          applied.add(f.id);
        }
      }
    };
    const onRefresh = () => {
      applied.clear();
      apply();
    };
    apply();
    map.on("idle", apply); // pan/zoom'da yangi tile'larga ham qo'llanadi
    map.on("buildings:refreshed", onRefresh);
    return () => {
      map.off("idle", apply);
      map.off("buildings:refreshed", onRefresh);
    };
  }, [houses, state.status, showEntered]);

  // faol filter o'zgarsa — xaritani status rangiga bo'yaymiz
  useEffect(() => {
    if (state.status === "ready") interactRef.current?.applyFilter(activeFilter);
  }, [activeFilter, state.status]);

  const orbit = () => {
    const map = mapRef.current;
    if (map) map.easeTo({ bearing: map.getBearing() + 360, duration: 32000, easing: (t) => t });
  };
  const reset = () => {
    onSelect(null);
    mapRef.current?.flyTo({ ...INITIAL_VIEW, essential: true, duration: 1600 });
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(130% 130% at 50% 0%, rgba(34,211,238,.08), transparent 55%), radial-gradient(100% 100% at 80% 90%, rgba(168,85,247,.06), transparent 60%), #06080d",
      }}
    >
      <div ref={hostRef} className="h-full w-full" />

      {/* chap panel — kamera boshqaruvi (vertikal markazda) */}
      {state.status === "ready" && (
        <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
          <MapBtn onClick={reset} title="Hammasini ko'rsatish"><Maximize className="size-4" /></MapBtn>
          <MapBtn onClick={orbit} title="Aylantirish"><Orbit className="size-4" /></MapBtn>
          {selectedId && (
            <MapBtn onClick={() => onSelect(null)} title="Tanlovni tozalash" accent><Crosshair className="size-4" /></MapBtn>
          )}
        </div>
      )}

      {state.status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-cyan-400" />
            <p className="text-xs">3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <MapPinned className="size-7 text-foreground/30" />
            <p className="text-sm">Xaritani yuklab bo'lmadi</p>
            <p className="text-xs">OpenStreetMap manbasiga ulanib bo'lmadi — internetni tekshiring</p>
          </div>
        </div>
      )}
    </div>
  );
};

function MapBtn({ onClick, title, accent, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "grid size-9 place-items-center rounded-xl border backdrop-blur-md transition-colors",
        accent
          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
          : "border-[rgb(var(--card-border))] bg-card/60 text-foreground/70 hover:bg-card/90 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default MahallaMap;
