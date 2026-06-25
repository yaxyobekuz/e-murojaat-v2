// Yoshlar agentligi yo'nalishlari — 7 ta animatsiyali, AYDIN vizual (lucide ikonlar, emoji emas).
import { useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, Landmark, Star, Banknote, Sun, Accessibility, TrendingUp } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";
import GlowCard from "./ui/GlowCard";
import {
  VOLUNTEER_FIELDS, volunteerSummary, FIVE_INITIATIVES, PARLIAMENT,
  TALENT_DOMAINS, TALENT_STARS, talentSummary, CREDIT_TIERS, creditSummary,
  DOLZARB, DISABLED_YOUTH,
} from "../mock/directions.data";

const Head = ({ icon: Icon, glow, title, sub }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="grid size-8 place-items-center rounded-lg" style={{ background: `rgba(${glow},0.15)`, color: `rgb(${glow})` }}><Icon className="size-4" /></span>
    <div className="leading-tight">
      <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
      <p className="text-[11px] text-foreground/50">{sub}</p>
    </div>
  </div>
);

const fmt = (n) => n.toLocaleString("uz-UZ");

// ── 1. VOLONTYORLIK — markaziy hub + 4 yo'nalish (HTML, lucide) ──
const Volunteering = () => {
  const total = useCountUp(volunteerSummary.total, 1600);
  return (
    <GlowCard tilt={false} glow="34,197,94" className="flex flex-col">
      <Head icon={HeartHandshake} glow="34,197,94" title="Volontyorlik harakati" sub="4 yo'nalish · 5× o'sish" />
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(total)}</span>
        <span className="text-[12px] text-foreground/55">faol volontyor</span>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"><TrendingUp className="size-3" />5×</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {VOLUNTEER_FIELDS.map((f, i) => {
          const pct = Math.round((f.count / volunteerSummary.total) * 100);
          return (
            <motion.div key={f.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2.5">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg" style={{ background: `${f.color}22`, color: f.color }}><f.icon className="size-4" /></span>
                <span className="text-[12px] font-medium text-foreground/85">{f.label}</span>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <span className="font-mono text-[15px] font-bold tabular-nums text-foreground">{fmt(f.count)}</span>
                <span className="font-mono text-[11px]" style={{ color: f.color }}>{pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 2.2}%` }} transition={{ duration: 1, delay: i * 0.08 }}
                  className="h-full rounded-full" style={{ background: f.color, boxShadow: `0 0 6px ${f.color}88` }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlowCard>
  );
};

// ── 2. BESHTA TASHABBUS — progress halqa + lucide ikon ──
const FiveInitiatives = () => (
  <GlowCard tilt={false} glow="167,139,250" className="flex flex-col">
    <Head icon={Sparkles} glow="167,139,250" title="Beshta tashabbus" sub="Madaniyat · Sport · IT · Kitob · Xotin-qizlar" />
    <div className="grid grid-cols-5 gap-2">
      {FIVE_INITIATIVES.map((it, i) => {
        const pct = Math.round((it.reach / it.target) * 100);
        const r = 22, circ = 2 * Math.PI * r;
        return (
          <motion.div key={it.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2">
            <div className="relative size-14">
              <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                <circle cx="28" cy="28" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <motion.circle cx="28" cy="28" r={r} fill="none" stroke={it.color} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
                  transition={{ duration: 1, delay: i * 0.08 }} style={{ filter: `drop-shadow(0 0 4px ${it.color})` }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center" style={{ color: it.color }}><it.icon className="size-5" /></div>
            </div>
            <div className="mt-1 font-mono text-[13px] font-bold" style={{ color: it.color }}>{pct}%</div>
            <div className="text-center text-[9px] leading-tight text-foreground/55">{it.label}</div>
            <div className="font-mono text-[8.5px] text-foreground/40">{(it.reach / 1_000_000).toFixed(1)}M</div>
          </motion.div>
        );
      })}
    </div>
  </GlowCard>
);

// ── 3. YOSHLAR PARLAMENTI — yarim doira o'rindiqlar (aniqroq) ──
const Parliament = () => {
  const ROWS = [10, 12, 14]; // 36 o'rindiq, 3 yoy
  let idx = 0;
  const facColor = (i) => {
    let acc = 0;
    for (const f of PARLIAMENT.factions) { acc += f.count; if (i < acc) return f.color; }
    return "hsl(var(--muted))";
  };
  return (
    <GlowCard tilt={false} glow="59,130,246" className="flex flex-col">
      <Head icon={Landmark} glow="59,130,246" title="Yoshlar parlamenti" sub={`${PARLIAMENT.initiatives} tashabbus · ${PARLIAMENT.adopted} qabul qilindi`} />
      <div className="relative flex justify-center py-1">
        <svg viewBox="0 0 220 120" className="w-full max-w-[300px]">
          {ROWS.map((count, row) => {
            const radius = 38 + row * 26;
            return Array.from({ length: count }).map((_, c) => {
              const ang = Math.PI - (c / (count - 1)) * Math.PI;
              const x = 110 + Math.cos(ang) * radius, y = 108 - Math.sin(ang) * radius;
              const myIdx = idx++;
              const filled = myIdx < PARLIAMENT.filled;
              return (
                <motion.circle key={`${row}-${c}`} cx={x} cy={y} r={5} fill={filled ? facColor(myIdx) : "hsl(var(--muted))"}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: myIdx * 0.015, type: "spring", stiffness: 300 }} />
              );
            });
          })}
          <text x="110" y="115" textAnchor="middle" className="fill-foreground font-mono font-bold" fontSize={13}>{PARLIAMENT.filled}/{PARLIAMENT.seats}</text>
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {PARLIAMENT.factions.map((f) => (
          <span key={f.label} className="flex items-center gap-1 text-[10.5px] text-foreground/70">
            <span className="size-2.5 rounded-full" style={{ background: f.color }} /> {f.label} <b className="font-mono text-foreground">{f.count}</b>
          </span>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 4. IQTIDORLI YOSHLAR — zich yulduzlar (porlaydi, domen filtri) ──
const TalentStarfield = () => {
  const [active, setActive] = useState("");
  const total = useCountUp(talentSummary.total, 1600);
  return (
    <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
      <Head icon={Star} glow="34,211,238" title="Iqtidorli yoshlar reestri" sub="Har nuqta — iqtidorli yosh · sohaga hover qiling" />
      <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--card-border))]"
        style={{ height: 150, background: "radial-gradient(ellipse at 50% 40%, rgba(34,211,238,0.06), hsl(var(--muted)/0.25))" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {TALENT_STARS.map((s) => {
            const dim = active && s.domain !== active;
            const hl = active && s.domain === active;
            return (
              <motion.circle key={s.id} cx={s.x} cy={s.y} r={s.size * (s.bright || hl ? 1.4 : 1)} fill={s.color}
                animate={{ opacity: dim ? 0.08 : [0.35, s.bright || hl ? 1 : 0.65, 0.35] }}
                transition={{ duration: 2 + s.delay, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: (s.bright || hl) ? `drop-shadow(0 0 1.5px ${s.color})` : "none" }} />
            );
          })}
        </svg>
        <div className="absolute left-2.5 top-2.5">
          <div className="font-mono text-[17px] font-bold leading-none text-cyan-600 dark:text-cyan-400">{fmt(total)}</div>
          <div className="text-[10px] text-foreground/55">iqtidorli yosh</div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {TALENT_DOMAINS.map((d) => (
          <button key={d.key} onMouseEnter={() => setActive(d.key)} onMouseLeave={() => setActive("")}
            className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10.5px] transition-colors"
            style={{ borderColor: active === d.key ? d.color : "rgb(var(--card-border))", background: active === d.key ? `${d.color}14` : "transparent", color: active === d.key ? d.color : "hsl(var(--muted-foreground))" }}>
            <d.icon className="size-3.5" /> {d.label}
          </button>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 5. TADBIRKORLIK KREDITLARI — 3 daraja + pul oqimi ──
const CreditFlow = () => {
  const total = useCountUp(Math.round(creditSummary.totalUzs / 1_000_000_000), 1600);
  return (
    <GlowCard tilt={false} glow="245,158,11" className="flex flex-col">
      <Head icon={Banknote} glow="245,158,11" title="Tadbirkorlik kreditlari" sub="O'z-band → loyiha → startap" />
      <div className="mb-3 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">{fmt(total)}</span>
        <span className="text-[12px] text-foreground/55">mlrd so'm · {fmt(creditSummary.beneficiaries)} yosh</span>
      </div>
      <div className="space-y-2">
        {CREDIT_TIERS.map((t, i) => (
          <motion.div key={t.key} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
            className="relative flex items-center justify-between overflow-hidden rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2.5">
            {[0, 1].map((k) => (
              <motion.span key={k} className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full" style={{ background: t.color }}
                animate={{ left: ["-3%", "103%"], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 + k * 1.1, ease: "linear" }} />
            ))}
            <div className="relative flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-lg" style={{ background: `${t.color}1f`, color: t.color }}><t.icon className="size-5" /></span>
              <div className="leading-tight">
                <div className="text-[12px] font-semibold text-foreground">{t.label}</div>
                <div className="text-[10px] text-foreground/50">{fmt(t.count)} yosh foydalandi</div>
              </div>
            </div>
            <div className="relative text-right">
              <div className="font-mono text-[13px] font-bold" style={{ color: t.color }}>{t.unit === "$" ? `$${(t.max / 1000).toFixed(0)}k` : `${(t.max / 1_000_000).toLocaleString("uz-UZ")} mln`}</div>
              <div className="text-[9px] text-foreground/40">maksimal</div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 6. DOLZARB 90 KUN — qamrov + vaqt + tadbirlar ──
const Dolzarb = () => {
  const reached = useCountUp(DOLZARB.reached, 1600);
  const pct = Math.round((DOLZARB.reached / DOLZARB.target) * 100);
  const dayPct = Math.round((DOLZARB.daysPassed / DOLZARB.daysTotal) * 100);
  return (
    <GlowCard tilt={false} glow="251,191,36" className="flex flex-col">
      <Head icon={Sun} glow="251,191,36" title="Dolzarb 90 kun" sub="Yozgi mavsumiy bandlik dasturi" />
      <div className="mb-2 flex items-end justify-between">
        <div><span className="font-mono text-[22px] font-bold text-foreground">{(reached / 1_000_000).toFixed(2)}M</span><span className="text-[11px] text-foreground/55"> / {DOLZARB.target / 1_000_000}M yosh</span></div>
        <div className="text-right"><span className="font-mono text-[15px] font-bold text-amber-600 dark:text-amber-400">{DOLZARB.daysPassed}</span><span className="text-[10px] text-foreground/50">/{DOLZARB.daysTotal} kun</span></div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2 }}
          className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b)", boxShadow: "0 0 8px #f59e0b88" }} />
      </div>
      <div className="mt-1 text-[10px] text-foreground/45">Qamrov {pct}% · vaqt {dayPct}%</div>
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {DOLZARB.activities.map((a) => (
          <div key={a.label} className="flex items-center gap-2 rounded-lg border border-[rgb(var(--card-border))] bg-muted/30 px-2 py-1.5 text-[10.5px]">
            <span className="grid size-6 place-items-center rounded-md" style={{ background: `${a.color}1f`, color: a.color }}><a.icon className="size-3.5" /></span>
            <span className="flex-1 truncate text-foreground/70">{a.label}</span>
            <b className="font-mono text-foreground/80">{(a.count / 1000).toFixed(1)}k</b>
          </div>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 7. NOGIRON YOSHLAR — g'amxo'rlik qamrovi ──
const DisabledYouth = () => (
  <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
    <Head icon={Accessibility} glow="34,211,238" title="Imkoniyati cheklangan yoshlar" sub={`${fmt(DISABLED_YOUTH.total)} yoshga g'amxo'rlik`} />
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {DISABLED_YOUTH.measures.map((m, i) => {
        const pct = Math.round((m.value / DISABLED_YOUTH.total) * 100);
        return (
          <motion.div key={m.key} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2.5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg" style={{ background: `${m.color}1f`, color: m.color }}><m.icon className="size-4" /></span>
              <span className="text-[11px] font-medium leading-tight text-foreground/80">{m.label}</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="font-mono text-[17px] font-bold tabular-nums text-foreground">{fmt(m.value)}</span>
              <span className="font-mono text-[11px]" style={{ color: m.color }}>{pct}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full rounded-full" style={{ background: m.color, boxShadow: `0 0 6px ${m.color}88` }} />
            </div>
          </motion.div>
        );
      })}
    </div>
  </GlowCard>
);

export const YouthDirections = () => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <Volunteering />
    <FiveInitiatives />
    <TalentStarfield />
    <Parliament />
    <CreditFlow />
    <Dolzarb />
    <div className="xl:col-span-2"><DisabledYouth /></div>
  </div>
);
