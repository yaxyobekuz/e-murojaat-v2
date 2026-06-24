// Reusable horizontal breakdown (bar) chart. Supports labelMap (object) or labelOf (fn).
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
import { formatMoney } from "@/shared/utils/formatMoney";
import { useChartColors } from "./chartColors";

const PALETTE = ["#1E4FD8", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const BreakdownBar = ({
  data = [],
  labelMap = {},
  labelOf,
  color,
  isMoney = false,
  height = 300,
}) => {
  const c = useChartColors();
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  const resolveLabel = (key) => (labelOf ? labelOf(key) : labelMap[key] || key);
  const rows = data.map((d) => ({ ...d, name: resolveLabel(d.key) }));
  const fmt = (v) => (isMoney ? formatMoney(v) : v.toLocaleString("uz-UZ"));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: c.axis }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          tickFormatter={(v) => (v >= 1e6 ? `${Math.round(v / 1e6)}M` : v)}
        />
        <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: c.axisStrong }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(v) => [fmt(v), "Qiymat"]}
          cursor={{ fill: c.cursor }}
          contentStyle={c.tooltip}
          labelStyle={c.tooltipLabel}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
          {rows.map((_, i) => (
            <Cell key={i} fill={color || PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBar;
