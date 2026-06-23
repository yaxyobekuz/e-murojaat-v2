// Bizneslar 3D xaritasi — Photorealistic. Faqat bizneslar markeri ko'rinadi (ortiqcha
// belgi yo'q). Har biznes faoliyat turi ikoni bilan, yig'im darajasi rangida. Hududlar
// poligoni yig'im darajasiga qarab bo'yaladi (kontekst). Rejimlar (mode):
//   map      — har biznes alohida marker (icon)
//   heatmap  — yig'im darajasi bo'yicha rangli doiralar (issiqlik xaritasi)
//   clusters — yaqin bizneslar bitta klaster markeriga guruhlanadi (soni bilan)
// Boshqariladi: businesses (filtrlangan), activeId + onSelect.
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { loadMaps3d } from "../../utils/googleMaps3d.loader";
import { MAP_CENTER, MAHALLA_AREAS } from "../../mock/soliq.mapAreas";
import { BUSINESS_TYPES, COLLECTION_TIERS } from "../../mock/soliq.businesses";
import BusinessMapFallback from "./BusinessMapFallback";

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 64, range: 1500, heading: 20 };
const MARKER_ALT = 24;

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

// markaz atrofida doira poligoni (heatmap uchun)
const circleRing = (center, radiusM, steps = 28) => {
  const ring = [];
  const latM = radiusM / 111000;
  const lngM = radiusM / (111000 * Math.cos((center.lat * Math.PI) / 180));
  for (let i = 0; i < steps; i++) {
    const ang = (i / steps) * Math.PI * 2;
    ring.push({
      lat: center.lat + Math.sin(ang) * latM,
      lng: center.lng + Math.cos(ang) * lngM,
      altitude: 4,
    });
  }
  return ring;
};

// Bloklarni yig'im darajasiga qarab rang berish uchun — blok ichidagi bizneslar o'rtachasi
const blockTierColor = (block, businesses) => {
  const inside = businesses.filter((b) => b.blockId === block.id);
  if (!inside.length) return "#475569";
  const avg = Math.round(inside.reduce((s, b) => s + b.rate, 0) / inside.length);
  const tier =
    avg >= 90 ? "high" : avg >= 70 ? "mid" : avg >= 50 ? "low" : "veryLow";
  return COLLECTION_TIERS[tier].color;
};

