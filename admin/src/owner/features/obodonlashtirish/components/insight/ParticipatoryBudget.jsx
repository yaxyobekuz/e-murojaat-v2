// Tashabbusli budjet — STATISTIKA EMAS. Tirik ovoz berish: loyihalar ovoz balandligiga
// ko'tariladi, ovoz bosilganda to'lqin/ripple + raqam sakraydi, g'oliblar podiumda glow.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Vote, Trophy, Check, HardHat } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { hexA } from "@/shared/components/ui/command/primitives";
import { PB_PROJECTS, PB_TYPE } from "../../mock/participatoryBudget.data";

const ACCENT = "#f59e0b";

// Ovoz berish kartasi — pastdan ovoz "ustuni" ko'tariladi
const VoteCard = ({ p, i, voteCount, voted, onVote, maxVotes }) => {
  const [ripple, setRipple] = useState(0);
  const t = PB_TYPE[p.type];
  const heightPct = Math.min(100, Math.round((voteCount / maxVotes) * 100));
  const isWinner = p.status === "won" || p.status === "building";
  const canVote = p.status === "voting";

  const handleVote = () => { if (!voted && canVote) { onVote(p.id); setRipple((r) => r + 1); } };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
      className="relative flex flex-col overflow-hidden rounded-xl border bg-card"
      style={{ borderColor: isWinner ? hexA("#22c55e", 0.4) : "rgb(var(--card-border))", boxShadow: isWinner ? `0 0 20px ${hexA("#22c55e", 0.18)}` : "none" }}>
      {/* ovoz ustuni (orqa fon balandligi) */}
      <motion.div className="absolute inset-x-0 bottom-0" initial={{ height: 0 }} animate={{ height: `${heightPct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        style={{ background: `linear-gradient(0deg, ${hexA(isWinner ? "#22c55e" : ACCENT, 0.18)}, transparent)` }} />

      <div className="relative flex items-start justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg" style={{ background: hexA(ACCENT, 0.14), color: ACCENT }}><t.icon className="size-4" /></span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-foreground">{p.title}</div>
            <div className="text-[10px] text-foreground/45">{p.mahalla} · {formatMoney(p.cost)}</div>
          </div>
        </div>
        {isWinner && <Trophy className="size-4 shrink-0 text-emerald-500" />}
      </div>

      {/* ovoz soni — sakraydi */}
      <div className="relative px-3 pb-1">
        <motion.div key={voteCount} initial={{ scale: 1.3, color: ACCENT }} animate={{ scale: 1 }}
          className="font-mono text-2xl font-bold tabular-nums text-foreground">
          {voteCount.toLocaleString("uz-UZ")}<span className="ml-1 text-[11px] font-normal text-foreground/40">ovoz</span>
        </motion.div>
      </div>

      {/* tugma yoki holat */}
      <div className="relative p-3 pt-1">
        {canVote ? (
          <button onClick={handleVote} disabled={voted}
            className="relative w-full overflow-hidden rounded-lg border px-3 py-2 text-[12px] font-semibold transition-colors"
            style={voted ? { borderColor: hexA("#22c55e", 0.4), background: hexA("#22c55e", 0.12), color: "#16a34a" } : { borderColor: hexA(ACCENT, 0.5), background: hexA(ACCENT, 0.12), color: ACCENT }}>
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {voted ? <><Check className="size-4" /> Ovozingiz qabul qilindi</> : <><Vote className="size-4" /> Ovoz berish</>}
            </span>
            {/* ripple to'lqin */}
            <AnimatePresence>
              {ripple > 0 && (
                <motion.span key={ripple} initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 0.7 }}
                  className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: hexA(ACCENT, 0.4) }} />
              )}
            </AnimatePresence>
          </button>
        ) : isWinner ? (
          <div className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-center text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
            <HardHat className="size-3.5" /> G'olib · {p.status === "building" ? `${p.progress}% bajarildi` : "moliyalashtirildi"}
          </div>
        ) : (
          <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-center text-[12px] text-rose-600 dark:text-rose-400">Yetarli ovoz yig'ilmadi</div>
        )}
      </div>
    </motion.div>
  );
};

export const ParticipatoryBudget = () => {
  const [votes, setVotes] = useState(() => Object.fromEntries(PB_PROJECTS.map((p) => [p.id, p.votes])));
  const [voted, setVoted] = useState({});
  const vote = (id) => { setVotes((v) => ({ ...v, [id]: v[id] + 1 })); setVoted((vd) => ({ ...vd, [id]: true })); };

  const maxVotes = Math.max(...Object.values(votes), 1);
  const sorted = [...PB_PROJECTS].sort((a, b) => {
    const order = { voting: 0, building: 1, won: 2, lost: 3 };
    return order[a.status] - order[b.status] || votes[b.id] - votes[a.id];
  });

  return (
    <div className="p-3">
      <div className="mb-2 text-[10px] text-foreground/40">«Bir fuqaro, bir ovoz» — eng ko'p ovoz olgan loyihalar moliyalashtiriladi. Ovoz bering ↓</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => (
          <VoteCard key={p.id} p={p} i={i} voteCount={votes[p.id]} voted={!!voted[p.id]} onVote={vote} maxVotes={maxVotes} />
        ))}
      </div>
    </div>
  );
};
