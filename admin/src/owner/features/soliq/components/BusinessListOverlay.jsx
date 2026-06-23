// "Ro'yxat" rejimida xarita ustida chiqadigan ixcham bizneslar ro'yxati.
// Qatorni bossang xarita o'sha biznesga uchadi (activeId).
import { cn } from "@/shared/utils/cn";
import { BUSINESS_TYPES, COLLECTION_TIERS } from "../mock/soliq.businesses";

const shortMln = (n) => `${(n / 1_000_000).toFixed(1)} mln`;

const BusinessListOverlay = ({ businesses = [], activeId, onSelect }) => (
  <div className="surface-overlay flex h-full max-h-full w-80 flex-col rounded-xl p-2">
    <div className="flex shrink-0 items-center justify-between px-2 py-1.5">
      <h4 className="text-[13px] font-semibold">Bizneslar</h4>
      <span className="text-[11px] text-foreground/45">{businesses.length} ta</span>
    </div>
    <div className="soliq-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-1.5">
      {businesses.length === 0 && (
        <p className="px-2 py-4 text-center text-xs text-foreground/40">Biznes topilmadi</p>
      )}
      {businesses.map((b) => {
        const type = BUSINESS_TYPES[b.typeKey];
        const Icon = type.icon;
        const active = activeId === b.id;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(active ? null : b.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
              active ? "bg-card" : "hover:bg-card/60",
            )}
          >
            <span
              className="grid size-7 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: `${type.color}26`, color: type.color }}
            >
              <Icon className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium">{b.name}</span>
              <span className="block truncate text-[11px] text-foreground/45">{b.typeLabel}</span>
            </span>
            <span className="shrink-0 text-right">
              {b.isDebtor ? (
                <span className="block text-[12px] font-semibold tabular-nums text-rose-400">
                  {shortMln(b.debtYear)}
                </span>
              ) : (
                <span className="block text-[12px] tabular-nums text-foreground/30">—</span>
              )}
              <span
                className="block text-[11px] font-semibold tabular-nums"
                style={{ color: COLLECTION_TIERS[b.tier].color }}
              >
                {b.rate}%
              </span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default BusinessListOverlay;
