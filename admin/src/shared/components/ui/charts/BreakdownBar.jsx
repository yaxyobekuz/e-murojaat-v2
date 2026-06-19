// Hududlar/kategoriyalar kesimi — recharts horizontal Bar
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BreakdownBar = ({
  data,
  xKey = "name",
  dataKey = "value",
  color = "#1E4FD8",
  colorFor,
  suffix = "",
  height = 280,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#eef2f7" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}${suffix}`} />
        <YAxis type="category" dataKey={xKey} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={130} />
        <Tooltip formatter={(v) => [`${v}${suffix}`, ""]} cursor={{ fill: "#f1f5f9" }} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorFor ? colorFor(d[dataKey]) : color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBar;
