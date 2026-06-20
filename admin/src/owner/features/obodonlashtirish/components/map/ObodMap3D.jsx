// Photorealistic 3D obodonlashtirish xaritasi — loyiha zonalari holat rangida
// (ko'k rejada / amber jarayonda / yashil yakunlangan). Boshqariladi (controlled):
//   - statusFilter: tanlangan holatlar; mos kelmaganlar xiralashadi
//   - activeId + onSelect: tanlangan loyiha (panel bilan bog'langan), kamera uchadi
// API kalit yo'q/xato bo'lsa — SVG fallback'ga o'tadi.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps3d.loader";
import { MAP_CENTER, OBOD_PROJECTS, PROJECT_STATUS } from "../../mock/obod.projects";
import ObodMapInfoCard from "./ObodMapInfoCard";
import ObodMapFallback from "./ObodMapFallback";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 66, range: 1300, heading: 20 };

const hexToRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const centroid = (path) => ({
  lat: path.reduce((s, p) => s + p.lat, 0) / path.length,
  lng: path.reduce((s, p) => s + p.lng, 0) / path.length,
});

const ObodMap3D = ({ statusFilter = [], activeId = null, onSelect }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const polysRef = useRef({});
  const [status, setStatus] = useState("loading"); // loading | ready | fallback

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;

        const { Map3DElement, Polygon3DInteractiveElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        OBOD_PROJECTS.forEach((p) => {
          const color = PROJECT_STATUS[p.status].color;
          const ring = p.path.map((q) => ({ ...q, altitude: 0 }));
          const poly = new Polygon3DInteractiveElement({
            outerCoordinates: ring,
            altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba(color, 0.45),
            strokeColor: color,
            strokeWidth: 4,
            drawsOccludedSegments: false,
          });
          poly.addEventListener("gmp-click", () => onSelect?.(p.id));
          map.append(poly);
          polysRef.current[p.id] = poly;
        });

        setStatus("ready");
      } catch (err) {
        console.warn("Obod 3D xarita yuklanmadi, fallback ko'rsatiladi.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtr + tanlovga qarab poligon ko'rinishini yangilash
  useEffect(() => {
    if (status !== "ready") return;
    OBOD_PROJECTS.forEach((p) => {
      const poly = polysRef.current[p.id];
      if (!poly) return;
      const color = PROJECT_STATUS[p.status].color;
      const visible = statusFilter.length === 0 || statusFilter.includes(p.status);
      const isActive = activeId === p.id;
      poly.fillColor = hexToRgba(color, !visible ? 0.06 : isActive ? 0.7 : 0.45);
      poly.strokeColor = !visible ? hexToRgba(color, 0.3) : color;
      poly.strokeWidth = isActive ? 7 : 4;
    });
  }, [statusFilter, activeId, status]);

  // Tanlangan loyihaga kamera uchadi
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const p = OBOD_PROJECTS.find((x) => x.id === activeId);
    if (!p) return;
    const c = centroid(p.path);
    mapRef.current.flyCameraTo({
      endCamera: { center: { ...c, altitude: GROUND_ALT }, tilt: 64, range: 700, heading: 20 },
      durationMillis: 1400,
    });
  }, [activeId, status]);

  const activeProject = OBOD_PROJECTS.find((p) => p.id === activeId) || null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-teal-500" />
            <p className="text-xs">Photorealistic 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "fallback" && (
        <div className="h-full w-full p-2">
          <ObodMapFallback
            active={activeProject}
            statusFilter={statusFilter}
            onSelect={(p) => onSelect?.(p.id)}
          />
        </div>
      )}

      <ObodMapInfoCard project={activeProject} onClose={() => onSelect?.(null)} />
    </div>
  );
};

export default ObodMap3D;
