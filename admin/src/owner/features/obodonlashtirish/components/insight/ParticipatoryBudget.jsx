// Tashabbusli budjet — fuqaro ovoz beradigan loyihalar (kartalar + ovoz progress).
import { motion } from "framer-motion";
import { Vote, Users } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { hexA } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import useObjectState from "@/shared/hooks/useObjectState";
import { PB_PROJECTS, PB_TYPE, PB_STATUS } from "../../mock/participatoryBudget.data";

const ACCENT = "#f59e0b";

const ProjectCard = ({ p, i, voted, onVote }) => {
  const t = PB_TYPE[p.type];
  const st = PB_STATUS[p.status];
  const votePct = Math.min(100, Math.round((p.votes / Math.max(p.target, p.votes)) * 100));
  const canVote = p.status === "voting";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
      className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{t.icon}</span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-foreground">{p.title}</div>
            <div className="text-[10.5px] text-foreground/45">{p.mahalla} · {p.id}</div>
          </div>
        </div>
        <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
      </div>

      {/* ovoz progress */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-foreground/55"><Users className="size-3" /> {p.votes.toLocaleString("uz-UZ")} ovoz</span>
          <span className="font-mono text-foreground/70">{formatMoney(p.cost)}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/5">
          <div className="h-full rounded-full" style={{ width: `${votePct}%`, background: `linear-gradient(90deg, ${hexA(ACCENT, 0.5)}, ${ACCENT})`, boxShadow: `0 0 8px ${hexA(ACCENT, 0.5)}` }} />
        </div>
      </div>

      {/* amalga oshmoqda progress yoki ovoz tugma */}
      {p.status === "building" ? (
        <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">Qurilish: {p.progress}% bajarildi</div>
      ) : canVote ? (
        <button onClick={() => onVote(p.id)} disabled={voted}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
          style={voted ? { borderColor: hexA("#22c55e", 0.4), background: hexA("#22c55e", 0.1), color: "#16a34a" } : { borderColor: hexA(ACCENT, 0.4), background: hexA(ACCENT, 0.1), color: ACCENT }}>
          <Vote className="size-3.5" /> {voted ? "Ovoz berildi ✓" : "Ovoz berish"}
        </button>
      ) : null}
    </motion.div>
  );
};

export const ParticipatoryBudget = () => {
  const { voted, setField } = useObjectState({ voted: {} });

  const vote = (id) => setField("voted", { ...voted, [id]: true });
  const sorted = [...PB_PROJECTS].sort((a, b) => {
    const order = { voting: 0, building: 1, won: 2, lost: 3 };
    return order[a.status] - order[b.status] || b.votes - a.votes;
  });

  return (
    <div className="p-3">
      <div className="mb-2 text-[10px] text-foreground/40">«Bir fuqaro, bir ovoz» — eng ko'p ovoz olgan loyihalar moliyalashtiriladi (openbudget.uz uslubi)</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => <ProjectCard key={p.id} p={p} i={i} voted={!!voted[p.id]} onVote={vote} />)}
      </div>
    </div>
  );
};
