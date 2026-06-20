// Google Photorealistic 3D Map (Map3DElement) with tilt, auto-orbit + interactive
// cadastre markers. Renders a dashboard-styled info card on marker click.
import { useEffect, useRef, useState } from "react";
import { Loader2, MapPinned, RotateCw } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps.loader";
import { MAP_CENTER, CADASTRE_MARKERS } from "../../mock/yer.mapMarkers";
import MapInfoCard from "./MapInfoCard";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

// Baliqchi yer balandligi (~440m). Kamera yerga qaraydi — shunda markerlar
// kadr markazida turadi (altitude:0 bo'lsa kamera yer ostiga qarab, markerlar yuqoriga suriladi).
const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };

// Kamera sozlamalari — tilt (3D ko'rinish) + range (zoom, kichikroq = yaqinroq)
const CAMERA = { tilt: 66, range: 1000, heading: 0 };

// Smooth flyover orbit around the center
const startOrbit = (map) => {
  map.flyCameraAround({
    camera: { center: LOOK_AT, ...CAMERA },
    durationMillis: 60000,
    rounds: 1,
  });
};

const Map3D = () => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [active, setActive] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;

        const { Map3DElement, Marker3DInteractiveElement, MapMode } = lib;

        const map = new Map3DElement({
          center: LOOK_AT,
          ...CAMERA,
          mode: MapMode.HYBRID,
        });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        // Interactive markers -> open info card on click
        CADASTRE_MARKERS.forEach((m) => {
          const marker = new Marker3DInteractiveElement({
            position: m.position,
            label: m.title,
          });
          marker.addEventListener("gmp-click", () => setActive(m));
          map.append(marker);
        });

        setStatus("ready");
        startOrbit(map);
      } catch (err) {
        console.error("Map3D yuklashda xatolik:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const replayOrbit = () => mapRef.current && startOrbit(mapRef.current);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" />

      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-brand-purple" />
            <p className="text-xs">Photorealistic 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <MapPinned className="size-7 text-foreground/30" />
            <p className="text-sm">Xaritani yuklab bo'lmadi</p>
            <p className="text-xs">API kalit yoki ulanishni tekshiring</p>
          </div>
        </div>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={replayOrbit}
          className="surface-overlay absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground hover:text-brand-purple"
        >
          <RotateCw className="size-3.5" /> Aylanishni takrorlash
        </button>
      )}

      <MapInfoCard marker={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default Map3D;
