// Photorealistic 3D soliq xaritasi — oq 3D shahar ustida hududlar rangli, ko'tarilgan
// (extruded) poligonlar bilan belgilanadi: yashil to'lagan, sariq chala, qizil qarzdor.
// Blok bosilsa info card. API kalit yo'q/xato bo'lsa — SVG fallback'ga o'tadi.
import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCw } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps3d.loader";
import { MAP_CENTER, MAHALLA_AREAS, TAX_STATUS } from "../../mock/soliq.mapAreas";
import SoliqMapInfoCard from "./SoliqMapInfoCard";
import SoliqMapFallback from "./SoliqMapFallback";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

// Baliqchi yer balandligi (~440m). Kamera shu nuqtaga qaraydi.
const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 70, range: 1200, heading: 25 };

// Hex (#16a34a) -> "rgba(r,g,b,a)" (Polygon3D fillColor uchun)
const hexToRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const startOrbit = (map) => {
  map.flyCameraAround({
    camera: { center: LOOK_AT, ...CAMERA },
    durationMillis: 60000,
    rounds: 1,
  });
};

const SoliqMap3D = () => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | fallback
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;

        const { Map3DElement, Polygon3DInteractiveElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({
          center: LOOK_AT,
          ...CAMERA,
          mode: MapMode.HYBRID,
        });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        // Har blok — yerga yopishgan rangli hudud belgisi (extruded quti emas).
        // Poligon yer yuzasiga to'shaladi, qalin oq chegara bilan — xuddi
        // hududni qo'lda belgilaganday ko'rinadi.
        MAHALLA_AREAS.forEach((a) => {
          const color = TAX_STATUS[a.status].color;
          const ring = a.path.map((p) => ({ ...p, altitude: 0 }));

          const poly = new Polygon3DInteractiveElement({
            outerCoordinates: ring,
            altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba(color, 0.45),
            strokeColor: color,
            strokeWidth: 4,
            drawsOccludedSegments: false,
          });
          poly.addEventListener("gmp-click", () => setActive(a));
          map.append(poly);
        });

        setStatus("ready");
        startOrbit(map);
      } catch (err) {
        console.warn("Soliq 3D xarita yuklanmadi, fallback ko'rsatiladi.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const replayOrbit = () => mapRef.current && startOrbit(mapRef.current);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-indigo-500" />
            <p className="text-xs">Photorealistic 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "fallback" && (
        <div className="h-full w-full p-2">
          <SoliqMapFallback active={active} onSelect={setActive} />
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={replayOrbit}
          className="surface-overlay absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground hover:text-indigo-500"
        >
          <RotateCw className="size-3.5" /> Aylanishni takrorlash
        </button>
      )}

      <SoliqMapInfoCard area={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default SoliqMap3D;
