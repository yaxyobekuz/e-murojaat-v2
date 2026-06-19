// Reusable 12-month trend (area) chart for the citizen views.
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TrendChart = ({ data = [], color = "#f59e0b", height = 240, unit = "" }) => {
  if (!data.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="cTrendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          formatter={(v) => [`${v}${unit ? " " + unit : ""}`, "Sarf"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#cTrendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
