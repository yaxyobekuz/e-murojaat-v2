// Kuchlanish sifati — mahalla bo'yicha o'rtacha kuchlanish. 220V me'yor chizig'i;
// 200V dan past mahallalar qizil (maishiy texnika ishlamaydi).
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { E } from "./chartTheme";

const VoltageBars = ({ data = [], height = 300 }) => {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <XAxis dataKey="key" tick={{ fontSize: 10, fill: "#71717a" }} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={52} />
        <YAxis domain={[140, 240]} tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} unit="V" />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.08)" }}
          formatter={(v) => [`${v} V`, "Kuchlanish"]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <ReferenceLine y={220} stroke={E.emerald} strokeDasharray="4 4" label={{ value: "Me'yor 220V", fontSize: 10, fill: E.emerald, position: "insideTopRight" }} />
        <ReferenceLine y={200} stroke={E.red} strokeDasharray="4 4" />
        <Bar dataKey="value" radius={[3, 3, 0, 0]} barSize={26}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.low ? E.red : d.value < 215 ? E.amber : E.emerald} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VoltageBars;
