// Honadon kartada bosilganda — u haqida ma'lumotlar (aholi soni, xavf, gaz...).
import { X, Home, Users, Baby, Accessibility, Flame, ShieldAlert, Phone, CalendarCheck, Building2 } from "lucide-react";

import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { RISK_TONE } from "../../mock/fvv.cityMap";

const Row = ({ icon: Icon, label, value, valueClass = "" }) => (
  <div className="flex items-center justify-between gap-3 text-[12.5px]">
    <span className="flex items-center gap-1.5 text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </span>
    <span className={`font-medium tabular-nums ${valueClass}`}>{value}</span>
  </div>
);

const FvvHouseholdCard = ({ household, onClose }) => {
  if (!household) return null;
  const h = household;
  const risk = RISK_TONE[h.risk] || RISK_TONE.Past;

  return (
    <div className="surface absolute bottom-4 right-4 z-30 w-72 animate-in fade-in slide-in-from-right-2 p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="grid size-8 place-items-center rounded-lg"
            style={{ backgroundColor: `${risk.color}26`, color: risk.color }}
          >
            <Home className="size-4" />
          </span>
          <div className="leading-tight">
            <h4 className="text-sm font-semibold">{h.head}</h4>
            <p className="text-[11px] text-foreground/50">{h.address}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="grid size-6 shrink-0 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        <Row icon={Building2} label="Bino turi" value={h.buildingType} />
        <Row icon={Home} label="Xonadonlar" value={h.apartments} />
        <Row icon={Users} label="Aholi" value={h.residents} valueClass="text-cyan-300" />
        <Row icon={Baby} label="Bolalar" value={h.children} />
        <Row icon={Accessibility} label="Keksalar" value={h.elderly} />
        <Row
          icon={Flame}
          label="Gaz tarmog'i"
          value={h.gas ? "Bor" : "Yo'q"}
          valueClass={h.gas ? "text-amber-300" : "text-foreground/60"}
        />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[12.5px] text-foreground/55">
            <ShieldAlert className="size-3.5" /> Xavf darajasi
          </span>
          <GlassStatusBadge tone={risk.tone}>{h.risk}</GlassStatusBadge>
        </div>
        <Row icon={Phone} label="Aloqa" value={h.phone} />
        <Row icon={CalendarCheck} label="Oxirgi tekshiruv" value={h.lastInspection} />
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
