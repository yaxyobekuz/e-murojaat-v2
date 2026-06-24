// Quvur uptime / tiklash gauge'i — uptime % markazda, rang holatga qarab.
import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import { G } from "./chartTheme";

const RepairGauge = ({ uptime = 0, repairH = 0, openIncidents = 0, height = 200 }) => {
  const { theme } = useTheme();
  const dark = theme !== "light";
  const color = uptime >= 96 ? G.emerald : uptime >= 90 ? G.amber : G.red;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={[{ value: uptime, fill: color }]} startAngle={220} endAngle={-40} innerRadius="72%" outerRadius="100%" barSize={12}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: dark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)" }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter value={uptime} suffix="%" className="text-3xl font-semibold tabular-nums" />
          <p className="mt-0.5 text-xs text-foreground/55">quvur ishlash davri</p>
        </div>
      </div>
      <div className="mt-1 flex gap-4 text-[12px] text-foreground/60">
        <span>O'rt. tiklash: <b className="text-foreground">{repairH} soat</b></span>
        <span>Ochiq muammo: <b className="text-foreground">{openIncidents}</b></span>
      </div>
    </div>
  );
};

export default RepairGauge;
