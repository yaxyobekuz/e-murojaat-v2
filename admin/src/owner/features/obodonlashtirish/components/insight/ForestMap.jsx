// Ekilgan daraxtlar XARITADA — har ekish nuqtasi real koordinatasiga ko'ra joylashtiriladi.
// Daraxt o'lchami = ekilgan soni. Tepada jonli umumiy hisoblagich, ostida mahalla bo'yicha soni.
import { useState } from "react";
import { motion } from "framer-motion";

import { hexA } from "@/shared/components/ui/command/primitives";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";

const CANOPY = ["#22c55e", "#16a34a", "#84cc16", "#15803d", "#4ade80"];

// Bitta daraxt — o'sish + shamol tebranishi
const Tree = ({ x, y, size, color, delay, weak, active, onClick, label }) => {
  const trunkH = 10 * size;
  const cr = 8 * size;
  const c = weak ? "#a3a847" : color;
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${x}px ${y}px`, transformBox: "fill-box", cursor: "pointer" }}
      onClick={onClick}
    >
      {active && <circle cx={x} cy={y - trunkH - cr * 0.3} r={cr * 1.7} fill="none" stroke={c} strokeWidth={1.5} opacity={0.7} />}
      <rect x={x - 1.4 * size} y={y - trunkH} width={2.8 * size} height={trunkH} rx={1} fill="#6b4f2a" />
      <motion.g
        animate={{ rotate: [-2.2, 2.2, -2.2] }}
        transition={{ duration: 3.5 + (Math.round(x) % 5) * 0.4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.4 }}
        style={{ transformOrigin: `${x}px ${y - trunkH}px` }}
      >
        <circle cx={x} cy={y - trunkH - cr * 0.45} r={cr} fill={c} opacity={0.94} style={{ filter: active ? `drop-shadow(0 0 6px ${c})` : "none" }} />
        <circle cx={x - cr * 0.5} cy={y - trunkH + cr * 0.05} r={cr * 0.66} fill={c} opacity={0.85} />
        <circle cx={x + cr * 0.5} cy={y - trunkH + cr * 0.05} r={cr * 0.66} fill={c} opacity={0.85} />
      </motion.g>
      {/* soni — faqat aktiv yoki katta daraxtlarda */}
      {(active || size > 1.25) && (
        <text x={x} y={y + 11} textAnchor="middle" className="pointer-events-none fill-white font-mono" style={{ fontSize: 7.5, textShadow: "0 1px 2px #000" }}>{label}</text>
      )}
    </motion.g>
  );
};

// plantings: [{ lat, lng, count, mahalla, type, survivalPct }] · bounds: {minLat..maxLng}
export const ForestMap = ({ plantings, bounds, total, survival, accent = "#22c55e", height = 360 }) => {
  const [active, setActive] = useState(null);
  const W = 900, H = 460;
  const pad = 40;
  const live = useCountUp(total, 1600);

  const nx = (lng) => pad + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (W - 2 * pad);
  const ny = (lat) => pad + (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (H - 2 * pad);

  const maxCount = Math.max(...plantings.map((p) => p.count), 1);
  const trees = plantings.map((p, i) => ({
    ...p, i,
    x: nx(p.lng), y: ny(p.lat),
    size: 0.8 + (p.count / maxCount) * 1.4,
    color: CANOPY[i % CANOPY.length],
    weak: p.survivalPct < survival - 4,
    delay: 0.15 + (i % 12) * 0.06,
  })).sort((a, b) => a.y - b.y);

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height,
      background: "linear-gradient(180deg, #08120e 0%, #0b1a13 60%, #0d2018 100%)" }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <pattern id="fm-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke={hexA(accent, 0.07)} strokeWidth="1" />
          </pattern>
        </defs>
        {/* xarita foni — grid + tuman konturi */}
        <rect x={0} y={0} width={W} height={H} fill="url(#fm-grid)" />
        <rect x={pad - 10} y={pad - 10} width={W - 2 * pad + 20} height={H - 2 * pad + 20} rx={16}
          fill={hexA(accent, 0.04)} stroke={hexA(accent, 0.25)} strokeWidth={1} strokeDasharray="6 5" />
        {/* daraxtlar */}
        {trees.map((t) => (
          <Tree key={t.i} {...t} label={t.count.toLocaleString("uz-UZ")}
            active={active === t.i} onClick={() => setActive(active === t.i ? null : t.i)} />
        ))}
      </svg>

      {/* jonli umumiy hisoblagich */}
      <div className="absolute left-4 top-3 rounded-xl border bg-black/45 px-3 py-2 backdrop-blur-md" style={{ borderColor: hexA(accent, 0.3) }}>
        <div className="font-mono text-2xl font-bold tabular-nums text-white" style={{ textShadow: `0 0 16px ${hexA(accent, 0.6)}` }}>{live.toLocaleString("uz-UZ")}</div>
        <div className="text-[10px] uppercase tracking-wider text-white/55">jami ekilgan ko'chat</div>
      </div>
      <div className="absolute right-4 top-3 flex items-center gap-1.5 rounded-full border bg-black/45 px-2.5 py-1 backdrop-blur-md" style={{ borderColor: hexA(accent, 0.3) }}>
        <span className="size-2 animate-pulse rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <span className="text-[10px] font-medium text-white/70">{plantings.length} ekish nuqtasi · {survival}% tirik</span>
      </div>

      {/* tanlangan nuqta detali */}
      {active != null && (() => {
        const t = trees.find((x) => x.i === active);
        return (
          <div className="absolute bottom-3 left-4 rounded-xl border bg-black/70 px-3 py-2 backdrop-blur-md" style={{ borderColor: hexA(accent, 0.4) }}>
            <div className="text-[12px] font-semibold text-white">{t.mahalla}</div>
            <div className="mt-0.5 font-mono text-[11px]" style={{ color: accent }}>{t.count.toLocaleString("uz-UZ")} ko'chat · {t.survivalPct}% tirik</div>
            <div className="text-[9.5px] text-white/45">{t.coords}</div>
          </div>
        );
      })()}

      <div className="absolute bottom-3 right-4 text-[9px] text-white/40">Daraxt o'lchami = ekilgan soni · bosib ko'ring</div>
    </div>
  );
};
