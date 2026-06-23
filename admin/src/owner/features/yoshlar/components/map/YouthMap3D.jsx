// Yoshlar 3D xaritasi (Photorealistic, Google Maps 3D). Har mahalla:
//   - score bo'yicha rangli glow doira (risk=qizil, muvaffaqiyatli=yashil) — heatmap
//   - score yorlig'i bilan marker (bosiladi -> onSelect + kamera flyTo)
// missionTarget berilsa kamera avtomatik o'sha mahallaga uchadi (Mission Mode).
// Boshqariladi: mahallas, activeId, missionTarget. API kalit yo'q bo'lsa -> fallback.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "@/owner/features/soliq/utils/googleMaps3d.loader";
import { MAP_CENTER, SCORE_TIERS, tierOfScore, aiRiskScore } from "../../mock/youth.data";
import YouthMapFallback from "./YouthMapFallback";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const GROUND_ALT = 460;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 60, range: 4200, heading: 18 };

const circleRing = (center, radiusM, steps = 36) => {
  const ring = [];
  const latM = radiusM / 111000;
  const lngM = radiusM / (111000 * Math.cos((center.lat * Math.PI) / 180));
  for (let i = 0; i < steps; i++) {
    const ang = (i / steps) * Math.PI * 2;
    ring.push({ lat: center.lat + Math.sin(ang) * latM, lng: center.lng + Math.cos(ang) * lngM, altitude: 6 });
  }
  return ring;
};

const buildPin = (m, active) => {
  const tier = SCORE_TIERS[tierOfScore(m.score)];
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    display:flex;flex-direction:column;align-items:center;gap:2px;
    transform:translateY(${active ? -2 : 0}px);`;
  const dot = document.createElement("div");
  dot.style.cssText = `
    width:${active ? 40 : 34}px;height:${active ? 40 : 34}px;border-radius:50%;
    display:grid;place-items:center;font-weight:700;font-size:${active ? 14 : 12}px;color:#fff;
    background:radial-gradient(circle at 35% 30%, rgba(${tier.glow},0.95), rgba(${tier.glow},0.55));
    border:2px solid rgba(255,255,255,${active ? 0.95 : 0.7});
    box-shadow:0 0 ${active ? 28 : 16}px rgba(${tier.glow},0.85), 0 4px 10px rgba(0,0,0,.5);`;
  dot.textContent = m.score;
  wrap.appendChild(dot);
  return wrap;
};

const YouthMap3D = ({ mahallas = [], activeId = null, missionTarget = null, onSelect }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const markersRef = useRef({});
  const circlesRef = useRef({});
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;
        libRef.current = lib;
        const { Map3DElement, Polygon3DElement, Marker3DInteractiveElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        mahallas.forEach((m) => {
          const tier = SCORE_TIERS[tierOfScore(m.score)];
          // heatmap glow doira (score past -> kichik, risk -> qizil yorqin)
          const radius = 240 + m.youth / 14;
          const circle = new Polygon3DElement({
            outerCoordinates: circleRing({ lat: m.lat, lng: m.lng }, radius),
            altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
            extruded: false,
            fillColor: `rgba(${tier.glow},0.32)`,
            strokeColor: `rgba(${tier.glow},0.7)`,
            strokeWidth: 2,
            drawsOccludedSegments: true,
          });
          map.append(circle);
          circlesRef.current[m.id] = circle;

          const marker = new Marker3DInteractiveElement({ position: { lat: m.lat, lng: m.lng, altitude: 40 } });
          marker.append(buildPin(m, false));
          marker.addEventListener("gmp-click", () => onSelect?.(m.id));
          map.append(marker);
          markersRef.current[m.id] = marker;
        });

        setStatus("ready");
      } catch (err) {
        console.warn("Yoshlar 3D xarita yuklanmadi, fallback.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // active marker -> pin kattalashadi + kamera uchadi
  useEffect(() => {
    if (status !== "ready") return;
    mahallas.forEach((m) => {
      const mk = markersRef.current[m.id];
      if (mk) mk.replaceChildren(buildPin(m, m.id === activeId));
    });
    if (activeId && mapRef.current) {
      const m = mahallas.find((x) => x.id === activeId);
      if (m) {
        mapRef.current.flyCameraTo({
          endCamera: { center: { lat: m.lat, lng: m.lng, altitude: GROUND_ALT }, tilt: 58, range: 1400, heading: 18 },
          durationMillis: 1500,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, status]);

  // Mission Mode — kamera muammoli mahallaga avtomatik uchadi
  useEffect(() => {
    if (status !== "ready" || !missionTarget || !mapRef.current) return;
    const m = mahallas.find((x) => x.id === missionTarget);
    if (!m) return;
    mapRef.current.flyCameraTo({
      endCamera: { center: { lat: m.lat, lng: m.lng, altitude: GROUND_ALT }, tilt: 64, range: 1100, heading: 30 },
      durationMillis: 2400,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionTarget, status]);

  if (status === "fallback") {
    return (
      <div className="h-full w-full p-2">
        <YouthMapFallback mahallas={mahallas} activeId={activeId} onSelect={onSelect} />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-white/60">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-cyan-400" />
            <p className="text-xs">3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouthMap3D;
