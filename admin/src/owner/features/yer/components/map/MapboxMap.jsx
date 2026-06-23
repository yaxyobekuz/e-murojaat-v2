// Mapbox GL 3D cadastre map: extruded parcels + buildings, terrain, heatmap,
// basemap switching and click-to-inspect. Heavy bits live in ./map* helpers.
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, MapPinned } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAPBOX_TOKEN, BASEMAPS, INITIAL_VIEW } from "./mapConfig";
import { LAYER, setupLayers } from "./mapLayers";
import { attachInteractions } from "./mapInteractions";
import { addGovMarkers } from "./govMarkers";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";
import MapInfoCard from "./MapInfoCard";

const styleOf = (id) => BASEMAPS.find((b) => b.id === id)?.style;

const MapboxMap = () => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const wiredRef = useRef(false);
  const { state, setField, setFields } = useObjectState({
    status: MAPBOX_TOKEN ? "loading" : "error",
    active: null,
    visibleCount: null,
    layers: { buildings: true, terrain: true },
  });
  const layersRef = useRef(state.layers);

  const applyVisibility = (map) => {
    const L = layersRef.current;
    if (map.getLayer(LAYER.buildings)) {
      map.setLayoutProperty(LAYER.buildings, "visibility", L.buildings ? "visible" : "none");
    }
    map.setTerrain(L.terrain ? { source: "mapbox-dem", exaggeration: 1.2 } : null);
  };

  const refreshCount = (map) => {
    if (!map.getLayer(LAYER.buildings)) return;
    const n = map.queryRenderedFeatures({ layers: [LAYER.buildings] }).length;
    setField("visibleCount", n);
  };

  useEffect(() => {
    if (!MAPBOX_TOKEN || !hostRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({ container: hostRef.current, ...INITIAL_VIEW, style: styleOf("satellite") });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");
    map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-left");

    map.on("style.load", () => {
      setupLayers(map);
      applyVisibility(map);
      refreshCount(map);
      if (!wiredRef.current) {
        wiredRef.current = true;
        addGovMarkers(map, (m) => setField("active", m));
        attachInteractions(map, (m) => setField("active", m));
        map.on("idle", () => refreshCount(map));
        setField("status", "ready");
      }
    });
    map.on("error", (e) => console.error("Mapbox xato:", e?.error || e));

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (key) => {
    const layers = { ...layersRef.current, [key]: !layersRef.current[key] };
    layersRef.current = layers;
    setField("layers", layers);
    if (mapRef.current) applyVisibility(mapRef.current);
  };

  const orbit = () => {
    const map = mapRef.current;
    if (map) map.easeTo({ bearing: map.getBearing() + 360, duration: 32000, easing: (t) => t });
  };
  const reset = () => mapRef.current?.flyTo({ ...INITIAL_VIEW, essential: true, duration: 1600 });

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" />

      {state.status !== "error" && (
        <>
          <MapControls
            layers={state.layers}
            onToggle={toggle}
            onOrbit={orbit}
            onReset={reset}
          />
          <MapLegend visibleCount={state.visibleCount} />
          <MapInfoCard
            key={state.active ? `${state.active.info.lng},${state.active.info.lat}` : "none"}
            marker={state.active}
            onClose={() => setFields({ active: null })}
          />
        </>
      )}

      {state.status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-brand-purple" />
            <p className="text-xs">3D kadastr xaritasi yuklanmoqda…</p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <MapPinned className="size-7 text-foreground/30" />
            <p className="text-sm">Xaritani yuklab bo'lmadi</p>
            <p className="text-xs">VITE_MAPBOX_TOKEN .env faylida ko'rsatilganini tekshiring</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
