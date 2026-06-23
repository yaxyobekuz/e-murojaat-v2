// Pastki chap suzuvchi legenda — hududlar yig'im darajasi (rang xaritasi).
import { COLLECTION_TIERS } from "../mock/soliq.businesses";

const ORDER = ["high", "mid", "low", "veryLow"];

const BusinessLegend = () => (
  <div className="surface-overlay w-52 rounded-xl p-3">
    <h4 className="mb-2 text-[12px] font-semibold text-foreground/70">Hududlar yig'im darajasi</h4>
    <div className="flex flex-col gap-1.5">
      {ORDER.map((key) => {
        const t = COLLECTION_TIERS[key];
        return (
          <div key={key} className="flex items-center gap-2 text-[12px] text-foreground/70">
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: t.color }} />
            {t.label}
          </div>
        );
      })}
    </div>
  </div>
);

export default BusinessLegend;
