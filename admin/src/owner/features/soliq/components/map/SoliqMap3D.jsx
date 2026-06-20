// Photorealistic 3D soliq xaritasi — hududlar holat rangida (yashil/sariq/qizil)
// poligon bilan belgilanadi. Boshqariladi (controlled):
//   - statusFilter: tanlangan holatlar; mos kelmaganlar xiralashadi
//   - activeId + onSelect: tanlangan hudud (jadval bilan bog'langan), kamera uchib boradi
// API kalit yo'q/xato bo'lsa — SVG fallback'ga o'tadi.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps3d.loader";
import { MAP_CENTER, MAHALLA_AREAS, TAX_STATUS } from "../../mock/soliq.mapAreas";
import SoliqMapInfoCard from "./SoliqMapInfoCard";
import SoliqMapFallback from "./SoliqMapFallback";

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

// Markaz atrofida doira poligoni (radius metrda). altitude — yer ustiga ko'tarish,
// shunda zona ustida fizik tepada turadi (yashil/sariq/qizil poligonlardan ajraladi).
const CIRCLE_ALT = 6;
const circleRing = (center, radiusM = 120, steps = 40) => {
  const ring = [];
  const latM = radiusM / 111000;
  const lngM = radiusM / (111000 * Math.cos((center.lat * Math.PI) / 180));
  for (let i = 0; i < steps; i++) {
    const ang = (i / steps) * Math.PI * 2;
    ring.push({
      lat: center.lat + Math.sin(ang) * latM,
      lng: center.lng + Math.cos(ang) * lngM,
      altitude: CIRCLE_ALT,
    });
  }
  return ring;
};

const MARKER_ALT = 30;
// Eng katta qarzli hududlar — ogohlantirish marki shularga qo'yiladi (top 5, qarzi bor)
const ALERT_ZONES = MAHALLA_AREAS.filter((a) => a.info.debtUzs > 0)
  .sort((a, b) => b.info.debtUzs - a.info.debtUzs)
  .slice(0, 5);

// Qisqa pul formati (label uchun): 225 600 000 -> "225.6 mln"
const shortMoney = (n) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} mlrd`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} mln`;
  return n.toLocaleString("uz-UZ");
};

const SoliqMap3D = ({ statusFilter = [], activeId = null, onSelect }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const polysRef = useRef({}); // id -> Polygon3D element
  const alertsRef = useRef({}); // id -> { circle, marker } (qarzdor ogohlantirish marki)
  const [status, setStatus] = useState("loading"); // loading | ready | fallback

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;

        const { Map3DElement, Polygon3DInteractiveElement, Polygon3DElement, Marker3DInteractiveElement, PinElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({
          center: LOOK_AT,
          ...CAMERA,
          mode: MapMode.HYBRID,
        });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

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
          poly.addEventListener("gmp-click", () => onSelect?.(a.id));
          map.append(poly);
          polysRef.current[a.id] = poly;
        });

        // Eng qarzdor hududlarga ogohlantirish marki — qizil radius doira + pin + qarz label
        const danger = TAX_STATUS.unpaid.color;
        ALERT_ZONES.forEach((a) => {
          const c = centroid(a.path);
          const circle = new Polygon3DElement({
            outerCoordinates: circleRing(c, 120),
            altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba(danger, 0.4),
            strokeColor: danger,
            strokeWidth: 4,
            drawsOccludedSegments: true,
          });
          map.append(circle);

          const pin = new PinElement({
            background: danger,
            borderColor: "#7f1d1d",
            glyph: "⚠️",
            scale: 1.3,
          });
          const marker = new Marker3DInteractiveElement({
            position: { ...c, altitude: MARKER_ALT },
            label: `Qarz ${shortMoney(a.info.debtUzs)}`,
          });
          marker.append(pin);
          marker.addEventListener("gmp-click", () => onSelect?.(a.id));
          map.append(marker);

          alertsRef.current[a.id] = { circle, marker };
        });

        setStatus("ready");
      } catch (err) {
        console.warn("Soliq 3D xarita yuklanmadi, fallback ko'rsatiladi.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtr + tanlovga qarab poligon ko'rinishini yangilash (xaritani qayta qurmasdan)
  useEffect(() => {
    if (status !== "ready") return;
    MAHALLA_AREAS.forEach((a) => {
      const poly = polysRef.current[a.id];
      if (!poly) return;
      const color = TAX_STATUS[a.status].color;
      const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
      const isActive = activeId === a.id;
      const fillA = !visible ? 0.06 : isActive ? 0.7 : 0.45;
      poly.fillColor = hexToRgba(color, fillA);
      poly.strokeColor = !visible ? hexToRgba(color, 0.3) : color;
      poly.strokeWidth = isActive ? 7 : 4;

      // Ogohlantirish marki — filtrda yashirilsa olib qo'yiladi
      const alert = alertsRef.current[a.id];
      if (alert) {
        alert.circle.style.display = visible ? "" : "none";
        alert.marker.style.display = visible ? "" : "none";
      }
    });
  }, [statusFilter, activeId, status]);

  // Tanlangan hududga kamera uchib boradi
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const area = MAHALLA_AREAS.find((a) => a.id === activeId);
    if (!area) return;
    const c = centroid(area.path);
    mapRef.current.flyCameraTo({
      endCamera: { center: { ...c, altitude: GROUND_ALT }, tilt: 64, range: 700, heading: 20 },
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
            <p className="text-xs">Photorealistic 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}

      {status === "fallback" && (
        <div className="h-full w-full p-2">
          <SoliqMapFallback
            active={activeArea}
            statusFilter={statusFilter}
            onSelect={(a) => onSelect?.(a.id)}
          />
        </div>
      )}

      <SoliqMapInfoCard area={activeArea} onClose={() => onSelect?.(null)} />
    </div>
  );
};

export default SoliqMap3D;
