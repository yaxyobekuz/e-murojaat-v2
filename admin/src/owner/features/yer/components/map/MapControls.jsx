// Floating control deck: layer toggles, basemap switch + camera actions.
import { Building2, Mountain, RotateCw, Crosshair } from "lucide-react";

const TOGGLES = [
  { key: "buildings", label: "3D binolar", icon: Building2 },
  { key: "terrain", label: "Relyef", icon: Mountain },
];

const Pill = ({ active, onClick, icon: Icon, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
      active ? "bg-brand-purple text-white" : "text-foreground/60 hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="size-3.5" /> {children}
  </button>
);

const MapControls = ({ layers, onToggle, onOrbit, onReset }) => (
  <div className="surface absolute left-4 top-4 z-10 flex items-center gap-1 p-2.5">
    {TOGGLES.map((t) => (
      <Pill key={t.key} active={layers[t.key]} onClick={() => onToggle(t.key)} icon={t.icon}>
        {t.label}
      </Pill>
    ))}
    <span className="mx-1 h-5 w-px bg-[rgb(var(--card-border))]" />
    <button
      type="button"
      onClick={onReset}
      aria-label="Boshlang'ich ko'rinish"
      className="grid size-7 place-items-center rounded-md text-foreground/55 hover:bg-muted hover:text-foreground"
    >
      <Crosshair className="size-3.5" />
    </button>
    <button
      type="button"
      onClick={onOrbit}
      aria-label="Aylanish"
      className="grid size-7 place-items-center rounded-md text-foreground/55 hover:bg-muted hover:text-foreground"
    >
      <RotateCw className="size-3.5" />
    </button>
  </div>
);

export default MapControls;
