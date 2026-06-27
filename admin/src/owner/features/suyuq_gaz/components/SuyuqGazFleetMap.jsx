// Suyultirilgan gaz — yetkazib beruvchi mashinalar jonli xaritasi (Mapbox GL 3D).
// Har mashina marshrut chizig'i bo'ylab jonli harakatlanadi; to'xtash nuqtalari — markerlar.
// Tugagan to'xtash yashil (kelgan/ketgan vaqt bilan), joriy nuqta yonib turadi.
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader2, MapPinned, RotateCw, Crosshair } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { TRUCKS, TRUCK_STATUS } from "../mock/suyuqGaz.fleet";

const MAPBOX_TOKEN = "pk.eyJ1IjoieWF4eW9iZWsiLCJhIjoiY21xcXVyMnN5MDJ0YTJzczhmZGhoMGh5bCJ9.C66cPZikWv2zNvjXHNrp5g";

const INITIAL_VIEW = { center: [71.8640, 40.9050], zoom: 13.4, pitch: 55, bearing: -18, antialias: true };

// marshrut bo'ylab t (0..1) nuqtani topadi (segmentlar bo'yicha chiziqli interpolyatsiya)
const pointAlong = (route, t) => {
  if (route.length < 2) return route[0];
  const clamped = Math.max(0, Math.min(1, t));
  const seg = clamped * (route.length - 1);
  const i = Math.min(route.length - 2, Math.floor(seg));
  const f = seg - i;
  const [ax, ay] = route[i];
  const [bx, by] = route[i + 1];
  return [ax + (bx - ax) * f, ay + (by - ay) * f];
};

const routesGeoJSON = {
  type: "FeatureCollection",
  features: TRUCKS.map((t) => ({
    type: "Feature",
    properties: { color: t.color },
    geometry: { type: "LineString", coordinates: t.route },
  })),
};

const stopsGeoJSON = {
  type: "FeatureCollection",
  features: TRUCKS.flatMap((t) =>
    t.stops.map((s) => ({
      type: "Feature",
      properties: { color: t.color, done: s.done },
      geometry: { type: "Point", coordinates: [s.lng, s.lat] },
    })),
  ),
};

const truckEl = (color) => {
  const el = document.createElement("div");
  el.style.cssText = `display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:${color};border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.45);font-size:17px;transition:transform .2s linear;`;
  el.textContent = "🚚";
  return el;
};

