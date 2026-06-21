// Bubble-grid heatmap — qatorlar × ustunlar. Har katak o'lcham + QIYMATGA mos rang.
// Rang qiymat bo'yicha sovuq->issiq shkala (to'liq opacity) — dark modeda ham aniq ko'rinadi.
const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

export function BubbleGridHeatmap({ rows, cols, cells, accent = "#7c6cf0" }) {
  const map = new Map(cells.map((c) => [`${c.row}|${c.col}`, c.value]));
  const max = Math.max(1, ...cells.map((c) => c.value));
  const hot = hexToRgb(accent);
  const cold = [71, 85, 105]; // slate-600 — dark/light ikkalasida ham ko'rinadi
  const sizeFor = (v) => 14 + (v / max) * 22;
  const colorFor = (v) => {
    const t = Math.min(1, Math.max(0, v / max));
    const r = Math.round(cold[0] + (hot[0] - cold[0]) * t);
    const g = Math.round(cold[1] + (hot[1] - cold[1]) * t);
    const b = Math.round(cold[2] + (hot[2] - cold[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
                          className="flex items-center justify-center rounded-full text-[9px] font-semibold text-white ring-1 ring-white/20"
                          style={{ width: s, height: s, background: colorFor(v) }}
                          title={`${r} · ${c}: ${v}`}
                        >
                          {v >= 10 ? v : ""}
                        </span>
                      ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-foreground/15" />
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
