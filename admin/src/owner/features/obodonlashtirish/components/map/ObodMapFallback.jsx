// API kalitsiz ko'rinish (SVG). Default: faqat qurilish joylari (kran belgisi + puls).
// showGreen=true bo'lsa: yashil zonalar + daraxt soni qo'shiladi.
import { useMemo } from "react";

import { OBOD_PROJECTS, isGreen, isConstruction } from "../../mock/obod.projects";

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

const ObodMapFallback = ({ active, showGreen = false, onSelect, plantings = null }) => {
  const project = useProjection();
  const maxCount = plantings?.length ? Math.max(...plantings.map((p) => p.count), 1) : 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.10),transparent_60%)]"
    >
      {/* Ekilgan ko'chat nuqtalari (real koordinata) */}
      {plantings?.map((p, i) => {
        if (p.lat == null || p.lng == null) return null;
        const c = project(p);
        const sz = 7 + (p.count / maxCount) * 9;
        const col = p.survivalPct >= 90 ? "#22c55e" : p.survivalPct >= 85 ? "#65a30d" : "#ca8a04";
        return (
          <g key={`pl-${i}`}>
            <circle cx={c.x} cy={c.y} r={sz} fill={col} fillOpacity={0.85} />
            <text x={c.x} y={c.y - sz - 2} textAnchor="middle" className="pointer-events-none fill-foreground text-[9px] font-mono">{p.count}</text>
            <text x={c.x} y={c.y + 3} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none text-[9px]">🌳</text>
          </g>
        );
      })}
      {/* Yashil maydonlar (faqat showGreen) */}
      {showGreen &&
        OBOD_PROJECTS.filter(isGreen).map((p) => {
          const pts = p.path.map(project);
          const d = pts.map((q, i) => `${i === 0 ? "M" : "L"}${q.x},${q.y}`).join(" ") + " Z";
          const c = project(p.center);
          return (
            <g key={`g-${p.id}`} className="cursor-pointer" onClick={() => onSelect(p)}>
              <path d={d} fill="#16a34a" fillOpacity={0.5} stroke="#16a34a" strokeWidth={2} />
              <text
                x={c.x}
                y={c.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none fill-foreground text-[12px] font-semibold"
              >
                🌳 {p.info.trees}
              </text>
            </g>
          );
        })}

      {/* Qurilish joylari — kran belgisi + puls (har doim) */}
      {OBOD_PROJECTS.filter(isConstruction).map((p) => {
        const c = project(p.center);
        const isActive = active?.id === p.id;
        return (
          <g key={`c-${p.id}`} className="cursor-pointer" onClick={() => onSelect(p)}>
            <circle cx={c.x} cy={c.y} r={isActive ? 18 : 14} fill="#d97706" fillOpacity={0.25}>
              <animate attributeName="r" values="10;22;10" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx={c.x} cy={c.y} r={8} fill="#d97706" />
            <text x={c.x} y={c.y + 1} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none text-[10px]">
              🏗️
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default ObodMapFallback;
