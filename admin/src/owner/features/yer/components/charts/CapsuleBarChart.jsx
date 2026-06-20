// 3D-effect capsule bars: rounded pills, alternating solid/hatch, floating labels.
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis } from "recharts";

import { CHART, useChartTheme } from "./chartTheme";

const STRONG = 0.78; // ratio above which a bar is "highlighted"

// Custom bar shape — decides fill/hatch from its own payload (Cell can't pass extra props)
const makeCapsule = (dataKey, max, dark) =>
  function Capsule(props) {
    const { x, y, width, height, index, payload } = props;
    const ratio = (payload?.[dataKey] || 0) / max;
    const strong = ratio > STRONG;
    const hatch = strong && index % 2 !== 0;
    const fill = strong
      ? index % 2 === 0
        ? CHART.purpleLight
        : CHART.yellowLight
      : dark
        ? "rgba(255,255,255,0.07)"
        : "rgba(15,23,42,0.06)";

    const r = Math.min(width / 2, 14);
    const h = Math.max(height, r);
    return (
      <g>
        <rect x={x} y={y} width={width} height={h} rx={r} ry={r} fill={fill} />
        {hatch && (
          <rect x={x} y={y} width={width} height={h} rx={r} ry={r} fill="url(#capsuleHatch)" />
        )}
      </g>
    );
  };

const CapsuleBarChart = ({ data = [], dataKey = "arizalar", height = 240 }) => {
  const t = useChartTheme();
  const max = Math.max(...data.map((d) => d[dataKey] || 0), 1);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 28, right: 8, left: 8, bottom: 0 }} barCategoryGap="28%">
        <defs>
          <pattern id="capsuleHatch" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="6" stroke={t.dark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.2)"} strokeWidth="2" />
          </pattern>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.axis }} tickLine={false} axisLine={false} />
        <Bar dataKey={dataKey} shape={makeCapsule(dataKey, max, t.dark)}>
          <LabelList
            dataKey={dataKey}
            content={({ x, y, width, value, index }) => {
              const ratio = (data[index]?.[dataKey] || 0) / max;
              if (ratio <= STRONG) return null; // float labels only on strong bars
              return (
                <g transform={`translate(${x + width / 2}, ${y - 8})`}>
                  <rect x={-18} y={-14} width={36} height={20} rx={6} fill={t.tooltipBg} stroke={t.tooltipBorder} />
                  <text textAnchor="middle" dy={0} fontSize={11} fontWeight={600} fill={t.text}>
                    {value}
                  </text>
                </g>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CapsuleBarChart;
