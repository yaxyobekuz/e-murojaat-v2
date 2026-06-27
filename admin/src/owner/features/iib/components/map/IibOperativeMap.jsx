// IIB operativ xarita — bloklar holat rangida (poligon) + hodisa nuqtalari (marker).
// Boshqariladi: statusFilter (filtr), activeId + onSelect (tanlangan blok → kamera).
// API kalit yo'q/xato bo'lsa — SVG fallback'ga o'tadi.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "@/shared/components/ui/chart3d/maps3dLoader";
import { MAP_CENTER, MAHALLA_AREAS, SECURITY_STATUS, INCIDENT_TYPES } from "../../mock/iib.mapAreas";
import IibMapFallback from "./IibMapFallback";

const API_KEY = "AIzaSyAzevS5emLN3BTdUOIN6tmK6Din6aG7DjY";

const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 66, range: 1400, heading: 20 };

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

const IibOperativeMap = ({ statusFilter = [], activeId = null, onSelect }) => {
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
        const { Map3DElement, Polygon3DInteractiveElement, Marker3DInteractiveElement, Marker3DElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        MAHALLA_AREAS.forEach((a) => {
          const color = SECURITY_STATUS[a.status].color;
          const ring = a.path.map((p) => ({ ...p, altitude: 0 }));
          const poly = new Polygon3DInteractiveElement({
            outerCoordinates: ring,
            altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba(color, 0.42),
            strokeColor: color,
            strokeWidth: 4,
            drawsOccludedSegments: false,
          });
          poly.addEventListener("gmp-click", () => onSelect?.(a.id));
          map.append(poly);
          polysRef.current[a.id] = poly;

          // Hodisa nuqtalari (marker)
          const MarkerEl = Marker3DInteractiveElement || Marker3DElement;
          a.incidents.forEach((inc) => {
            try {
              const mk = new MarkerEl({
                position: { lat: inc.pos.lat, lng: inc.pos.lng, altitude: 40 },
                altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
                label: INCIDENT_TYPES[inc.type]?.label || "Hodisa",
                extruded: true,
              });
              if (Marker3DInteractiveElement) mk.addEventListener("gmp-click", () => onSelect?.(a.id));
              map.append(mk);
            } catch {
              /* ignore single marker */
            }
          });
        });

        setStatus("ready");
      } catch (err) {
        console.warn("IIB 3D xarita yuklanmadi, fallback ko'rsatiladi.", err?.message);
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
    MAHALLA_AREAS.forEach((a) => {
      const poly = polysRef.current[a.id];
      if (!poly) return;
      const color = SECURITY_STATUS[a.status].color;
      const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
      const isActive = activeId === a.id;
      const fillA = !visible ? 0.05 : isActive ? 0.7 : 0.42;
      poly.fillColor = hexToRgba(color, fillA);
      poly.strokeColor = !visible ? hexToRgba(color, 0.3) : color;
      poly.strokeWidth = isActive ? 7 : 4;
    });
  }, [statusFilter, activeId, status]);

  // Tanlangan blokka kamera uchib boradi
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const area = MAHALLA_AREAS.find((a) => a.id === activeId);
    if (!area) return;
    const c = centroid(area.path);
    mapRef.current.flyCameraTo({
      endCamera: { center: { ...c, altitude: GROUND_ALT }, tilt: 64, range: 600, heading: 20 },
      durationMillis: 1400,
    });
  }, [activeId, status]);

  const activeArea = MAHALLA_AREAS.find((a) => a.id === activeId) || null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-indigo-500" />
            <p className="text-xs">Operativ xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "fallback" && (
        <div className="h-full w-full p-2">
          <IibMapFallback active={activeArea} statusFilter={statusFilter} onSelect={(a) => onSelect?.(a.id)} />
        </div>
      )}
    </div>
  );
};

export default IibOperativeMap;
