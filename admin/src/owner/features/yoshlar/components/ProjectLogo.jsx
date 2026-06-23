// Loyiha logosi — rasmiy domen favikoni. Yuklanmasa lucide ikonkasiga qaytadi.
import { useState } from "react";

import { projectLogo } from "../mock/youth.projects";

const ProjectLogo = ({ project, size = 44, iconSize = 20 }) => {
  const [failed, setFailed] = useState(false);
  const Icon = project.icon;
  const showLogo = project.logo && !failed;

  return (
    <span
      className="grid place-items-center overflow-hidden rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `rgba(${project.glow},0.14)`,
        color: `rgb(${project.glow})`,
        boxShadow: `0 0 18px rgba(${project.glow},0.35)`,
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
        <Icon style={{ width: iconSize, height: iconSize }} strokeWidth={2} />
      )}
    </span>
  );
};

export default ProjectLogo;
