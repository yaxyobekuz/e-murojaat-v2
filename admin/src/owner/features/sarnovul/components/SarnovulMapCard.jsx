// Sarnovul mahallasining jonli OSM mini xaritasi (hero yonidagi 1 ustunlik karta).
// OpenFreeMap basemap + Overpass'dan real chizilgan binolar 3D ko'rinishda.
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Loader2, MapPinned } from "lucide-react";

const VIEW = { center: [71.93235, 40.89249], zoom: 14.6, pitch: 55, bearing: -20 };
const BBOX = "40.882,71.915,40.903,71.95"; // mahalla atrofi (s,w,n,e)

const heightOf = (t = {}) => {
  const h = parseFloat(t.height);
  if (h > 0) return h;
  const lv = parseFloat(t["building:levels"]);
  return lv > 0 ? lv * 3 : 4;
};

const SarnovulMapCard = () => {
  const hostRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hostRef.current) return;
    const map = new maplibregl.Map({
      container: hostRef.current,
      ...VIEW,
      style: "https://tiles.openfreemap.org/styles/dark",
      interactive: false,
      attributionControl: false,
    });

    map.on("style.load", async () => {
      setLoading(false);
      try {
        const q = `[out:json][timeout:20];(way["building"](${BBOX}););out geom;`;
        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: "data=" + encodeURIComponent(q),
        });
        if (!res.ok) return;
        const { elements } = await res.json();
        const features = elements
          .filter((el) => el.type === "way" && el.geometry?.length >= 4)
          .map((el) => ({
            type: "Feature",
            geometry: { type: "Polygon", coordinates: [el.geometry.map((p) => [p.lon, p.lat])] },
            properties: { height: heightOf(el.tags) },
          }));
        if (map.getSource("mini-buildings")) return;
        map.addSource("mini-buildings", { type: "geojson", data: { type: "FeatureCollection", features } });
        map.addLayer({
          id: "mini-buildings",
          source: "mini-buildings",
          type: "fill-extrusion",
          paint: {
            "fill-extrusion-color": [
              "interpolate", ["linear"], ["get", "height"],
              3, "#34d399", 12, "#22d3ee", 25, "#6366f1",
            ],
            "fill-extrusion-height": ["max", ["get", "height"], 3],
            "fill-extrusion-opacity": 0.9,
          },
        });
      } catch {
        // mini xarita uchun binolarsiz basemap ham yetarli
      }
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-[rgb(var(--card-border))] bg-card shadow-lg">
      {/* inline style — maplibre-gl.css ning .maplibregl-map{position:relative} qoidasi Tailwind absolute'ni yengadi */}
      <div ref={hostRef} style={{ position: "absolute", inset: 0 }} />

      {loading && (
        <div className="absolute inset-0 grid place-items-center text-foreground/50">
          <Loader2 className="size-5 animate-spin text-emerald-400" />
        </div>
      )}

      {/* pastki yorliq */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
        <MapPinned className="size-4 text-emerald-300" />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">Sarnovul mahallasi</div>
        </div>
      </div>
    </div>
  );
};

export default SarnovulMapCard;
