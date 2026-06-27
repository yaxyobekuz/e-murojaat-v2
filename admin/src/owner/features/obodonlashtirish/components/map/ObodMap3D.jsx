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

const API_KEY = "AIzaSyAzevS5emLN3BTdUOIN6tmK6Din6aG7DjY";

const GROUND_ALT = 440;
const LOOK_AT = { ...MAP_CENTER, altitude: GROUND_ALT };
const CAMERA = { tilt: 66, range: 1300, heading: 20 };

const hexToRgba = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Markaz atrofida doira poligoni (radius metrda). altitude — yer ustiga ko'tarish
// (yashil yer-zonasi ustида fizik tepada tursin, render tartibidan qat'i nazar).
const CIRCLE_ALT = 6;
const circleRing = (center, radiusM = 130, steps = 40) => {
  const ring = [];
  const latM = radiusM / 111000; // 1° lat ~ 111km
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

// Marker balandligi — yerga nisbatan (yer moduli kabi 25m, shunda yer ostiga tushmaydi)
const MARKER_ALT = 25;

// bare=true → faqat xarita foni (qurilish markerlari, yashil zonalar yo'q). Tashqi `markers` chiziladi.
// range — kamera masofasi (metr); kichikroq = yaqinroq ko'rinish.
const ObodMap3D = ({ showGreen = false, activeId = null, onSelect, plantings = null, markers = null, bare = false, range }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const greenPolysRef = useRef([]); // yashil zonalar (showGreen rejimida)
  const greenMarkersRef = useRef([]); // daraxt markerlari
  const plantingMarkersRef = useRef([]); // ekish nuqtalari (real koordinata)
  const customMarkersRef = useRef([]); // umumiy markerlar (chiqindi qutilari, mashina ...)
  const constructionElsRef = useRef([]); // qurilish doira + markerlari (eng tepada turishi kerak)
  const [status, setStatus] = useState("loading"); // loading | ready | fallback

  // Boshlang'ich — xarita + qurilish markerlari (har doim ko'rinadi)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const lib = await loadMaps3d(API_KEY);
        if (cancelled || !hostRef.current) return;
        libRef.current = lib;

        const { Map3DElement, Marker3DInteractiveElement, PinElement, Polygon3DElement, AltitudeMode, MapMode } = lib;

        const map = new Map3DElement({ center: LOOK_AT, ...CAMERA, range: range ?? CAMERA.range, mode: MapMode.HYBRID });
        map.style.width = "100%";
        map.style.height = "100%";
        hostRef.current.replaceChildren(map);
        mapRef.current = map;

        // Qurilish (jarayonda) joylari — olov rang doira (radius) + markazда kran pin
        // bare rejimida o'tkazib yuboriladi (masalan chiqindi xaritasi — faqat qutilar/mashina)
        if (!bare) OBOD_PROJECTS.filter(isConstruction).forEach((p) => {
          // Olov rang qurilish maydoni (doira zona)
          const circle = new Polygon3DElement({
            outerCoordinates: circleRing(p.center, 140),
            altitudeMode: AltitudeMode.RELATIVE_TO_GROUND,
            extruded: false,
            fillColor: hexToRgba("#f97316", 0.45),
            strokeColor: "#ea580c",
            strokeWidth: 4,
            drawsOccludedSegments: true,
          });
          map.append(circle);

          const pin = new PinElement({
            background: "#ea580c",
            borderColor: "#7c2d12",
            glyph: "🏗️",
            scale: 1.4,
          });
          const marker = new Marker3DInteractiveElement({
            position: { ...p.center, altitude: MARKER_ALT },
            label: `${p.name} (${p.info.progress}%)`,
          });
          marker.append(pin);
          marker.addEventListener("gmp-click", () => onSelect?.(p.id));
          map.append(marker);
          // doira + marker — keyin yashil ustiga qayta ko'tarish uchun saqlaymiz
          constructionElsRef.current.push(circle, marker);
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

  // Watchdog — 7s ichida xarita tayyor bo'lmasa, fallback (sxema) ko'rsatamiz
  useEffect(() => {
    if (status !== "loading") return undefined;
    const id = setTimeout(() => setStatus((s) => (s === "loading" ? "fallback" : s)), 7000);
    return () => clearTimeout(id);
  }, [status]);

  // Yashil maydon rejimi — zona + daraxt markerlarini qo'shish/olib tashlash
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !libRef.current) return;
    const map = mapRef.current;
    const { Polygon3DElement, Marker3DInteractiveElement, PinElement, AltitudeMode } = libRef.current;

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

      const pin = new PinElement({
        background: "#16a34a",
        borderColor: "#14532d",
        glyph: "🌳",
        scale: 1.3,
      });
      const marker = new Marker3DInteractiveElement({
        position: { ...p.center, altitude: MARKER_ALT },
        label: `${p.info.trees.toLocaleString("uz-UZ")} daraxt`,
      });
      marker.append(pin);
      marker.addEventListener("gmp-click", () => onSelect?.(p.id));
      map.append(marker);
      greenMarkersRef.current.push(marker);
    });

    // Qurilish doira + markerlarini eng tepaga qayta ko'tarish (yashil ostida qolmasin)
    constructionElsRef.current.forEach((el) => map.append(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGreen, status]);

  // Ekish nuqtalari — har ko'chat ekilgan joy real koordinatasiga 🌳 marker
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !libRef.current) return;
    const map = mapRef.current;
    const { Marker3DInteractiveElement, PinElement } = libRef.current;

    plantingMarkersRef.current.forEach((el) => el.remove());
    plantingMarkersRef.current = [];
    if (!plantings || !plantings.length) return;

    plantings.forEach((p) => {
      if (p.lat == null || p.lng == null) return;
      // tirik qolishga qarab rang
      const bg = p.survivalPct >= 90 ? "#16a34a" : p.survivalPct >= 85 ? "#65a30d" : "#ca8a04";
      const pin = new PinElement({ background: bg, borderColor: "#14532d", glyph: "🌳", scale: 1.1 });
      const marker = new Marker3DInteractiveElement({
        position: { lat: p.lat, lng: p.lng, altitude: MARKER_ALT },
        label: `${p.count.toLocaleString("uz-UZ")} ko'chat`,
      });
      marker.append(pin);
      map.append(marker);
      plantingMarkersRef.current.push(marker);
    });
  }, [plantings, status]);

  // Umumiy markerlar — {lat,lng,glyph,color,label}. Chiqindi qutilari, mashina va h.k.
  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !libRef.current) return;
    const map = mapRef.current;
    const { Marker3DInteractiveElement, PinElement } = libRef.current;

    customMarkersRef.current.forEach((el) => el.remove());
    customMarkersRef.current = [];
    if (!markers || !markers.length) return;

    markers.forEach((m) => {
      if (m.lat == null || m.lng == null) return;
      const pin = new PinElement({
        background: m.color || "#22d3ee",
        borderColor: m.borderColor || "#0b1220",
        glyph: m.glyph || "",
        glyphColor: m.glyphColor || "#ffffff",
        scale: m.scale || 1.1,
      });
      const marker = new Marker3DInteractiveElement({
        position: { lat: m.lat, lng: m.lng, altitude: MARKER_ALT },
        label: m.label || "",
      });
      marker.append(pin);
      map.append(marker);
      customMarkersRef.current.push(marker);
    });
  }, [markers, status]);

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
            plantings={plantings}
            onSelect={(p) => onSelect?.(p.id)}
          />
        </div>
      )}

      <ObodMapInfoCard project={activeProject} onClose={() => onSelect?.(null)} />
    </div>
  );
};

export default ObodMap3D;
