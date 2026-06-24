// Yosh × kategoriya issiqlik matritsasi — qaysi yoshdagilar qaysi xizmatni so'raydi.
import { M } from "./chartTheme";

const hexA = (a) => {
  const r = parseInt(M.rose.slice(1, 3), 16);
  const g = parseInt(M.rose.slice(3, 5), 16);
  const b = parseInt(M.rose.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const AgeCategoryHeatmap = ({ data }) => {
  if (!data?.matrix?.length) {
    return <div className="flex h-72 items-center justify-center text-sm text-zinc-400">Ma'lumot yo'q</div>;
  }
  const { buckets, categories, matrix } = data;
  const max = Math.max(1, ...matrix.flat());
  const cols = `64px repeat(${categories.length}, minmax(0, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        <div className="grid items-end gap-1" style={{ gridTemplateColumns: cols }}>
          <span />
          {categories.map((c) => (
            <span key={c} className="truncate px-1 pb-1 text-center text-[10px] leading-tight text-foreground/55" title={c}>
              {c}
            </span>
          ))}
        </div>
        {buckets.map((b, ri) => (
          <div key={b} className="mt-1 grid gap-1" style={{ gridTemplateColumns: cols }}>
            <span className="flex items-center text-[11px] font-medium text-foreground/60">{b}</span>
            {matrix[ri].map((v, ci) => (
              <div
                key={ci}
                className="grid h-9 place-items-center rounded-md text-[11px] font-medium tabular-nums"
                style={{
                  background: hexA(0.12 + (v / max) * 0.78),
                  color: v / max > 0.5 ? "#fff" : "rgb(var(--foreground))",
                }}
                title={`${b} yosh × ${categories[ci]}: ${v}`}
              >
                {v || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeCategoryHeatmap;
