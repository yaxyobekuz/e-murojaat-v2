// Overlapping bubble chart (land-use %). Pure SVG — recharts has no bubble type.
import { CHART, useChartTheme } from "./chartTheme";

// Fixed layout positions (cx, cy, r are relative to a 320x240 viewBox)
const LAYOUT = [
  { cx: 118, cy: 132, color: CHART.purpleLight, big: true },
  { cx: 214, cy: 158, color: CHART.yellowLight, hatch: true },
  { cx: 196, cy: 76, color: CHART.cyan },
  { cx: 268, cy: 92, color: CHART.emerald, small: true },
];

const radiusFor = (percent) => 22 + Math.sqrt(percent) * 9;

const BubbleChart = ({ data = [], labelMap = {}, height = 240 }) => {
  const t = useChartTheme();
  const sorted = [...data].sort((a, b) => b.percent - a.percent);

  return (
    <div style={{ height }} className="w-full">
      <svg viewBox="0 0 320 240" className="h-full w-full">
        <defs>
          <pattern id="bubbleHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="7" stroke={t.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.5)"} strokeWidth="2.5" />
          </pattern>
        </defs>
        {sorted.map((d, i) => {
          const pos = LAYOUT[i] || LAYOUT[LAYOUT.length - 1];
          const r = radiusFor(d.percent);
          return (
            <g key={d.key}>
              <circle cx={pos.cx} cy={pos.cy} r={r} fill={pos.color} fillOpacity={0.92} />
              {pos.hatch && <circle cx={pos.cx} cy={pos.cy} r={r} fill="url(#bubbleHatch)" />}
              <text
                x={pos.cx}
                y={pos.cy}
                textAnchor="middle"
                dy={pos.small ? 4 : 2}
                fontSize={d.percent > 25 ? 22 : d.percent > 10 ? 15 : 11}
                fontWeight={700}
                fill={t.dark ? "#0b0b0d" : "#0f172a"}
              >
                {d.percent}%
              </text>
              {!pos.small && (
                <text
                  x={pos.cx}
                  y={pos.cy + (d.percent > 25 ? 18 : 14)}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={500}
                  fill={t.dark ? "rgba(11,11,13,0.7)" : "rgba(15,23,42,0.6)"}
                >
                  {labelMap[d.key] || d.key}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BubbleChart;
