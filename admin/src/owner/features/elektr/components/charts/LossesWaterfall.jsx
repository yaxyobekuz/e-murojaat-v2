// Yo'qotishlar tahlili — Waterfall. Stansiyadan chiqqan 100% energiyaning
// qayerda yo'qolishi va aholi to'lagan ulushi (texnik + tijoriy yo'qotish).
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { E } from "./chartTheme";

const buildRows = (steps) => {
  let cum = 0;
  return steps.map((s) => {
    if (s.type === "start") {
      cum = s.value;
      return { name: s.name, base: 0, bar: s.value, fill: E.slate, tag: `${s.value}%` };
    }
    if (s.type === "end") {
      return { name: s.name, base: 0, bar: s.value, fill: E.emerald, tag: `${s.value}%` };
    }
    const after = cum + s.delta; // delta manfiy
    const row = { name: s.name, base: after, bar: -s.delta, fill: E.red, tag: `${s.delta}%` };
    cum = after;
    return row;
  });
};

const LossesWaterfall = ({ data = [], height = 300 }) => {
  if (!data.length) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-zinc-400">
        Ma'lumot yo'q
      </div>
    );
  }
  const rows = buildRows(data);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#71717a" }}
          tickLine={false}
          axisLine={false}
          interval={0}
          height={48}
          angle={-12}
          textAnchor="end"
        />
        <YAxis tick={{ fontSize: 11, fill: "#71717a" }} tickLine={false} axisLine={false} domain={[0, 100]} unit="%" />
        <Tooltip
          cursor={{ fill: "rgba(148,163,184,0.08)" }}
          formatter={(v, n, p) => [p.payload.tag, p.payload.name]}
          contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }}
        />
        <Bar dataKey="base" stackId="w" fill="transparent" />
        <Bar dataKey="bar" stackId="w" radius={[3, 3, 0, 0]} barSize={42}>
          {rows.map((r, i) => (
            <Cell key={i} fill={r.fill} />
          ))}
          <LabelList dataKey="tag" position="top" style={{ fontSize: 11, fill: "#52525b", fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LossesWaterfall;