const SuyuqGazFleetMap = ({ selectedTruckId, onSelectTruck }) => {
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const progressRef = useRef(Object.fromEntries(TRUCKS.map((t) => [t.id, t.progress])));
  const rafRef = useRef(null);
  const selectedRef = useRef(selectedTruckId);
  const { state, setField } = useObjectState({ status: MAPBOX_TOKEN ? "loading" : "error" });

  useEffect(() => {
    selectedRef.current = selectedTruckId;
    const map = mapRef.current;
    if (!map || state.status !== "ready") return;
    const t = TRUCKS.find((x) => x.id === selectedTruckId);
    if (t) {
      const p = pointAlong(t.route, progressRef.current[t.id]);
      map.flyTo({ center: p, zoom: 14.6, duration: 1200, essential: true });
    } else {
      map.flyTo({ ...INITIAL_VIEW, essential: true, duration: 1200 });
    }
  }, [selectedTruckId, state.status]);

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
      if (!map.getSource("mapbox-dem")) {
        map.addSource("mapbox-dem", { type: "raster-dem", url: "mapbox://mapbox.mapbox-terrain-dem-v1", tileSize: 512, maxzoom: 14 });
      }
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.1 });
      if (!map.getLayer("sky")) {
        map.addLayer({ id: "sky", type: "sky", paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 10 } });
      }

      // marshrut chiziqlari
      map.addSource("gz-routes", { type: "geojson", data: routesGeoJSON });
      map.addLayer({
        id: "gz-routes-line",
        source: "gz-routes",
        type: "line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": ["get", "color"], "line-width": 4, "line-opacity": 0.55, "line-dasharray": [1.5, 1.2] },
      });

      // to'xtash nuqtalari (almashtirilgan / kutilayotgan)
      map.addSource("gz-stops", { type: "geojson", data: stopsGeoJSON });
      map.addLayer({
        id: "gz-stops-dot",
        source: "gz-stops",
        type: "circle",
        paint: {
          "circle-radius": 6,
          "circle-color": ["case", ["get", "done"], "#22c55e", "#fff"],
          "circle-stroke-color": ["get", "color"],
          "circle-stroke-width": 2.5,
          "circle-opacity": 0.95,
        },
      });

      // mashina markerlari + popup
      TRUCKS.forEach((t) => {
        const el = truckEl(t.color);
        el.style.cursor = "pointer";
        const start = pointAlong(t.route, progressRef.current[t.id]);
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(start)
          .setPopup(
            new mapboxgl.Popup({ offset: 22, closeButton: false }).setHTML(
              `<div style="font:12px/1.5 system-ui;color:#111"><b>${t.plate}</b><br>${t.driver}<br><span style="color:${TRUCK_STATUS[t.status].color}">●</span> ${TRUCK_STATUS[t.status].label}</div>`,
            ),
          )
          .addTo(map);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectTruck?.(selectedRef.current === t.id ? "" : t.id);
        });
        markersRef.current[t.id] = marker;
      });

      // to'xtash nuqtasi popup'i
      map.on("click", "gz-stops-dot", (e) => {
        const c = e.features[0].geometry.coordinates.slice();
        const all = TRUCKS.flatMap((t) => t.stops.map((s) => ({ ...s, plate: t.plate })));
        const s = all.find((x) => Math.abs(x.lng - c[0]) < 1e-6 && Math.abs(x.lat - c[1]) < 1e-6);
        if (!s) return;
        const when = s.done
          ? `Kelgan: <b>${s.arrived}</b> · Ketgan: <b>${s.left}</b><br>Almashtirilgan: <b>${s.swapped}</b> ballon`
          : s.arrived
            ? `Kelgan: <b>${s.arrived}</b> · hozir almashtirilmoqda`
            : "Kutilmoqda";
        new mapboxgl.Popup({ offset: 14, closeButton: false })
          .setLngLat(c)
          .setHTML(`<div style="font:12px/1.5 system-ui;color:#111"><b>${s.street}</b><br>${s.plate}<br>${when}</div>`)
          .addTo(map);
      });
      map.on("mouseenter", "gz-stops-dot", () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", "gz-stops-dot", () => (map.getCanvas().style.cursor = ""));

      setField("status", "ready");

      // jonli harakat — progress'ni sekin oshirib, markerni marshrut bo'ylab suradi
      const speeds = Object.fromEntries(TRUCKS.map((t) => [t.id, t.status === "to'xtashda" ? 0 : 0.00018 + Math.random() * 0.0002]));
      const tick = () => {
        TRUCKS.forEach((t) => {
          let p = progressRef.current[t.id] + speeds[t.id];
          if (p > 1) p = 0;
          progressRef.current[t.id] = p;
          markersRef.current[t.id]?.setLngLat(pointAlong(t.route, p));
        });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    });
    map.on("error", (e) => console.error("Mapbox xato:", e?.error || e));

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orbit = () => {
    const map = mapRef.current;
    if (map) map.easeTo({ bearing: map.getBearing() + 360, duration: 30000, easing: (x) => x });
  };
  const reset = () => {
    onSelectTruck?.("");
    mapRef.current?.flyTo({ ...INITIAL_VIEW, essential: true, duration: 1400 });
  };

  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-xl bg-card">
      <div ref={hostRef} className="h-full w-full" />

      {state.status !== "error" && (
        <>
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <button type="button" onClick={orbit} className="grid size-7 place-items-center rounded-full bg-card/70 text-foreground/60 hover:text-foreground" title="Aylantirish">
              <RotateCw className="size-3.5" />
            </button>
            <button type="button" onClick={reset} className="grid size-7 place-items-center rounded-full bg-card/70 text-foreground/60 hover:text-foreground" title="Boshlang'ich ko'rinish">
              <Crosshair className="size-3.5" />
            </button>
          </div>

          <div className="absolute bottom-3 left-3 rounded-lg border border-[rgb(var(--card-border))] bg-popover/90 px-3 py-2 backdrop-blur-md">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">To'xtash nuqtalari</div>
            <div className="flex items-center gap-3 text-[10px] text-foreground/60">
              <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-full bg-emerald-500" /> Almashtirildi</span>
              <span className="flex items-center gap-1"><span className="inline-block size-2.5 rounded-full border-2 border-cyan-500 bg-white" /> Kutilmoqda</span>
              <span className="flex items-center gap-1">🚚 Mashina</span>
            </div>
          </div>
        </>
      )}

      {state.status === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="size-6 animate-spin text-cyan-500" />
            <p className="text-xs">Mashinalar xaritasi yuklanmoqda…</p>
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

export default SuyuqGazFleetMap;
