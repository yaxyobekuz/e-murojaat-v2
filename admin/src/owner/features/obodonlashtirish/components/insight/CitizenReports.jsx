// Xalq Nazorati — fuqaro shikoyatlari (foto + manzil + holat + SLA). Filtr bilan.
import { MapPin, Clock, AlertTriangle } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import { hexA } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import useObjectState from "@/shared/hooks/useObjectState";
import { CITIZEN_REPORTS, REPORT_TYPE, REPORT_STATUS } from "../../mock/citizenReports.data";

const ACCENT = "#8b5cf6";

const ReportCard = ({ r }) => {
  const t = REPORT_TYPE[r.type];
  const st = REPORT_STATUS[r.status];
  return (
    <div className="overflow-hidden rounded-xl border border-[rgb(var(--card-border))] bg-card">
      <div className="relative h-24 w-full overflow-hidden">
        <img src={r.photo} alt={r.type} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{t.icon} {t.label}</span>
        {r.overdue && <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-semibold text-white"><AlertTriangle className="size-2.5" /> Muddat o'tdi</span>}
      </div>
      <div className="p-2.5">
        <div className="flex items-center gap-1 text-[11px] text-foreground/65"><MapPin className="size-3" /> {r.address}</div>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-foreground/40">{r.id} · {formatDateUz(r.createdDate)}</span>
          {r.slaHours != null && <span className="flex items-center gap-0.5 text-[10px] text-foreground/50"><Clock className="size-2.5" /> {r.slaHours}s</span>}
        </div>
        <div className="mt-1.5"><StatusBadge tone={st.tone}>{st.label}</StatusBadge></div>
      </div>
    </div>
  );
};

export const CitizenReports = () => {
  const { type, setField } = useObjectState({ type: "" });
  const rows = CITIZEN_REPORTS.filter((r) => !type || r.type === type);

  return (
    <div className="p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-foreground/40">xalqnazorati.uz uslubida — foto+manzil bilan, fuqaro tasdiqlashi bilan yopiladi</span>
        <div className="ml-auto flex flex-wrap gap-1">
          {[["", "Hammasi"], ...Object.entries(REPORT_TYPE).map(([k, v]) => [k, v.label])].map(([k, label]) => (
            <button key={k} onClick={() => setField("type", k)}
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={type === k ? { borderColor: hexA(ACCENT, 0.5), background: hexA(ACCENT, 0.12), color: ACCENT } : { borderColor: "rgb(var(--card-border))", color: "hsl(var(--muted-foreground))" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((r) => <ReportCard key={r.id} r={r} />)}
      </div>
    </div>
  );
};
