// Andijon shahri 3D xaritasi (Mapbox GL) — uylar real bino izlari sifatida 3D ko'tariladi.
// Binoni bosib ma'lumotini ko'rish mumkin. Erkin zoom/pan/orbit. Tanlangan bino oqaradi.
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, MapPinned, Maximize, Crosshair, Orbit } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import useObjectState from "@/shared/hooks/useObjectState";
import { MAPBOX_TOKEN, INITIAL_VIEW, BASEMAPS } from "../data/mapConfig";
import { LAYER, setupLayers } from "../data/mapLayers";
import { attachInteractions } from "../data/mapInteractions";

const styleOf = (id) => BASEMAPS.find((b) => b.id === id)?.style;

const MahallaMap = ({ selectedId, onSelect, onHover }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const interactRef = useRef(null);
  const wiredRef = useRef(false);
  const { state, setField } = useObjectState({
    status: MAPBOX_TOKEN ? "loading" : "error",
  });

  useEffect(() => {
    if (!MAPBOX_TOKEN || !hostRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: hostRef.current,
      ...INITIAL_VIEW,
      style: styleOf("dark"),
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("style.load", () => {
      setupLayers(map);
      if (!wiredRef.current) {
        wiredRef.current = true;
        interactRef.current = attachInteractions(map, { onPick: onSelect, onHover });
        setField("status", "ready");
      }
    });
    map.on("error", (e) => console.error("Mapbox xato:", e?.error || e));

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tashqaridan tanlov bekor qilinsa — bino holatini ham tozalaymiz
  useEffect(() => {
    if (!selectedId && interactRef.current) interactRef.current.clearSelection();
  }, [selectedId]);

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
            <p className="text-xs">VITE_MAPBOX_TOKEN sozlamasini tekshiring</p>
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
