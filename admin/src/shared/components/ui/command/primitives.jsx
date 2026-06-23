// Command-center primitivlari — admin to'q palitrasiga moslangan (bg-card, white/0.07
// border, glow aksent). Bitta mahalla (Navbahor MFY) miqyosi. Funksional, qayta ishlatiladi.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CircleDot, Power, Video, VideoOff, Circle, Info, X, Database, Clock, Plus, Trash2, Car, User, Play, MapPin } from "lucide-react";

import { EChart } from "@/shared/components/ui/chart3d/EChart";

export const hexA = (hex, a) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Ma'lumot manbasi konteksti — har panel qaysi tizimdan kelishini ko'rsatadi
const SourceContext = createContext({ system: "Ma'lumotlar bazasi", place: "" });

export const useClock = () => {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  const p = (n) => String(n).padStart(2, "0");
  return { time: `${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`, date: `${p(t.getDate())}.${p(t.getMonth() + 1)}.${t.getFullYear()}` };
};

// ── Header ──
export const CmdHeader = ({ brand, place, nav, accent, active, onNav }) => {
  const { time, date } = useClock();
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[rgb(var(--card-border))] bg-card px-4 py-2">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-md" style={{ background: hexA(accent, 0.15), color: accent, boxShadow: `0 0 14px ${hexA(accent, 0.5)}` }}><CircleDot className="size-4" /></span>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-[0.18em] text-foreground">{brand}</div>
          <div className="text-[9px] uppercase tracking-[0.22em]" style={{ color: accent }}>{place}</div>
        </div>
      </div>
      <div className="hidden items-center gap-1 lg:flex">
        {nav.map((n, i) => {
          const on = active != null ? n === active : i === 0;
          return (
            <button key={n} onClick={() => onNav?.(n)}
              className="flex items-center gap-1 rounded px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors hover:text-white"
              style={on ? { background: hexA(accent, 0.18), color: accent } : { color: "hsl(var(--muted-foreground))" }}>
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="font-mono text-base font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 10px ${hexA(accent, 0.6)}` }}>{time}</div>
          <div className="font-mono text-[9px] tracking-wider text-foreground/40">{date}</div>
        </div>
        <span className="grid size-7 place-items-center rounded-md border border-rose-500/40 text-rose-400"><Power className="size-3.5" /></span>
      </div>
    </div>
  );
};

// ── Manba oynasi (chart/bo'limni bosganda — ma'lumot qayerdan kelishi) ──
const SourceOverlay = ({ title, source, accent, onClose }) => {
  const { system, place } = useContext(SourceContext);
  const { time } = useClock();
  return (
    <div className="absolute inset-0 z-40 flex flex-col gap-2 p-3 backdrop-blur-sm" style={{ background: "rgba(8,8,10,0.92)" }} onClick={onClose}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}><Database className="size-3.5" /> Ma'lumot manbasi</span>
        <button onClick={onClose} className="text-foreground/50 hover:text-foreground"><X className="size-4" /></button>
      </div>
      <div className="flex flex-col gap-1.5 text-[11.5px]">
        <Field k="Bo'lim" v={title} accent={accent} />
        <Field k="Manba" v={source} accent={accent} />
        <Field k="Tizim" v={system} accent={accent} />
        {place && <Field k="Hudud" v={place} accent={accent} />}
        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400"><span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> Real vaqt · sinxron</div>
        <div className="flex items-center gap-1.5 text-[10px] text-foreground/45"><Clock className="size-3" /> Oxirgi yangilanish: <span className="font-mono">{time}</span></div>
      </div>
      <div className="mt-auto text-[9.5px] text-foreground/35">Yopish uchun bosing</div>
    </div>
  );
};
const Field = ({ k, v, accent }) => (
  <div className="flex items-start justify-between gap-3 rounded border border-white/5 bg-white/[0.02] px-2 py-1">
    <span className="text-foreground/45">{k}</span>
    <span className="text-right font-medium" style={{ color: accent }}>{v}</span>
  </div>
);

// ── Panel (admin surface + accent header + manba footer/oyna) ──
export const Panel = ({ title, icon: Icon, accent, right, source, clickToSource, children, className = "", bodyClass = "" }) => {
  const [open, setOpen] = useState(false);
  const src = source || title || "Tizim";
  return (
    <div className={`relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-[rgb(var(--card-border))] bg-card ${className}`}
      style={{ boxShadow: `inset 0 0 28px ${hexA(accent, 0.05)}` }}>
      {[["top-0 left-0", "border-t border-l"], ["top-0 right-0", "border-t border-r"], ["bottom-0 left-0", "border-b border-l"], ["bottom-0 right-0", "border-b border-r"]].map(([pos, b], i) => (
        <span key={i} className={`pointer-events-none absolute ${pos} ${b} size-2.5`} style={{ borderColor: hexA(accent, 0.6) }} />
      ))}
      {title && (
        <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ borderBottom: `1px solid ${hexA(accent, 0.16)}`, background: hexA(accent, 0.04) }}>
          <div className="flex items-center gap-1.5">{Icon && <Icon className="size-3.5" style={{ color: accent }} />}<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/75">{title}</span></div>
          <div className="flex items-center gap-2">
            {right && <span className="text-[9px] font-medium uppercase tracking-wider text-foreground/35">{right}</span>}
            <button onClick={() => setOpen(true)} title="Ma'lumot manbasi" className="text-foreground/35 transition-colors hover:text-foreground"><Info className="size-3.5" /></button>
          </div>
        </div>
      )}
      <div className={`min-h-0 flex-1 ${clickToSource ? "cursor-pointer" : ""} ${bodyClass}`} onClick={clickToSource ? () => setOpen(true) : undefined}>{children}</div>
      <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-3 py-1 text-[9px] text-foreground/40 transition-colors hover:text-foreground/70" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Database className="size-2.5" style={{ color: hexA(accent, 0.7) }} /> Manba: <span className="truncate" style={{ color: hexA(accent, 0.85) }}>{src}</span>
      </button>
      {open && <SourceOverlay title={title} source={src} accent={accent} onClose={() => setOpen(false)} />}
    </div>
  );
};

