// Bubble-grid heatmap — qatorlar × ustunlar, har katak o'lcham+rang bilan
export function BubbleGridHeatmap({ rows, cols, cells, accent = "#7c6cf0" }) {
  const map = new Map(cells.map((c) => [`${c.row}|${c.col}`, c.value]));
  const max = Math.max(1, ...cells.map((c) => c.value));
  const sizeFor = (v) => 14 + (v / max) * 22;
  const opacityFor = (v) => 0.25 + (v / max) * 0.75;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate" style={{ borderSpacing: "6px 8px" }}>
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c} className="pb-1 text-center text-[10px] font-medium text-foreground/45">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r}>
              <td className="whitespace-nowrap pr-2 text-right text-[11px] text-foreground/55">{r}</td>
              {cols.map((c) => {
                const v = map.get(`${r}|${c}`) ?? 0;
                const s = sizeFor(v);
                return (
                  <td key={c} className="text-center">
                    <div className="mx-auto flex items-center justify-center">
                      {v > 0 ? (
                        <span
                          className="flex items-center justify-center rounded-full text-[9px] font-semibold text-white ring-1 ring-white/15"
                          style={{ width: s, height: s, background: accent, opacity: opacityFor(v) }}
                          title={`${r} · ${c}: ${v}`}
                        >
                          {v >= 10 ? v : ""}
                        </span>
                      ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-white/10" />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BubbleGridHeatmap;
