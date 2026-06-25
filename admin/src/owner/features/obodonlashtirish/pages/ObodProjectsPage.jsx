// Obodonlashtirish loyihalari — command-center kartalar gridi. Ma'lumot o'zgarmagan
// (obod.projects.js). Har loyiha: tur ikonkasi, holat badge, glow progress, byudjet.
import { motion } from "framer-motion";
import { Activity, Banknote, BarChart3, CheckCircle2, Coins, Droplet, Flag, Layers, Lightbulb, Route, Sprout, Trees, Wrench } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { CmdRoot, CmdHeader, hexA } from "@/shared/components/ui/command/primitives";
import { OBOD_PROJECTS, PROJECT_STATUS, obodSummary } from "../mock/obod.projects";
import { InsightCard, Reveal, SectionTitle } from "../components/insight/kit";

const ACCENT = "#10b981";
const PLACE = "Baliqchi tumani, Andijon";

const TYPE_META = {
  road: { icon: Route, color: "#f59e0b" },
  park: { icon: Trees, color: "#22c55e" },
  lighting: { icon: Lightbulb, color: "#eab308" },
  greenery: { icon: Sprout, color: "#10b981" },
  water: { icon: Droplet, color: "#06b6d4" },
};

// Bajarilishi bo'yicha kamayish tartibida
const projects = [...OBOD_PROJECTS].sort((a, b) => b.info.progress - a.info.progress);

const ProjectCard = ({ p, i }) => {
  const t = TYPE_META[p.type] || TYPE_META.road;
  const st = PROJECT_STATUS[p.status];
  return (
    <Reveal i={i}>
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="group relative h-full overflow-hidden rounded-2xl border bg-foreground/[0.03] p-4 backdrop-blur-xl"
        style={{ borderColor: hexA(t.color, 0.18) }}>
        <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
          style={{ background: `radial-gradient(circle, ${hexA(t.color, 0.5)}, transparent 70%)` }} />

        {/* sarlavha qatori */}
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: hexA(t.color, 0.14), color: t.color, boxShadow: `0 0 16px ${hexA(t.color, 0.35)}` }}>
              <t.icon className="size-[18px]" />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-foreground">{p.name}</div>
              <div className="text-[10.5px] text-foreground/45">{p.info.typeLabel}</div>
            </div>
          </div>
          <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: hexA(st.color, 0.16), color: st.color }}>{st.label}</span>
        </div>

        {/* progress */}
        <div className="relative mt-4">
          <div className="mb-1 flex items-center justify-between text-[10.5px]">
            <span className="text-foreground/50">Bajarilishi</span>
            <span className="font-mono font-bold tabular-nums" style={{ color: st.color }}>{p.info.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/5">
            <motion.div initial={{ width: 0 }} animate={{ width: `${p.info.progress}%` }} transition={{ delay: 0.2 + i * 0.04, duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${hexA(st.color, 0.5)}, ${st.color})`, boxShadow: `0 0 10px ${hexA(st.color, 0.6)}` }} />
          </div>
        </div>

        {/* byudjet / sarflangan */}
        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-2.5 py-2">
            <div className="text-[9px] uppercase tracking-wider text-foreground/35">Byudjet</div>
            <div className="mt-0.5 font-mono text-[12px] font-semibold tabular-nums text-foreground">{formatMoney(p.info.budgetUzs)}</div>
          </div>
          <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] px-2.5 py-2">
            <div className="text-[9px] uppercase tracking-wider text-foreground/35">Sarflangan</div>
            <div className="mt-0.5 font-mono text-[12px] font-semibold tabular-nums" style={{ color: hexA(st.color, 0.95) }}>{formatMoney(p.info.spentUzs)}</div>
          </div>
        </div>

        {/* daraxt soni (bor bo'lsa) */}
        {p.info.trees > 0 && (
          <div className="relative mt-2 flex items-center gap-1.5 text-[11px] text-foreground/60">
            <Sprout className="size-3.5" style={{ color: "#22c55e" }} />
            <span className="font-mono font-semibold text-foreground">{p.info.trees.toLocaleString("uz-UZ")}</span> ko'chat ekilgan
          </div>
        )}
      </motion.div>
    </Reveal>
  );
};

const ObodProjectsPage = () => (
  <CmdRoot accent={ACCENT} dark={false} system="Obodonlashtirish loyihalari reyestri (demo)" place={PLACE}>
    <CmdHeader brand="LOYIHALAR NAZORATI" place={PLACE} accent={ACCENT} nav={["Loyihalar", "Holat"]} active="Loyihalar" />

    {/* KPI insight qatori */}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <InsightCard i={0} icon={Layers} label="Jami loyihalar" value={obodSummary.count} accent={ACCENT}
        equivalents={[{ icon: CheckCircle2, text: `${obodSummary.done} yakunlangan` }, { icon: Wrench, text: `${obodSummary.ongoing} jarayonda` }]} />
      <InsightCard i={1} icon={Coins} label="Umumiy byudjet" value={obodSummary.budgetUzs} formatter={formatMoney} accent="#eab308"
        equivalents={[{ icon: Banknote, text: `${formatMoney(obodSummary.spentUzs)} sarflangan` }]} />
      <InsightCard i={2} icon={Activity} label="O'rtacha bajarilish" value={obodSummary.avgProgress} suffix="%" accent={ACCENT}
        equivalents={[{ icon: BarChart3, text: "Barcha loyihalar bo'yicha" }]} />
      <InsightCard i={3} icon={CheckCircle2} label="Yakunlangan" value={obodSummary.done} accent="#22c55e"
        equivalents={[{ icon: Flag, text: `${Math.round((obodSummary.done / obodSummary.count) * 100)}% loyihalar` }]} />
    </div>

    {/* Loyiha kartalari */}
    <SectionTitle accent={ACCENT}>Barcha loyihalar — bajarilishi bo'yicha</SectionTitle>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
    </div>
  </CmdRoot>
);

export default ObodProjectsPage;
