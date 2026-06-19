// Reusable donut chart for type/status share. Supports labelMap (object) or labelOf (fn).
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatMoney } from "@/shared/utils/formatMoney";

const PALETTE = ["#1E4FD8", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444", "#64748b"];

const DonutChart = ({
  data = [],
  labelMap = {},
  labelOf,
  isMoney = false,
  colors = PALETTE,
  height = 280,
}) => {
  if (!data.length || data.every((d) => !d.value)) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  const resolveLabel = (key) => (labelOf ? labelOf(key) : labelMap[key] || key);
  const rows = data.map((d) => ({ ...d, name: resolveLabel(d.key) }));
  const fmt = (v) => (isMoney ? formatMoney(v) : v.toLocaleString("uz-UZ"));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="name" innerRadius={64} outerRadius={96} paddingAngle={2}>
          {rows.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, n) => [fmt(v), n]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
