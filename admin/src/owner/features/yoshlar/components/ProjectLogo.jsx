// Loyiha logosi — rasmiy domen favikoni, toza oq/och tagchada (brend o'z rangida).
// Glass kartaga ozoda 'badge' bo'lib tushadi: accent halqa + yumshoq glow.
// Yuklanmasa lucide ikonkasiga qaytadi.
import { useState } from "react";

import { projectLogo } from "../mock/youth.projects";

const ProjectLogo = ({ project, size = 44, iconSize = 20 }) => {
  const [failed, setFailed] = useState(false);
  const Icon = project.icon;
  const showLogo = project.logo && !failed;

  return (
    <span
      className="grid place-items-center overflow-hidden rounded-2xl bg-zinc-100 ring-1 dark:bg-white/95"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 18px rgba(${project.glow},0.35)`,
        "--tw-ring-color": `rgba(${project.glow},0.45)`,
      }}
    >
      {showLogo ? (
        <img
          src={projectLogo(project.logo)}
          alt={project.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-2/3 object-contain"
        />
      ) : (
        <Icon style={{ width: iconSize, height: iconSize, color: `rgb(${project.glow})` }} strokeWidth={2} />
      )}
    </span>
  );
};

export default ProjectLogo;
