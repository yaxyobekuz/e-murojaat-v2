import { useMemo, useState, useEffect } from "react";
import { Users, ShieldCheck, Activity, Clock, Camera, MapPin, Flame, Truck } from "lucide-react";

import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import { EChart } from "@/shared/components/ui/chart3d/EChart";
import { BubbleGridHeatmap } from "@/shared/components/ui/chart3d/BubbleGridHeatmap";
import { DarkAreaMap } from "@/shared/components/ui/chart3d/DarkAreaMap";
import { Map3DChart } from "@/shared/components/ui/chart3d/Map3DChart";
import { Mahalla3DMap } from "@/shared/components/ui/chart3d/Mahalla3DMap";

const MAP3D_MARKERS = [
  { lat: 40.6402, lng: 72.2378, label: "Yong'in-qutqaruv posti", status: "Navbatda: 2 brigada" },
  { lat: 40.6385, lng: 72.2405, label: "Kamera — Markaziy ko'cha", status: "Jonli efir" },
  { lat: 40.6371, lng: 72.2362, label: "Yong'in — Bozor", status: "Bartaraf etilmoqda" },
  { lat: 40.6418, lng: 72.2418, label: "Gaz taqsimlagich", status: "Nazoratda" },
  { lat: 40.636, lng: 72.239, label: "Suv ombori", status: "Faol" },
];

/* --------------------------------- mock data --------------------------------- */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(556677);
const ri = (a, b) => Math.floor(rnd() * (b - a + 1)) + a;
const pick = (a) => a[Math.floor(rnd() * a.length)];

const MAHALLA = { name: "Navbahor MFY", tuman: "Asaka tumani", population: 4860, households: 1120 };

const FIRST_M = ["Aziz", "Jasur", "Bekzod", "Sardor", "Otabek", "Akmal", "Bobur", "Sanjar", "Rustam", "Islom"];
const FIRST_F = ["Madina", "Nilufar", "Dilnoza", "Malika", "Zarina", "Kamola", "Nodira", "Sevara"];
const LAST = ["Karimov", "Rasulov", "Tursunov", "Yusupov", "Aliyev", "Saidov", "Qodirov", "Ergashev", "Nazarov", "Olimov"];
const STREETS = ["Mustaqillik", "Navoiy", "Amir Temur", "Bobur", "Yangihayot", "Istiqlol"];

const CITIZENS = Array.from({ length: 9 }, (_, i) => {
  const g = rnd() < 0.5 ? "male" : "female";
  const name = `${pick(LAST)}${g === "female" ? "a" : ""} ${g === "male" ? pick(FIRST_M) : pick(FIRST_F)}`;
  const status = pick(["Faol", "Faol", "Faol", "Nazoratda", "Yolg'iz keksa"]);
  return { id: `c${i}`, name, photo: `https://i.pravatar.cc/120?u=navbahor-${i}`, address: `${pick(STREETS)} ko'chasi, ${ri(1, 80)}-uy`, age: ri(19, 67), status };
});

const CAM_LOCS = ["Markaziy ko'cha", "Bozor kirishi", "Gaz taqsimlagich", "Maktab oldi", "Suv ombori", "MFY binosi"];
const CAMERAS = CAM_LOCS.map((loc, i) => ({
  id: `CAM-${String(i + 1).padStart(2, "0")}`,
  loc,
  online: rnd() < 0.84,
  img: `https://picsum.photos/seed/navbahor-cam-${i}/480/300?grayscale`,
}));

const KPIS = {
  population: MAHALLA.population,
  active: ri(0, 5),
  compliance: ri(70, 92),
  responseMin: ri(6, 12),
  camsOnline: CAMERAS.filter((c) => c.online).length,
  camsTotal: CAMERAS.length,
};

const DAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
const TYPE_COLORS = { "Yong'in": "#fb7185", Qutqaruv: "#22d3ee", "Tabiiy ofat": "#fbbf24", Texnogen: "#a78bfa", Tibbiy: "#34d399" };
const TYPES = Object.keys(TYPE_COLORS);

const SCATTER = Array.from({ length: 140 }, () => ({ value: [ri(0, 23), ri(0, 6), ri(1, 4)], type: pick(TYPES) }));
const TYPE_DIST = TYPES.map((t) => ({ name: t, value: ri(8, 60), color: TYPE_COLORS[t] }));
const STATUS_DIST = [
  { name: "Yopilgan", value: ri(80, 160), color: "#34d399" },
  { name: "Bartaraf etilmoqda", value: ri(20, 60), color: "#fbbf24" },
  { name: "Faol", value: ri(8, 30), color: "#fb7185" },
];
const RADAR_INDICATORS = ["Javob", "Bartaraf", "Tayyorlik", "Texnika", "Profilaktika", "Kamera"];
const RADAR_CURRENT = RADAR_INDICATORS.map(() => ri(10, 95));
const RADAR_NORM = RADAR_INDICATORS.map(() => ri(10, 95));
const GRID_ROWS = ["Yong'in", "Qutqaruv", "Tabiiy ofat", "Texnogen", "Tibbiy"];
const GRID_CELLS = GRID_ROWS.flatMap((row) => DAY_LABELS.map((col) => ({ row, col, value: ri(0, 14) })));

