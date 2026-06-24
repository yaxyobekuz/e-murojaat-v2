// Eko-faol fuqaro — STATISTIKA EMAS. Har oila = o'sayotgan daraxt (ball = bo'y).
// "Yashil oila" tojli + glow. Mukofotlar suzadi. Animatsiyali metafora (framer-motion).
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";
import { ECO_FAMILIES, ECO_ACTIONS, ECO_REWARDS, ecoSummary } from "../../mock/ecoCitizen.data";

const ACCENT = "#22c55e";
const maxPoints = Math.max(...ECO_FAMILIES.map((f) => f.points), 1);

// Bitta oila-daraxti — balldan o'sadi, shamol bilan tebranadi
const FamilyTree = ({ f, i, x, ground }) => {
  const scale = 0.5 + (f.points / maxPoints) * 1.0;
  const trunkH = 34 * scale;
  const cr = 20 * scale;
  const color = f.greenFamily ? "#16a34a" : ["#22c55e", "#4ade80", "#84cc16"][i % 3];
  return (
    <motion.g
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ delay: 0.1 + i * 0.07, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${x}px ${ground}px`, transformBox: "fill-box" }}
    >
      {/* poya */}
      <rect x={x - 2.5 * scale} y={ground - trunkH} width={5 * scale} height={trunkH} rx={2} fill="#6b4f2a" />
      {/* shox — shamol */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 3.5 + (i % 4) * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        style={{ transformOrigin: `${x}px ${ground - trunkH}px` }}
      >
        <circle cx={x} cy={ground - trunkH - cr * 0.5} r={cr} fill={color} opacity={0.92}
          style={{ filter: f.greenFamily ? `drop-shadow(0 0 8px ${hexA(color, 0.7)})` : "none" }} />
        <circle cx={x - cr * 0.55} cy={ground - trunkH + cr * 0.1} r={cr * 0.7} fill={color} opacity={0.85} />
        <circle cx={x + cr * 0.55} cy={ground - trunkH + cr * 0.1} r={cr * 0.7} fill={color} opacity={0.85} />
        {/* Yashil oila — toj */}
        {f.greenFamily && (
          <motion.text x={x} y={ground - trunkH - cr * 1.3} textAnchor="middle" fontSize={16}
            animate={{ y: [ground - trunkH - cr * 1.3, ground - trunkH - cr * 1.5, ground - trunkH - cr * 1.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>👑</motion.text>
        )}
      </motion.g>
      {/* ism + ball */}
      <text x={x} y={ground + 13} textAnchor="middle" className="fill-foreground font-medium" style={{ fontSize: 8.5 }}>{f.name}</text>
      <text x={x} y={ground + 23} textAnchor="middle" className="font-mono" style={{ fontSize: 8, fill: color }}>{f.points.toLocaleString("uz-UZ")}</text>
    </motion.g>
  );
};

export const EcoCitizen = () => {
  const totalPts = useCountUp(ecoSummary.totalPoints, 1500);
  // ball bo'yicha tartiblab, o'rmonga joylash
  const trees = [...ECO_FAMILIES].sort((a, b) => b.points - a.points);
  const W = 920, H = 300, ground = H - 50;
  const step = (W - 80) / (trees.length - 1 || 1);

  return (
    <div className="p-3">
      {/* O'rmon sahnasi */}
      <div className="relative overflow-hidden rounded-xl border border-[rgb(var(--card-border))]"
        style={{ background: "linear-gradient(180deg, hsl(var(--muted)/0.3) 0%, hsl(var(--muted)/0.5) 100%)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" className="h-[300px] w-full">
          {/* yer */}
          <line x1={0} y1={ground} x2={W} y2={ground} stroke={hexA(ACCENT, 0.4)} strokeWidth={1.5} />
          <rect x={0} y={ground} width={W} height={H - ground} fill={hexA(ACCENT, 0.08)} />
          {/* daraxtlar */}
          {trees.map((f, i) => <FamilyTree key={f.id} f={f} i={i} x={40 + i * step} ground={ground} />)}
        </svg>
        {/* jonli hisoblagich */}
        <div className="absolute left-3 top-3 rounded-xl border border-[rgb(var(--card-border))] bg-card/80 px-3 py-2 backdrop-blur-md">
          <div className="font-mono text-xl font-bold tabular-nums" style={{ color: ACCENT }}>{totalPts.toLocaleString("uz-UZ")}</div>
          <div className="text-[10px] uppercase tracking-wider text-foreground/55">jami eko-ball</div>
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-[rgb(var(--card-border))] bg-card/80 px-2.5 py-1 backdrop-blur-md">
          <Crown className="size-3.5 text-amber-500" />
          <span className="text-[11px] font-medium text-foreground/75">{ecoSummary.greenFamilies} ta «Yashil oila»</span>
        </div>
        <div className="absolute bottom-2 right-3 text-[9px] text-foreground/40">Ball ↑ = daraxt baland · 👑 = Yashil oila</div>
      </div>

      {/* ball turlari + mukofotlar */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/45">Ball qanday yig'iladi</div>
          <div className="flex flex-wrap gap-1.5">
            {ECO_ACTIONS.map((a) => (
              <span key={a.key} className="flex items-center gap-1 rounded-full border border-[rgb(var(--card-border))] bg-muted/40 px-2 py-1 text-[11px] text-foreground/75">
                {a.icon} {a.label} <b className="font-mono" style={{ color: ACCENT }}>+{a.points}</b>
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/45">Mukofotlar</div>
          <div className="flex flex-wrap gap-2">
            {ECO_REWARDS.map((r, i) => (
              <motion.span key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5"
                style={{ borderColor: hexA(r.color, 0.4), background: hexA(r.color, 0.08) }}>
                <span className="text-base">{r.icon}</span>
                <span className="leading-tight"><span className="block text-[11px] font-bold text-foreground">{r.title}</span><span className="block text-[9px] text-foreground/50">{r.sub}</span></span>
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
