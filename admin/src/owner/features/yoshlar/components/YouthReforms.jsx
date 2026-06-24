// Yoshlar islohotlari — 4 panel: Bandlik dasturlari, Tashabbusli budjet,
// El-yurt umidi, Mehribonlik uyi bitiruvchilari. Theme-aware.
import { Briefcase, Vote, GraduationCap, HeartHandshake, Home, BookOpen, Globe2 } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import GlowCard from "./ui/GlowCard";
import {
  EMPLOYMENT_PROGRAMS, EMPLOYMENT_FUNNEL, employmentSummary,
  YOUTH_INITIATIVES, initiativeSummary,
  SCHOLARSHIPS, scholarshipSummary,
  ORPHAN_GRADUATES, orphanSummary,
} from "../mock/reforms.data";

const TONE = {
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  new: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  progress: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
};
const Chip = ({ tone, children }) => (
  <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap", TONE[tone] || TONE.new)}>{children}</span>
);

const Head = ({ icon: Icon, glow, title, sub }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="grid size-8 place-items-center rounded-lg" style={{ background: `rgba(${glow},0.15)`, color: `rgb(${glow})` }}><Icon className="size-4" /></span>
    <div className="leading-tight">
      <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      <p className="text-[11px] text-foreground/50">{sub}</p>
    </div>
  </div>
);

// ── 1. Bandlik dasturlari ──
const Employment = () => (
  <GlowCard tilt={false} glow="52,211,153" className="flex flex-col">
    <Head icon={Briefcase} glow="52,211,153" title="Bandlik dasturlari" sub="Yoshlar biznesi · Kelajakka qadam · maqsad vs erishilgan" />
    <div className="mb-3 rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-3 py-2 text-center">
      <span className="font-mono text-[18px] font-bold tabular-nums text-foreground">{employmentSummary.reached.toLocaleString("uz-UZ")}</span>
      <span className="text-foreground/45"> / {employmentSummary.target.toLocaleString("uz-UZ")} yosh ish bilan ta'minlandi ({employmentSummary.pct}%)</span>
    </div>
    <div className="space-y-2.5">
      {EMPLOYMENT_PROGRAMS.map((p) => {
        const pct = Math.round((p.reached / p.target) * 100);
        return (
          <div key={p.key}>
            <div className="mb-1 flex items-center justify-between text-[11.5px]">
              <span className="flex items-center gap-1 text-foreground/75">{p.icon} {p.name}</span>
              <span className="font-mono tabular-nums" style={{ color: p.color }}>{p.reached.toLocaleString("uz-UZ")} / {p.target.toLocaleString("uz-UZ")}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color, boxShadow: `0 0 8px ${p.color}80` }} />
            </div>
          </div>
        );
      })}
    </div>
    {/* voronka */}
    <div className="mt-3 border-t border-[rgb(var(--card-border))] pt-3">
      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/45">Bandlik voronkasi</div>
      <div className="space-y-1">
        {EMPLOYMENT_FUNNEL.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-32 shrink-0 text-[11px] text-foreground/65">{f.stage}</span>
            <div className="h-4 flex-1 overflow-hidden rounded bg-foreground/5">
              <div className="h-full rounded" style={{ width: `${(f.value / EMPLOYMENT_FUNNEL[0].value) * 100}%`, background: f.color }} />
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-[11px] tabular-nums text-foreground/70">{(f.value / 1000).toFixed(0)}k</span>
          </div>
        ))}
      </div>
    </div>
  </GlowCard>
);

