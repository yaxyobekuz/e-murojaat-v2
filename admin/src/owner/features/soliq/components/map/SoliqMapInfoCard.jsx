// Dashboard-styled info panel shown when a mahalla block is clicked (glass overlay).
import { X, Home, Coins, Wallet, TrendingDown } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { TAX_STATUS } from "../../mock/soliq.mapAreas";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="flex items-center gap-1.5 text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

const SoliqMapInfoCard = ({ area, onClose }) => {
  if (!area) return null;
  const { name, status, info } = area;
  const st = TAX_STATUS[status] || TAX_STATUS.paid;

  return (
    <div className="surface absolute right-4 top-4 z-10 w-72 animate-in fade-in slide-in-from-right-2 p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${st.color}26`, color: st.color }}
          >
            <Home className="size-4" />
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

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        <Row icon={Home} label="Xonadonlar" value={info.households.toLocaleString("uz-UZ")} />
        <Row icon={Coins} label="Hisoblangan" value={formatMoney(info.assessedUzs)} />
        <Row icon={Wallet} label="Yig'ilgan" value={formatMoney(info.collectedUzs)} />
        <Row icon={TrendingDown} label="Qarz" value={formatMoney(info.debtUzs)} />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] text-foreground/55">Holati</span>
          <GlassStatusBadge tone={st.tone}>{st.label}</GlassStatusBadge>
        </div>
        <div className="mt-1">
          <div className="mb-1 flex items-center justify-between text-[11px] text-foreground/45">
            <span>Yig'ilish darajasi</span>
            <span className="font-semibold tabular-nums" style={{ color: st.color }}>
              {info.collectionRate}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{ width: `${info.collectionRate}%`, backgroundColor: st.color }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoliqMapInfoCard;
