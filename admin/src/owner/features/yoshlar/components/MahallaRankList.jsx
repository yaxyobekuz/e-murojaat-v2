// Mahallalar reytingi — score bo'yicha. Qatorga bossa xarita o'sha mahallaga uchadi.
import { cn } from "@/shared/utils/cn";
import { SCORE_TIERS, tierOfScore } from "../mock/youth.data";

const MahallaRankList = ({ mahallas = [], activeId, onSelect }) => {
  const sorted = [...mahallas].sort((a, b) => b.score - a.score);
  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#0b0f17]/70 backdrop-blur-xl">
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-3 py-2.5">
        <h4 className="text-[13px] font-semibold text-white">Mahallalar reytingi</h4>
        <span className="text-[11px] text-white/40">{mahallas.length} ta</span>
      </div>
      <div className="soliq-scroll flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-1.5">
        {sorted.map((m, i) => {
          const tier = SCORE_TIERS[tierOfScore(m.score)];
          const active = activeId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(active ? null : m.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors",
                active ? "bg-white/10" : "hover:bg-white/[0.06]",
              )}
            >
              <span className="w-4 shrink-0 text-center text-[11px] font-medium text-white/35">{i + 1}</span>
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white"
                style={{ background: `radial-gradient(circle at 35% 30%, rgba(${tier.glow},0.85), rgba(${tier.glow},0.45))`, boxShadow: `0 0 12px rgba(${tier.glow},0.5)` }}
              >
                {m.score}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-white">{m.shortName}</span>
                <span className="block text-[10px]" style={{ color: tier.color }}>{tier.label}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block text-[11px] tabular-nums text-white/55">{m.youth.toLocaleString("uz-UZ")}</span>
                <span className="block text-[10px] text-rose-300/80">{m.unemployed} ishsiz</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MahallaRankList;