const MAP_MARKERS = [
  ...CAMERAS.map((c, i) => ({ id: c.id, x: 12 + ((i * 14.5) % 76), y: 22 + ((i * 23) % 56), type: "camera", label: `${c.id} · ${c.loc}`, status: c.online ? "Jonli efir" : "Signal yo'q" })),
  { id: "inc1", x: 38, y: 40, type: "incident", label: "Yong'in — Bozor", status: "Faol" },
  { id: "inc2", x: 64, y: 58, type: "incident", label: "Tibbiy — Maktab", status: "Bartaraf etilmoqda" },
  { id: "inc3", x: 26, y: 66, type: "incident", label: "Gaz — MFY", status: "Bartaraf etilgan" },
  { id: "post", x: 50, y: 34, type: "unit", label: "Yong'in-qutqaruv posti", status: "Navbatchi: 2 xodim" },
];

/* ------------------------------ echarts options ------------------------------ */
const AXIS = {
  axisLine: { lineStyle: { color: "#334155" } },
  axisLabel: { color: "#64748b", fontSize: 10 },
  splitLine: { lineStyle: { color: "#1e293b" } },
  nameTextStyle: { color: "#64748b" },
};

function nestedRadialOption() {
  return {
    tooltip: { trigger: "item" },
    angleAxis: { show: false, max: 100, startAngle: 90 },
    radiusAxis: { show: false, type: "category" },
    polar: { radius: ["25%", "42%"] },
    series: [
      { type: "bar", coordinateSystem: "polar", data: [Math.round((KPIS.active / 5) * 100)], roundCap: true, itemStyle: { color: "#22d3ee" }, barWidth: 14 },
      {
        type: "pie",
        radius: ["58%", "80%"],
        center: ["50%", "50%"],
        label: { show: false },
        data: [
          { value: KPIS.active, name: "Faol", itemStyle: { color: "#fb923c" } },
          { value: 100 - KPIS.active, name: "Bartaraf", itemStyle: { color: "#a78bfa" } },
        ],
      },
    ],
  };
}

function radarReadinessOption() {
  return {
    tooltip: {},
    legend: { data: ["Joriy", "Me'yor"], textStyle: { color: "#94a3b8", fontSize: 10 }, top: 0, right: 0 },
    radar: {
      indicator: RADAR_INDICATORS.map((a) => ({ name: a, max: 100 })),
      splitNumber: 4,
      shape: "polygon",
      axisName: { color: "#94a3b8", fontSize: 10 },
      splitLine: { lineStyle: { color: "#1e293b" } },
      splitArea: { areaStyle: { color: ["rgba(124,108,240,0.04)", "rgba(34,211,238,0.04)"] } },
      axisLine: { lineStyle: { color: "#1e293b" } },
    },
    series: [
      {
        type: "radar",
        data: [
          { value: RADAR_CURRENT, name: "Joriy", areaStyle: { color: "rgba(167,139,250,0.25)" }, lineStyle: { color: "#a78bfa" }, itemStyle: { color: "#a78bfa" } },
          { value: RADAR_NORM, name: "Me'yor", areaStyle: { color: "rgba(251,146,60,0.18)" }, lineStyle: { color: "#fb923c" }, itemStyle: { color: "#fb923c" } },
        ],
      },
    ],
  };
}

function breakdownOption(items) {
  return {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { left: 8, right: 16, top: 8, bottom: 4, containLabel: true },
    xAxis: { type: "value", ...AXIS },
    yAxis: { type: "category", data: items.map((i) => i.name).reverse(), ...AXIS },
    series: [{ type: "bar", data: items.map((i) => ({ value: i.value, itemStyle: { color: i.color, borderRadius: [0, 4, 4, 0] } })).reverse(), barWidth: 14 }],
  };
}

function scatter3dOption() {
  return {
    tooltip: {},
    legend: { textStyle: { color: "#94a3b8", fontSize: 10 }, top: 0 },
    xAxis3D: { type: "value", name: "Soat", max: 24, ...AXIS },
    yAxis3D: { type: "value", name: "Kun", max: 7, ...AXIS },
    zAxis3D: { type: "value", name: "Og'irlik", max: 4, ...AXIS },
    grid3D: {
      boxWidth: 100,
      boxDepth: 90,
      viewControl: { autoRotate: true, autoRotateSpeed: 9, distance: 190, alpha: 22 },
      light: { main: { intensity: 1.2 }, ambient: { intensity: 0.4 } },
      environment: "transparent",
    },
    series: TYPES.map((t) => ({ name: t, type: "scatter3D", symbolSize: 9, data: SCATTER.filter((p) => p.type === t).map((p) => p.value), itemStyle: { color: TYPE_COLORS[t], opacity: 0.85 } })),
  };
}

