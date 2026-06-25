// Obodonlashtirish "Command Center" — premium insight kit (dark glassmorphism + framer-motion).
// Ma'lumotni o'zgartirmaydi — mavjud raqamlarni hikoyaga (insight) aylantiradi.
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles, Trophy } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";

// ── Kirish animatsiyasi (sahifa elementlari ketma-ket suzib chiqadi) ──
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export const Reveal = ({ i = 0, className = "", children }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="show" custom={i} className={className}>
    {children}
  </motion.div>
);

// ── Count-up raqam (formatter bilan) ──
export const Count = ({ value, formatter, decimals = 0, className = "", suffix = "", prefix = "" }) => {
  const v = useCountUp(Math.round((Number(value) || 0) * 10 ** decimals), 1100) / 10 ** decimals;
  const text = formatter ? formatter(v) : v.toLocaleString("uz-UZ", { maximumFractionDigits: decimals });
  return <span className={className}>{prefix}{text}{suffix}</span>;
};

// ── Insight karta: katta raqam + "bu nimani anglatadi" ekvivalentlari ──
export const InsightCard = ({ icon: Icon, label, value, formatter, suffix, accent, decimals = 0, equivalents = [], trend, i = 0 }) => (
  <Reveal i={i}>
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative h-full overflow-hidden rounded-2xl border bg-foreground/[0.03] p-4 backdrop-blur-xl"
      style={{ borderColor: hexA(accent, 0.18), boxShadow: `0 0 0 1px ${hexA(accent, 0.04)}, inset 0 1px 0 ${hexA("#ffffff", 0.05)}` }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${hexA(accent, 0.5)}, transparent 70%)` }} />

      <div className="relative flex items-start justify-between">
        <span className="grid size-9 place-items-center rounded-xl" style={{ background: hexA(accent, 0.14), color: accent, boxShadow: `0 0 16px ${hexA(accent, 0.35)}` }}>
          {Icon && <Icon className="size-[18px]" />}
        </span>
        {trend && <TrendBadge dir={trend.dir} text={trend.text} accent={accent} />}
      </div>

      <div className="relative mt-3">
        <div className="font-mono text-[26px] font-bold leading-none tabular-nums text-foreground" style={{ textShadow: `0 0 18px ${hexA(accent, 0.45)}` }}>
          <Count value={value} formatter={formatter} suffix={suffix} decimals={decimals} />
        </div>
        <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/45">{label}</div>
      </div>

      {equivalents.length > 0 && (
        <div className="relative mt-3 space-y-1 border-t pt-2.5" style={{ borderColor: hexA(accent, 0.1) }}>
          <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/30">Ya'ni</div>
          {equivalents.map((e, k) => (
            <div key={k} className="flex items-center gap-1.5 text-[11.5px] text-foreground/70">
              {typeof e.icon === "function"
                ? <e.icon className="size-3.5 shrink-0" style={{ color: accent }} />
                : <span className="text-sm leading-none">{e.icon}</span>}
              <span>{e.text}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  </Reveal>
);

// ── Trend ko'rsatkichi (↑ yaxshilanmoqda / ↓ pasaymoqda / → barqaror) ──
const TREND = {
  up: { Icon: TrendingUp, color: "#22c55e", label: "Yaxshilanmoqda" },
  down: { Icon: TrendingDown, color: "#ef4444", label: "Pasaymoqda" },
  flat: { Icon: Minus, color: "#94a3b8", label: "Barqaror" },
};
export const TrendBadge = ({ dir = "flat", text }) => {
  const t = TREND[dir] || TREND.flat;
  return (
    <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: hexA(t.color, 0.14), color: t.color }}>
      <t.Icon className="size-3" /> {text}
    </span>
  );
};

// ── Trend hikoyasi (matn bilan) ──
export const TrendNarrative = ({ items, accent }) => (
  <div className="space-y-px">
    {items.map((it, i) => {
      const t = TREND[it.dir] || TREND.flat;
      return (
        <motion.div key={i} variants={fadeUp} initial="hidden" animate="show" custom={i}
          className="flex items-start gap-2.5 px-3 py-2" style={{ borderBottom: i < items.length - 1 ? "1px solid rgb(var(--card-border))" : "none" }}>
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg" style={{ background: hexA(t.color, 0.15), color: t.color }}>
            <t.Icon className="size-3.5" />
          </span>
          <div className="min-w-0 leading-snug">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-foreground/85">{it.title}</span>
              {it.value != null && <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: t.color }}>{it.value}</span>}
            </div>
            <div className="text-[10.5px] text-foreground/45">{it.note}</div>
          </div>
        </motion.div>
      );
    })}
  </div>
);

// ── Animatsiyali progress ring (joriy/target + prognoz sana) ──
export const ProgressRing = ({ value, target, label, accent, forecast, unit = "", size = 132 }) => {
  const pct = target ? Math.min(100, Math.round((value / target) * 100)) : value;
  const animated = useCountUp(pct, 1200);
  const r = size / 2 - 11;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - animated / 100);
  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="9" />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off}
            style={{ filter: `drop-shadow(0 0 7px ${hexA(accent, 0.8)})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 14px ${hexA(accent, 0.6)}` }}>{animated}%</span>
          {target != null && <span className="font-mono text-[9px] tabular-nums text-foreground/40">{value.toLocaleString("uz-UZ")} / {target.toLocaleString("uz-UZ")}{unit}</span>}
        </div>
      </div>
      <div className="text-center leading-tight">
        <div className="text-[11px] font-medium text-foreground/75">{label}</div>
        {forecast && <div className="mt-0.5 text-[9.5px]" style={{ color: hexA(accent, 0.9) }}>Prognoz: {forecast}</div>}
      </div>
    </div>
  );
};

// ── AI insight paneli (avtomatik xulosalar) ──
export const AIInsightPanel = ({ insights, accent }) => (
  <div className="space-y-2 p-3">
    {insights.map((ins, i) => (
      <motion.div key={i} variants={fadeUp} initial="hidden" animate="show" custom={i}
        className="flex items-start gap-2.5 rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-2.5">
        <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg" style={{ background: hexA(ins.tone || accent, 0.15), color: ins.tone || accent }}>
          <Sparkles className="size-3.5" />
        </span>
        <p className="text-[11.5px] leading-snug text-foreground/75">{ins.text}</p>
      </motion.div>
    ))}
  </div>
);

// ── Yutuq nishonlari (badges) ──
export const BadgeStrip = ({ badges }) => (
  <div className="flex flex-wrap gap-2 p-3">
    {badges.map((b, i) => (
      <motion.div key={i} variants={fadeUp} initial="hidden" animate="show" custom={i}
        whileHover={{ scale: 1.04 }}
        className="flex items-center gap-2 rounded-xl border px-3 py-2"
        style={{ borderColor: hexA(b.color, 0.4), background: hexA(b.color, 0.08), boxShadow: `0 0 18px ${hexA(b.color, 0.2)}` }}>
        {typeof b.icon === "function"
          ? <b.icon className="size-5 shrink-0" style={{ color: b.color }} />
          : <span className="text-lg leading-none">{b.icon}</span>}
        <div className="leading-tight">
          <div className="text-[11px] font-bold text-foreground">{b.title}</div>
          <div className="text-[9.5px] text-foreground/55">{b.sub}</div>
        </div>
      </motion.div>
    ))}
  </div>
);

// ── Champion leaderboard (reyting, podium glow bilan) ──
const MEDAL = ["#fbbf24", "#cbd5e1", "#d97706"];
export const Leaderboard = ({ items, accent, unit = "" }) => (
  <div className="space-y-1 p-2">
    {items.map((it, i) => {
      const color = i < 3 ? MEDAL[i] : accent;
      return (
        <motion.div key={it.label} variants={fadeUp} initial="hidden" animate="show" custom={i}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-foreground/[0.03]"
          style={i < 3 ? { background: hexA(color, 0.06) } : undefined}>
          <span className="grid size-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold"
            style={{ background: hexA(color, i < 3 ? 0.18 : 0.08), color }}>
            {i < 3 ? <Trophy className="size-3" /> : i + 1}
          </span>
          <span className="flex-1 truncate text-[12px] text-foreground/80">{it.label}</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-foreground/5">
            <motion.div initial={{ width: 0 }} animate={{ width: `${it.pct}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.8 }}
              className="h-full rounded-full" style={{ background: color, boxShadow: `0 0 8px ${hexA(color, 0.6)}` }} />
          </div>
          <span className="w-12 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums" style={{ color }}>{it.value}{unit}</span>
        </motion.div>
      );
    })}
  </div>
);

