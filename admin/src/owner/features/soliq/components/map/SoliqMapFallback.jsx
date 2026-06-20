// API kalitsiz ko'rinish — mahalla bloklarini SVG choropleth sifatida chizadi.
// Real lat/lng poligonlarni ekran koordinatasiga proyeksiya qiladi (oddiy linear).
import { useMemo } from "react";

import { MAHALLA_AREAS, TAX_STATUS } from "../../mock/soliq.mapAreas";

const PAD = 24;
const W = 720;
const H = 420;

// Barcha nuqtalarning chegarasini topib, [PAD..W-PAD] oralig'iga proyeksiya
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
      // lat yuqoriga o'sadi, ekran y pastga — teskari
      y: PAD + (maxLat - lat) * sy,
    });
    return project;
  }, []);

const centroid = (pts) => {
  const x = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const y = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  return { x, y };
};

const SoliqMapFallback = ({ active, statusFilter = [], onSelect }) => {
  const project = useProjection();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_60%)]"
    >
      {MAHALLA_AREAS.map((a) => {
        const pts = a.path.map(project);
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
        const c = centroid(pts);
        const color = TAX_STATUS[a.status].color;
        const isActive = active?.id === a.id;
        const visible = statusFilter.length === 0 || statusFilter.includes(a.status);
        return (
          <g key={a.id} className="cursor-pointer" onClick={() => onSelect(a)}>
            <path
              d={d}
              fill={color}
              fillOpacity={!visible ? 0.1 : isActive ? 0.85 : 0.55}
              stroke="#fff"
              strokeOpacity={!visible ? 0.12 : 0.35}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <text
              x={c.x}
              y={c.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="pointer-events-none fill-white text-[11px] font-semibold"
              opacity={visible ? 1 : 0.25}
            >
              {a.info.collectionRate}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default SoliqMapFallback;
