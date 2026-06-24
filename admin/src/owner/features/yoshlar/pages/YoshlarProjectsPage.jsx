// Yoshlar agentligi loyihalari — command center uslubi (dark, glass, cyan accent).
// Tepada qamrov statistikasi, kategoriya filtri (chip), loyihalar gridi (3D karta).
// Kartani bossa o'ngdan batafsil panel chiqadi.
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, Users, MapPin, Megaphone } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { cn } from "@/shared/utils/cn";
import LiveCounter from "../components/ui/LiveCounter";
import ProjectCard from "../components/ProjectCard";
import ProjectDetail from "../components/ProjectDetail";
import { PROJECTS, PROJECT_CATEGORIES, projectTotals } from "../mock/youth.projects";

const HeadStat = ({ icon: Icon, value, label, glow }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-muted/40 px-4 py-3 backdrop-blur-xl">
    <span className="grid size-10 place-items-center rounded-xl" style={{ background: `rgba(${glow},0.14)`, color: `rgb(${glow})` }}>
      <Icon className="size-5" />
    </span>
    <div>
      <LiveCounter value={value} live={false} className="text-xl font-bold tabular-nums text-foreground" />
      <div className="text-[12px] text-foreground/45">{label}</div>
    </div>
  </div>
);

const YoshlarProjectsPage = () => {
  const { category, activeId, setField } = useObjectState({ category: null, activeId: null });

  const totals = useMemo(() => projectTotals(), []);
  const list = useMemo(
    () => (category ? PROJECTS.filter((p) => p.category === category) : PROJECTS),
    [category],
  );
  const active = useMemo(() => PROJECTS.find((p) => p.id === activeId) || null, [activeId]);

  return (
    <div className="relative min-h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-cyan-400/15 bg-background p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(6,182,212,0.08),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(6,182,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.18)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="pointer-events-none absolute -right-24 top-10 size-72 rounded-full bg-cyan-500/12 blur-[120px]" />

      <div className="relative flex flex-col gap-4">
        {/* sarlavha */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
              <h1 className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-cyan-300 dark:to-blue-400">
                Yoshlar loyihalari
              </h1>
            </div>
            <p className="mt-0.5 text-[12px] text-foreground/45">Yoshlar ishlari agentligi · davlat dasturlari va tashabbuslari</p>
          </div>
        </div>

        {/* qamrov statistikasi */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <HeadStat icon={Layers} value={totals.count} label="Faol loyiha" glow="6,182,212" />
          <HeadStat icon={Users} value={totals.participants} label="Jami ishtirokchi" glow="52,211,153" />
          <HeadStat icon={MapPin} value={totals.centers} label="O'quv markazlari" glow="168,139,250" />
          <HeadStat icon={Megaphone} value={totals.recruiting} label="Qabul ochiq" glow="245,158,11" />
        </div>

        {/* kategoriya filtri */}
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!category} onClick={() => setField("category", null)}>Barchasi</Chip>
          {Object.values(PROJECT_CATEGORIES).map((c) => (
            <Chip key={c.key} active={category === c.key} color={c.color} onClick={() => setField("category", category === c.key ? null : c.key)}>
              {c.label}
            </Chip>
          ))}
        </div>

        {/* grid + detail */}
        <div className="flex gap-4">
          <motion.div
            layout
            className={cn(
              "grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2",
              active ? "xl:grid-cols-2" : "xl:grid-cols-3",
            )}
          >
            <AnimatePresence mode="popLayout">
              {list.map((p) => (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                  <ProjectCard project={p} active={p.id === activeId} onOpen={(pr) => setField("activeId", pr.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {active && (
              <div className="sticky top-4 hidden h-fit shrink-0 lg:block">
                <ProjectDetail project={active} onClose={() => setField("activeId", null)} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Chip = ({ active, color, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
      active ? "border-transparent text-background" : "border-foreground/15 text-foreground/65 hover:text-foreground",
    )}
    style={active ? { background: color || "#22d3ee" } : undefined}
  >
    {children}
  </button>
);

export default YoshlarProjectsPage;
