// Photorealistic 3D obodonlashtirish xaritasi.
// Default: xarita TOZA — faqat qurilish (jarayonda) joylari animatsiyali marker bilan
//   (aylanuvchi kran + puls halqa) belgilanadi. Zonalar ko'rsatilmaydi.
// showGreen=true bo'lsa: yashil maydonlar (park/ko'kalamzor) zona bo'lib chiziladi +
//   ustida daraxt ikonka + daraxtlar soni. Qurilish markerlari ham qoladi.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps3d.loader";
import { MAP_CENTER, OBOD_PROJECTS, isGreen, isConstruction } from "../../mock/obod.projects";
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

// Qurilish markeri HTML — aylanuvchi kran + puls
const constructionEl = () => {
  const el = document.createElement("div");
  el.className = "obod-marker";
  el.innerHTML =
    '<span class="obod-pulse"></span>' +
    '<span class="obod-chip"><span class="obod-crane">🏗️</span>Qurilish</span>';
  return el;
};

// Yashil maydon markeri — daraxt + soni
const treeEl = (count) => {
  const el = document.createElement("div");
  el.className = "obod-tree-chip";
  el.innerHTML = `<span>🌳</span>${count.toLocaleString("uz-UZ")}`;
  return el;
};

const ObodMap3D = ({ showGreen = false, activeId = null, onSelect }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const greenPolysRef = useRef([]); // yashil zonalar (showGreen rejimida)
  const greenMarkersRef = useRef([]); // daraxt markerlari
  const [status, setStatus] = useState("loading"); // loading | ready | fallback

  // Boshlang'ich — xarita + qurilish markerlari (har doim ko'rinadi)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;
        libRef.current = lib;

        const { Map3DElement, Marker3DInteractiveElement, MapMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        // Qurilish (jarayonda) markerlari — animatsiyali
        OBOD_PROJECTS.filter(isConstruction).forEach((p) => {
          const marker = new Marker3DInteractiveElement({
            position: { ...p.center, altitude: 0 },
            altitudeMode: lib.AltitudeMode.CLAMP_TO_GROUND,
          });
          marker.append(constructionEl());
          marker.addEventListener("gmp-click", () => onSelect?.(p.id));
          map.append(marker);
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

  // Yashil maydon rejimi — zona + daraxt markerlarini qo'shish/olib tashlash
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !libRef.current) return;
    const map = mapRef.current;
    const { Polygon3DElement, Marker3DInteractiveElement, AltitudeMode } = libRef.current;

    // Tozalash
    greenPolysRef.current.forEach((el) => el.remove());
    greenMarkersRef.current.forEach((el) => el.remove());
    greenPolysRef.current = [];
    greenMarkersRef.current = [];

    if (!showGreen) return;

    const green = "#16a34a";
    OBOD_PROJECTS.filter(isGreen).forEach((p) => {
      const ring = p.path.map((q) => ({ ...q, altitude: 0 }));
      const poly = new Polygon3DElement({
        outerCoordinates: ring,
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
        extruded: false,
        fillColor: hexToRgba(green, 0.5),
        strokeColor: green,
        strokeWidth: 3,
        drawsOccludedSegments: false,
      });
      map.append(poly);
      greenPolysRef.current.push(poly);

      const marker = new Marker3DInteractiveElement({
        position: { ...p.center, altitude: 0 },
        altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
      });
      marker.append(treeEl(p.info.trees));
      marker.addEventListener("gmp-click", () => onSelect?.(p.id));
      map.append(marker);
      greenMarkersRef.current.push(marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGreen, status]);

  // Tanlangan loyihaga kamera uchadi
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const p = OBOD_PROJECTS.find((x) => x.id === activeId);
    if (!p) return;
    mapRef.current.flyCameraTo({
      endCamera: { center: { ...p.center, altitude: GROUND_ALT }, tilt: 64, range: 600, heading: 20 },
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
            showGreen={showGreen}
            onSelect={(p) => onSelect?.(p.id)}
          />
        </div>
      )}

      <ObodMapInfoCard project={activeProject} onClose={() => onSelect?.(null)} />
    </div>
  );
};

export default ObodMap3D;
