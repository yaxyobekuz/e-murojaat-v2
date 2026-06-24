// Loyiha kartasi — 3D glass, accent glow. Ikon + nom + tagline + qamrov + progress.
// Bosilsa onOpen (batafsil modal).
import { motion } from "framer-motion";
import { Users, GraduationCap, MapPin, ArrowRight } from "lucide-react";

import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import GlowCard from "./ui/GlowCard";
import ProjectLogo from "./ProjectLogo";
import { PROJECT_CATEGORIES, PROJECT_STATUS } from "../mock/youth.projects";

const compact = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} mln`;
  if (n >= 1_000) return `${Math.round(n / 1000)} ming`;
  return String(n);
};

const Mini = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-1.5">
    <Icon className="size-3.5 text-foreground/35" />
    <span className="text-[12px] font-semibold tabular-nums text-foreground/85">{value}</span>
    <span className="text-[10px] text-foreground/40">{label}</span>
  </div>
);

const ProjectCard = ({ project, active, onOpen }) => {
  const cat = PROJECT_CATEGORIES[project.category];
  const st = PROJECT_STATUS[project.status];

  return (
    <GlowCard glow={project.glow} className="flex h-full flex-col" active={active}>
      <div className="flex items-start justify-between gap-2">
        <ProjectLogo project={project} size={44} iconSize={20} />
        <GlassStatusBadge tone={st.tone}>{st.label}</GlassStatusBadge>
      </div>

      <div className="mt-3">
        <h3 className="text-[15px] font-semibold text-foreground">{project.name}</h3>
        <p className="mt-0.5 text-[12px] text-foreground/50">{project.tagline}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        <Mini icon={Users} value={compact(project.participants)} label="ishtirokchi" />
        {project.mentors > 0 && <Mini icon={GraduationCap} value={compact(project.mentors)} label="mentor" />}
        {project.centers > 0 && <Mini icon={MapPin} value={project.centers} label="markaz" />}
      </div>

      {/* progress */}
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] text-foreground/45">
          <span>Qamrov rejasi</span>
          <span className="font-semibold tabular-nums" style={{ color: cat.color }}>{project.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{ background: `rgb(${project.glow})` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(project)}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-foreground/10 bg-muted/40 px-3 py-2 text-[12px] font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.07]"
      >
        Batafsil <ArrowRight className="size-3.5" />
      </button>
    </GlowCard>
  );
};

export default ProjectCard;
