// API kalitsiz ko'rinish — mahalla bloklarini SVG choropleth + hodisa nuqtalari.
// Real lat/lng poligon va nuqtalarni ekran koordinatasiga proyeksiya qiladi.
import { useMemo } from "react";

import { MAHALLA_AREAS, SECURITY_STATUS, INCIDENT_TYPES } from "../../mock/iib.mapAreas";

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
    const project = ({ lat, lng }) => ({
      x: PAD + (lng - minLng) * sx,
      y: PAD + (maxLat - lat) * sy,
    });
    return project;
  }, []);

const centroid = (pts) => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

const IibMapFallback = ({ active, statusFilter = [], onSelect }) => {
  const project = useProjection();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.10),transparent_60%)]"
    >
      <defs>
        <filter id="iib-glow" x="-50%" y="-50%" width="200%" height="200%">
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
        const color = SECURITY_STATUS[a.status].color;
        const isActive = active?.id === a.id;
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        return (
          <g key={a.id} className="cursor-pointer" onClick={() => onSelect(a)}>
            <path
              d={d}
              fill={color}
              fillOpacity={!visible ? 0.08 : isActive ? 0.8 : 0.5}
              stroke={isActive ? "#fff" : "#fff"}
              strokeOpacity={!visible ? 0.1 : isActive ? 0.9 : 0.32}
              strokeWidth={isActive ? 3 : 1.4}
            />
            <text
              x={c.x}
              y={c.y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none fill-white text-[10px] font-semibold"
              opacity={visible ? 0.95 : 0.25}
            >
              {a.name}
            </text>
            <text
              x={c.x}
              y={c.y + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none fill-white/70 text-[8.5px]"
              opacity={visible ? 0.9 : 0.2}
            >
              {a.info.cameras} kamera
            </text>
          </g>
        );
      })}

      {/* Hodisa nuqtalari (dots) */}
      {MAHALLA_AREAS.map((a) => {
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        if (!visible) return null;
        return a.incidents.map((inc) => {
          const p = project(inc.pos);
          const col = INCIDENT_TYPES[inc.type]?.color || "#ef4444";
          return (
            <g key={inc.id} className="cursor-pointer" onClick={() => onSelect(a)}>
              <circle cx={p.x} cy={p.y} r="9" fill={col} opacity="0.18">
                <animate attributeName="r" values="6;13;6" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0;0.3" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <circle cx={p.x} cy={p.y} r="4" fill={col} stroke="#fff" strokeWidth="1.2" filter="url(#iib-glow)" />
            </g>
          );
        });
      })}
    </svg>
  );
};

export default IibMapFallback;
