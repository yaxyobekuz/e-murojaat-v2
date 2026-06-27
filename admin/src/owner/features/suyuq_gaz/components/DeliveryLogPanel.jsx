// Mashinalar va ularning to'xtashlari — kelgan/ketgan vaqt + almashtirilgan ballon soni.
// Mashinani bosib xaritada kuzatish mumkin.
import { Truck, Clock, PackageCheck, ChevronRight } from "lucide-react";

import { TRUCKS, TRUCK_STATUS } from "../mock/suyuqGaz.fleet";

const StopRow = ({ stop }) => (
  <div className="flex items-start gap-2 py-1.5">
    <span className={`mt-1 inline-block size-2 shrink-0 rounded-full ${stop.done ? "bg-emerald-500" : "bg-cyan-400 ring-2 ring-cyan-200"}`} />
    <div className="min-w-0 flex-1">
      <div className="truncate text-xs font-medium text-foreground/90">{stop.street}</div>
      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-foreground/50">
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          {stop.arrived ? stop.arrived : "—"}
          {stop.left ? ` → ${stop.left}` : stop.arrived ? " → hozir" : ""}
        </span>
        {stop.done && (
          <span className="flex items-center gap-1 font-medium text-emerald-600 tabular-nums">
            <PackageCheck className="size-3" /> {stop.swapped} ballon
          </span>
        )}
        {!stop.done && stop.arrived && <span className="text-amber-600">almashtirilmoqda</span>}
        {!stop.arrived && <span className="text-foreground/40">kutilmoqda</span>}
      </div>
    </div>
  </div>
);

const DeliveryLogPanel = ({ selectedTruckId, onSelectTruck }) => (
  <div className="flex flex-col gap-2">
    {TRUCKS.map((t) => {
      const active = selectedTruckId === t.id;
      const swapped = t.stops.reduce((s, x) => s + x.swapped, 0);
      const st = TRUCK_STATUS[t.status];
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelectTruck(active ? "" : t.id)}
          className={`rounded-xl border p-3 text-left transition-colors ${
            active ? "border-cyan-400 bg-cyan-50/60" : "border-[rgb(var(--card-border))] bg-card hover:border-cyan-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg text-white" style={{ background: t.color }}>
              <Truck className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground/90">{t.plate}</div>
              <div className="truncate text-[11px] text-foreground/50">{t.driver}</div>
            </div>
            <ChevronRight className={`size-4 shrink-0 text-foreground/30 transition-transform ${active ? "rotate-90" : ""}`} />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 font-medium" style={{ color: st.color }}>
              <span className="inline-block size-2 rounded-full" style={{ background: st.color }} /> {st.label}
            </span>
            <span className="tabular-nums text-foreground/60">Jami: <b>{swapped}</b> ballon</span>
          </div>

          {active && (
            <div className="mt-2 divide-y divide-[rgb(var(--card-border))] border-t border-[rgb(var(--card-border))] pt-1">
              {t.stops.map((s) => (
                <StopRow key={s.id} stop={s} />
              ))}
            </div>
          )}
        </button>
      );
    })}
  </div>
);

export default DeliveryLogPanel;
