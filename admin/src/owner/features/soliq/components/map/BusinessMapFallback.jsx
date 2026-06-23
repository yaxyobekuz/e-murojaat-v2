// API kalitsiz ko'rinish — hududlar choropleth + bizneslar markeri (SVG). Rejimlar:
// map (har biznes nuqta+icon), heatmap (rangli yumshoq doiralar), clusters (guruh soni).
import { useMemo } from "react";

import { MAHALLA_AREAS } from "../../mock/soliq.mapAreas";
import { BUSINESS_TYPES, COLLECTION_TIERS } from "../../mock/soliq.businesses";

const PAD = 24;
const W = 760;
const H = 440;

const TYPE_GLYPH = {
  retail: "🛒", shop: "🏬", food: "🍴", service: "✂️", manufacture: "🏭",
  construction: "🔨", logistics: "🚚", medical: "⚕️", education: "🎓",
  fuel: "⛽", office: "🏢", finance: "🏛️",
};

const useProjection = () =>
  useMemo(() => {
    const pts = MAHALLA_AREAS.flatMap((a) => a.path);
    const lats = pts.map((p) => p.lat);
    const lngs = pts.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const sx = (W - PAD * 2) / (maxLng - minLng || 1);
    const sy = (H - PAD * 2) / (maxLat - minLat || 1);
    return ({ lat, lng }) => ({
      x: PAD + (lng - minLng) * sx,
      y: PAD + (maxLat - lat) * sy,
    });
  }, []);

const buildClusters = (businesses, project) => {
  const CELL = 60;
  const map = new Map();
  businesses.forEach((b) => {
    const p = project(b);
    const key = `${Math.round(p.x / CELL)}:${Math.round(p.y / CELL)}`;
    if (!map.has(key)) map.set(key, { items: [], sx: 0, sy: 0 });
    const c = map.get(key);
    c.items.push(b);
    c.sx += p.x;
    c.sy += p.y;
  });
  return [...map.values()].map((c) => ({
    items: c.items,
    x: c.sx / c.items.length,
    y: c.sy / c.items.length,
    rate: Math.round(c.items.reduce((s, b) => s + b.rate, 0) / c.items.length),
  }));
};

const tierColor = (rate) =>
  COLLECTION_TIERS[rate >= 90 ? "high" : rate >= 70 ? "mid" : rate >= 50 ? "low" : "veryLow"].color;

const BusinessMapFallback = ({ businesses = [], mode = "map", activeId, activeBlockId, onSelect, onSelectBlock }) => {
  const project = useProjection();
  const clusters = mode === "clusters" ? buildClusters(businesses, project) : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.1),transparent_60%)]"
    >
      {/* hududlar konturi — bosiladigan */}
      {MAHALLA_AREAS.map((a) => {
        const pts = a.path.map(project);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        const inside = businesses.filter((b) => b.blockId === a.id);
        const avg = inside.length ? Math.round(inside.reduce((s, b) => s + b.rate, 0) / inside.length) : 0;
        const color = inside.length ? tierColor(avg) : "#475569";
        const on = activeBlockId === a.id;
        return (
          <path
            key={a.id}
            d={d}
            fill={color}
            fillOpacity={on ? 0.3 : 0.08}
            stroke={color}
            strokeOpacity={on ? 0.9 : 0.4}
            strokeWidth={on ? 3 : 1.5}
            className="cursor-pointer"
            onClick={() => onSelectBlock?.(a.id)}
          />
        );
      })}

      {/* heatmap — yumshoq doiralar */}
      {mode === "heatmap" &&
        businesses.map((b) => {
          const p = project(b);
          const color = COLLECTION_TIERS[b.tier].color;
          const r = 14 + Math.min(26, b.debtYear / 8_000_000);
          return <circle key={b.id} cx={p.x} cy={p.y} r={r} fill={color} fillOpacity={0.4} />;
        })}

      {/* klasterlar */}
      {mode === "clusters" &&
        clusters.map((c, i) =>
          c.items.length === 1 ? (
            <BizMarker key={c.items[0].id} b={c.items[0]} p={project(c.items[0])} activeId={activeId} onSelect={onSelect} />
          ) : (
            <g key={`cl-${i}`} className="cursor-pointer">
              <circle cx={c.x} cy={c.y} r={16} fill={tierColor(c.rate)} stroke="#fff" strokeWidth={1.5} />
              <text x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central" className="pointer-events-none fill-white text-[12px] font-bold">
                {c.items.length}
              </text>
            </g>
          ),
        )}

      {/* map — har biznes marker */}
      {mode === "map" &&
        businesses.map((b) => <BizMarker key={b.id} b={b} p={project(b)} activeId={activeId} onSelect={onSelect} />)}
    </svg>
  );
};

const BizMarker = ({ b, p, activeId, onSelect }) => {
  const active = activeId === b.id;
  const color = b.isDebtor ? COLLECTION_TIERS[b.tier].color : BUSINESS_TYPES[b.typeKey].color;
  return (
    <g className="cursor-pointer" onClick={() => onSelect?.(b.id)}>
      <circle cx={p.x} cy={p.y} r={active ? 13 : 10} fill={color} stroke="#fff" strokeWidth={active ? 2.5 : 1.5} />
      <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="central" className="pointer-events-none" style={{ fontSize: active ? 13 : 11 }}>
        {TYPE_GLYPH[b.typeKey] || "🏢"}
      </text>
    </g>
  );
};

export default BusinessMapFallback;
