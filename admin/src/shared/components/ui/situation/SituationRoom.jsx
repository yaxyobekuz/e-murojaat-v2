// Vaziyat markazi (Command Center) — ATLAS COMMAND uslubidagi to'liq ekranli
// dashboard. 3 panel (IIB/FVV/Ta'lim) bir xil tuzilma, har biri config orqali.
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Search, Activity, Cpu, Wifi, Gauge, CircleDot, Power } from "lucide-react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";

const hexA = (hex, a) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// ── Jonli soat ─────────────────────────────────────────────────────────────────
const useClock = () => {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n) => String(n).padStart(2, "0");
  return {
    time: `${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`,
    date: `${p(t.getDate())}.${p(t.getMonth() + 1)}.${t.getFullYear()}`,
  };
};

// ── Panel (sarlavhali, burchak qavslari + glow) ────────────────────────────────
const Panel = ({ title, icon: Icon, accent, right, children, className = "", bodyClass = "" }) => (
  <div className={`relative flex min-h-0 flex-col overflow-hidden rounded-lg border bg-[#0a1224]/80 ${className}`}
    style={{ borderColor: hexA(accent, 0.22), boxShadow: `inset 0 0 30px ${hexA(accent, 0.06)}` }}>
    {/* burchak qavslari */}
    {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"], ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]].map(([pos, b], i) => (
      <span key={i} className={`pointer-events-none absolute ${pos} ${b} size-3`} style={{ borderColor: accent }} />
    ))}
    {title && (
      <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${hexA(accent, 0.18)}`, background: hexA(accent, 0.05) }}>
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="size-3.5" style={{ color: accent }} />}
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">{title}</span>
        </div>
        {right && <span className="text-[9px] font-medium uppercase tracking-wider text-white/35">{right}</span>}
      </div>
    )}
    <div className={`min-h-0 flex-1 ${bodyClass}`}>{children}</div>
  </div>
);

// ── Command header ─────────────────────────────────────────────────────────────
const CommandHeader = ({ brand, nav, accent }) => {
  const { time, date } = useClock();
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border bg-[#0a1224]/80 px-4 py-2"
      style={{ borderColor: hexA(accent, 0.22) }}>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-md" style={{ background: hexA(accent, 0.15), color: accent, boxShadow: `0 0 14px ${hexA(accent, 0.5)}` }}>
          <CircleDot className="size-4" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-[0.2em] text-white">{brand.title}</div>
          <div className="text-[9px] uppercase tracking-[0.25em]" style={{ color: accent }}>{brand.subtitle}</div>
        </div>
      </div>
      <div className="hidden items-center gap-1 lg:flex">
        {nav.map((n, i) => (
          <button key={n} className="flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors"
            style={i === 0 ? { background: hexA(accent, 0.16), color: accent } : { color: "rgba(255,255,255,0.45)" }}>
            {i === 1 && <Search className="size-3" />}{n}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="font-mono text-base font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 10px ${hexA(accent, 0.6)}` }}>{time}</div>
          <div className="font-mono text-[9px] tracking-wider text-white/40">{date}</div>
        </div>
        <span className="grid size-7 place-items-center rounded-md border text-rose-400" style={{ borderColor: hexA("#ef4444", 0.4) }}><Power className="size-3.5" /></span>
      </div>
    </div>
  );
};

// ── KPI command tile ───────────────────────────────────────────────────────────
const KpiTile = ({ icon: Icon, label, value, accent, highlight }) => (
  <div className="relative flex items-center gap-2.5 overflow-hidden rounded-lg border bg-[#0a1224]/80 px-3 py-2"
    style={{ borderColor: highlight ? hexA(accent, 0.5) : "rgba(255,255,255,0.08)", boxShadow: highlight ? `0 0 18px ${hexA(accent, 0.25)}` : "none" }}>
    <span className="grid size-8 shrink-0 place-items-center rounded-md" style={{ background: hexA(accent, 0.14), color: accent }}>
      {Icon && <Icon className="size-4" />}
    </span>
    <div className="min-w-0 leading-tight">
      <div className="truncate text-[9px] font-medium uppercase tracking-wider text-white/45">{label}</div>
      <div className="font-mono text-[15px] font-bold tabular-nums text-white" style={{ textShadow: highlight ? `0 0 10px ${hexA(accent, 0.6)}` : "none" }}>{value}</div>
    </div>
  </div>
);

