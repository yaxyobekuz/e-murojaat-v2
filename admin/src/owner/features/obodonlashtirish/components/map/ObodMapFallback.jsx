// API kalitsiz ko'rinish — loyiha zonalarini SVG sifatida chizadi (progress % bilan).
import { useMemo } from "react";

import { OBOD_PROJECTS, PROJECT_STATUS } from "../../mock/obod.projects";

const PAD = 24;
const W = 720;
const H = 420;

const useProjection = () =>
  useMemo(() => {
    const pts = OBOD_PROJECTS.flatMap((p) => p.path);
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

const centroid = (pts) => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
});

const ObodMapFallback = ({ active, statusFilter = [], onSelect }) => {
  const project = useProjection();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.10),transparent_60%)]"
    >
      {OBOD_PROJECTS.map((p) => {
        const pts = p.path.map(project);
        const d = pts.map((q, i) => `${i === 0 ? "M" : "L"}${q.x},${q.y}`).join(" ") + " Z";
        const c = centroid(pts);
        const color = PROJECT_STATUS[p.status].color;
        const isActive = active?.id === p.id;
        const visible = statusFilter.length === 0 || statusFilter.includes(p.status);
        return (
          <g key={p.id} className="cursor-pointer" onClick={() => onSelect(p)}>
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
              {p.info.progress}%
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ObodMapFallback;
