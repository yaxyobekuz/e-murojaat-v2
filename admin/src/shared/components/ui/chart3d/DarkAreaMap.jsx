import { useState } from "react";

// Dark operatsion xarita — mahalla hududi + marker'lar (kamera / hodisa / post)
const STYLES = {
  camera: { color: "#22d3ee", glow: "rgba(34,211,238,0.5)" },
  incident: { color: "#fb7185", glow: "rgba(251,113,133,0.55)" },
  unit: { color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
};

export function DarkAreaMap({ markers, height = 320 }) {
  const [hover, setHover] = useState(null);
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-white/10"
      style={{ height, background: "radial-gradient(120% 100% at 30% 10%, #0e1830, #070b16 70%)" }}
    >
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="dmap-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="#1b2740" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dmap-grid)" opacity="0.5" />
        <path d="M0,62 C180,40 320,90 520,66 760,40 900,80 1200,58" fill="none" stroke="#27406b" strokeWidth="6" opacity="0.5" />
        <path d="M150,0 C170,120 130,220 200,360" fill="none" stroke="#22344f" strokeWidth="5" opacity="0.5" />
        <path d="M0,180 C260,150 520,210 800,170 1000,140 1100,200 1280,180" fill="none" stroke="#22344f" strokeWidth="4" opacity="0.45" />
        <path d="M40,300 C220,260 380,330 560,290 760,250 920,320 1240,270" fill="none" stroke="#155e75" strokeWidth="7" opacity="0.4" />
      </svg>

      {markers.map((m) => {
        const s = STYLES[m.type];
        return (
          <button
            key={m.id}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            onMouseEnter={() => setHover(m)}
            onMouseLeave={() => setHover(null)}
          >
            {m.type === "incident" ? (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: s.color }} />
                <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px 2px ${s.glow}` }} />
              </span>
            ) : (
              <span
                className="block rounded-full ring-2 ring-white/20"
                style={{ width: m.type === "unit" ? 14 : 9, height: m.type === "unit" ? 14 : 9, background: s.color, boxShadow: `0 0 8px 1px ${s.glow}` }}
              />
            )}
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-xl bg-black/40 px-3 py-2 text-[11px] text-slate-300 backdrop-blur">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Kamera</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Hodisa</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Post</span>
      </div>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-black/80 px-2.5 py-1.5 text-xs text-white backdrop-blur"
          style={{ left: `${Math.min(88, Math.max(12, hover.x))}%`, top: `${Math.max(10, hover.y - 4)}%` }}
        >
          <div className="font-semibold">{hover.label}</div>
          {hover.status && <div className="text-[11px] text-slate-400">{hover.status}</div>}
        </div>
      )}
    </div>
  );
}

export default DarkAreaMap;
