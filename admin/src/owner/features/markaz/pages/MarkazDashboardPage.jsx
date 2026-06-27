// Boshqaruv markazi — IIB + FVV + Ta'lim yagona panel (2×2, 4 grid). Elektr UI stilida.
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GraduationCap, NotebookPen, Briefcase, School, Flame, AlertTriangle, Car, Clock4, Maximize2, X, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { cn } from "@/shared/utils/cn";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { useChartColors } from "@/shared/components/ui/chart/chartColors";

const MAHALLA = "Sarnovul MFY";
const pad = (n) => String(n).padStart(2, "0");
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const nf = (v) => Math.round(v).toLocaleString("uz-UZ").replace(/,/g, " ");
const L = () => "ABCDEFHIKLMNOPRSTUVXYZ"[ri(0, 21)];
const plate = () => `${pad(ri(1, 95))} ${L()} ${ri(100, 999)} ${L()}${L()}`;
const STREETS = ["Sarnovul", "Bog'", "Navbahor", "Guliston", "Mustaqillik", "Do'stlik", "Bahor", "Yangiobod"];
const SCHOOLS = ["12-maktab", "47-maktab", "Bilim xususiy maktabi"];
const NAMES = ["Azizov Jasur", "Karimova Madina", "Rasulov Bekzod", "Tursunova Nilufar", "Yusupov Sardor", "Aliyeva Zarina", "Saidov Otabek", "Qodirova Kamola", "Ergashev Akmal", "Olimova Sevara", "Nazarov Bobur", "Sobirova Dilnoza"];
const CHIP = { cyan: "bg-brand-cyan/15 text-brand-cyan", purple: "bg-brand-purple/15 text-brand-purple", yellow: "bg-brand-yellow/15 text-brand-yellow", emerald: "bg-emerald-500/15 text-emerald-400", red: "bg-red-500/15 text-red-400" };
const MOD_ROUTE = { "Ta'lim": "/owner/talim", IIB: "/owner/iib", FVV: "/owner/fvv", Yoshlar: "/owner/yoshlar" };

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => { const f = () => { const d = new Date(); setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`); }; f(); const id = setInterval(f, 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ───────── 1-GRID: Umumiy ma'lumotlar — faqat qiymatli kartalar ───────── */
const STATS = [
  { icon: GraduationCap, n: 2540, lab: "O'quvchilar", sub: "6–18 yosh · maktablarda", a: "cyan", to: "/owner/talim" },
  { icon: Briefcase, n: 73, lab: "Bitirgan, ishsiz yoshlar", sub: "maktabni tugatgan · ishsiz", a: "red", to: "/owner/yoshlar" },
  { icon: NotebookPen, n: 96, lab: "Yoshlar daftarida", sub: "maxsus monitoringda", a: "yellow", to: "/owner/yoshlar" },
  { icon: ShieldAlert, n: 31, lab: "Jinoyatga moyil oilalar", sub: "IIB — profilaktika", a: "yellow", to: "/owner/iib" },
  { icon: Flame, n: 28, lab: "Xavfli obyektlar", sub: "FVV — yong'in xavfi", a: "red", to: "/owner/fvv" },
  { icon: AlertTriangle, n: 73, lab: "Tekshirilmagan oilalar", sub: "FVV — yong'in tekshiruvi", a: "yellow", to: "/owner/fvv" },
];
function StatTile({ s }) {
  const nav = useNavigate();
  const Icon = s.icon;
  return (
    <button type="button" onClick={() => nav(s.to)} className="group flex h-full flex-col justify-center rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4 text-left transition-colors hover:border-brand-cyan/50 hover:bg-card/70">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", CHIP[s.a])}><Icon className="size-[18px]" strokeWidth={2} /></span>
        <AnimatedCounter value={s.n} formatter={nf} className="text-2xl font-semibold tracking-tight tabular-nums" />
      </div>
      <p className="mt-2 text-[13px] font-medium">{s.lab}</p>
      <p className="text-xs text-foreground/45">{s.sub}</p>
    </button>
  );
}

/* ───────── 2-GRID: Statistikalar ───────── */
function StatRow({ icon: Icon, color, title, kpi }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] font-medium"><Icon className="size-4" style={{ color }} /> {title}</div>
      <span className="text-sm font-semibold tabular-nums">{kpi}</span>
    </div>
  );
}
// Chartlar ekran kattaligiga qarab kattalashadi
function useScale() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(1.7, Math.max(1, window.innerWidth / 1366)));
    f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, []);
  return s;
}

// Ta'lim — maktablar bo'yicha davomat foizi (vertikal bar)
const SCHOOLS_ATT = [{ name: "12-maktab", v: 95.2 }, { name: "47-maktab", v: 93.8 }, { name: "Bilim", v: 97.1 }];
function SchoolBars({ height }) {
  const c = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={SCHOOLS_ATT} margin={{ top: 22, right: 8, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: c.axis }} tickLine={false} axisLine={false} />
        <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: c.axis }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip formatter={(v) => [`${v}%`, "Davomat"]} contentStyle={c.tooltip} labelStyle={c.tooltipLabel} cursor={{ fill: "rgba(125,150,170,.08)" }} />
        <Bar dataKey="v" radius={[7, 7, 0, 0]} barSize={54}>
          {SCHOOLS_ATT.map((d, i) => <Cell key={i} fill={["#22d3ee", "#10b981", "#f59e0b"][i]} />)}
          <LabelList dataKey="v" position="top" formatter={(v) => `${v}%`} style={{ fill: c.axis, fontSize: 12, fontWeight: 700 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// IIB — oilalar (proporsiya/stacked bar — donut o'rniga)
const IIB_ITEMS = [
  { label: "Jinoyatchi yashaydigan oilalar", value: 8, color: "#ef4444" },
  { label: "Jinoyatga moyilligi bor oilalar", value: 23, color: "#f59e0b" },
  { label: "Jinoyatga aloqasi yo'q oilalar", value: 1209, color: "#10b981" },
];
function ProportionBar({ items, barH = 28 }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded-lg border border-[rgb(var(--card-border))]" style={{ height: barH }}>
        {items.map((it) => <div key={it.label} title={`${it.label}: ${it.value}`} style={{ width: `${(it.value / total) * 100}%`, background: it.color, minWidth: it.value > 0 ? 7 : 0 }} />)}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2"><span className="size-2.5 shrink-0 rounded-sm" style={{ background: it.color }} /><span className="truncate">{it.label}</span></span>
            <span className="shrink-0 font-semibold tabular-nums">{nf(it.value)} <span className="font-normal text-foreground/45">({((it.value / total) * 100).toFixed(1)}%)</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// FVV — Umumiy xavf darajasi (yarim doira gauge)
function RiskGauge({ value = 55, height = 150 }) {
  const cx = 100, cy = 100, r = 78, sw = 16;
  const polar = (pct) => { const a = Math.PI * (1 - pct / 100); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
  const arc = (p0, p1) => { const [x0, y0] = polar(p0), [x1, y1] = polar(p1); return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  const zones = [[0, 33, "#10b981"], [33, 66, "#f59e0b"], [66, 100, "#ef4444"]];
  const na = Math.PI * (1 - value / 100); const nx = cx + (r - 8) * Math.cos(na), ny = cy - (r - 8) * Math.sin(na);
  const lvl = value < 33 ? ["Past", "#10b981"] : value < 66 ? ["O'rta", "#f59e0b"] : ["Yuqori", "#ef4444"];
  return (
    <div className="flex flex-col items-center justify-center">
      <svg viewBox="0 0 200 116" width="100%" style={{ maxHeight: height }}>
        {zones.map((z, i) => <path key={i} d={arc(z[0], z[1])} fill="none" stroke={z[2]} strokeWidth={sw} />)}
        <line x1={cx} y1={cy} x2={nx.toFixed(1)} y2={ny.toFixed(1)} stroke={lvl[1]} strokeWidth="4" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill={lvl[1]} />
      </svg>
      <div className="-mt-1 text-center">
        <div className="text-3xl font-bold tabular-nums" style={{ color: lvl[1] }}>{value}<span className="text-base text-foreground/45">/100</span></div>
        <div className="text-xs font-bold uppercase tracking-wide" style={{ color: lvl[1] }}>{lvl[0]} xavf darajasi</div>
      </div>
    </div>
  );
}

/* ───────── 3-GRID: Barcha kameralar ───────── */
const vid = (id, f) => `https://videos.pexels.com/video-files/${id}/${f}.mp4`;
const CCTV = "grayscale(.32) contrast(1.16) brightness(.9) saturate(.7)";
const VIDS = [
  vid(2034115, "2034115-sd_640_360_30fps"), vid(5921059, "5921059-sd_640_360_30fps"), vid(1721294, "1721294-sd_640_360_25fps"),
  vid(857195, "857195-sd_640_360_25fps"), vid(2099536, "2099536-sd_640_360_30fps"), vid(854671, "854671-sd_640_360_25fps"),
];
const GROUP_COLOR = { "Mahalla kirishi": "#22d3ee", "IIB post": "#22d3ee", "Ko'cha": "#f59e0b", "Maktab": "#10b981", "Jamoat": "#f59e0b" };
const CAM_DEFS = [
  { group: "Mahalla kirishi", places: ["Sarnovul kirishi", "Bog' kirishi", "Markaziy kirishi", "Shimoliy post", "Janubiy post"] },
  { group: "IIB post", places: ["MFY posti", "Markaziy chorraha", "Bozor posti", "Avtoturargoh", "Park posti", "Tungi post"] },
  { group: "Ko'cha", places: STREETS.flatMap((s) => [`${s} ko'chasi (boshi)`, `${s} ko'chasi (o'rtasi)`, `${s} ko'chasi (oxiri)`]) },
  { group: "Maktab", places: ["12-maktab darvoza", "12-maktab hovli", "12-maktab koridor", "12-maktab oshxona", "47-maktab darvoza", "47-maktab hovli", "47-maktab koridor", "Bilim maktabi kirish", "Bilim maktabi hovli"] },
  { group: "Jamoat", places: ["Bozor ichi", "Bozor kirishi", "Park markaz", "Stadion", "Poliklinika", "Bog'cha-14", "Suv ombori", "Transformator", "Mahalla idora"] },
];
const ALL_CAMERAS = [];
let _cn = 1;
CAM_DEFS.forEach((d) => d.places.forEach((p) => { ALL_CAMERAS.push({ id: _cn, code: `CAM-${pad(_cn)}`, name: p, group: d.group, src: VIDS[(_cn - 1) % VIDS.length], warn: null }); _cn++; }));
const WARN_DEFS = [
  [2, "Begona avtomobil", "#ef4444"], [8, "To'planish aniqlandi", "#ef4444"], [13, "Aloqa uzildi", "#64748b"],
  [20, "Ruxsatsiz harakat", "#ef4444"], [26, "Tungi harakat", "#f59e0b"], [31, "Begona avtomobil", "#ef4444"],
  [37, "Aloqa uzildi", "#64748b"], [42, "Yong'in tutuni", "#ef4444"], [46, "Ruxsatsiz kirish", "#ef4444"],
];
WARN_DEFS.forEach(([i, label, color]) => { const cam = ALL_CAMERAS[i % ALL_CAMERAS.length]; if (cam) cam.warn = { label, color }; });

function CameraTile({ cam, clk, onClick }) {
  const w = cam.warn;
  return (
    <button type="button" onClick={onClick} title="To'liq ekranda ko'rish" className="group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-xl border bg-black text-left" style={{ borderColor: w ? w.color : "rgb(var(--card-border))", boxShadow: w ? `0 0 14px -3px ${w.color}` : "none" }}>
      <video src={cam.src} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" style={{ filter: CCTV }} />
      <div className="absolute left-2 top-2 z-10 flex items-center gap-1 text-[9px] font-bold text-red-400"><span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />REC</div>
      <div className="absolute right-2 top-2 z-10 font-mono text-[9.5px] text-cyan-100 [text-shadow:0_1px_2px_#000]">{clk}</div>
      {w && <div className="absolute inset-x-2 top-[22px] z-10 flex items-center justify-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: w.color }}><AlertTriangle className="size-2.5" /> {w.label}</div>}
      <div className="absolute inset-0 z-20 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"><span className="grid size-9 place-items-center rounded-full bg-white/20 backdrop-blur-sm"><Maximize2 className="size-4 text-white" /></span></div>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-3">
        <div className="truncate text-[10px] font-bold text-white">{cam.code} · {cam.name}</div>
        <div className="text-[8.5px] font-bold uppercase tracking-wide" style={{ color: GROUP_COLOR[cam.group] }}>{cam.group}</div>
      </div>
    </button>
  );
}

function CameraFullscreen({ cam, clk, onClose }) {
  const w = cam.warn;
  return createPortal(
    <div className="fixed inset-0 z-[400] grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <div className="relative w-[min(1500px,97vw)] overflow-hidden rounded-xl border border-white/10 bg-black" style={{ aspectRatio: "16/9" }} onClick={(e) => e.stopPropagation()}>
        <video src={cam.src} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" style={{ filter: CCTV }} />
        <div className="absolute left-4 top-4 flex items-center gap-1.5 text-[12px] font-bold text-red-400"><span className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />REC</div>
        <div className="absolute right-14 top-4 font-mono text-sm text-cyan-100 [text-shadow:0_1px_2px_#000]">{clk}</div>
        <button onClick={onClose} className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg bg-black/50 text-white hover:bg-black/70"><X className="size-5" /></button>
        {w && <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-1.5 rounded-md px-3 py-1 text-sm font-bold text-white" style={{ background: w.color }}><AlertTriangle className="size-4" /> {w.label}</div>}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-10">
          <div className="text-lg font-bold text-white">{cam.code} · {cam.name}</div>
          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: GROUP_COLOR[cam.group] }}>{cam.group} · {MAHALLA}</div>
        </div>
      </div>
    </div>, document.body);
}

function CameraModal({ onClose, clk }) {
  const groups = ["Hammasi", ...Array.from(new Set(ALL_CAMERAS.map((c) => c.group)))];
  const [grp, setGrp] = useState("Hammasi");
  const [fs, setFs] = useState(null);
  const list = grp === "Hammasi" ? ALL_CAMERAS : ALL_CAMERAS.filter((c) => c.group === grp);
  const cnt = (g) => (g === "Hammasi" ? ALL_CAMERAS.length : ALL_CAMERAS.filter((c) => c.group === g).length);
  return createPortal(
    <div className="fixed inset-0 z-[300] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="surface flex max-h-[90vh] w-[min(1200px,96vw)] flex-col overflow-hidden p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">Barcha kameralar — to'liq ro'yxat</h3>
            <p className="mt-0.5 text-xs text-foreground/45">{MAHALLA} · jami {ALL_CAMERAS.length} kamera · joylashuv bo'yicha filtr</p>
          </div>
          <button onClick={onClose} className="grid size-8 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/60 hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => (
            <button key={g} onClick={() => setGrp(g)} className={cn("rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors", grp === g ? "border-brand-cyan bg-brand-cyan/10 text-brand-cyan" : "border-[rgb(var(--card-border))] text-foreground/55 hover:text-foreground")}>{g} <span className="tabular-nums opacity-60">{cnt(g)}</span></button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 overflow-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((c) => <CameraTile key={c.id} cam={c} clk={clk} onClick={() => setFs(c)} />)}
        </div>
      </div>
      {fs && <CameraFullscreen cam={fs} clk={clk} onClose={() => setFs(null)} />}
    </div>, document.body);
}

function GridKameralar() {
  const clk = useClock();
  const [open, setOpen] = useState(false);
  const [fs, setFs] = useState(null);
  const warnCams = ALL_CAMERAS.filter((c) => c.warn);
  return (
    <GlassChartCard
      title="Barcha kameralar"
      insight={`Jami ${ALL_CAMERAS.length} kamera · ${warnCams.length} ogohlantirish · default faqat ogohlantirishlilar`}
      right={<button onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] px-3 py-1.5 text-[12px] font-medium text-foreground/70 hover:text-foreground"><Maximize2 className="size-3.5" /> To'liq ro'yxat</button>}
    >
      {warnCams.length === 0 ? (
        <p className="py-4 text-sm text-emerald-500">Ogohlantirish yo'q — barcha kameralar normal.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{warnCams.map((c) => <CameraTile key={c.id} cam={c} clk={clk} onClick={() => setFs(c)} />)}</div>
      )}
      {open && <CameraModal onClose={() => setOpen(false)} clk={clk} />}
      {fs && <CameraFullscreen cam={fs} clk={clk} onClose={() => setFs(null)} />}
    </GlassChartCard>
  );
}

/* ───────── 4-GRID: Bildirishnomalar ───────── */
const NOTIF_KINDS = [
  () => ({ mod: "Ta'lim", icon: GraduationCap, color: "#ef4444", a: "red", title: `${pick(NAMES)} — ${pick(SCHOOLS)} ${ri(1, 11)}-${pick(["A", "B", "V"])}`, sub: "Bugun maktabga kelmadi (Face-ID yo'q)" }),
  () => ({ mod: "FVV", icon: Flame, color: "#f59e0b", a: "yellow", title: `${pick(STREETS)} ko'chasi ${ri(1, 80)}-uy`, sub: "Yong'in/tutun xavfi — sensor signal berdi" }),
  () => ({ mod: "IIB", icon: Car, color: "#ef4444", a: "red", title: `${plate()} · begona avtomobil`, sub: `${pick(["Mahalla kirishi", "Markaziy chorraha", "Bog' ko'chasi"])} — ro'yxatda yo'q` }),
  () => ({ mod: "FVV", icon: AlertTriangle, color: "#ef4444", a: "red", title: `${pick(STREETS)} ko'chasi ${ri(1, 60)}-uy`, sub: "Gaz konsentratsiyasi yuqori — tekshiruv kerak" }),
  () => ({ mod: "Ta'lim", icon: Clock4, color: "#f59e0b", a: "yellow", title: `${pick(NAMES)} — ${ri(1, 11)}-${pick(["A", "B", "V"])}`, sub: `Darsga kech qoldi (${ri(10, 45)} daqiqa)` }),
];
function makeNotif() { const n = pick(NOTIF_KINDS)(); const d = new Date(); return { ...n, id: Math.random().toString(36).slice(2), t: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` }; }
function GridNotif() {
  const nav = useNavigate();
  const [list, setList] = useState(() => Array.from({ length: 8 }, makeNotif));
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setList((l) => [makeNotif(), ...l].slice(0, 14)), 3500);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <GlassChartCard title="Bildirishnomalar" insight="Ta'lim · FVV · IIB — jonli ogohlantirishlar">
      <div className="flex max-h-[360px] flex-col gap-2 overflow-auto pr-1">
        {list.map((n) => {
          const Icon = n.icon;
          return (
            <button type="button" key={n.id} onClick={() => nav(MOD_ROUTE[n.mod] || "/owner/markaz")} className="flex w-full items-center gap-3 rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3 text-left transition-colors hover:bg-card/70" style={{ borderLeftColor: n.color, borderLeftWidth: 3 }}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", CHIP[n.a])}><Icon className="size-[18px]" strokeWidth={2} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-md border px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide" style={{ color: n.color, borderColor: `${n.color}55` }}>{n.mod}</span>
                  <span className="truncate text-[13px] font-semibold">{n.title}</span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/50">{n.sub}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-foreground/40">{n.t}</span>
            </button>
          );
        })}
      </div>
    </GlassChartCard>
  );
}

// Bosiladigan chart blok — manba modul sahifasiga olib o'tadi
function ChartBlock({ to, hoverColor, children }) {
  const nav = useNavigate();
  return (
    <div role="button" tabIndex={0} onClick={() => nav(to)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && nav(to)} className="cursor-pointer rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4 transition-colors hover:bg-card/70" style={{ "--hc": hoverColor }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = hoverColor)} onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}>
      {children}
    </div>
  );
}

const MarkazDashboardPage = () => {
  const scale = useScale();
  const h = (b) => Math.round(b * scale);
  return (
    <div className="mx-[calc(50%-50vw)] w-screen overflow-x-hidden px-4 md:px-6 2xl:px-10">
      <div className="mx-auto flex max-w-[2100px] flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Boshqaruv markazi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">IIB · FVV · Ta'lim — yagona panel · {MAHALLA} · kartani/chartni bossangiz — manba sahifa ochiladi</p>
        </div>

        {/* 4 grid — 2 qator × 2 ustun */}
        <div className="grid gap-5 xl:grid-cols-2">
          {/* 1 — Umumiy ma'lumotlar (faqat qiymatli kartalar) */}
          <GlassChartCard title="Umumiy ma'lumotlar" insight="Mahalla bo'yicha kalit ko'rsatkichlar" bodyClassName="flex">
            <div className="grid h-full w-full grid-cols-2 gap-3 [grid-auto-rows:1fr]">{STATS.map((s) => <StatTile key={s.lab} s={s} />)}</div>
          </GlassChartCard>

          {/* 2 — Statistikalar */}
          <GlassChartCard title="Statistikalar" insight="Ta'lim · IIB · FVV kesimida">
            <div className="flex flex-col gap-4">
              {/* 1-qator: Ta'lim — maktablar davomat foizi (vertikal bar) */}
              <ChartBlock to="/owner/talim" hoverColor="#10b981">
                <StatRow icon={School} color="#10b981" title="Ta'lim — maktablar davomat foizi" kpi="94.6%" />
                <SchoolBars height={h(180)} />
              </ChartBlock>
              {/* 2-qator: IIB (proporsiya) + FVV (yong'in tekshiruvi donut) */}
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartBlock to="/owner/iib" hoverColor="#ef4444">
                  <StatRow icon={ShieldAlert} color="#ef4444" title="IIB — oilalar tahlili" kpi="1 240 oila" />
                  <div style={{ minHeight: h(150) }}><ProportionBar items={IIB_ITEMS} barH={h(28)} /></div>
                </ChartBlock>
                <ChartBlock to="/owner/fvv" hoverColor="#f59e0b">
                  <StatRow icon={Flame} color="#f59e0b" title="FVV — yong'in tekshiruvi" kpi="1 240 oila" />
                  <DonutChart data={[{ key: "yaxshi", value: 980 }, { key: "qoniqarsiz", value: 187 }, { key: "tekshirilmagan", value: 73 }]} labelMap={{ yaxshi: "Yaxshi o'tgan", qoniqarsiz: "Qoniqarsiz", tekshirilmagan: "Tekshirilmagan" }} colors={["#10b981", "#f59e0b", "#ef4444"]} height={h(210)} />
                </ChartBlock>
              </div>
              {/* 3-qator: FVV — umumiy xavf darajasi (gauge) */}
              <ChartBlock to="/owner/fvv" hoverColor="#f59e0b">
                <StatRow icon={AlertTriangle} color="#f59e0b" title="FVV — umumiy xavf darajasi" kpi="O'rta" />
                <RiskGauge value={55} height={h(160)} />
              </ChartBlock>
            </div>
          </GlassChartCard>

          {/* 3 — Barcha kameralar */}
          <GridKameralar />

          {/* 4 — Bildirishnomalar */}
          <GridNotif />
        </div>

        <p className="text-xs text-foreground/40">Barcha ko'rsatkichlar — <b>namunaviy (demo)</b>.</p>
      </div>
    </div>
  );
};
export default MarkazDashboardPage;
