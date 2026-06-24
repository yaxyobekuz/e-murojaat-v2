// Tarmoq salomatligi — mahalla transformator yuklamasi heatmap'i.
// Yashil (norma) / sariq (sub-kritik) / qizil (kritik yuklama).
import { Zap } from "lucide-react";

import { HEALTH } from "../mock/elektr.data";

const hexA = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const Cell = ({ m }) => {
  const c = HEALTH[m.status].color;
  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl border p-3 transition hover:scale-[1.02]"
      style={{ background: hexA(c, 0.12), borderColor: hexA(c, 0.35) }}
      title={`${m.name}: yuklama ${m.load}%, ${m.transformers} transformator, ${m.voltage}V`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-[12px] font-medium text-foreground/80">{m.name}</span>
        <span className="size-2 shrink-0 rounded-full" style={{ background: c }} />
      </div>
      <div className="flex items-end gap-1">
        <span className="text-xl font-semibold tabular-nums" style={{ color: c }}>{m.load}</span>
        <span className="mb-0.5 text-[11px] text-foreground/45">%</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-foreground/45">
        <Zap className="size-3" /> {m.transformers} TP · {m.voltage}V
      </div>
    </div>
  );
};

const Legend = () => (
  <div className="flex flex-wrap items-center gap-3">
    {Object.values(HEALTH).map((h) => (
      <span key={h.label} className="flex items-center gap-1.5 text-[11px] text-foreground/55">
        <span className="size-2.5 rounded-sm" style={{ background: h.color }} /> {h.label}
      </span>
    ))}
  </div>
);

const HealthHeatmap = ({ data = [] }) => (
  <div className="flex flex-col gap-3">
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((m) => (
        <Cell key={m.id} m={m} />
      ))}
    </div>
    <Legend />
  </div>
);

export default HealthHeatmap;
