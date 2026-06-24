// Ariza tafsiloti — to'liq ma'lumot + ijro timeline'i. ModalWrapper `appeal` ni uzatadi.
import { User, MapPin, Wrench, CalendarClock, Coins, Star, Phone } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import { formatMoney } from "@/shared/utils/formatMoney";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { CAT, STATUS, GENDER, PRIORITY, SOURCE } from "../../mock/msk.data";

const dt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${formatDateUz(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const Row = ({ icon: Icon, label, value }) =>
  value == null || value === "" ? null : (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="flex items-center gap-1.5 text-foreground/55"><Icon className="size-3.5" /> {label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );

const AppealDetailModal = ({ appeal }) => {
  if (!appeal) return null;
  const c = CAT[appeal.category];
  const st = STATUS[appeal.status];

  return (
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <span className="size-3 rounded-sm" style={{ background: c.color }} /> {c.label}
        </span>
        <GlassStatusBadge tone={st.tone}>{st.label}</GlassStatusBadge>
      </div>
      <p className="rounded-lg bg-foreground/5 p-3 text-[13px] text-foreground/75">{appeal.description}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/40">Arizachi</p>
          <Row icon={User} label="F.I.Sh" value={appeal.applicant.name} />
          <Row icon={User} label="Jins / yosh" value={`${GENDER[appeal.applicant.gender]} · ${appeal.applicant.age}`} />
          <Row icon={Phone} label="Telefon" value={appeal.applicant.phone} />
          <Row icon={MapPin} label="Manzil" value={`${appeal.address.street}, ${appeal.address.house}-uy`} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground/40">Ijro</p>
          <Row icon={Wrench} label="Mas'ul xodim" value={appeal.assignedWorker?.name || "Tayinlanmagan"} />
          <Row icon={CalendarClock} label="Ijro muddati" value={appeal.deadline ? formatDateUz(appeal.deadline) : "—"} />
          <Row icon={CalendarClock} label="Davomiyligi" value={appeal.durationH ? `${appeal.durationH} soat` : "—"} />
          <Row icon={Coins} label="Narxi" value={appeal.costUzs ? formatMoney(appeal.costUzs) : "—"} />
          <Row icon={Star} label="Baho" value={appeal.rating ? `${appeal.rating} ★` : "—"} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-foreground/55">
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">№ {appeal.appealNumber}</span>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">Ustuvorlik: {PRIORITY[appeal.priority].label}</span>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5">Manba: {SOURCE[appeal.source]}</span>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-foreground/40">Ijro tarixi</p>
        <ol className="flex flex-col gap-3 border-l border-[rgb(var(--card-border))] pl-4">
          {appeal.events.map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1 size-2.5 rounded-full" style={{ background: STATUS[e.type]?.tone === "danger" ? "#ef4444" : "#f43f5e" }} />
              <div className="text-[13px] font-medium">{e.note}</div>
              <div className="text-[11px] text-foreground/45">{dt(e.at)}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default AppealDetailModal;
