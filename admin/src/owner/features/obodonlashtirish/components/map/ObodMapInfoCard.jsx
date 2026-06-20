// Loyiha bosilganda chiqadigan info panel (glass overlay).
import { X, Hammer, Coins, Wallet } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { PROJECT_STATUS } from "../../mock/obod.projects";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="flex items-center gap-1.5 text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

const ObodMapInfoCard = ({ project, onClose }) => {
  if (!project) return null;
  const { name, status, info } = project;
  const st = PROJECT_STATUS[status] || PROJECT_STATUS.planned;

  return (
    <div className="surface absolute bottom-4 right-4 z-20 w-72 animate-in fade-in slide-in-from-right-2 p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${st.color}26`, color: st.color }}
          >
            <Hammer className="size-4" />
          </span>
          <h4 className="text-sm font-semibold leading-tight">{name}</h4>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="grid size-6 shrink-0 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-foreground/50">{info.typeLabel}</p>

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        <Row icon={Coins} label="Byudjet" value={formatMoney(info.budgetUzs)} />
        <Row icon={Wallet} label="Sarflangan" value={formatMoney(info.spentUzs)} />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] text-foreground/55">Holati</span>
          <GlassStatusBadge tone={st.tone}>{st.label}</GlassStatusBadge>
        </div>
        <div className="mt-1">
          <div className="mb-1 flex items-center justify-between text-[11px] text-foreground/45">
            <span>Bajarilishi</span>
            <span className="font-semibold tabular-nums" style={{ color: st.color }}>
              {info.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${info.progress}%`, backgroundColor: st.color }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObodMapInfoCard;
