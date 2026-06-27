// Internet qamrov xaritasi — Mapbox GL 3D (yer kadastri uslubida).
// Har uy = extruded blok, balandligi va rangi internet tezligiga (Mbit/s) qarab.
// Antennalar — markerlar, qamrov — doira qatlamlar. Sun'iy yo'ldosh + relyef + 3D.
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, MapPinned, Building2, Mountain, RotateCw, Crosshair } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { HOUSES, HOUSE_SPEED, ANTENNAS, ANTENNA_STATUS } from "../mock/internet.data";

const MAPBOX_TOKEN = "pk.eyJ1IjoieWF4eW9iZWsiLCJhIjoiY21xcXVyMnN5MDJ0YTJzczhmZGhoMGh5bCJ9.C66cPZikWv2zNvjXHNrp5g";
const CENTER = { lat: 40.9034, lng: 71.8604 };

const INITIAL_VIEW = { center: [CENTER.lng, CENTER.lat], zoom: 16.2, pitch: 60, bearing: -24, antialias: true };

// uy markazidan kichik kvadrat (extrude asosi)
const square = (lat, lng, sizeM = 9) => {
  const dLat = sizeM / 111000;
  const dLng = sizeM / (111000 * Math.cos((lat * Math.PI) / 180));
  return [[
    [lng - dLng, lat - dLat],
    [lng + dLng, lat - dLat],
    [lng + dLng, lat + dLat],
    [lng - dLng, lat + dLat],
    [lng - dLng, lat - dLat],
  ]];
};

// doira (qamrov zonasi) poligoni
const circle = (lat, lng, radiusM, steps = 48) => {
  const ring = [];
  const dLat = radiusM / 111000;
  const dLng = radiusM / (111000 * Math.cos((lat * Math.PI) / 180));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    ring.push([lng + Math.cos(a) * dLng, lat + Math.sin(a) * dLat]);
  }
  return [ring];
};

const housesGeoJSON = {
  type: "FeatureCollection",
  features: HOUSES.map((h) => ({
    type: "Feature",
    properties: { mbps: h.mbps, color: HOUSE_SPEED[h.status].color, height: 6 + Math.min(48, h.mbps * 0.6) },
    geometry: { type: "Polygon", coordinates: square(h.lat, h.lng) },
  })),
};

const coverageGeoJSON = {
  type: "FeatureCollection",
  features: ANTENNAS.map((a) => ({
    type: "Feature",
    properties: { color: ANTENNA_STATUS[a.status].color },
    geometry: { type: "Polygon", coordinates: circle(a.lat, a.lng, a.coverageM) },
  })),
};

