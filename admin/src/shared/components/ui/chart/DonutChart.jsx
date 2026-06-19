import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatMoney } from "@/shared/utils/formatMoney";

// Ulush (tur/holat) — donut. data: [{ key, value }]
const PALETTE = ["#1E4FD8", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];

const DonutChart = ({
  data = [],
  height = 280,
  isMoney = false,
  labelOf = (k) => k,
  colors = PALETTE,
}) => {
  const rows = data.map((d, i) => ({ ...d, label: labelOf(d.key), color: colors[i % colors.length] }));
  const fmt = (v) => (isMoney ? formatMoney(v) : v.toLocaleString("uz-UZ"));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={rows} dataKey="value" nameKey="label" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v, n) => [fmt(v), n]} />
        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;
