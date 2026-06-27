// Boshqaruv markazi — IIB + FVV + Ta'lim yagona panel (2×2, 4 grid). Elektr UI stilida.
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Users, GraduationCap, NotebookPen, Briefcase, School, Home, Flame, Cctv, AlertTriangle, Car, Clock4, Maximize2, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";

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

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => { const f = () => { const d = new Date(); setT(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`); }; f(); const id = setInterval(f, 1000); return () => clearInterval(id); }, []);
  return t;
}

/* ───────── 1-GRID: Umumiy ma'lumotlar ───────── */
const STATS = [
  { icon: GraduationCap, n: 2540, lab: "O'quvchilar", sub: "6–18 yosh · maktablarda", a: "cyan" },
  { icon: Users, n: 1820, lab: "Yoshlar (14–30)", sub: "mahalla bo'yicha", a: "purple" },
  { icon: NotebookPen, n: 96, lab: "Yoshlar daftarida", sub: "maxsus monitoring", a: "yellow" },
  { icon: Briefcase, n: 73, lab: "Bitirgan, ishsiz yoshlar", sub: "maktabni tugatgan", a: "red" },
  { icon: School, n: 3, lab: "Maktablar", sub: "2 davlat · 1 xususiy", a: "emerald" },
  { icon: Home, n: 1240, lab: "Xonadonlar", sub: "FVV nazoratida", a: "purple" },
  { icon: Flame, n: 28, lab: "Xavfli obyektlar", sub: "FVV — yong'in xavfi", a: "red" },
  { icon: Cctv, n: 53, lab: "Kameralar", sub: "IIB · ko'cha · maktab", a: "cyan" },
];
function StatTile({ s }) {
  const Icon = s.icon;
  return (
    <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4">
      <div className="flex items-center gap-2.5">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", CHIP[s.a])}><Icon className="size-[18px]" strokeWidth={2} /></span>
        <AnimatedCounter value={s.n} formatter={nf} className="text-2xl font-semibold tracking-tight tabular-nums" />
      </div>
      <p className="mt-2 text-[13px] font-medium">{s.lab}</p>
      <p className="text-xs text-foreground/45">{s.sub}</p>
    </div>
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
const MONTHS = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
const SCHOOL_TREND = MONTHS.map((m, i) => ({ month: m, value: +(93 + Math.sin(i / 1.7) * 1.8 + (i % 3) * 0.4).toFixed(1) }));

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

function CameraTile({ cam, clk }) {
  const w = cam.warn;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-black" style={{ borderColor: w ? w.color : "rgb(var(--card-border))", boxShadow: w ? `0 0 14px -3px ${w.color}` : "none" }}>
      <video src={cam.src} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" style={{ filter: CCTV }} />
      <div className="absolute left-2 top-2 flex items-center gap-1 text-[9px] font-bold text-red-400"><span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />REC</div>
      <div className="absolute right-2 top-2 font-mono text-[9.5px] text-cyan-100 [text-shadow:0_1px_2px_#000]">{clk}</div>
      {w && <div className="absolute inset-x-2 top-[22px] flex items-center justify-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ background: w.color }}><AlertTriangle className="size-2.5" /> {w.label}</div>}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2 pb-1.5 pt-3">
        <div className="truncate text-[10px] font-bold text-white">{cam.code} · {cam.name}</div>
        <div className="text-[8.5px] font-bold uppercase tracking-wide" style={{ color: GROUP_COLOR[cam.group] }}>{cam.group}</div>
      </div>
    </div>
  );
}

function CameraModal({ onClose, clk }) {
  const groups = ["Hammasi", ...Array.from(new Set(ALL_CAMERAS.map((c) => c.group)))];
  const [grp, setGrp] = useState("Hammasi");
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
          {list.map((c) => <CameraTile key={c.id} cam={c} clk={clk} />)}
        </div>
      </div>
    </div>, document.body);
}

function GridKameralar() {
  const clk = useClock();
  const [open, setOpen] = useState(false);
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{warnCams.map((c) => <CameraTile key={c.id} cam={c} clk={clk} />)}</div>
      )}
      {open && <CameraModal onClose={() => setOpen(false)} clk={clk} />}
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
            <div key={n.id} className="flex items-center gap-3 rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3" style={{ borderLeftColor: n.color, borderLeftWidth: 3 }}>
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", CHIP[n.a])}><Icon className="size-[18px]" strokeWidth={2} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-md border px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide" style={{ color: n.color, borderColor: `${n.color}55` }}>{n.mod}</span>
                  <span className="truncate text-[13px] font-semibold">{n.title}</span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/50">{n.sub}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-foreground/40">{n.t}</span>
            </div>
          );
        })}
      </div>
    </GlassChartCard>
  );
}

const MarkazDashboardPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Boshqaruv markazi</h1>
      <p className="mt-0.5 text-sm text-foreground/50">IIB · FVV · Ta'lim — yagona panel · {MAHALLA}</p>
    </div>

    <div className="grid gap-5 xl:grid-cols-2">
      {/* 1 — Umumiy ma'lumotlar */}
      <GlassChartCard title="Umumiy ma'lumotlar" insight="Mahalla bo'yicha jami ko'rsatkichlar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">{STATS.map((s) => <StatTile key={s.lab} s={s} />)}</div>
      </GlassChartCard>

      {/* 2 — Statistikalar */}
      <GlassChartCard title="Statistikalar" insight="Maktab · FVV · IIB kesimida">
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4">
            <StatRow icon={School} color="#10b981" title="Maktab — davomat (12 oy)" kpi="94.6%" />
            <TrendChart data={SCHOOL_TREND} color="#10b981" height={140} unit="%" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4">
              <StatRow icon={Flame} color="#f59e0b" title="FVV — hodisalar" kpi="15 ta" />
              <DonutChart data={[{ key: "tibbiy", value: 6 }, { key: "yongin", value: 4 }, { key: "gaz", value: 3 }, { key: "tabiiy", value: 2 }]} labelMap={{ tibbiy: "Tibbiy", yongin: "Yong'in", gaz: "Gaz", tabiiy: "Tabiiy" }} colors={["#22d3ee", "#ef4444", "#f59e0b", "#10b981"]} height={180} />
            </div>
            <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4">
              <StatRow icon={Car} color="#22d3ee" title="IIB — avto oqimi (bugun)" kpi="332" />
              <BreakdownBar data={[{ key: "kirim", value: 178 }, { key: "chiqim", value: 149 }, { key: "begona", value: 5 }]} labelMap={{ kirim: "Kirim", chiqim: "Chiqim", begona: "Begona" }} color="#22d3ee" height={180} />
            </div>
          </div>
        </div>
      </GlassChartCard>

      {/* 3 — Barcha kameralar */}
      <GridKameralar />

      {/* 4 — Bildirishnomalar */}
      <GridNotif />
    </div>

    <p className="text-xs text-foreground/40">Barcha ko'rsatkichlar — <b>namunaviy (demo)</b>.</p>
  </div>
);
export default MarkazDashboardPage;