/* --------------------------------- UI bits ----------------------------------- */
function Section({ title, icon: Icon, children, className = "", accent = "cyan" }) {
  const tone = { cyan: "bg-cyan-500/15 text-cyan-400", purple: "bg-violet-500/15 text-violet-400", emerald: "bg-emerald-500/15 text-emerald-400", indigo: "bg-indigo-500/15 text-indigo-400" }[accent];
  return (
    <GlassCard className={`flex flex-col ${className}`}>
      <div className="mb-3 flex items-center gap-2.5">
        {Icon && <span className={`grid size-8 place-items-center rounded-xl ${tone}`}><Icon className="size-[16px]" strokeWidth={2} /></span>}
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </GlassCard>
  );
}

/* --------------------------------- page -------------------------------------- */
const FvvDashboardPage = () => {
  const nestedOpt = useMemo(nestedRadialOption, []);
  const radarOpt = useMemo(radarReadinessOption, []);
  const typeBreak = useMemo(() => breakdownOption(TYPE_DIST), []);
  const statusBreak = useMemo(() => breakdownOption(STATUS_DIST), []);
  const scatterOpt = useMemo(scatter3dOption, []);

  const [clock, setClock] = useState("");
  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString("ru-RU")), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Flame className="size-5 text-orange-400" /> {MAHALLA.name} — Favqulodda tahlil
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-foreground/50"><MapPin className="size-3.5" /> {MAHALLA.tuman} · barcha ma'lumotlar shu mahalla bo'yicha</p>
        </div>
        <span className="font-mono text-lg tabular-nums text-orange-300">{clock || "—"}</span>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassStatCard label="Aholi" value={KPIS.population} icon={Users} accent="cyan" />
        <GlassStatCard label="Faol vaziyatlar" value={KPIS.active} icon={Flame} accent="purple" />
        <GlassStatCard label="Normaga rioya" value={KPIS.compliance} suffix="%" icon={ShieldCheck} accent="emerald" glow />
        <GlassStatCard label="O'rtacha javob" value={KPIS.responseMin} suffix=" daq" icon={Clock} accent="yellow" />
      </div>

      {/* nested + radar */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Faol vs Bartaraf" icon={Activity} accent="purple">
          <EChart option={nestedOpt} height={260} />
          <div className="mt-1 flex items-center justify-center gap-5 text-xs">
            <span className="flex items-center gap-1.5 text-foreground/70"><span className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Faol: {KPIS.active}</span>
            <span className="flex items-center gap-1.5 text-foreground/70"><span className="h-2.5 w-2.5 rounded-full bg-violet-400" /> Bartaraf</span>
          </div>
        </Section>
        <Section title="Qism tayyorligi" icon={ShieldCheck} accent="cyan">
          <EChart option={radarOpt} height={290} />
        </Section>
      </div>

      {/* bubble grid */}
      <Section title="Hodisa turi × hafta kuni" icon={Activity} accent="purple">
        <BubbleGridHeatmap rows={GRID_ROWS} cols={DAY_LABELS} cells={GRID_CELLS} accent="#fb7185" />
      </Section>

      {/* 3D map + 2D map */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Section title="Photorealistik 3D xarita" icon={MapPin} accent="indigo">
          <Mahalla3DMap markers={MAP3D_MARKERS} height={340} fallbackSeed={556677} />
        </Section>
        <Section title="Operatsion xarita" icon={MapPin} accent="cyan">
          <DarkAreaMap markers={MAP_MARKERS} height={340} />
        </Section>
      </div>

      {/* breakdown + 3D scatter */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Section title="Hodisa turlari bo'yicha" icon={Activity} accent="purple"><EChart option={typeBreak} height={220} /></Section>
        <Section title="Holatlar bo'yicha" icon={Activity} accent="emerald"><EChart option={statusBreak} height={220} /></Section>
        <Section title="Hodisalar taqsimoti (3D)" icon={Activity} accent="cyan"><EChart option={scatterOpt} height={220} /></Section>
      </div>

      {/* cameras */}
      <Section title="Kamera kuzatuvi" icon={Camera} accent="cyan">
        <p className="-mt-2 mb-3 text-xs text-foreground/45">{KPIS.camsOnline} ta faol · jonli efir</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CAMERAS.map((c) => (
            <div key={c.id} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black">
              <div className="relative aspect-video">
                {c.online ? (
                  <img src={c.img} alt={c.loc} loading="lazy" className="h-full w-full object-cover opacity-80 transition group-hover:opacity-100" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-zinc-600">Signal yo'q</div>
                )}
                <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)" }} />
                <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
                  {c.online ? <><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> REC</> : <span className="text-zinc-400">OFFLINE</span>}
                </div>
                <div className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-cyan-300">{c.id}</div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                  <div className="truncate text-[11px] font-medium text-white">{c.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* citizens */}
      <Section title="Fuqarolar (xavf guruhi)" icon={Users} accent="cyan">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {CITIZENS.map((p) => (
            <div key={p.id} className="flex w-60 shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <img src={p.photo} alt={p.name} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="truncate text-xs text-foreground/45">{p.address}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[11px] text-foreground/40">{p.age} yosh</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${p.status === "Faol" ? "bg-emerald-500/15 text-emerald-400" : p.status === "Nazoratda" ? "bg-amber-500/15 text-amber-400" : "bg-sky-500/15 text-sky-400"}`}>{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default FvvDashboardPage;