// ── Iyerarxiya ro'yxati ────────────────────────────────────────────────────────
const HierarchyList = ({ items, accent }) => (
  <div className="flex flex-col">
    {items.map((it, i) => (
      <div key={i} className="flex items-center gap-2.5 px-3 py-1.5" style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <span className="grid size-6 shrink-0 place-items-center rounded" style={{ background: hexA(accent, 0.12), color: accent }}>
          <ChevronRight className="size-3" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[11px] font-medium text-white/85">{it.label}</div>
          {it.sub && <div className="truncate text-[9px] text-white/35">{it.sub}</div>}
        </div>
        <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color: accent }}>{it.value}</span>
      </div>
    ))}
  </div>
);

// ── Progress bar qatori (samaradorlik / kogorta) ───────────────────────────────
const BarRow = ({ label, value, pct, accent, unit }) => (
  <div className="px-3 py-1.5">
    <div className="mb-1 flex items-center justify-between text-[10.5px]">
      <span className="text-white/70">{label}</span>
      <span className="font-mono font-semibold tabular-nums text-white">{value}{unit}</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${hexA(accent, 0.4)}, ${accent})`, boxShadow: `0 0 8px ${hexA(accent, 0.6)}` }} />
    </div>
  </div>
);

// ── Hududiy reyting (scroll list) ──────────────────────────────────────────────
const RatingList = ({ items, accent }) => (
  <div className="max-h-full overflow-y-auto">
    {items.map((it, i) => (
      <div key={i} className="flex items-center gap-2 px-3 py-[5px]">
        <span className="w-4 shrink-0 font-mono text-[9px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
        <span className="grid size-4 shrink-0 place-items-center rounded-sm" style={{ background: hexA(accent, 0.14), color: accent }}>
          <CircleDot className="size-2.5" />
        </span>
        <span className="flex-1 truncate text-[10.5px] text-white/80">{it.label}</span>
        <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-white/5 sm:block">
          <div className="h-full rounded-full" style={{ width: `${it.pct}%`, background: accent }} />
        </div>
        <span className="w-10 shrink-0 text-right font-mono text-[10.5px] font-semibold tabular-nums" style={{ color: accent }}>{it.pct}%</span>
      </div>
    ))}
  </div>
);

// ── Tizim holati ───────────────────────────────────────────────────────────────
const SystemStatus = ({ accent }) => (
  <div className="grid grid-cols-2 gap-2 p-3">
    <div className="col-span-2 flex items-center justify-between rounded-md border px-3 py-2" style={{ borderColor: hexA("#22c55e", 0.3), background: hexA("#22c55e", 0.06) }}>
      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/60"><Power className="size-3.5 text-emerald-400" /> Holat</span>
      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> OPERATIONAL</span>
    </div>
    {[{ i: Cpu, l: "Edge nodes", v: "98/98", s: "100% online" }, { i: Wifi, l: "Latency", v: "25ms", s: "OPTIMAL" }].map((x, k) => (
      <div key={k} className="rounded-md border border-white/8 bg-white/[0.02] p-2">
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-white/40"><x.i className="size-3" style={{ color: accent }} /> {x.l}</div>
        <div className="mt-0.5 font-mono text-sm font-bold text-white">{x.v}</div>
        <div className="text-[9px]" style={{ color: accent }}>{x.s}</div>
      </div>
    ))}
  </div>
);

// ── Dinamika grafigi (yorqin maydon) ───────────────────────────────────────────
const DynamicsChart = ({ accent }) => {
  const option = useMemo(() => {
    const data = Array.from({ length: 32 }, (_, i) => Math.round(40 + 30 * Math.sin(i / 4) + i * 1.4 + (i % 5) * 4));
    return {
      grid: { left: 6, right: 10, top: 14, bottom: 18 },
      xAxis: { type: "category", boundaryGap: false, data: data.map((_, i) => i), axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } }, axisLabel: { show: false }, axisTick: { show: false } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9 } },
      tooltip: { trigger: "axis", backgroundColor: "#0a1224", borderColor: hexA(accent, 0.4), textStyle: { color: "#fff", fontSize: 11 } },
      series: [{
        type: "line", smooth: true, symbol: "none", data,
        lineStyle: { width: 2.5, color: accent, shadowColor: accent, shadowBlur: 14 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: hexA(accent, 0.5) }, { offset: 1, color: hexA(accent, 0) }] } },
      }],
    };
  }, [accent]);
  return <EChart option={option} height={150} />;
};

// ── Viloyat xaritasi (voronoi tumanlar + glow) ─────────────────────────────────
const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const clipHP = (poly, a, b, c) => {
  const out = []; const inside = (p) => a * p.x + b * p.y <= c + 1e-9;
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i], prev = poly[(i + poly.length - 1) % poly.length];
    const ci = inside(cur), pi = inside(prev);
    if (ci !== pi) { const dx = cur.x - prev.x, dy = cur.y - prev.y, den = a * dx + b * dy, t = den === 0 ? 0 : (c - (a * prev.x + b * prev.y)) / den; out.push({ x: prev.x + t * dx, y: prev.y + t * dy }); }
    if (ci) out.push(cur);
  }
  return out;
};
const RegionMap = ({ title, accent, mapAccent, districts, right }) => {
  const { cells, silhouette } = useMemo(() => {
    const W = 600, H = 360, bb = { x0: 50, y0: 60, x1: 550, y1: 310 };
    const n = districts.length;
    const cols = Math.ceil(Math.sqrt(n * 1.7)), rows = Math.ceil(n / cols);
    const seeds = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (idx >= n) break;
      const gx = bb.x0 + (c + 0.5) * ((bb.x1 - bb.x0) / cols) + (rng(idx * 3.1) - 0.5) * 40;
      const gy = bb.y0 + (r + 0.5) * ((bb.y1 - bb.y0) / rows) + (rng(idx * 5.7) - 0.5) * 32;
      seeds.push({ x: gx, y: gy, name: districts[idx].name, hot: districts[idx].hot }); idx++;
    }
    const box = { x0: bb.x0 - 14, y0: bb.y0 - 14, x1: bb.x1 + 14, y1: bb.y1 + 14 };
    const cells = seeds.map((s) => {
      let poly = [{ x: box.x0, y: box.y0 }, { x: box.x1, y: box.y0 }, { x: box.x1, y: box.y1 }, { x: box.x0, y: box.y1 }];
      for (const o of seeds) { if (o === s) continue; const a = o.x - s.x, b = o.y - s.y, c = (o.x * o.x - s.x * s.x + o.y * o.y - s.y * s.y) / 2; poly = clipHP(poly, a, b, c); if (!poly.length) break; }
      return { ...s, poly };
    });
    const silhouette = "M70,185 C70,120 150,80 240,86 C310,66 395,78 445,104 C525,100 555,150 548,196 C556,256 495,300 415,294 C335,316 245,312 188,294 C112,300 66,252 70,185 Z";
    return { cells, silhouette };
  }, [districts]);

  return (
    <Panel title={title} icon={Activity} accent={accent} right={right} className="flex-1" bodyClass="relative">
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 45%, ${hexA(mapAccent, 0.12)}, transparent 65%)` }} />
      <svg viewBox="0 0 600 360" className="h-full w-full">
        <defs>
          <clipPath id="prov-clip"><path d={silhouette} /></clipPath>
          <filter id="prov-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
        </defs>
        {/* glow silueti */}
        <path d={silhouette} fill="none" stroke={mapAccent} strokeWidth="6" opacity="0.5" filter="url(#prov-glow)" />
        <g clipPath="url(#prov-clip)">
          {cells.map((c, i) => {
            const d = c.poly.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";
            const col = c.hot ? "#fbbf24" : mapAccent;
            return <path key={i} d={d} fill={hexA(col, c.hot ? 0.55 : 0.32)} stroke={hexA(col, 0.9)} strokeWidth="1" />;
          })}
        </g>
        <path d={silhouette} fill="none" stroke={hexA(mapAccent, 0.9)} strokeWidth="1.5" />
        {cells.map((c, i) => {
          const cx = c.poly.reduce((s, p) => s + p.x, 0) / c.poly.length;
          const cy = c.poly.reduce((s, p) => s + p.y, 0) / c.poly.length;
          return <text key={`t${i}`} x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="pointer-events-none fill-white font-medium" style={{ fontSize: 8, textShadow: "0 1px 2px #000" }}>{c.name}</text>;
        })}
      </svg>
      {/* legenda */}
      <div className="absolute bottom-2 left-3 flex gap-3 text-[8.5px] text-white/55">
        <span className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ background: mapAccent }} /> Faol</span>
        <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-400" /> Yuqori</span>
      </div>
    </Panel>
  );
};

