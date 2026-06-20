// Ranked viloyat list (region + count + share bar) — pairs with RegionDotMap.
const RegionRankList = ({ data = [], max = 1 }) => (
  <ul className="flex flex-col gap-2.5">
    {data.map((d) => (
      <li key={d.key} className="flex items-center gap-3 text-[13px]">
        <span className="w-28 shrink-0 truncate text-foreground/70">{d.key}</span>
        <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-card">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-brand-purple"
            style={{ width: `${Math.max((d.value / max) * 100, 4)}%` }}
          />
        </span>
        <span className="w-10 shrink-0 text-right font-semibold tabular-nums">{d.value}</span>
      </li>
    ))}
  </ul>
);

export default RegionRankList;
