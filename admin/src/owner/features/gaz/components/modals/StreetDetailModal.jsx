// Ko'cha tafsiloti — ko'rsatkichlar + yetkazish tarixi + quvur muammolari.
import { Cylinder, CalendarClock, Gauge, TriangleAlert } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { useGazStreet } from "../../hooks/useGazStreet";
import { SUPPLY, STATUS, DELIVERY_STATUS, INCIDENT_TYPE, ADEQUACY } from "../../mock/gaz.data";

const DLV_TONE = { yetkazildi: "done", kechikdi: "progress", yetkazilmadi: "danger" };

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-2">
    <Icon className="size-4 text-foreground/45" />
    <div className="leading-tight">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-foreground/50">{label}</div>
    </div>
  </div>
);

const StreetDetailModal = ({ streetId }) => {
  const { data, isLoading } = useGazStreet(streetId);
  if (isLoading || !data) return <p className="py-8 text-center text-sm text-foreground/50">Yuklanmoqda…</p>;
  const { street: s, deliveries, incidents } = data;

  return (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <span className="size-3 rounded-sm" style={{ background: SUPPLY[s.supplyType].color }} /> {SUPPLY[s.supplyType].label}
        </span>
        <GlassStatusBadge tone={STATUS[s.status].tone}>{STATUS[s.status].label}</GlassStatusBadge>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat icon={Cylinder} label="Oylik balon" value={s.cylindersPerMonth} />
        <Stat icon={CalendarClock} label="O'rt. davr" value={s.deliveryCycleDays ? `${s.deliveryCycleDays} kun` : "—"} />
        <Stat icon={Gauge} label="Gazlashtirish" value={`${s.gasifiedPct}%`} />
        <Stat icon={TriangleAlert} label="Yetarlilik" value={ADEQUACY[s.adequacy]} />
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">Oxirgi yetkazishlar</p>
        <div className="flex flex-col gap-1.5">
          {deliveries.length === 0 && <p className="text-xs text-foreground/40">Yetkazish yozuvi yo'q</p>}
          {deliveries.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2 text-[13px]">
              <span className="text-foreground/60">{formatDateUz(d.date)}</span>
              <span className="font-medium tabular-nums">{d.cylinders} balon</span>
              <GlassStatusBadge tone={DLV_TONE[d.status]}>{DELIVERY_STATUS[d.status]}</GlassStatusBadge>
            </div>
          ))}
        </div>
      </div>

      {incidents.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">Quvur muammolari</p>
          <div className="flex flex-col gap-1.5">
            {incidents.map((x) => (
              <div key={x.id} className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2 text-[13px]">
                <span className="font-medium">{INCIDENT_TYPE[x.type]}</span>
                <span className="text-foreground/55">{formatDateUz(x.reportedAt)}</span>
                <GlassStatusBadge tone={x.status === "ochiq" ? "danger" : "done"}>
                  {x.status === "ochiq" ? "Ochiq" : `${x.durationH} soatda hal`}
                </GlassStatusBadge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreetDetailModal;
