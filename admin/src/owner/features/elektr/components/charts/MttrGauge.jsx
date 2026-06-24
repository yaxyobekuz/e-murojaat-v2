// MTTR — avariyani bartaraf etish o'rtacha vaqti (daqiqa). Maqsadga nisbatan rang.
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import { E, useChartTheme } from "./chartTheme";

const MAX = 120; // daqiqa shkalasi

const MttrGauge = ({ actual = 0, target = 45, height = 210 }) => {
  const t = useChartTheme();
  const onTarget = actual <= target;
  const color = onTarget ? E.emerald : actual <= target * 1.5 ? E.amber : E.red;
  const data = [{ name: "v", value: Math.min(actual, MAX), fill: color }];

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
          <PolarAngleAxis type="number" domain={[0, MAX]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={{ fill: t.dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedCounter
          value={actual}
          suffix=" daq"
          className="text-3xl font-semibold tabular-nums"
        />
        <p className="mt-0.5 text-xs text-foreground/55">
          Maqsad: {target} daq · {onTarget ? "bajarilmoqda" : "kechikmoqda"}
        </p>
      </div>
    </div>
  );
};

export default MttrGauge;
