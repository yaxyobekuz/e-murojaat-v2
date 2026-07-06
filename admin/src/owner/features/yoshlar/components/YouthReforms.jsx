// Yoshlar islohotlari — STATISTIKA EMAS. Animatsiyali metaforalar:
// Bandlik = oqar voronka, El-yurt umidi = dunyo xaritasida uchish, Mehribonlik = qalb to'lishi.
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, HeartHandshake, Vote, Home, BookOpen, Plane } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import GlowCard from "./ui/GlowCard";
import {
  EMPLOYMENT_PROGRAMS, EMPLOYMENT_FUNNEL, employmentSummary,
  YOUTH_INITIATIVES, initiativeSummary,
  SCHOLARSHIPS, scholarshipSummary,
  ORPHAN_GRADUATES, orphanSummary,
} from "../mock/reforms.data";

const Head = ({ icon: Icon, glow, title, sub }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="grid size-8 place-items-center rounded-lg" style={{ background: `rgba(${glow},0.15)`, color: `rgb(${glow})` }}><Icon className="size-4" /></span>
    <div className="leading-tight">
      <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      <p className="text-[11px] text-foreground/50">{sub}</p>
    </div>
  </div>
);

// ── 1. BANDLIK — oqar voronka (har bosqich torayadi, oqim harakatlanadi) ──
const Employment = () => {
  const W = 420, top = EMPLOYMENT_FUNNEL[0].value;
  return (
    <GlowCard tilt={false} glow="52,211,153" className="flex flex-col">
      <Head icon={Briefcase} glow="52,211,153" title="Bandlik dasturlari" sub="Yoshlar oqimi: ro'yxat → o'qish → ish" />
      <div className="mb-3 text-center text-[12px] text-foreground/60">
        <span className="font-mono text-[20px] font-bold text-foreground">{employmentSummary.reached.toLocaleString("uz-UZ")}</span> yosh ish bilan ta'minlandi · <b className="text-emerald-600 dark:text-emerald-400">{employmentSummary.pct}%</b>
      </div>
      {/* voronka */}
      <svg viewBox={`0 0 ${W} 200`} className="w-full">
        {EMPLOYMENT_FUNNEL.map((f, i) => {
          const wTop = (f.value / top) * W;
          const wBot = (i < EMPLOYMENT_FUNNEL.length - 1 ? EMPLOYMENT_FUNNEL[i + 1].value : f.value * 0.8) / top * W;
          const y = i * 48 + 6, h = 40;
          const x1 = (W - wTop) / 2, x2 = (W - wBot) / 2;
          return (
            <g key={i}>
              <motion.path d={`M${x1},${y} L${x1 + wTop},${y} L${x2 + wBot},${y + h} L${x2},${y + h} Z`}
                initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: i * 0.15, duration: 0.6 }}
                fill={f.color} fillOpacity={0.35} stroke={f.color} strokeWidth={1.5} style={{ transformOrigin: `${W / 2}px ${y}px` }} />
              {/* oqim nuqtalari (pastga harakat) */}
              {[0, 1, 2].map((k) => (
                <motion.circle key={k} cx={W / 2 + (k - 1) * 14} r={2.2} fill={f.color}
                  animate={{ cy: [y, y + h], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 + k * 0.4, ease: "easeIn" }} />
              ))}
              <text x={W / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle" className="fill-foreground font-medium" style={{ fontSize: 10 }}>{f.stage}</text>
              <text x={W / 2} y={y + h / 2 + 12} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 9, fill: f.color }}>{f.value}</text>
            </g>
          );
        })}
      </svg>
      {/* dasturlar mini */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {EMPLOYMENT_PROGRAMS.map((p) => (
          <div key={p.key} className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-1 text-[10.5px]">
            <p.icon className="size-3.5 shrink-0" style={{ color: p.color }} /><span className="flex-1 truncate text-foreground/70">{p.name}</span>
            <b className="font-mono" style={{ color: p.color }}>{Math.round((p.reached / p.target) * 100)}%</b>
          </div>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 2. TASHABBUSLI BUDJET (yoshlar) — ovoz to'lqini ──
const Initiatives = () => {
  const maxV = Math.max(...YOUTH_INITIATIVES.map((p) => p.votes), 1);
  return (
    <GlowCard tilt={false} glow="245,158,11" className="flex flex-col">
      <Head icon={Vote} glow="245,158,11" title="Tashabbusli budjet" sub="Yosh g'oyalari · ovoz balandligi" />
      <div className="mb-2 text-center text-[12px] text-foreground/60">
        <b className="font-mono text-foreground">{initiativeSummary.totalVotes.toLocaleString("uz-UZ")}</b> ovoz · <b className="text-amber-600 dark:text-amber-400">{formatMoney(initiativeSummary.allocated)}</b> ajratildi
      </div>
      {/* ovoz ustunlari (balandlik = ovoz) */}
      <div className="flex items-end justify-between gap-1 px-1" style={{ height: 130 }}>
        {[...YOUTH_INITIATIVES].sort((a, b) => b.votes - a.votes).map((p, i) => {
          const h = Math.max(12, (p.votes / maxV) * 110);
          const color = p.status === "won" ? "#22c55e" : p.status === "voting" ? "#f59e0b" : "#94a3b8";
          return (
            <div key={p.id} className="group relative flex flex-1 flex-col items-center justify-end" title={`${p.title} · ${p.votes} ovoz`}>
              <span className="mb-0.5 font-mono text-[8px] tabular-nums text-foreground/50">{p.votes}</span>
              <motion.div initial={{ height: 0 }} animate={{ height: h }} transition={{ delay: i * 0.06, type: "spring", stiffness: 120, damping: 16 }}
                className="w-full rounded-t" style={{ background: `linear-gradient(0deg, ${color}, ${color}aa)`, boxShadow: `0 0 8px ${color}66` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-around text-[8.5px] text-foreground/45">
        <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-emerald-500" /> G'olib</span>
        <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-amber-500" /> Ovoz berilmoqda</span>
        <span className="flex items-center gap-1"><i className="size-2 rounded-full bg-slate-400" /> Ko'rilmoqda</span>
      </div>
    </GlowCard>
  );
};

// ── 3. EL-YURT UMIDI — dunyo xaritasida uchish ──
const COUNTRY_POS = {
  "AQSH": { x: 18, y: 42 }, "Buyuk Britaniya": { x: 46, y: 30 }, "Germaniya": { x: 50, y: 33 },
  "Yaponiya": { x: 86, y: 44 }, "Janubiy Koreya": { x: 83, y: 46 }, "Singapur": { x: 78, y: 62 },
  "Italiya": { x: 51, y: 40 }, "Fransiya": { x: 47, y: 36 },
};
const HOME = { x: 64, y: 40 }; // O'zbekiston (taxminiy)

const Scholarships = () => (
  <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
    <Head icon={GraduationCap} glow="34,211,238" title="El-yurt umidi" sub="Talabalar dunyo bo'ylab uchmoqda" />
    <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--card-border))]" style={{ height: 180, background: "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.06), hsl(var(--muted)/0.25))" }}>
      {/* dotted-grid "dunyo" foni */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)/0.12) 1px, transparent 1px)", backgroundSize: "10px 10px" }} />
      <svg viewBox="0 0 100 70" className="absolute inset-0 h-full w-full">
        {/* uchish yo'llari + lucide samolyot (emoji emas) */}
        {SCHOLARSHIPS.filter((s) => s.status === "studying").slice(0, 7).map((s, i) => {
          const pos = COUNTRY_POS[s.country] || { x: 50, y: 35 };
          const d = `M${HOME.x},${HOME.y} Q${(HOME.x + pos.x) / 2},${Math.min(HOME.y, pos.y) - 12} ${pos.x},${pos.y}`;
          return (
            <g key={s.id}>
              <path d={d} fill="none" stroke={hexFly(i)} strokeWidth={0.4} strokeDasharray="1.5 1.5" opacity={0.5} />
              <circle cx={pos.x} cy={pos.y} r={1.8} fill={hexFly(i)} style={{ filter: `drop-shadow(0 0 1px ${hexFly(i)})` }} />
              <text x={pos.x} y={pos.y - 3} textAnchor="middle" fontSize={2.6} className="fill-foreground/65">{s.country}</text>
              <motion.g animate={{ offsetDistance: ["0%", "100%"] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                style={{ offsetPath: `path("${d}")`, offsetRotate: "auto" }}>
                <Plane x={-2} y={-2} width={4} height={4} style={{ color: hexFly(i) }} />
              </motion.g>
            </g>
          );
        })}
        {/* uy — O'zbekiston */}
        <circle cx={HOME.x} cy={HOME.y} r={3} fill="#22d3ee" style={{ filter: "drop-shadow(0 0 2px #22d3ee)" }} />
        <circle cx={HOME.x} cy={HOME.y} r={1.4} fill="#fff" />
        <text x={HOME.x} y={HOME.y + 6} textAnchor="middle" fontSize={3} className="fill-foreground font-semibold">O'zbekiston</text>
      </svg>
      <div className="absolute left-2 top-2 rounded-lg bg-card/80 px-2 py-1 backdrop-blur-md">
        <span className="font-mono text-[14px] font-bold text-cyan-600 dark:text-cyan-400">{scholarshipSummary.studying}</span>
        <span className="text-[10px] text-foreground/55"> talaba · {scholarshipSummary.countries} davlat</span>
      </div>
    </div>
    {/* davlatlar chiplari */}
    <div className="mt-2 flex flex-wrap gap-1">
      {SCHOLARSHIPS.slice(0, 8).map((s) => (
        <span key={s.id} className="flex items-center gap-1 rounded-full border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-0.5 text-[10px] text-foreground/70">
          <Plane className="size-2.5 text-cyan-500" /> {s.name} → {s.country}
        </span>
      ))}
    </div>
  </GlowCard>
);

// ── 4. MEHRIBONLIK UYI — qalb/qamrov to'lishi ──
const CareHeart = ({ value, total, label, icon: Icon, color }) => {
  const pct = Math.round((value / total) * 100);
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-20">
        <svg viewBox="0 0 100 100" className="size-full">
          <defs><clipPath id={`clip-${label}`}><path d="M50,88 C20,62 8,44 8,30 C8,16 18,8 30,8 C40,8 47,14 50,22 C53,14 60,8 70,8 C82,8 92,16 92,30 C92,44 80,62 50,88 Z" /></clipPath></defs>
          <path d="M50,88 C20,62 8,44 8,30 C8,16 18,8 30,8 C40,8 47,14 50,22 C53,14 60,8 70,8 C82,8 92,16 92,30 C92,44 80,62 50,88 Z" fill="hsl(var(--muted))" />
          <motion.rect x="0" width="100" clipPath={`url(#clip-${label})`} fill={color}
            initial={{ y: 100, height: 0 }} animate={{ y: 100 - pct, height: pct }} transition={{ duration: 1.2, ease: "easeOut" }} />
          <path d="M50,88 C20,62 8,44 8,30 C8,16 18,8 30,8 C40,8 47,14 50,22 C53,14 60,8 70,8 C82,8 92,16 92,30 C92,44 80,62 50,88 Z" fill="none" stroke={color} strokeWidth={3} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><Icon className="size-5" style={{ color }} /></div>
      </div>
      <div className="mt-1 font-mono text-[13px] font-bold tabular-nums text-foreground">{value}/{total}</div>
      <div className="text-[10px] text-foreground/50">{label}</div>
    </div>
  );
};

const Orphans = () => (
  <GlowCard tilt={false} glow="168,139,250" className="flex flex-col">
    <Head icon={HeartHandshake} glow="168,139,250" title="Mehribonlik uyi bitiruvchilari" sub="G'amxo'rlik qamrovi to'lib bormoqda" />
    <div className="grid grid-cols-3 gap-2 py-3">
      <CareHeart value={orphanSummary.housing} total={orphanSummary.total} label="Uy-joy" icon={Home} color="#a78bfa" />
      <CareHeart value={orphanSummary.job} total={orphanSummary.total} label="Ish bilan" icon={Briefcase} color="#34d399" />
      <CareHeart value={orphanSummary.study} total={orphanSummary.total} label="O'qishda" icon={BookOpen} color="#22d3ee" />
    </div>
    {/* bitiruvchilar */}
    <div className="mt-1 flex flex-wrap gap-1.5">
      {ORPHAN_GRADUATES.map((o) => (
        <span key={o.id} className="flex items-center gap-1.5 rounded-full border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-0.5 text-[10px] text-foreground/70">
          {o.name}
          <span className="flex items-center gap-0.5">
            {o.housing && <Home className="size-3 text-[#a78bfa]" />}
            {o.job && <Briefcase className="size-3 text-[#34d399]" />}
            {o.study && <BookOpen className="size-3 text-[#22d3ee]" />}
          </span>
        </span>
      ))}
    </div>
  </GlowCard>
);

// hexFly — uchish yo'li ranglari
function hexFly(i) { return ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#f472b6", "#60a5fa", "#fbbf24"][i % 7]; }

export const YouthReforms = () => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <Employment />
    <Initiatives />
    <Scholarships />
    <Orphans />
  </div>
);
