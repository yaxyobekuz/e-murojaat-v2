// Hudud (mahalla bloki) tanlanganda chiqadigan panel — yig'indi statistika +
// eng katta qarzdor bizneslar. summary blockSummary() dan keladi.
import { X, Home, Coins, Wallet, TrendingDown, Store } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { COLLECTION_TIERS, BUSINESS_TYPES } from "../mock/soliq.businesses";

const Row = ({ icon: Icon, label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between gap-3 text-[13px]">
    <span className="flex items-center gap-1.5 text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </span>
    <span className={`font-medium tabular-nums ${valueClass}`}>{value}</span>
  </div>
);

const BlockDetailPanel = ({ summary, onClose, onSelectBusiness }) => {
  if (!summary) return null;
  const tier = COLLECTION_TIERS[summary.tier];

  return (
    <div className="surface flex w-72 flex-col overflow-hidden rounded-2xl shadow-2xl">
      <div className="flex flex-col gap-3 p-4">
        {/* sarlavha */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="grid size-8 place-items-center rounded-lg"
              style={{ backgroundColor: `${tier.color}26`, color: tier.color }}
            >
              <Home className="size-4" />
            </span>
            <div>
              <h4 className="text-sm font-semibold leading-tight">{summary.blockName}</h4>
              <p className="text-[11px] text-foreground/50">{summary.count} ta biznes</p>
            </div>
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

        {/* yig'indi */}
        <div className="flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
          <Row icon={Store} label="Bizneslar" value={summary.count} />
          <Row icon={Coins} label="Hisoblangan" value={formatMoney(summary.assessed)} />
          <Row icon={Wallet} label="Yig'ilgan" value={formatMoney(summary.collected)} />
          <Row icon={TrendingDown} label="Qarz" value={formatMoney(summary.debt)} valueClass="text-rose-400" />
          <Row icon={Store} label="Qarzdorlar" value={`${summary.debtors} ta`} />

          {/* yig'im progress */}
          <div className="mt-1">
            <div className="mb-1 flex items-center justify-between text-[11px] text-foreground/45">
              <span>Yig'im darajasi</span>
              <span className="font-semibold tabular-nums" style={{ color: tier.color }}>
                {summary.rate}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${summary.rate}%`, backgroundColor: tier.color }} />
            </div>
          </div>
        </div>

        {/* eng katta qarzdorlar */}
        {summary.topDebtors.length > 0 && (
          <div className="border-t border-[rgb(var(--card-border))] pt-3">
            <h5 className="mb-1.5 text-[12px] font-semibold text-foreground/70">Eng katta qarzdorlar</h5>
            <div className="flex flex-col gap-0.5">
              {summary.topDebtors.map((b) => {
                const Icon = BUSINESS_TYPES[b.typeKey].icon;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelectBusiness?.(b.id)}
                    className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-colors hover:bg-card/60"
                  >
                    <span
                      className="grid size-6 shrink-0 place-items-center rounded-md"
                      style={{ backgroundColor: `${BUSINESS_TYPES[b.typeKey].color}26`, color: BUSINESS_TYPES[b.typeKey].color }}
                    >
                      <Icon className="size-3" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12px] font-medium">{b.name}</span>
                    <span className="shrink-0 text-[12px] font-semibold tabular-nums text-rose-400">
                      {(b.debtYear / 1_000_000).toFixed(1)} mln
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockDetailPanel;
