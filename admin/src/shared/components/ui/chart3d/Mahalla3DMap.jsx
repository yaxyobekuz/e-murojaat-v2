import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { loadMaps3d } from "./maps3dLoader";
import { Map3DChart } from "./Map3DChart";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

// Photorealistik Google Maps 3D xarita (Obod/Soliq uslubi). Marker'lar + popup.
// API kalit bo'lmasa — echarts 3D shahar bloklari fallback.
export function Mahalla3DMap({
  center = { lat: 40.639, lng: 72.239 },
  markers = [],
  height = 360,
  fallbackSeed = 1234,
}) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | fallback
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;
        const { Map3DElement, Marker3DInteractiveElement, Marker3DElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({
          center: { ...center, altitude: 0 },
          tilt: 64,
          range: 1200,
          heading: 25,
          mode: MapMode.HYBRID,
        });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);

        const MarkerEl = Marker3DInteractiveElement || Marker3DElement;
        markers.forEach((m) => {
          try {
            const mk = new MarkerEl({
              position: { lat: m.lat, lng: m.lng, altitude: 30 },
              altitudeMode: AltitudeMode?.RELATIVE_TO_GROUND,
              label: m.label,
              extruded: true,
            });
            if (Marker3DInteractiveElement) {
              mk.addEventListener("gmp-click", () => setActive(m));
            }
            map.append(mk);
          } catch {
            /* ignore single marker */
          }
        });

        setStatus("ready");
      } catch (err) {
        console.warn("3D xarita yuklanmadi, fallback ko'rsatiladi.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-card" style={{ height }}>
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-cyan-400" />
            <p className="text-xs">Photorealistik 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "fallback" && (
        <div className="h-full w-full">
          <Map3DChart height={height} seed={fallbackSeed} hotspots={3} />
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/50 px-2.5 py-1.5 text-[11px] text-slate-300 backdrop-blur">
            3D xarita (demo) — Google Maps kaliti ulanmagan
          </div>
        </div>
      )}

      {active && (
        <div className="absolute right-3 top-3 w-52 rounded-xl border border-white/10 bg-black/70 p-3 text-white backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold">{active.label}</div>
            <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          {active.status && <div className="mt-1 text-xs text-slate-300">{active.status}</div>}
        </div>
      )}
    </div>
  );
}

export default Mahalla3DMap;
