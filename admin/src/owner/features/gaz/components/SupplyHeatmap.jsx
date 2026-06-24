// Ko'cha ta'minot holati gridi — yashil/sariq/qizil/qora.
import { STATUS, SUPPLY } from "../mock/gaz.data";

const hexA = (hex, a) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const Cell = ({ s }) => {
  const c = STATUS[s.status].color;
  const metric = s.coveragePct != null ? `${s.coveragePct}% ta'minot` : `${s.gasifiedPct ?? 0}% gaz`;
  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl border p-3 transition hover:scale-[1.02]"
      style={{ background: hexA(c, 0.14), borderColor: hexA(c, 0.4) }}
      title={`${s.name}: ${STATUS[s.status].label}, ${SUPPLY[s.supplyType].label}`}
    >
      <div className="flex items-center justify-between">
        <span className="truncate text-[12px] font-medium text-foreground/80">{s.name}</span>
        <span className="size-2.5 shrink-0 rounded-full" style={{ background: c }} />
      </div>
      <span className="text-[15px] font-semibold tabular-nums" style={{ color: c }}>{metric}</span>
      <span className="text-[10px] text-foreground/45">
        {SUPPLY[s.supplyType].label}{s.deliveryCycleDays ? ` · ${s.deliveryCycleDays} kun` : ""}
      </span>
    </div>
  );
};

const SupplyHeatmap = ({ data = [] }) => (
  <div className="flex flex-col gap-3">
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {data.map((s) => <Cell key={s.id} s={s} />)}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {Object.values(STATUS).map((h) => (
        <span key={h.label} className="flex items-center gap-1.5 text-[11px] text-foreground/55">
          <span className="size-2.5 rounded-sm" style={{ background: h.color }} /> {h.label}
        </span>
      ))}
    </div>
  </div>
);

export default SupplyHeatmap;
