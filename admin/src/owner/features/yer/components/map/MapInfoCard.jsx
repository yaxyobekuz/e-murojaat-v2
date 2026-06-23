// Dashboard-styled info panel shown when a parcel / building / marker is picked.
// Entrance: spring pop on the card + staggered rows (see .cad-* in index.css).
import { X, Building2, Ruler, Coins, User, MapPin, Layers, Navigation } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";

const STATUS = {
  royxatda: { tone: "done", label: "Ro'yxatda" },
  jarayonda: { tone: "progress", label: "Jarayonda" },
  nizoli: { tone: "danger", label: "Nizoli" },
};

const MapInfoCard = ({ marker, onClose }) => {
  if (!marker) return null;
  const { title, info } = marker;
  const status = STATUS[info.status];
  const coords = info.lat != null ? `${info.lat.toFixed(5)}, ${info.lng.toFixed(5)}` : null;

  const rows = [
    { icon: Building2, label: "Turi", value: info.typeLabel || info.type },
    { icon: User, label: "Egasi", value: info.owner },
    { icon: Layers, label: "Mulkchilik", value: info.ownershipLabel },
    { icon: Ruler, label: "Maydon", value: info.areaM2 != null ? `${info.areaM2.toLocaleString("uz-UZ")} m²` : null },
    { icon: Layers, label: "Qavatlar", value: info.floors != null ? `${info.floors} qavat` : null },
    { icon: Building2, label: "Balandlik", value: info.height != null ? `${info.height} m` : null },
    { icon: Coins, label: "Qiymati", value: info.valueUzs != null ? formatMoney(info.valueUzs) : null },
    { icon: MapPin, label: "Manzil", value: info.address },
    { icon: Navigation, label: "Koordinata", value: coords },
  ].filter((r) => r.value != null && r.value !== "");

  return (
    <div className="cad-card surface absolute right-4 top-4 z-10 w-72 p-4 shadow-xl">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="cad-badge grid size-8 place-items-center rounded-lg bg-brand-purple/15 text-brand-purple">
            <Building2 className="size-4" />
          </span>
          <h4 className="text-sm font-semibold leading-tight">{title}</h4>
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

      {info.cadastreNumber && (
        <p className="cad-row mt-2 font-mono text-xs text-foreground/50" style={{ "--i": 0 }}>
          {info.cadastreNumber}
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2 border-t border-[rgb(var(--card-border))] pt-3">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="cad-row flex items-center justify-between gap-3 text-[13px]"
            style={{ "--i": i + 1 }}
          >
            <span className="flex items-center gap-1.5 text-foreground/55">
              <r.icon className="size-3.5" /> {r.label}
            </span>
            <span className="text-right font-medium tabular-nums">{r.value}</span>
          </div>
        ))}
        {status && (
          <div
            className="cad-row mt-1 flex items-center justify-between"
            style={{ "--i": rows.length + 1 }}
          >
            <span className="text-[13px] text-foreground/55">Holati</span>
            <GlassStatusBadge tone={status.tone}>{status.label}</GlassStatusBadge>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapInfoCard;