// ── KPI command tile (bosilsa manba ko'rinadi) ──
export const StatTile = ({ icon: Icon, label, value, accent, highlight, source }) => {
  const { system } = useContext(SourceContext);
  const [show, setShow] = useState(false);
  return (
    <button onClick={() => setShow((s) => !s)} title={`Manba: ${source || system}`}
      className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border bg-card px-3 py-2 text-left transition-colors hover:border-white/20"
      style={{ borderColor: highlight ? hexA(accent, 0.5) : "rgb(var(--card-border))", boxShadow: highlight ? `0 0 18px ${hexA(accent, 0.22)}` : "none" }}>
      <span className="grid size-8 shrink-0 place-items-center rounded-md" style={{ background: hexA(accent, 0.14), color: accent }}>{Icon && <Icon className="size-4" />}</span>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[9px] font-medium uppercase tracking-wider text-foreground/45">{label}</div>
        <div className="font-mono text-[15px] font-bold tabular-nums text-foreground" style={{ textShadow: highlight ? `0 0 10px ${hexA(accent, 0.55)}` : "none" }}>{value}</div>
      </div>
      {show && (
        <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 truncate bg-black/85 px-2 py-0.5 text-[8.5px]" style={{ color: accent }}>
          <Database className="size-2.5" /> {source || system}
        </span>
      )}
    </button>
  );
};

