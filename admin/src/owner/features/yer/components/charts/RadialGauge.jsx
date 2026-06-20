// Radial gauge for cadaster completeness %. Purple gradient + centered counter.
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { CHART, useChartTheme } from "./chartTheme";
import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";

const RadialGauge = ({ value = 0, label = "", height = 200 }) => {
  const t = useChartTheme();
  const data = [{ name: "v", value, fill: "url(#gaugeFill)" }];

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          startAngle={220}
          endAngle={-40}
          innerRadius="72%"
          outerRadius="100%"
          barSize={12}
        >
          <defs>
            <linearGradient id="gaugeFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={CHART.purple} />
              <stop offset="100%" stopColor={CHART.cyan} />
            </linearGradient>
          </defs>
          {/* Fixes the ring scale to 0–100 so value % maps correctly */}
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: t.dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedCounter
          value={value}
          suffix="%"
          className="text-3xl font-semibold tabular-nums"
        />
        {label && <p className="mt-0.5 text-xs text-foreground/55">{label}</p>}
      </div>
    </div>
  );
};

export default RadialGauge;