const InternetMapbox = () => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const { state, setField } = useObjectState({
    status: MAPBOX_TOKEN ? "loading" : "error",
    buildings: true,
    terrain: true,
  });
  const layersRef = useRef({ buildings: true, terrain: true });

  const applyVisibility = (map) => {
    const L = layersRef.current;
    if (map.getLayer("net-houses")) {
      map.setLayoutProperty("net-houses", "visibility", L.buildings ? "visible" : "none");
    }
    map.setTerrain(L.terrain ? { source: "mapbox-dem", exaggeration: 1.2 } : null);
  };

  useEffect(() => {
    if (!MAPBOX_TOKEN || !hostRef.current) return undefined;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: hostRef.current,
      ...INITIAL_VIEW,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "bottom-right");
    map.addControl(new mapboxgl.FullscreenControl(), "bottom-right");

    map.on("style.load", () => {
      // relyef + osmon
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512, maxzoom: 14 });
      }
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.2 });
      if (!map.getLayer("sky")) {
        map.addLayer({ id: "sky", type: "sky", paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 12 } });
      }

      // qamrov zonalari (doira, yer ustida tekis)
      map.addSource("net-coverage", { type: "geojson", data: coverageGeoJSON });
      map.addLayer({
        id: "net-coverage-fill",
        source: "net-coverage",
        type: "fill",
        paint: { "fill-color": ["get", "color"], "fill-opacity": 0.12 },
      });
      map.addLayer({
        id: "net-coverage-line",
        source: "net-coverage",
        type: "line",
        paint: { "line-color": ["get", "color"], "line-width": 1.5, "line-opacity": 0.6 },
      });

      // uylar — extruded blok (balandlik + rang tezlikка qarab)
      map.addSource("net-houses", { type: "geojson", data: housesGeoJSON });
      map.addLayer({
        id: "net-houses",
        source: "net-houses",
        type: "fill-extrusion",
        paint: {
          "fill-extrusion-color": ["get", "color"],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": 0,
          "fill-extrusion-opacity": 0.92,
          "fill-extrusion-vertical-gradient": true,
        },
      });

      // antenna markerlari
      ANTENNAS.forEach((a) => {
        const c = ANTENNA_STATUS[a.status].color;
        const el = document.createElement("div");
        el.style.cssText = `display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:${c};border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);color:#fff;font-size:10px;font-weight:700;`;
        el.textContent = a.tech.includes("5G") ? "5G" : "4G";
        new mapboxgl.Marker({ element: el })
          .setLngLat([a.lng, a.lat])
          .setPopup(new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
            `<div style="font:12px/1.4 system-ui;color:#111"><b>${a.name}</b><br>Signal: <b>${a.signal}%</b> · ${a.tech}<br>${a.provider} · ${a.coverageM} m</div>`,
          ))
          .addTo(map);
      });

      applyVisibility(map);
      setField("status", "ready");
    });
    map.on("error", (e) => console.error("Mapbox xato:", e?.error || e));

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (key) => {
    layersRef.current = { ...layersRef.current, [key]: !layersRef.current[key] };
    setField(key, layersRef.current[key]);
    if (mapRef.current) applyVisibility(mapRef.current);
  };
  const orbit = () => {
    const map = mapRef.current;
    if (map) map.easeTo({ bearing: map.getBearing() + 360, duration: 32000, easing: (t) => t });
  };
  const reset = () => mapRef.current?.flyTo({ ...INITIAL_VIEW, essential: true, duration: 1600 });

  const btn = (active) =>
    `flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
      active ? "bg-brand-purple/80 text-white" : "bg-card/70 text-foreground/60 hover:text-foreground"
    }`;

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" />

      {state.status !== "error" && (
        <>
          {/* boshqaruv */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <button type="button" onClick={() => toggle("buildings")} className={btn(state.buildings)}>
              <Building2 className="size-3" /> 3D uylar
            </button>
            <button type="button" onClick={() => toggle("terrain")} className={btn(state.terrain)}>
              <Mountain className="size-3" /> Relyef
            </button>
            <button type="button" onClick={orbit} className="grid size-7 place-items-center rounded-full bg-card/70 text-foreground/60 hover:text-foreground" title="Aylantirish">
              <RotateCw className="size-3.5" />
            </button>
            <button type="button" onClick={reset} className="grid size-7 place-items-center rounded-full bg-card/70 text-foreground/60 hover:text-foreground" title="Boshlang'ich ko'rinish">
              <Crosshair className="size-3.5" />
            </button>
          </div>

          {/* legenda — tezlik gradienti */}
          <div className="absolute bottom-3 left-3 rounded-lg border border-[rgb(var(--card-border))] bg-popover/90 px-3 py-2 backdrop-blur-md">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">Uy internet tezligi</div>
            <div className="h-1.5 w-40 rounded-full" style={{ background: "linear-gradient(90deg,#ef4444,#f59e0b,#84cc16,#22c55e)" }} />
            <div className="mt-0.5 flex justify-between text-[9px] text-foreground/50">
              <span>Sekin (&lt;8)</span><span>Tez (50+ Mbit/s)</span>
            </div>
          </div>
        </>
      )}

      {state.status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-brand-purple" />
            <p className="text-xs">3D internet xaritasi yuklanmoqda…</p>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <MapPinned className="size-7 text-foreground/30" />
            <p className="text-sm">Xaritani yuklab bo'lmadi</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternetMapbox;
