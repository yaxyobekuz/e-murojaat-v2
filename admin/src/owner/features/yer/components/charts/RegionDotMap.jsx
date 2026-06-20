// Dotted region map + ranked list. Dots tinted purple by intensity (abstract grid).
import { useMemo } from "react";

import { useChartTheme } from "./chartTheme";
import RegionRankList from "./RegionRankList";

const COLS = 22;
const ROWS = 11;

// Rough silhouette mask (1 = land) — abstract, evokes a country footprint
const inShape = (c, r) => {
  const nx = c / COLS;
  const ny = r / ROWS;
  if (ny < 0.18 && (nx < 0.25 || nx > 0.82)) return false;
  if (ny > 0.85 && nx > 0.7) return false;
  if (nx < 0.06 || nx > 0.97) return false;
  return Math.sin(nx * 6) + 1.4 > ny * 0.6;
};

const RegionDotMap = ({ data = [], height = 240 }) => {
  const t = useChartTheme();
  const max = Math.max(...data.map((d) => d.value), 1);
  const top = data.slice(0, 6);

  // Deterministic per-dot intensity driven by column→region mapping
  const dots = useMemo(() => {
    const out = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!inShape(c, r)) continue;
        const region = data[(c + r) % Math.max(data.length, 1)];
        const intensity = region ? region.value / max : 0.2;
        out.push({ c, r, intensity });
      }
    }
    return out;
  }, [data, max]);

  return (
    <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]" style={{ minHeight: height }}>
      <svg viewBox={`0 0 ${COLS * 14} ${ROWS * 14}`} className="h-full w-full">
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.c * 14 + 7}
            cy={d.r * 14 + 7}
            r={3.4}
            fill="#b794f6"
            fillOpacity={t.dark ? 0.25 + d.intensity * 0.7 : 0.2 + d.intensity * 0.65}
          />
        ))}
      </svg>

      <div className="flex flex-col justify-center">
        <RegionRankList data={top} max={max} />
      </div>
    </div>
  );
};

export default RegionDotMap;
