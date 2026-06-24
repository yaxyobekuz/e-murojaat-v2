// Energiya balansi — kirim manbasi (markaziy tarmoq vs quyosh) donut'i +
// chiqim taqsimoti (foydali iste'mol / texnik / tijoriy yo'qotish).
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { E } from "./chartTheme";

const SRC = { grid: E.amber, solar: E.emerald };
const OUT = { useful: E.emerald, tech: E.cyan, comm: E.red };

const Bar = ({ label, value, total, color }) => {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[12px]">
        <span className="flex items-center gap-1.5 text-foreground/60">
          <span className="size-2.5 rounded-sm" style={{ background: color }} /> {label}
        </span>
        <span className="font-medium tabular-nums">{value} MVt·soat · {pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

const EnergyBalance = ({ balance }) => {
  if (!balance) return <div className="flex h-72 items-center justify-center text-sm text-zinc-400">Ma'lumot yo'q</div>;
  const srcTotal = balance.source.reduce((s, r) => s + r.value, 0);
  const outTotal = balance.output.reduce((s, r) => s + r.value, 0);
  const rows = balance.source.map((r) => ({ ...r, fill: SRC[r.key] }));

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[190px_1fr]">
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-[170px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={rows} dataKey="value" nameKey="label" innerRadius={56} outerRadius={80} paddingAngle={2}>
                {rows.map((r, i) => <Cell key={i} fill={r.fill} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [`${v} MVt·soat`, n]} contentStyle={{ borderRadius: 8, border: "1px solid #e4e4e7", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold tabular-nums">{Math.round(srcTotal)}</span>
            <span className="text-[10px] text-foreground/45">MVt·soat kirim</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {rows.map((r) => (
            <span key={r.key} className="flex items-center gap-1.5 text-[11px] text-foreground/60">
              <span className="size-2.5 rounded-sm" style={{ background: r.fill }} /> {r.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {balance.output.map((o) => (
          <Bar key={o.key} label={o.label} value={o.value} total={outTotal} color={OUT[o.key]} />
        ))}
      </div>
    </div>
  );
};

export default EnergyBalance;
