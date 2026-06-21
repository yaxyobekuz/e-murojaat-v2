// Bino markeri bosilganda — turga mos ma'lumot (shifoxona/maktab/bozor/uy...).
import {
  X, ShieldAlert, Phone, CalendarCheck, Users,
  Building2, Home, GraduationCap, Baby, ShoppingBag, Store, Trophy, Factory, Bus, Fuel, Landmark, HeartPulse,
} from "lucide-react";

import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { OBJECT_TYPES } from "../../mock/fvv.mapAreas";

const TYPE_ICON = {
  shifoxona: HeartPulse,
  maktab: GraduationCap,
  bogcha: Baby,
  apartment: Building2,
  house: Home,
  savdo: ShoppingBag,
  bozor: Store,
  stadion: Trophy,
  zavod: Factory,
  avtostansiya: Bus,
  benzin: Fuel,
  masjid: Landmark,
};
const RISK_TONE = { Yuqori: { color: "#ef4444", tone: "danger" }, "O'rta": { color: "#f59e0b", tone: "progress" }, Past: { color: "#22c55e", tone: "done" } };

const FvvHouseholdCard = ({ household, onClose }) => {
  if (!household) return null;
  const h = household;
  const tm = OBJECT_TYPES[h.type] || OBJECT_TYPES.apartment;
  const Icon = TYPE_ICON[h.type] || Building2;
  const risk = RISK_TONE[h.risk] || RISK_TONE.Past;

  return (
    <div className="surface absolute bottom-4 right-4 z-30 w-72 animate-in fade-in slide-in-from-right-2 p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg" style={{ backgroundColor: `${tm.color}26`, color: tm.color }}>
            <Icon className="size-4" />
          </span>
          <div className="leading-tight">
            <h4 className="text-sm font-semibold">{h.head}</h4>
            <p className="text-[11px] text-foreground/50">{tm.label} · {h.address}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Yopish"
          className="grid size-6 shrink-0 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        {h.stats.map(([label, value], i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="text-foreground/55">{label}</span>
            <span className="font-medium tabular-nums">{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-[12.5px]">
          <span className="flex items-center gap-1.5 text-foreground/55"><Users className="size-3.5" /> Xavf ostida</span>
          <span className="font-semibold tabular-nums text-cyan-300">{h.people} kishi</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12.5px] text-foreground/55"><ShieldAlert className="size-3.5" /> Xavf darajasi</span>
          <GlassStatusBadge tone={risk.tone}>{h.risk}</GlassStatusBadge>
        </div>
        <div className="flex items-center justify-between gap-3 text-[12.5px]">
          <span className="flex items-center gap-1.5 text-foreground/55"><Phone className="size-3.5" /> Aloqa</span>
          <span className="font-medium tabular-nums">{h.phone}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-[12.5px]">
          <span className="flex items-center gap-1.5 text-foreground/55"><CalendarCheck className="size-3.5" /> Oxirgi tekshiruv</span>
          <span className="font-medium tabular-nums">{h.lastInspection}</span>
        </div>
      </div>

      {h.note && (
        <div className="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2 text-[11.5px] text-amber-200/90">
          <span className="font-semibold">Eslatma:</span> {h.note}
        </div>
      )}
    </div>
  );
};

export default FvvHouseholdCard;
