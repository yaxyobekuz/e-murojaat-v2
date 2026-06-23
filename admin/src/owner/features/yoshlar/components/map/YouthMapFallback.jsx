// API kalitsiz — mahallalarni glow doira heatmap sifatida SVG da chizadi.
import { useMemo } from "react";

import { SCORE_TIERS, tierOfScore } from "../../mock/youth.data";

const W = 760;
const H = 460;
const PAD = 40;

const useProjection = (mahallas) =>
  useMemo(() => {
    const lats = mahallas.map((m) => m.lat);
    const lngs = mahallas.map((m) => m.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const sx = (W - PAD * 2) / (maxLng - minLng || 1);
    const sy = (H - PAD * 2) / (maxLat - minLat || 1);
    return (m) => ({ x: PAD + (m.lng - minLng) * sx, y: PAD + (maxLat - m.lat) * sy });
  }, [mahallas]);

const YouthMapFallback = ({ mahallas = [], activeId, onSelect }) => {
  const project = useProjection(mahallas);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full rounded-2xl bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.08),transparent_70%)]">
      <defs>
        {Object.values(SCORE_TIERS).map((t) => (
          <radialGradient key={t.key} id={`g-${t.key}`}>
            <stop offset="0%" stopColor={`rgba(${t.glow},0.55)`} />
            <stop offset="100%" stopColor={`rgba(${t.glow},0)`} />
          </radialGradient>
        ))}
      </defs>
      {/* heatmap glow */}
      {mahallas.map((m) => {
        const p = project(m);
        const tier = SCORE_TIERS[tierOfScore(m.score)];
        return <circle key={`h-${m.id}`} cx={p.x} cy={p.y} r={46} fill={`url(#g-${tier.key})`} />;
      })}
      {/* markerlar */}
      {mahallas.map((m) => {
        const p = project(m);
        const tier = SCORE_TIERS[tierOfScore(m.score)];
        const active = activeId === m.id;
        return (
          <g key={m.id} className="cursor-pointer" onClick={() => onSelect?.(m.id)}>
            <circle cx={p.x} cy={p.y} r={active ? 17 : 14} fill={tier.color} stroke="#fff" strokeWidth={active ? 2.5 : 1.5} />
            <text x={p.x} y={p.y + 0.5} textAnchor="middle" dominantBaseline="central" className="pointer-events-none fill-white text-[11px] font-bold">
              {m.score}
            </text>
            <text x={p.x} y={p.y + 28} textAnchor="middle" className="pointer-events-none fill-white/70 text-[9px]">
              {m.shortName}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default YouthMapFallback;
