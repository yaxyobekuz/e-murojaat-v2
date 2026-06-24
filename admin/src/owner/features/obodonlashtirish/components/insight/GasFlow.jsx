// Gaz mashinasi oqimi — mahallalardan qabul nuqtasiga animatsiyali suyuq chiqindi oqimi.
// Har chiziq bo'ylab harakatlanuvchi nuqta = yo'ldagi assenizatsiya mashinasi.
import { motion } from "framer-motion";
import { Truck } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";

// nodes: [{ name, value }] — mahallalar; markazga (qabul nuqtasi) oqadi
export const GasFlow = ({ nodes, accent, height = 280 }) => {
  const W = 600, H = 360;
  const cx = W / 2, cy = H / 2;
  const n = nodes.length;
  const pts = nodes.map((nd, i) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const rx = W * 0.40, ry = H * 0.38;
    return { ...nd, x: cx + Math.cos(ang) * rx, y: cy + Math.sin(ang) * ry };
  });
  const maxV = Math.max(...nodes.map((nd) => nd.value), 1);

  return (
    <div className="relative w-full" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full">
        <defs>
          <radialGradient id="gf-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={hexA(accent, 0.9)} />
            <stop offset="100%" stopColor={hexA(accent, 0.1)} />
          </radialGradient>
        </defs>

        {pts.map((p, i) => {
          const dur = 2.4 + (i % 4) * 0.5;
          const w = 1 + (p.value / maxV) * 2.5;
          return (
            <g key={i}>
              <line x1={p.x} y1={p.y} x2={cx} y2={cy} stroke={hexA(accent, 0.18)} strokeWidth={w} />
              <motion.circle r={3.4} fill={accent}
                style={{ filter: `drop-shadow(0 0 5px ${accent})` }}
                animate={{ cx: [p.x, cx], cy: [p.y, cy] }}
                transition={{ duration: dur, repeat: Infinity, ease: "easeIn", delay: i * 0.25 }} />
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r={34} fill="url(#gf-core)" />
        <motion.circle cx={cx} cy={cy} r={34} fill="none" stroke={accent} strokeWidth={1.5}
          animate={{ r: [34, 46], opacity: [0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />
        <circle cx={cx} cy={cy} r={22} fill={hexA(accent, 0.2)} stroke={accent} strokeWidth={1.5} />
        <text x={cx} y={cy - 1} textAnchor="middle" className="fill-foreground font-semibold" style={{ fontSize: 9 }}>QABUL</text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-foreground" style={{ fontSize: 7 }}>nuqtasi</text>

        {pts.map((p, i) => (
          <g key={`node-${i}`}>
            <circle cx={p.x} cy={p.y} r={13} fill={hexA(accent, 0.12)} stroke={hexA(accent, 0.6)} strokeWidth={1} />
            <text x={p.x} y={p.y + 3} textAnchor="middle" className="fill-foreground font-mono" style={{ fontSize: 8 }}>{p.value}</text>
            <text x={p.x} y={p.y - 18} textAnchor="middle" className="fill-foreground" style={{ fontSize: 7.5 }}>{p.name}</text>
          </g>
        ))}
      </svg>

      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[9px] text-foreground/50">
        <Truck className="size-3" style={{ color: accent }} /> Yo'ldagi mashina · raqam = buyurtma soni
      </div>
    </div>
  );
};
