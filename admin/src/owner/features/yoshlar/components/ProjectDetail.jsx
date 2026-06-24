// Loyiha batafsil paneli (o'ngdan chiqadi) — tavsif, qamrov statistikasi, teglar, holat.
import { motion } from "framer-motion";
import { X, Users, GraduationCap, MapPin, CalendarDays } from "lucide-react";

import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import ProjectLogo from "./ProjectLogo";
import { PROJECT_CATEGORIES, PROJECT_STATUS } from "../mock/youth.projects";

const compact = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} mln`;
  if (n >= 1_000) return n.toLocaleString("uz-UZ");
  return String(n);
};

const Stat = ({ icon: Icon, value, label, color }) => (
  <div className="rounded-xl border border-foreground/10 bg-muted/40 p-3">
    <Icon className="size-4" style={{ color }} />
    <div className="mt-1.5 text-[17px] font-bold tabular-nums text-foreground">{value}</div>
    <div className="text-[11px] text-foreground/45">{label}</div>
  </div>
);

const ProjectDetail = ({ project, onClose }) => {
  if (!project) return null;
  const cat = PROJECT_CATEGORIES[project.category];
  const st = PROJECT_STATUS[project.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="w-[360px] overflow-hidden rounded-2xl border border-foreground/10 bg-card/85 backdrop-blur-2xl shadow-2xl"
    >
      <div
        className="relative p-4"
        style={{ background: `linear-gradient(135deg, rgba(${project.glow},0.16), transparent 70%)` }}
      >
        <button onClick={onClose} aria-label="Yopish" className="absolute right-3 top-3 grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground">
          <X className="size-4" />
        </button>
        <ProjectLogo project={project} size={56} iconSize={28} />
        <h3 className="mt-3 text-lg font-bold text-foreground">{project.name}</h3>
        <p className="mt-0.5 text-[13px] text-foreground/55">{project.tagline}</p>
        <div className="mt-2 flex items-center gap-2">
          <GlassStatusBadge tone={st.tone}>{st.label}</GlassStatusBadge>
          <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: `rgba(${project.glow},0.14)`, color: cat.color }}>
            {cat.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-2">
        <p className="text-[13px] leading-relaxed text-foreground/70">{project.description}</p>

        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Users} value={compact(project.participants)} label="ishtirokchi" color={`rgb(${project.glow})`} />
          <Stat icon={GraduationCap} value={project.mentors ? compact(project.mentors) : "—"} label="mentor" color={`rgb(${project.glow})`} />
          <Stat icon={MapPin} value={project.centers ? project.centers : "—"} label="markaz" color={`rgb(${project.glow})`} />
        </div>

        {/* progress */}
        <div className="rounded-xl border border-foreground/10 bg-muted/40 p-3">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-foreground/55">
            <span>Yillik qamrov rejasi</span>
            <span className="font-bold tabular-nums" style={{ color: cat.color }}>{project.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
            <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.9 }} style={{ background: `rgb(${project.glow})` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span key={t} className="rounded-md border border-foreground/10 bg-foreground/[0.04] px-2 py-0.5 text-[11px] text-foreground/60">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-foreground/40">
          <CalendarDays className="size-3.5" /> {project.yearStarted}-yildan beri faol
        </div>

        <button
          type="button"
          className="mt-1 w-full rounded-xl px-3 py-2.5 text-[13px] font-semibold text-foreground transition-opacity hover:opacity-90"
          style={{ background: `rgb(${project.glow})` }}
        >
          Loyihaga ariza topshirish
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
