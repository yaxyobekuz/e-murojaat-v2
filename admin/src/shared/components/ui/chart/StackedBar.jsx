// Reusable stacked bar — e.g. within-norm vs over-norm consumption per month.
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// series: [{ key, label, color }]
const StackedBar = ({ data = [], series = [], height = 300, unit = "" }) => {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          formatter={(v, n) => [`${v}${unit ? " " + unit : ""}`, n]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            stackId="a"
            fill={s.color}
            radius={[2, 2, 0, 0]}
            barSize={18}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StackedBar;
