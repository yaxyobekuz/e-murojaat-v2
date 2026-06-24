// Reusable 12-month trend (area) chart. Same props shape across all modules.
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useChartColors } from "./chartColors";

// 12 oylik dinamika (yig'ilgan soliq/sarf). data: [{ month, value }]
const TrendChart = ({
  data = [],
  color = "#1E4FD8",
  height = 260,
  isMoney = false,
  unit = "",
}) => {
  const c = useChartColors();
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  const fmt = (v) =>
    isMoney ? formatMoney(v) : `${v.toLocaleString("uz-UZ")}${unit ? " " + unit : ""}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.axis }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fontSize: 11, fill: c.axis }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={(v) => (v >= 1e6 ? `${Math.round(v / 1e6)}M` : v)}
        />
        <Tooltip
          formatter={(v) => [fmt(v), "Qiymat"]}
          contentStyle={c.tooltip}
          labelStyle={c.tooltipLabel}
        />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#trendFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
