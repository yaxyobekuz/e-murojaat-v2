// Joriy missiya banneri — Pajar qaysi honadonga, nima maqsadda ketyapti,
// qancha vaqtda yetib boradi (ETA), necha kishi (rasch), necha litr suv.
import { Truck, MapPin, Navigation, Hash, Clock, Users, Droplets } from "lucide-react";

import { MISSION_KIND, getHousehold } from "../../mock/fvv.cityMap";

const fmtEta = (sec) => {
  if (sec == null) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s} s`;
};

const Stat = ({ icon: Icon, value, color }) => (
  <span className="flex items-center gap-1 text-[11px] font-semibold tabular-nums" style={{ color }}>
    <Icon className="size-3" /> {value}
  </span>
);

const FvvMissionBanner = ({ mission, eta }) => {
  if (!mission) return null;
  const kind = MISSION_KIND[mission.kind] || MISSION_KIND.check;
  const house = getHousehold(mission.householdId);

  return (
    <div className="surface-overlay flex items-center gap-3 rounded-xl px-3 py-2">
      <span
        className="grid size-9 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${kind.color}26`, color: kind.color }}
      >
        <Truck className="size-5" />
      </span>
      <div className="min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <Navigation className="size-3 animate-pulse text-rose-400" />
          <span className="text-[11px] uppercase tracking-wide text-foreground/55">Pajar harakatda</span>
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${kind.color}26`, color: kind.color }}
          >
            {kind.label}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold">
          <MapPin className="size-3.5 text-foreground/50" />
          <span className="truncate">{house?.address || "—"}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <Stat icon={Clock} value={`~${fmtEta(eta)}`} color="#fbbf24" />
          <Stat icon={Users} value={`${mission.crew} kishi`} color="#38bdf8" />
          <Stat icon={Droplets} value={`${mission.water.toLocaleString("uz-UZ")} L`} color="#34d399" />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-foreground/55">
          <span className="flex items-center gap-1">
            <Hash className="size-3" /> {mission.code}
          </span>
          <span className="truncate">{mission.reason}</span>
        </div>
      </div>
    </div>
  );
};

export default FvvMissionBanner;