// ── Progress bar qator ──
export const BarRow = ({ label, value, pct, accent, unit, color }) => (
  <div className="px-3 py-1.5">
    <div className="mb-1 flex items-center justify-between text-[10.5px]"><span className="text-foreground/70">{label}</span><span className="font-mono font-semibold tabular-nums text-foreground">{value}{unit}</span></div>
    <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${hexA(color || accent, 0.4)}, ${color || accent})`, boxShadow: `0 0 8px ${hexA(color || accent, 0.55)}` }} /></div>
  </div>
);

// ── Radial gauge ──
export const RadialGauge = ({ value, label, sub, accent, size = 96 }) => {
  const r = size / 2 - 8, circ = 2 * Math.PI * r, off = circ * (1 - value / 100);
  return (
    <div className="flex flex-col items-center gap-1 p-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ filter: `drop-shadow(0 0 5px ${hexA(accent, 0.7)})`, transition: "stroke-dashoffset 0.8s" }} />
      </svg>
      <div className="-mt-[60%] flex flex-col items-center" style={{ marginTop: -size * 0.62 }}>
        <span className="font-mono text-lg font-bold" style={{ color: accent }}>{value}%</span>
      </div>
      <div className="mt-[35%] text-center leading-tight" style={{ marginTop: size * 0.3 }}>
        <div className="text-[10px] font-medium text-foreground/75">{label}</div>
        {sub && <div className="text-[9px] text-foreground/40">{sub}</div>}
      </div>
    </div>
  );
};

// ── Donut (EChart) ──
export const Donut = ({ data, accent, height = 200 }) => {
  const option = useMemo(() => ({
    tooltip: { trigger: "item", backgroundColor: "#16161a", borderColor: hexA(accent, 0.4), textStyle: { color: "#fff", fontSize: 11 } },
    legend: { bottom: 0, textStyle: { color: "rgba(255,255,255,0.55)", fontSize: 10 }, icon: "circle", itemWidth: 8, itemHeight: 8 },
    series: [{ type: "pie", radius: ["48%", "72%"], center: ["50%", "44%"], avoidLabelOverlap: false, label: { show: false }, data: data.map((d) => ({ ...d, itemStyle: { color: d.color } })) }],
  }), [data, accent]);
  return <EChart option={option} height={height} />;
};

// ── Area sparkline (EChart) ──
export const AreaSpark = ({ accent, height = 150, seed = 1 }) => {
  const option = useMemo(() => {
    const data = Array.from({ length: 32 }, (_, i) => Math.round(40 + 26 * Math.sin((i + seed) / 4) + i * 1.2 + ((i * seed) % 5) * 4));
    return {
      grid: { left: 6, right: 10, top: 12, bottom: 16 },
      xAxis: { type: "category", boundaryGap: false, data: data.map((_, i) => i), axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } }, axisLabel: { show: false }, axisTick: { show: false } },
      yAxis: { type: "value", splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9 } },
      tooltip: { trigger: "axis", backgroundColor: "#16161a", borderColor: hexA(accent, 0.4), textStyle: { color: "#fff", fontSize: 11 } },
      series: [{ type: "line", smooth: true, symbol: "none", data, lineStyle: { width: 2.4, color: accent, shadowColor: accent, shadowBlur: 12 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: hexA(accent, 0.45) }, { offset: 1, color: hexA(accent, 0) }] } } }],
    };
  }, [accent, seed]);
  return <EChart option={option} height={height} />;
};

// ── Reyting ro'yxati ──
export const RatingList = ({ items, accent }) => (
  <div className="max-h-full overflow-y-auto py-0.5">
    {items.map((it, i) => (
      <div key={i} className="flex cursor-pointer items-center gap-2 rounded px-3 py-[5px] transition-colors hover:bg-foreground/[0.04]">
        <span className="w-4 shrink-0 font-mono text-[9px] text-foreground/30">{String(i + 1).padStart(2, "0")}</span>
        <span className="flex-1 truncate text-[10.5px] text-foreground/80">{it.label}</span>
        <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-foreground/5 sm:block"><div className="h-full rounded-full" style={{ width: `${it.pct}%`, background: accent }} /></div>
        <span className="w-10 shrink-0 text-right font-mono text-[10.5px] font-semibold tabular-nums" style={{ color: accent }}>{it.pct}%</span>
      </div>
    ))}
  </div>
);

// ── Jonli feed (hodisalar) ──
export const FeedList = ({ items, accent }) => (
  <div className="max-h-full overflow-y-auto">
    {items.map((it, i) => (
      <div key={i} title={`${it.place} · ${it.time}`} className="flex cursor-pointer items-start gap-2 px-3 py-1.5 transition-colors hover:bg-foreground/[0.04]" style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <span className="mt-1 size-2 shrink-0 rounded-full" style={{ background: it.color || accent, boxShadow: `0 0 6px ${it.color || accent}` }} />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[11px] text-foreground/85">{it.title}</div>
          <div className="text-[9px] text-foreground/40">{it.time} · {it.place}</div>
        </div>
        {it.tag && <span className="shrink-0 rounded px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ background: hexA(it.color || accent, 0.16), color: it.color || accent }}>{it.tag}</span>}
      </div>
    ))}
  </div>
);

// ── Kamera grid (jonli) ──
export const CameraGrid = ({ items, accent, cols = "lg:grid-cols-6" }) => (
  <div className={`grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 ${cols}`}>
    {items.map((c) => (
      <div key={c.id} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black">
        <div className="relative aspect-video">
          {c.online ? (
            <>
              <img src={c.img} alt={c.loc} loading="lazy" className="h-full w-full object-cover opacity-75 transition group-hover:opacity-100" />
              <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5"><Circle className="size-1.5 animate-pulse fill-rose-500 text-rose-500" /><span className="text-[8px] font-semibold text-rose-300">JONLI</span></div>
            </>
          ) : (
            <div className="grid h-full w-full place-items-center bg-zinc-900 text-zinc-600"><VideoOff className="size-5" /></div>
          )}
        </div>
        <div className="flex items-center gap-1 px-1.5 py-1 text-[9px] text-foreground/70">{c.online ? <Video className="size-2.5" style={{ color: accent }} /> : <VideoOff className="size-2.5 text-zinc-600" />}<span className="truncate">{c.loc}</span></div>
      </div>
    ))}
  </div>
);

// ── Mahalla xaritasi (voronoi bloklar, tanlanadigan) ──
const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const clipHP = (poly, a, b, c) => {
  const out = []; const inside = (p) => a * p.x + b * p.y <= c + 1e-9;
  for (let i = 0; i < poly.length; i++) { const cur = poly[i], pr = poly[(i + poly.length - 1) % poly.length]; const ci = inside(cur), pi = inside(pr); if (ci !== pi) { const dx = cur.x - pr.x, dy = cur.y - pr.y, den = a * dx + b * dy, t = den === 0 ? 0 : (c - (a * pr.x + b * pr.y)) / den; out.push({ x: pr.x + t * dx, y: pr.y + t * dy }); } if (ci) out.push(cur); }
  return out;
};
export const MahallaMap = ({ blocks, accent, legend }) => {
  const [active, setActive] = useState(null);
  const cells = useMemo(() => {
    const W = 600, H = 360, bb = { x0: 40, y0: 36, x1: 560, y1: 324 };
    const n = blocks.length, cols = Math.ceil(Math.sqrt(n * 1.6)), rows = Math.ceil(n / cols);
    const seeds = []; let idx = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (idx >= n) break; const gx = bb.x0 + (c + 0.5) * ((bb.x1 - bb.x0) / cols) + (rng(idx * 3.1) - 0.5) * 46; const gy = bb.y0 + (r + 0.5) * ((bb.y1 - bb.y0) / rows) + (rng(idx * 5.7) - 0.5) * 34; seeds.push({ x: gx, y: gy, b: blocks[idx] }); idx++; }
    const box = { x0: bb.x0 - 16, y0: bb.y0 - 16, x1: bb.x1 + 16, y1: bb.y1 + 16 };
    return seeds.map((s) => { let poly = [{ x: box.x0, y: box.y0 }, { x: box.x1, y: box.y0 }, { x: box.x1, y: box.y1 }, { x: box.x0, y: box.y1 }]; for (const o of seeds) { if (o === s) continue; const a = o.x - s.x, b = o.y - s.y, c = (o.x * o.x - s.x * s.x + o.y * o.y - s.y * s.y) / 2; poly = clipHP(poly, a, b, c); if (!poly.length) break; } return { ...s, poly }; });
  }, [blocks]);
  const sel = active != null ? cells[active]?.b : null;

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 45%, ${hexA(accent, 0.1)}, transparent 65%)` }} />
      <svg viewBox="0 0 600 360" className="h-full w-full">
        <defs><filter id="mm-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.5" /></filter></defs>
        {cells.map((c, i) => {
          const d = c.poly.map((p, j) => `${j === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + "Z";
          const col = c.b.color || accent;
          const cx = c.poly.reduce((s, p) => s + p.x, 0) / c.poly.length, cy = c.poly.reduce((s, p) => s + p.y, 0) / c.poly.length;
          const isA = active === i;
          return (
            <g key={i} className="cursor-pointer" onClick={() => setActive(isA ? null : i)}>
              <path d={d} fill={hexA(col, isA ? 0.6 : 0.3)} stroke={hexA(col, isA ? 1 : 0.85)} strokeWidth={isA ? 2.2 : 1} filter={isA ? "url(#mm-glow)" : undefined} />
              <text x={cx} y={cy - 3} textAnchor="middle" className="pointer-events-none fill-white font-medium" style={{ fontSize: 8, textShadow: "0 1px 2px #000" }}>{c.b.name}</text>
              {c.b.metric != null && <text x={cx} y={cy + 7} textAnchor="middle" className="pointer-events-none font-mono" style={{ fontSize: 8, fill: col }}>{c.b.metric}</text>}
            </g>
          );
        })}
      </svg>
      {legend && <div className="absolute bottom-2 left-3 flex gap-3 text-[8.5px] text-foreground/55">{legend.map((l, i) => <span key={i} className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ background: l.color }} /> {l.label}</span>)}</div>}
      {sel && (
        <div className="absolute right-2 top-2 rounded-lg border border-white/10 bg-black/75 px-3 py-2 backdrop-blur">
          <div className="text-[11px] font-semibold text-white">{sel.name}</div>
          {sel.detail && <div className="mt-0.5 text-[10px] text-white/60">{sel.detail}</div>}
        </div>
      )}
    </div>
  );
};

// ── Root wrapper (manba kontekstini ta'minlaydi) ──
export const CmdRoot = ({ accent, system = "Ma'lumotlar bazasi", place = "", children }) => (
  <SourceContext.Provider value={{ system, place }}>
    <div className="flex flex-col gap-3 rounded-2xl p-3"
      style={{ background: `radial-gradient(circle at 50% 0%, ${hexA(accent, 0.06)}, hsl(var(--background)) 60%)`, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "100% 100%, 34px 34px, 34px 34px" }}>
      {children}
    </div>
  </SourceContext.Provider>
);

// kamera demo yasash
export const makeCams = (locs, seedBase) => locs.map((loc, i) => ({ id: `c${i}`, loc, online: rng(seedBase + i) > 0.16, img: `https://picsum.photos/seed/${seedBase}-${i}/320/200?grayscale` }));

// ── CCTV monitor — kirish hodisalari + tanlangan footage (begona odam/mashina) ──
export const CctvMonitor = ({ events, accent }) => {
  const [id, setId] = useState(events[0]?.id);
  const ev = events.find((e) => e.id === id) || events[0];
  if (!ev) return null;
  return (
    <div className="grid h-full gap-2 p-2 lg:grid-cols-3">
      <div className="flex max-h-[440px] flex-col overflow-y-auto rounded-lg border border-white/8 bg-white/[0.02]">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/45">Kirish hodisalari ({events.length})</div>
        {events.map((e) => {
          const on = e.id === ev.id;
          const Icon = e.kind === "avto" ? Car : User;
          const col = e.kind === "avto" ? "#ef4444" : "#f59e0b";
          return (
            <button key={e.id} onClick={() => setId(e.id)} className="flex items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-white/[0.04]" style={{ background: on ? hexA(accent, 0.12) : "transparent", borderLeft: `2px solid ${on ? accent : "transparent"}` }}>
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded" style={{ background: hexA(col, 0.16), color: col }}><Icon className="size-3.5" /></span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-[11.5px] font-medium text-foreground/90">{e.title}</div>
                <div className="flex items-center gap-1 text-[9px] text-foreground/40"><MapPin className="size-2.5" /> {e.place} · {e.time}</div>
                {e.plate && <div className="mt-0.5 inline-block rounded bg-white/10 px-1 font-mono text-[9.5px] text-white/80">{e.plate}</div>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0b1220,#111827 55%,#0a0f1a)" }} />
          <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 3px)" }} />
          <div className="absolute inset-0 grid place-items-center"><Play className="size-12 text-white/15" /></div>
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5"><Circle className="size-2 animate-pulse fill-rose-500 text-rose-500" /><span className="text-[9px] font-semibold text-rose-300">REC · {ev.cam}</span></div>
          <div className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-emerald-300">{ev.time}</div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.85), transparent)" }}>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold text-white">{ev.title}</div>
              <div className="flex items-center gap-1 text-[10px] text-white/60"><MapPin className="size-3" /> {ev.place}</div>
            </div>
            {ev.plate && <div className="rounded-md border-2 border-white/70 bg-black/40 px-2 py-1 font-mono text-[16px] font-bold tracking-wider text-white">{ev.plate}</div>}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {events.slice(0, 4).map((e) => (
            <button key={e.id} onClick={() => setId(e.id)} className="relative aspect-video overflow-hidden rounded border" style={{ borderColor: e.id === ev.id ? accent : "rgba(255,255,255,0.1)" }}>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,#0b1220,#1a2233)" }} />
              <Circle className="absolute right-1 top-1 size-1.5 animate-pulse fill-rose-500 text-rose-500" />
              <span className="absolute bottom-0.5 left-1 font-mono text-[8px] text-white/70">{e.cam}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Dark CRUD jadval (qo'shish/o'chirish) — command uslubi ──
const TONE = { yashil: "#22c55e", qizil: "#ef4444", sariq: "#f59e0b", kok: "#38bdf8", kulrang: "#94a3b8" };
export const CmdTable = ({ title, icon, accent, columns, rows, setRows, source, right }) => {
  const [open, setOpen] = useState(false);
  const blank = () => Object.fromEntries(columns.map((c) => [c.key, c.type === "select" ? c.options[0].value : ""]));
  const [form, setForm] = useState(blank);
  const submit = () => { setRows([{ id: `r${Date.now()}`, ...form }, ...rows]); setForm(blank()); setOpen(false); };
  const del = (id) => setRows(rows.filter((r) => r.id !== id));
  return (
    <Panel title={title} icon={icon} accent={accent} source={source} right={right}
      bodyClass="relative">
      <div className="flex items-center justify-end px-3 pt-2">
        <button onClick={() => setOpen(true)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white" style={{ background: hexA(accent, 0.9) }}>
          <Plus className="size-3.5" /> Qo'shish
        </button>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full min-w-[480px] text-left">
          <thead><tr className="text-[9.5px] uppercase tracking-wider text-foreground/40" style={{ borderBottom: `1px solid ${hexA(accent, 0.2)}` }}>
            {columns.map((c) => <th key={c.key} className="px-3 py-2 font-semibold">{c.label}</th>)}<th />
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-3 py-6 text-center text-[12px] text-foreground/40">Ma'lumot yo'q — "Qo'shish"</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="text-[12px] text-foreground/85 transition-colors hover:bg-white/[0.03]" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2.5">
                    {c.type === "status" ? (
                      <span className="rounded-full px-2 py-0.5 text-[10.5px] font-medium" style={{ background: hexA(TONE[c.tone?.(r[c.key]) || "kulrang"], 0.16), color: TONE[c.tone?.(r[c.key]) || "kulrang"] }}>{r[c.key]}</span>
                    ) : c.type === "number" ? <span className="font-mono tabular-nums">{r[c.key]}</span> : r[c.key]}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-right"><button onClick={() => del(r.id)} className="text-foreground/40 hover:text-rose-400"><Trash2 className="size-3.5" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-[rgb(var(--card-border))] bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><h4 className="text-sm font-bold">{title} — yangi</h4><button onClick={() => setOpen(false)} className="text-foreground/50 hover:text-foreground"><X className="size-4" /></button></div>
            <div className="flex flex-col gap-3">
              {columns.map((c) => (
                <label key={c.key} className="flex flex-col gap-1">
                  <span className="text-[11px] text-foreground/55">{c.label}</span>
                  {c.type === "select" ? (
                    <select value={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })} className="rounded-lg border border-[rgb(var(--card-border))] bg-background px-3 py-2 text-[13px] outline-none">
                      {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input type={c.type === "number" ? "number" : "text"} value={form[c.key]} onChange={(e) => setForm({ ...form, [c.key]: c.type === "number" ? Number(e.target.value) : e.target.value })} placeholder={c.label} className="rounded-lg border border-[rgb(var(--card-border))] bg-background px-3 py-2 text-[13px] outline-none" />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-[12px] text-foreground/60 hover:bg-white/5">Bekor</button>
              <button onClick={submit} className="rounded-lg px-4 py-2 text-[12px] font-semibold text-white" style={{ background: hexA(accent, 0.9) }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
};
