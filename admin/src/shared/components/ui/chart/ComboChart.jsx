// Reusable combo chart (bar + line) — e.g. revenue vs debt over 12 months.
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ComboChart = ({
  data = [],
  barKey = "revenue",
  barLabel = "Tushum",
  lineKey,
  lineLabel = "",
  barColor = "#1E4FD8",
  lineColor = "#ef4444",
  height = 300,
}) => {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  const fmt = (v) => (v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)} mln` : v);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v, n) => [v.toLocaleString("uz-UZ"), n]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey={barKey} name={barLabel} fill={barColor} radius={[3, 3, 0, 0]} barSize={18} />
        {lineKey && (
          <Line type="monotone" dataKey={lineKey} name={lineLabel} stroke={lineColor} strokeWidth={2} dot={false} />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ComboChart;
