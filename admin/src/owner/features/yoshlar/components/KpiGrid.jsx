// 10 ta asosiy KPI — glassmorphism kartalar, live hisoblagich, accent glow + pulse.
import {
  Users, BookMarked, UserX, GraduationCap, Rocket,
  Code2, Languages, PlaneTakeoff, Star, ShieldAlert,
} from "lucide-react";

import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import GlowCard from "./ui/GlowCard";
import LiveCounter from "./ui/LiveCounter";

// label (UI o'zbekcha), key (totals'dan), icon, accent glow rgb, delta (mock o'zgarish)
const KPIS = [
  { key: "youth", label: "Jami yoshlar", icon: Users, glow: "6,182,212", delta: 2.4, tone: "text-cyan-600 dark:text-cyan-300" },
  { key: "notebook", label: "Yoshlar daftari", icon: BookMarked, glow: "168,139,250", delta: -100, tone: "text-violet-600 dark:text-violet-300" },
  { key: "unemployed", label: "Ishsiz yoshlar", icon: UserX, glow: "239,68,68", delta: -3.2, tone: "text-rose-600 dark:text-rose-300" },
  { key: "students", label: "Talabalar", icon: GraduationCap, glow: "34,197,94", delta: 4.8, tone: "text-emerald-600 dark:text-emerald-300" },
  { key: "entrepreneurs", label: "Tadbirkorlar", icon: Rocket, glow: "52,211,153", delta: 6.5, tone: "text-emerald-600 dark:text-emerald-300" },
  { key: "itLearners", label: "IT o'rganuvchilar", icon: Code2, glow: "34,211,238", delta: 9.3, tone: "text-cyan-600 dark:text-cyan-300" },
  { key: "langLearners", label: "Til o'rganuvchilar", icon: Languages, glow: "96,165,250", delta: 5.1, tone: "text-blue-600 dark:text-blue-300" },
  { key: "migration", label: "Migratsiya", icon: PlaneTakeoff, glow: "245,158,11", delta: -1.7, tone: "text-amber-600 dark:text-amber-300" },
  { key: "talented", label: "Iqtidorli yoshlar", icon: Star, glow: "250,204,21", delta: 7.2, tone: "text-yellow-600 dark:text-yellow-300" },
  { key: "riskGroup", label: "Risk guruhi", icon: ShieldAlert, glow: "248,113,113", delta: -2.9, tone: "text-rose-600 dark:text-rose-300" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } },
};

const KpiGrid = ({ totals }) => (
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
  >
    {KPIS.map((k) => {
      const Icon = k.icon;
      const up = k.delta >= 0;
      return (
        <motion.div key={k.key} variants={item}>
          <GlowCard glow={k.glow} className="h-full">
            <div className="flex items-center justify-between">
              <span
                className="grid size-9 place-items-center rounded-xl"
                style={{ background: `rgba(${k.glow},0.14)`, color: `rgb(${k.glow})` }}
              >
                <Icon className="size-[18px]" strokeWidth={2} />
              </span>
              <span className="relative flex size-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ background: `rgb(${k.glow})` }}
                />
                <span className="relative inline-flex size-2 rounded-full" style={{ background: `rgb(${k.glow})` }} />
              </span>
            </div>
            <div className="mt-3">
              <LiveCounter
                value={totals[k.key]}
                className={cn("text-[22px] font-bold tabular-nums tracking-tight", k.tone)}
              />
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="truncate text-[12px] text-foreground/55">{k.label}</span>
              </div>
              <div className={cn("mt-1 inline-flex items-center gap-0.5 text-[11px] font-medium", up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                {up ? "▲" : "▼"} {Math.abs(k.delta)}%
                <span className="ml-1 text-foreground/30">oylik</span>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      );
    })}
  </motion.div>
);

export default KpiGrid;