// ── Efficiency / health meter (gorizontal, segmentli) ──
export const ScoreMeter = ({ score, label, accent, max = 100, hint }) => {
  const animated = useCountUp(score, 1100);
  const pct = (score / max) * 100;
  return (
    <div className="p-3">
      <div className="flex items-end justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-foreground/50">{label}</span>
        <span className="font-mono text-xl font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 12px ${hexA(accent, 0.5)}` }}>
          {animated}<span className="text-[11px] text-foreground/30">/{max}</span>
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-foreground/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${hexA(accent, 0.5)}, ${accent})`, boxShadow: `0 0 10px ${hexA(accent, 0.6)}` }} />
      </div>
      {hint && <div className="mt-1.5 text-[10px] text-foreground/40">{hint}</div>}
    </div>
  );
};

// ── Executive hero: tuman salomatlik indeksi (katta gauge + komponentlar) ──
export const ExecScore = ({ score, parts, accent }) => {
  const animated = useCountUp(score, 1400);
  const size = 200, r = size / 2 - 16, circ = 2 * Math.PI * r, off = circ * (1 - animated / 100);
  const grade = score >= 85 ? "A'lo" : score >= 70 ? "Yaxshi" : score >= 55 ? "Qoniqarli" : "E'tibor talab";
  return (
    <div className="grid grid-cols-1 items-center gap-6 p-5 lg:grid-cols-[auto_1fr]">
      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--foreground) / 0.1)" strokeWidth="13" />
          <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth="13" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} style={{ filter: `drop-shadow(0 0 12px ${hexA(accent, 0.85)})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[52px] font-bold leading-none tabular-nums text-foreground" style={{ textShadow: `0 0 26px ${hexA(accent, 0.7)}` }}>{animated}</span>
          <span className="font-mono text-[11px] tracking-wider text-foreground/40">/ 100</span>
          <span className="mt-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: hexA(accent, 0.16), color: accent }}>{grade}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">Tarkibiy ko'rsatkichlar</div>
        {parts.map((p, i) => (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between text-[11.5px]">
              <span className="text-foreground/70">{p.label}</span>
              <span className="font-mono font-bold tabular-nums" style={{ color: p.accent }}>{p.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
              <motion.div initial={{ width: 0 }} animate={{ width: `${p.value}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.9 }}
                className="h-full rounded-full" style={{ background: p.accent, boxShadow: `0 0 8px ${hexA(p.accent, 0.6)}` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Modul tugma-kartasi (hubdan modulga o'tish) ──
export const ModuleTile = ({ icon: Icon, title, score, accent, sub, onClick, i = 0 }) => (
  <Reveal i={i}>
    <motion.button onClick={onClick} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative w-full overflow-hidden rounded-2xl border bg-foreground/[0.03] p-4 text-left backdrop-blur-xl"
      style={{ borderColor: hexA(accent, 0.2) }}>
      <div className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-80"
        style={{ background: `radial-gradient(circle, ${hexA(accent, 0.6)}, transparent 70%)` }} />
      <div className="relative flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-xl" style={{ background: hexA(accent, 0.14), color: accent, boxShadow: `0 0 16px ${hexA(accent, 0.4)}` }}>
          {Icon && <Icon className="size-[18px]" />}
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 14px ${hexA(accent, 0.55)}` }}>{score}</span>
      </div>
      <div className="relative mt-3 text-[13px] font-semibold text-foreground">{title}</div>
      <div className="text-[10.5px] text-foreground/45">{sub}</div>
    </motion.button>
  </Reveal>
);

// ── Sahifa sarlavhasi (executive) ──
export const SectionTitle = ({ children, accent }) => (
  <div className="flex items-center gap-2 px-1">
    <span className="h-3.5 w-1 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/55">{children}</span>
  </div>
);

// ── Yirik bo'lim banneri (modullar orasida ajratuvchi) ──
export const SectionBanner = ({ id, icon: Icon, title, sub, accent }) => (
  <div id={id} className="flex items-center gap-3 scroll-mt-20 rounded-xl border px-4 py-2.5"
    style={{ borderColor: hexA(accent, 0.25), background: `linear-gradient(90deg, ${hexA(accent, 0.1)}, transparent)` }}>
    <span className="grid size-9 place-items-center rounded-xl" style={{ background: hexA(accent, 0.16), color: accent, boxShadow: `0 0 16px ${hexA(accent, 0.4)}` }}>
      {Icon && <Icon className="size-[18px]" />}
    </span>
    <div className="leading-tight">
      <div className="text-[14px] font-bold tracking-wide text-foreground">{title}</div>
      {sub && <div className="text-[10.5px] text-foreground/45">{sub}</div>}
    </div>
  </div>
);

// ── Yopishqoq bo'lim navigatsiyasi (chiplar) ──
export const AnchorNav = ({ items, accent }) => (
  <div className="sticky top-2 z-20 -mx-1 flex flex-wrap gap-2 rounded-xl border border-foreground/[0.08] bg-popover/90 px-2 py-2 backdrop-blur-xl">
    {items.map((it) => (
      <a key={it.id} href={`#${it.id}`}
        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:text-foreground"
        style={{ borderColor: hexA(it.color || accent, 0.3) }}>
        {it.icon && <it.icon className="size-3.5" style={{ color: it.color || accent }} />}
        {it.label}
      </a>
    ))}
  </div>
);
