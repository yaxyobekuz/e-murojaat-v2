// Yong'in mashinasi holati — Pajar holati, nishon (qaysi blok), real-time ETA.
import { Truck, Navigation, MapPin, Clock, Flame } from "lucide-react";

const STATE_COLOR = {
  Patrulda: "#22c55e",
  "Yo'lda": "#f59e0b",
  "O'chirilmoqda": "#ef4444",
  Qaytmoqda: "#38bdf8",
};

const fmt = (sec) => {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s} s`;
};

const FvvTruckStatus = ({ status }) => {
  const c = STATE_COLOR[status?.label] || "#94a3b8";
  return (
    <div className="surface-overlay flex items-center gap-3 rounded-xl px-3 py-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${c}26`, color: c }}>
        <Truck className="size-5" />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <Navigation className="size-3 animate-pulse" style={{ color: c }} />
          <span className="text-[11px] uppercase tracking-wide text-foreground/55">Pajar</span>
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${c}26`, color: c }}>
            {status?.label || "Patrulda"}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold">
          <MapPin className="size-3.5 text-foreground/50" />
          <span className="truncate">{status?.target || "Patrul rejimi"}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 text-[11px] text-foreground/55">
          <span className="flex items-center gap-1"><Clock className="size-3" /> ~{fmt(status?.eta)}</span>
          <span className="flex items-center gap-1 text-rose-400"><Flame className="size-3" /> {status?.activeFires ?? 0} faol</span>
        </div>
      </div>
    </div>
  );
};

export default FvvTruckStatus;
