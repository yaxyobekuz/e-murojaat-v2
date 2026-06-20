// FVV xaritasi (IIB uslubi) — voronoi bloklar + ustidan ko'cha yo'llari + yong'in
// nuqtalari. Blok bosilsa onSelect(block). Kalitsiz ishlaydi (sof SVG).
import { useMemo } from "react";

import { MAHALLA_AREAS, ROADS, FIRE_STATUS, FIRE_TYPES } from "../../mock/fvv.mapAreas";

const PAD = 26;
const W = 760;
const H = 440;

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
    return ({ lat, lng }) => ({ x: PAD + (lng - minLng) * sx, y: PAD + (maxLat - lat) * sy });
  }, []);

const centroid = (pts) => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

const FvvAreaMap = ({ active, statusFilter = [], onSelect }) => {
  const project = useProjection();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.10),transparent_60%)]"
    >
      <defs>
        <filter id="fvv-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bloklar */}
      {MAHALLA_AREAS.map((a) => {
        const pts = a.path.map(project);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        const c = centroid(pts);
        const color = FIRE_STATUS[a.status].color;
        const isActive = active?.id === a.id;
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        return (
          <g key={a.id} className="cursor-pointer" onClick={() => onSelect(a)}>
            <path
              d={d}
              fill={color}
              fillOpacity={!visible ? 0.08 : isActive ? 0.78 : 0.46}
              stroke="#fff"
              strokeOpacity={!visible ? 0.1 : isActive ? 0.9 : 0.28}
              strokeWidth={isActive ? 3 : 1.3}
            />
            <text x={c.x} y={c.y - 4} textAnchor="middle" dominantBaseline="middle"
              className="pointer-events-none fill-white text-[10px] font-semibold" opacity={visible ? 0.95 : 0.25}>
              {a.name}
            </text>
            <text x={c.x} y={c.y + 9} textAnchor="middle" dominantBaseline="middle"
              className="pointer-events-none fill-white/70 text-[8.5px]" opacity={visible ? 0.9 : 0.2}>
              {a.info.cameras} kamera
            </text>
          </g>
        );
      })}

      {/* Ko'cha yo'llari (bloklar ustidan) */}
      {ROADS.map((r) => {
        const pts = r.pts.map(project);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
        return (
          <g key={r.id}>
            <path d={d} fill="none" stroke="#0b1322" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
            <path d={d} fill="none" stroke="#e5edf6" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
            <path d={d} fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="5 7" opacity="0.7" />
          </g>
        );
      })}

      {/* Yong'in nuqtalari */}
      {MAHALLA_AREAS.map((a) => {
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        if (!visible) return null;
        return a.fires.map((f) => {
          const p = project(f.pos);
          const col = FIRE_TYPES[f.type]?.color || "#ef4444";
          return (
            <g key={f.id} className="cursor-pointer" onClick={() => onSelect(a)}>
              <circle cx={p.x} cy={p.y} r="9" fill={col} opacity="0.2">
                <animate attributeName="r" values="6;14;6" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="4" fill={col} stroke="#fff" strokeWidth="1.2" filter="url(#fvv-glow)" />
            </g>
          );
        });
      })}
    </svg>
  );
};

export default FvvAreaMap;