// Klaster uchun bizneslarni grid kataklarga guruhlash (taxminiy)
const buildClusters = (businesses) => {
  const CELL = 0.0016;
  const map = new Map();
  businesses.forEach((b) => {
    const gx = Math.round(b.lng / CELL);
    const gy = Math.round(b.lat / CELL);
    const key = `${gx}:${gy}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(b);
  });
  return [...map.values()].map((items) => ({
    items,
    lat: items.reduce((s, b) => s + b.lat, 0) / items.length,
    lng: items.reduce((s, b) => s + b.lng, 0) / items.length,
    debt: items.reduce((s, b) => s + b.debtYear, 0),
    rate: Math.round(items.reduce((s, b) => s + b.rate, 0) / items.length),
  }));
};

// HTML marker pin (biznes turi ikoni — SVG path lucide bilan emas, oddiy emoji/glyph)
const TYPE_GLYPH = {
  retail: "🛒", shop: "🏬", food: "🍴", service: "✂️", manufacture: "🏭",
  construction: "🔨", logistics: "🚚", medical: "⚕️", education: "🎓",
  fuel: "⛽", office: "🏢", finance: "🏛️",
};

const BusinessMap3D = ({
  businesses = [],
  mode = "map",
  activeId = null,
  activeBlockId = null,
  onSelect,
  onSelectBlock,
}) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const layerRef = useRef([]); // joriy rejim elementlari (marker/circle)
  const polysRef = useRef({}); // blockId -> { poly, color }
  const [status, setStatus] = useState("loading");

  // Xaritani bir marta quramiz + hudud poligonlari
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;
        libRef.current = lib;
        const { Map3DElement, Polygon3DInteractiveElement, MapMode, AltitudeMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        // hududlar — yig'im darajasi rangida, bosiladigan (interaktiv)
        MAHALLA_AREAS.forEach((a) => {
          const color = blockTierColor(a, businesses);
          const ring = a.path.map((p) => ({ ...p, altitude: 0 }));
          const poly = new Polygon3DInteractiveElement({
            outerCoordinates: ring,
            altitudeMode: AltitudeMode.CLAMP_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba(color, 0.1),
            strokeColor: color,
            strokeWidth: 3,
            drawsOccludedSegments: false,
          });
          poly.addEventListener("gmp-click", () => onSelectBlock?.(a.id));
          map.append(poly);
          polysRef.current[a.id] = { poly, color };
        });

        setStatus("ready");
      } catch (err) {
        console.warn("Bizneslar 3D xarita yuklanmadi, fallback.", err?.message);
        if (!cancelled) setStatus("fallback");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rejim/biznes/tanlovga qarab marker qatlamini qayta chizamiz
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !libRef.current) return;
    const map = mapRef.current;
    const { Marker3DInteractiveElement, Polygon3DElement, AltitudeMode } = libRef.current;

    // eski qatlamni tozalash
    layerRef.current.forEach((el) => el.remove());
    layerRef.current = [];

    if (mode === "heatmap") {
      // har biznes — yig'im darajasi rangida yumshoq doira (radius qarzga bog'liq)
      businesses.forEach((b) => {
        const color = COLLECTION_TIERS[b.tier].color;
        const radius = 60 + Math.min(120, b.debtYear / 1_500_000);
        const circle = new Polygon3DElement({
          outerCoordinates: circleRing({ lat: b.lat, lng: b.lng }, radius),
          altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
          extruded: false,
          fillColor: hexToRgba(color, 0.45),
          strokeColor: hexToRgba(color, 0.6),
          strokeWidth: 1,
          drawsOccludedSegments: true,
        });
        map.append(circle);
        layerRef.current.push(circle);
      });
      return;
    }

    const items = mode === "clusters" ? buildClusters(businesses) : null;

    if (mode === "clusters") {
      items.forEach((c) => {
        if (c.items.length === 1) {
          addBusinessMarker(c.items[0]);
        } else {
          const color = COLLECTION_TIERS[
            c.rate >= 90 ? "high" : c.rate >= 70 ? "mid" : c.rate >= 50 ? "low" : "veryLow"
          ].color;
          const marker = new Marker3DInteractiveElement({
            position: { lat: c.lat, lng: c.lng, altitude: MARKER_ALT + 10 },
            label: `${c.items.length} ta biznes`,
          });
          const el = buildClusterPin(c.items.length, color);
          marker.append(el);
          marker.addEventListener("gmp-click", () =>
            map.flyCameraTo({
              endCamera: { center: { lat: c.lat, lng: c.lng, altitude: GROUND_ALT }, tilt: 64, range: 600, heading: 20 },
              durationMillis: 1200,
            }),
          );
          map.append(marker);
          layerRef.current.push(marker);
        }
      });
      return;
    }

    // map rejimi — har biznes alohida marker
    businesses.forEach((b) => addBusinessMarker(b));

    function addBusinessMarker(b) {
      const isActive = activeId === b.id;
      const color = b.isDebtor ? COLLECTION_TIERS[b.tier].color : BUSINESS_TYPES[b.typeKey].color;
      const marker = new Marker3DInteractiveElement({
        position: { lat: b.lat, lng: b.lng, altitude: isActive ? MARKER_ALT + 14 : MARKER_ALT },
      });
      marker.append(buildBusinessPin(b.typeKey, color, isActive));
      marker.addEventListener("gmp-click", () => onSelect?.(b.id));
      map.append(marker);
      layerRef.current.push(marker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, mode, activeId, status]);

  // tanlangan biznesga kamera uchadi
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const b = businesses.find((x) => x.id === activeId);
    if (!b) return;
    mapRef.current.flyCameraTo({
      endCamera: { center: { lat: b.lat, lng: b.lng, altitude: GROUND_ALT }, tilt: 62, range: 500, heading: 20 },
      durationMillis: 1300,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, status]);

  // tanlangan hudud (blok) — to'ldirishni yoritish + kamera uchadi
  useEffect(() => {
    if (status !== "ready") return;
    Object.entries(polysRef.current).forEach(([id, { poly, color }]) => {
      const on = id === activeBlockId;
      poly.fillColor = hexToRgba(color, on ? 0.4 : 0.1);
      poly.strokeWidth = on ? 5 : 3;
    });
    if (activeBlockId && mapRef.current) {
      const area = MAHALLA_AREAS.find((a) => a.id === activeBlockId);
      if (area) {
        const c = centroid(area.path);
        mapRef.current.flyCameraTo({
          endCamera: { center: { ...c, altitude: GROUND_ALT }, tilt: 60, range: 900, heading: 20 },
          durationMillis: 1300,
        });
      }
    }
  }, [activeBlockId, status]);

  if (status === "fallback") {
    return (
      <div className="h-full w-full p-2">
        <BusinessMapFallback
          businesses={businesses}
          mode={mode}
          activeId={activeId}
          activeBlockId={activeBlockId}
          onSelect={onSelect}
          onSelectBlock={onSelectBlock}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" style={{ display: status === "ready" ? "block" : "none" }} />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-blue-500" />
            <p className="text-xs">Photorealistic 3D xarita yuklanmoqda…</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- DOM pin yasovchilar (lucide o'rniga emoji glyph — 3D marker uchun yengil) ---
function buildBusinessPin(typeKey, color, active) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    width:${active ? 38 : 32}px;height:${active ? 38 : 32}px;border-radius:50%;
    display:grid;place-items:center;font-size:${active ? 17 : 15}px;
    background:${color};border:2px solid ${active ? "#fff" : "rgba(255,255,255,0.85)"};
    box-shadow:0 4px 10px rgba(0,0,0,.45);${active ? "transform:scale(1.05);" : ""}`;
  wrap.textContent = TYPE_GLYPH[typeKey] || "🏢";
  return wrap;
}

function buildClusterPin(count, color) {
  const wrap = document.createElement("div");
  wrap.style.cssText = `
    min-width:42px;height:42px;padding:0 8px;border-radius:21px;
    display:grid;place-items:center;font-weight:700;font-size:14px;color:#fff;
    background:${color};border:2px solid rgba(255,255,255,0.9);
    box-shadow:0 6px 14px rgba(0,0,0,.5);`;
  wrap.textContent = String(count);
  return wrap;
}

export default BusinessMap3D;
