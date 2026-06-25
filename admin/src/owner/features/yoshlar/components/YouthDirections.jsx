// Yoshlar agentligi yo'nalishlari — STATISTIKA EMAS. 7 ta animatsiyali metafora.
// Volontyorlik to'lqini, Beshta tashabbus, Parlament, Iqtidor yulduzlari, Kredit oqimi,
// Dolzarb 90 kun, Nogiron yoshlar g'amxo'rligi. Theme-aware, framer-motion.
import { useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, Landmark, Star, Banknote, Sun, Accessibility } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
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

// ── 1. VOLONTYORLIK — markazdan to'lqin bo'lib tarqaladi ──
const Volunteering = () => {
  const total = useCountUp(volunteerSummary.total, 1600);
  const W = 420, H = 200, cx = W / 2, cy = H / 2;
  return (
    <GlowCard tilt={false} glow="34,197,94" className="flex flex-col">
      <Head icon={HeartHandshake} glow="34,197,94" title="Volontyorlik harakati" sub="4 yo'nalish · 5× o'sish" />
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          {/* tarqalish to'lqinlari */}
          {[0, 1, 2].map((k) => (
            <motion.circle key={k} cx={cx} cy={cy} fill="none" stroke="rgba(34,197,94,0.4)" strokeWidth={1}
              animate={{ r: [10, 90], opacity: [0.5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: k * 1, ease: "easeOut" }} />
          ))}
          {/* yo'nalish tugunlari */}
          {VOLUNTEER_FIELDS.map((f, i) => {
            const ang = (i / VOLUNTEER_FIELDS.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(ang) * 78, y = cy + Math.sin(ang) * 62;
            return (
              <g key={f.key}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke={f.color} strokeOpacity={0.3} strokeWidth={1.5} />
                {/* harakatlanuvchi volontyor nuqtasi */}
                <motion.circle r={2.5} fill={f.color} animate={{ cx: [cx, x], cy: [cy, y], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }} />
                <circle cx={x} cy={y} r={16} fill={`${f.color}22`} stroke={f.color} strokeWidth={1.5} />
                <text x={x} y={y - 1} textAnchor="middle" fontSize={13}>{f.icon}</text>
                <text x={x} y={y + 26} textAnchor="middle" className="fill-foreground/70" fontSize={8}>{f.label}</text>
                <text x={x} y={y + 35} textAnchor="middle" className="font-mono" fontSize={8} fill={f.color}>{(f.count / 1000).toFixed(0)}k</text>
              </g>
            );
          })}
          {/* markaz */}
          <circle cx={cx} cy={cy} r={20} fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth={1.5} />
          <text x={cx} y={cy + 1} textAnchor="middle" fontSize={16}>🤝</text>
        </svg>
        <div className="absolute left-2 top-1 rounded-lg bg-card/80 px-2 py-1 backdrop-blur-md">
          <span className="font-mono text-[15px] font-bold text-emerald-600 dark:text-emerald-400">{total.toLocaleString("uz-UZ")}</span>
          <span className="text-[10px] text-foreground/55"> volontyor</span>
        </div>
      </div>
    </GlowCard>
  );
};

// ── 2. BESHTA TASHABBUS — 5 yorqin progress halqa karta ──
const FiveInitiatives = () => (
  <GlowCard tilt={false} glow="167,139,250" className="flex flex-col">
    <Head icon={Sparkles} glow="167,139,250" title="Beshta tashabbus" sub="Madaniyat · Sport · IT · Kitob · Xotin-qizlar" />
    <div className="grid grid-cols-5 gap-1.5">
      {FIVE_INITIATIVES.map((it, i) => {
        const pct = Math.round((it.reach / it.target) * 100);
        const r = 22, circ = 2 * Math.PI * r;
        return (
          <motion.div key={it.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-1.5">
            <div className="relative size-14">
              <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                <circle cx="28" cy="28" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
                <motion.circle cx="28" cy="28" r={r} fill="none" stroke={it.color} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
                  transition={{ duration: 1, delay: i * 0.08 }} style={{ filter: `drop-shadow(0 0 4px ${it.color})` }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg">{it.icon}</div>
            </div>
            <div className="mt-1 font-mono text-[12px] font-bold" style={{ color: it.color }}>{pct}%</div>
            <div className="text-center text-[8.5px] leading-tight text-foreground/55">{it.label}</div>
            <div className="font-mono text-[8px] text-foreground/40">{(it.reach / 1_000_000).toFixed(1)}M</div>
          </motion.div>
        );
      })}
    </div>
  </GlowCard>
);

// ── 3. YOSHLAR PARLAMENTI — yarim doira o'rindiqlar ──
const Parliament = () => {
  const seats = Array.from({ length: PARLIAMENT.seats });
  const facColor = (i) => {
    let acc = 0;
    for (const f of PARLIAMENT.factions) { acc += f.count; if (i < acc) return f.color; }
    return "hsl(var(--muted-foreground))";
  };
  return (
    <GlowCard tilt={false} glow="59,130,246" className="flex flex-col">
      <Head icon={Landmark} glow="59,130,246" title="Yoshlar parlamenti" sub={`${PARLIAMENT.initiatives} tashabbus · ${PARLIAMENT.adopted} qabul qilindi`} />
      <div className="relative flex justify-center py-2">
        <svg viewBox="0 0 200 110" className="w-full max-w-[280px]">
          {seats.map((_, i) => {
            const rows = 3, perRow = Math.ceil(PARLIAMENT.seats / rows);
            const row = Math.floor(i / perRow), col = i % perRow;
            const radius = 32 + row * 22;
            const ang = Math.PI - (col / (perRow - 1)) * Math.PI;
            const x = 100 + Math.cos(ang) * radius, y = 98 - Math.sin(ang) * radius;
            const filled = i < PARLIAMENT.filled;
            return (
              <motion.circle key={i} cx={x} cy={y} r={4.5} fill={filled ? facColor(i) : "hsl(var(--muted))"}
                stroke={filled ? facColor(i) : "transparent"} strokeWidth={0.5}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.02, type: "spring", stiffness: 300 }} />
            );
          })}
          <text x="100" y="105" textAnchor="middle" className="fill-foreground font-mono font-bold" fontSize={11}>{PARLIAMENT.filled}/{PARLIAMENT.seats}</text>
        </svg>
      </div>
      {/* fraksiyalar */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {PARLIAMENT.factions.map((f) => (
          <span key={f.label} className="flex items-center gap-1 text-[10px] text-foreground/70">
            <span className="size-2 rounded-full" style={{ background: f.color }} /> {f.label} <b className="font-mono">{f.count}</b>
          </span>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 4. IQTIDORLI YOSHLAR — yulduzlar osmoni (porlaydi) ──
const TalentStarfield = () => {
  const [active, setActive] = useState("");
  const total = useCountUp(talentSummary.total, 1600);
  return (
    <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
      <Head icon={Star} glow="34,211,238" title="Iqtidorli yoshlar reestri" sub="Har yulduz — iqtidorli yosh" />
      <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--card-border))]"
        style={{ height: 170, background: "radial-gradient(ellipse at 50% 30%, hsl(var(--muted)/0.5), hsl(var(--muted)/0.2))" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {TALENT_STARS.map((s) => {
            const dim = active && s.domain !== active;
            return (
              <motion.circle key={s.id} cx={s.x} cy={s.y} r={s.size * (s.bright ? 1.3 : 1)} fill={s.color}
                animate={{ opacity: dim ? 0.1 : [0.3, s.bright ? 1 : 0.7, 0.3] }}
                transition={{ duration: 2 + s.delay, repeat: Infinity, ease: "easeInOut" }}
                style={{ filter: s.bright ? `drop-shadow(0 0 2px ${s.color})` : "none" }} />
            );
          })}
        </svg>
        <div className="absolute left-2 top-2 rounded-lg bg-card/80 px-2 py-1 backdrop-blur-md">
          <span className="font-mono text-[15px] font-bold text-cyan-600 dark:text-cyan-400">{total.toLocaleString("uz-UZ")}</span>
          <span className="text-[10px] text-foreground/55"> iqtidorli yosh</span>
        </div>
      </div>
      {/* domen chiplari — hoverда yoritadi */}
      <div className="mt-2 flex flex-wrap gap-1">
        {TALENT_DOMAINS.map((d) => (
          <button key={d.key} onMouseEnter={() => setActive(d.key)} onMouseLeave={() => setActive("")}
            className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] transition-colors"
            style={{ borderColor: active === d.key ? d.color : "rgb(var(--card-border))", color: active === d.key ? d.color : "hsl(var(--muted-foreground))" }}>
            {d.icon} {d.label}
          </button>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 5. TADBIRKORLIK KREDITLARI — pul oqimi (3 daraja) ──
const CreditFlow = () => {
  const total = useCountUp(Math.round(creditSummary.totalUzs / 1_000_000_000), 1600);
  return (
    <GlowCard tilt={false} glow="245,158,11" className="flex flex-col">
      <Head icon={Banknote} glow="245,158,11" title="Tadbirkorlik kreditlari" sub="O'z-band → loyiha → startap" />
      <div className="mb-3 text-center">
        <span className="font-mono text-[20px] font-bold text-amber-600 dark:text-amber-400">{total.toLocaleString("uz-UZ")}</span>
        <span className="text-[11px] text-foreground/55"> mlrd so'm ajratildi · {creditSummary.beneficiaries.toLocaleString("uz-UZ")} yosh</span>
      </div>
      <div className="space-y-2">
        {CREDIT_TIERS.map((t, i) => (
          <motion.div key={t.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
            className="relative overflow-hidden rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2.5">
            {/* pul oqimi animatsiya */}
            <div className="absolute inset-y-0 left-0 w-full overflow-hidden">
              {[0, 1, 2].map((k) => (
                <motion.span key={k} className="absolute top-1/2 size-1.5 rounded-full" style={{ background: t.color }}
                  animate={{ left: ["-5%", "105%"], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 + k * 0.8, ease: "linear" }} />
              ))}
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{t.icon}</span>
                <div className="leading-tight">
                  <div className="text-[12px] font-semibold text-foreground">{t.label}</div>
                  <div className="text-[10px] text-foreground/50">{t.count.toLocaleString("uz-UZ")} yosh foydalandi</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[12px] font-bold" style={{ color: t.color }}>
                  {t.unit === "$" ? `$${(t.max / 1000).toFixed(0)}k` : `${(t.max / 1_000_000).toLocaleString("uz-UZ")} mln`}
                </div>
                <div className="text-[9px] text-foreground/40">maksimal</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlowCard>
  );
};

// ── 6. DOLZARB 90 KUN — mavsumiy progress ──
const Dolzarb = () => {
  const reached = useCountUp(DOLZARB.reached, 1600);
  const pct = Math.round((DOLZARB.reached / DOLZARB.target) * 100);
  const dayPct = Math.round((DOLZARB.daysPassed / DOLZARB.daysTotal) * 100);
  return (
    <GlowCard tilt={false} glow="251,191,36" className="flex flex-col">
      <Head icon={Sun} glow="251,191,36" title="Dolzarb 90 kun" sub="Yozgi mavsumiy bandlik dasturi" />
      <div className="mb-2 flex items-end justify-between">
        <div><span className="font-mono text-[22px] font-bold text-foreground">{(reached / 1_000_000).toFixed(2)}M</span><span className="text-[11px] text-foreground/55"> / {(DOLZARB.target / 1_000_000)}M yosh</span></div>
        <div className="text-right"><span className="font-mono text-[15px] font-bold text-amber-600 dark:text-amber-400">{DOLZARB.daysPassed}</span><span className="text-[10px] text-foreground/50">/{DOLZARB.daysTotal} kun</span></div>
      </div>
      {/* qamrov bar */}
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2 }}
          className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#fbbf24,#f59e0b)", boxShadow: "0 0 8px #f59e0b88" }} />
      </div>
      <div className="mt-1 text-[10px] text-foreground/45">Qamrov: {pct}% · vaqt: {dayPct}%</div>
      {/* tadbirlar */}
      <div className="mt-3 grid grid-cols-2 gap-1.5">
        {DOLZARB.activities.map((a) => (
          <div key={a.label} className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] bg-muted/30 px-2 py-1 text-[10.5px]">
            <span>{a.icon}</span><span className="flex-1 truncate text-foreground/70">{a.label}</span>
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
    <Head icon={Accessibility} glow="34,211,238" title="Imkoniyati cheklangan yoshlar" sub={`${DISABLED_YOUTH.total.toLocaleString("uz-UZ")} yoshga g'amxo'rlik`} />
    <div className="grid grid-cols-2 gap-2">
      {DISABLED_YOUTH.measures.map((m, i) => {
        const pct = Math.round((m.value / DISABLED_YOUTH.total) * 100);
        return (
          <motion.div key={m.key} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/30 p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{m.icon}</span>
              <span className="text-[11px] font-medium text-foreground/80">{m.label}</span>
            </div>
            <div className="mt-1.5 flex items-end justify-between">
              <span className="font-mono text-[16px] font-bold tabular-nums text-foreground">{m.value.toLocaleString("uz-UZ")}</span>
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
