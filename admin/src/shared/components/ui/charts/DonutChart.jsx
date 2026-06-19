// Ulush (taqsimot) — recharts Pie/Donut
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PALETTE = ["#1E4FD8", "#2f6bdd", "#5b8def", "#93b4f5", "#c2d4fb", "#64748b", "#94a3b8"];

const DonutChart = ({ data, centerLabel = "", centerValue, unit = "ta", height = 240 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={64}
            outerRadius={92}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={d.color || PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v} ${unit}`, n]} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue !== undefined && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ height }}>
          <span className="text-2xl font-semibold text-gray-900">{centerValue}</span>
          {centerLabel && <span className="text-xs text-zinc-400">{centerLabel}</span>}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color || PALETTE[i % PALETTE.length] }} />
            <span className="text-zinc-600">{d.name}</span>
            <span className="font-semibold text-gray-900 tabular-nums">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
