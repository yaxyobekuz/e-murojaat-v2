// Dashboard-styled info panel shown when a 3D marker is clicked (glass overlay).
import { X, Building2, Ruler, Coins } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";

const STATUS = {
  royxatda: { tone: "done", label: "Ro'yxatda" },
  jarayonda: { tone: "progress", label: "Jarayonda" },
  nizoli: { tone: "danger", label: "Nizoli" },
};

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="flex items-center gap-1.5 text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

const MapInfoCard = ({ marker, onClose }) => {
  if (!marker) return null;
  const { title, info } = marker;
  const status = STATUS[info.status] || STATUS.royxatda;

  return (
    <div className="surface absolute right-4 top-4 z-10 w-72 animate-in fade-in slide-in-from-right-2 p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-purple/15 text-brand-purple">
            <Building2 className="size-4" />
          </span>
          <h4 className="text-sm font-semibold leading-tight">{title}</h4>
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

      <p className="mt-2 font-mono text-xs text-foreground/50">{info.cadastreNumber}</p>

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        <Row icon={Building2} label="Turi" value={info.type} />
        <Row icon={Ruler} label="Maydon" value={`${info.areaM2.toLocaleString("uz-UZ")} m²`} />
        <Row icon={Coins} label="Qiymati" value={formatMoney(info.valueUzs)} />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] text-foreground/55">Holati</span>
          <GlassStatusBadge tone={status.tone}>{status.label}</GlassStatusBadge>
        </div>
      </div>
    </div>
  );
};

export default MapInfoCard;
