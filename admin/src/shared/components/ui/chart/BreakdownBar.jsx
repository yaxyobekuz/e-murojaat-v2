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

// Kesim (viloyat/tur/soha) — gorizontal bar. data: [{ key, value }]
const BreakdownBar = ({
  data = [],
  color = "#1E4FD8",
  height = 280,
  isMoney = false,
  labelOf = (k) => k,
}) => {
  const rows = data.map((d) => ({ ...d, label: labelOf(d.key) }));
  const fmt = (v) => (isMoney ? formatMoney(v) : v.toLocaleString("uz-UZ"));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} tickFormatter={(v) => (v >= 1e6 ? `${Math.round(v / 1e6)}M` : v)} />
        <YAxis type="category" dataKey="label" width={110} tick={{ fontSize: 11, fill: "#3f3f46" }} tickLine={false} axisLine={false} />
        <Tooltip formatter={(v) => [fmt(v), ""]} cursor={{ fill: "#f4f4f5" }} />
        <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={18}>
          {rows.map((_, i) => (
            <Cell key={i} fill={color} fillOpacity={1 - i * 0.06} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBar;