// ── Asosiy ─────────────────────────────────────────────────────────────────────
export default function SituationRoom({ config }) {
  const a = config.accent;
  return (
    <div className="flex flex-col gap-3 rounded-2xl p-3"
      style={{ background: "radial-gradient(circle at 50% 0%, #0c1730, #060b16 70%)", backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "100% 100%, 34px 34px, 34px 34px" }}>
      <CommandHeader brand={config.brand} nav={config.nav} accent={a} />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {config.kpis.map((k, i) => <KpiTile key={i} {...k} accent={a} />)}
      </div>

      {/* asosiy 3 ustun */}
      <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "calc(100vh - 16rem)" }}>
        {/* chap */}
        <div className="flex flex-col gap-3 xl:col-span-3">
          <Panel title={config.hierarchy.title} icon={config.hierarchy.icon} accent={a} right="LIVE" className="flex-1">
            <HierarchyList items={config.hierarchy.items} accent={a} />
          </Panel>
          <Panel title={config.efficiency.title} icon={Gauge} accent={a} className="flex-1">
            <div className="flex flex-col py-1">
              {config.efficiency.items.map((it, i) => <BarRow key={i} {...it} accent={a} />)}
            </div>
          </Panel>
        </div>

        {/* markaz */}
        <div className="flex flex-col gap-3 xl:col-span-6">
          <RegionMap title={config.mapTitle} accent={a} mapAccent={config.mapAccent} districts={config.districts} right="DATA VALID · LIVE" />
          <Panel title={config.dynamicsTitle} icon={Activity} accent={a}>
            <DynamicsChart accent={a} />
          </Panel>
        </div>

        {/* o'ng */}
        <div className="flex flex-col gap-3 xl:col-span-3">
          <Panel title={config.ratings.title} icon={Activity} accent={a} className="flex-1" bodyClass="min-h-0">
            <RatingList items={config.ratings.items} accent={a} />
          </Panel>
          <Panel title={config.cohorts.title} icon={Activity} accent={a}>
            <div className="flex flex-col py-1.5">
              {config.cohorts.items.map((it, i) => <BarRow key={i} {...it} accent={a} />)}
            </div>
          </Panel>
          <Panel title="Tizim holati" icon={Cpu} accent={a}>
            <SystemStatus accent={a} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