// ── 2. Tashabbusli budjet (yoshlar) ──
const Initiatives = () => {
  const maxV = Math.max(...YOUTH_INITIATIVES.map((p) => p.votes), 1);
  return (
    <GlowCard tilt={false} glow="245,158,11" className="flex flex-col">
      <Head icon={Vote} glow="245,158,11" title="Tashabbusli budjet" sub="Yosh g'oyalarini moliyalashtirish · ovoz berish" />
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Loyihalar", v: initiativeSummary.total },
          { k: "Ovozlar", v: initiativeSummary.totalVotes.toLocaleString("uz-UZ") },
          { k: "Ajratildi", v: formatMoney(initiativeSummary.allocated), small: true },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-2">
            <div className={cn("font-mono font-bold tabular-nums text-foreground", m.small ? "text-[11px]" : "text-[15px]")}>{m.v}</div>
            <div className="text-[9.5px] text-foreground/45">{m.k}</div>
          </div>
        ))}
      </div>
      <div className="max-h-[260px] space-y-1.5 overflow-y-auto">
        {YOUTH_INITIATIVES.map((p) => (
          <div key={p.id} className="rounded-lg border border-[rgb(var(--card-border))] bg-card p-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">{p.title}</span>
              <Chip tone={p.status === "won" ? "done" : p.status === "voting" ? "new" : "progress"}>
                {p.status === "won" ? "G'olib" : p.status === "voting" ? "Ovoz berilmoqda" : "Ko'rilmoqda"}
              </Chip>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10.5px] text-foreground/50">
              <span>{p.mahalla}</span>·<span>{p.votes.toLocaleString("uz-UZ")} ovoz</span>·<span className="font-mono">{formatMoney(p.cost)}</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full rounded-full bg-amber-500" style={{ width: `${(p.votes / maxV) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 3. El-yurt umidi ──
const Scholarships = () => (
  <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
    <Head icon={GraduationCap} glow="34,211,238" title="El-yurt umidi" sub="Chet elda o'qish stipendiyalari" />
    <div className="mb-3 grid grid-cols-3 gap-2 text-center">
      {[
        { icon: BookOpen, k: "O'qimoqda", v: scholarshipSummary.studying },
        { icon: GraduationCap, k: "Tanlandi", v: scholarshipSummary.selected },
        { icon: Globe2, k: "Davlatlar", v: scholarshipSummary.countries },
      ].map((m, i) => (
        <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-2">
          <m.icon className="mx-auto size-4 text-cyan-600 dark:text-cyan-400" />
          <div className="mt-1 font-mono text-[16px] font-bold tabular-nums text-foreground">{m.v}</div>
          <div className="text-[9.5px] text-foreground/45">{m.k}</div>
        </div>
      ))}
    </div>
    <div className="max-h-[230px] space-y-1 overflow-y-auto">
      {SCHOLARSHIPS.map((s) => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-[rgb(var(--card-border))] bg-card px-2.5 py-1.5">
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-foreground">{s.name}</div>
            <div className="text-[10px] text-foreground/50">{s.country} · {s.field} · {s.level}</div>
          </div>
          <Chip tone={s.status === "studying" ? "done" : s.status === "selected" ? "new" : "progress"}>
            {s.status === "studying" ? "O'qimoqda" : s.status === "selected" ? "Tanlandi" : "Ariza"}
          </Chip>
        </div>
      ))}
    </div>
  </GlowCard>
);

// ── 4. Mehribonlik uyi bitiruvchilari ──
const Orphans = () => (
  <GlowCard tilt={false} glow="168,139,250" className="flex flex-col">
    <Head icon={HeartHandshake} glow="168,139,250" title="Mehribonlik uyi bitiruvchilari" sub="Uy-joy · ish · ta'lim qo'llab-quvvatlash" />
    <div className="mb-3 grid grid-cols-3 gap-2 text-center">
      {[
        { icon: Home, k: "Uy-joy", v: `${orphanSummary.housing}/${orphanSummary.total}` },
        { icon: Briefcase, k: "Ish bilan", v: `${orphanSummary.job}/${orphanSummary.total}` },
        { icon: BookOpen, k: "O'qishda", v: `${orphanSummary.study}/${orphanSummary.total}` },
      ].map((m, i) => (
        <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-2">
          <m.icon className="mx-auto size-4 text-violet-600 dark:text-violet-400" />
          <div className="mt-1 font-mono text-[14px] font-bold tabular-nums text-foreground">{m.v}</div>
          <div className="text-[9.5px] text-foreground/45">{m.k}</div>
        </div>
      ))}
    </div>
    <div className="max-h-[230px] space-y-1 overflow-y-auto">
      {ORPHAN_GRADUATES.map((o) => (
        <div key={o.id} className="flex items-center justify-between rounded-lg border border-[rgb(var(--card-border))] bg-card px-2.5 py-1.5">
          <div className="leading-tight">
            <div className="text-[12px] font-medium text-foreground">{o.name} <span className="text-foreground/40">· {o.age} yosh</span></div>
            <div className="flex gap-1 mt-0.5">
              {o.housing && <span className="text-[9px]">🏠</span>}
              {o.job && <span className="text-[9px]">💼</span>}
              {o.study && <span className="text-[9px]">📚</span>}
              <span className="text-[10px] text-foreground/45">{o.mahalla}</span>
            </div>
          </div>
          <Chip tone={o.status === "full" ? "done" : o.status === "partial" ? "progress" : "new"}>
            {o.status === "full" ? "To'liq qamrov" : o.status === "partial" ? "Qisman" : "Kutilmoqda"}
          </Chip>
        </div>
      ))}
    </div>
  </GlowCard>
);

export const YouthReforms = () => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <Employment />
    <Initiatives />
    <Scholarships />
    <Orphans />
  </div>
);
