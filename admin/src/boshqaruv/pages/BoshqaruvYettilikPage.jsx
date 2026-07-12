// Mahalla yettiligi — 7 kanonik lavozim uchun mas'ul shaxs ma'lumotlarini kiritish/tahrirlash.
import { toast } from "sonner";
import { Loader2, Phone, Clock, MapPin, Pencil, Plus, Trash2, Landmark } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { useOfficialsQuery } from "../hooks/useOfficialsQuery";
import { useOfficialDeleteMutation } from "../hooks/useOfficialMutations";
import OfficialFormDrawer from "../components/OfficialFormDrawer";
import { MAHALLA_SEVEN } from "../data/officials";

const InfoLine = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-1.5 text-xs text-foreground/60">
    <Icon className="size-3.5 shrink-0 text-foreground/35" /> <span className="truncate">{children}</span>
  </p>
);

const BoshqaruvYettilikPage = () => {
  const { data: officials, isLoading } = useOfficialsQuery();
  const removeMutation = useOfficialDeleteMutation();
  const { activeRole, drawerOpen, setFields } = useObjectState({ activeRole: null, drawerOpen: false });

  const byRole = Object.fromEntries((officials || []).map((o) => [o.role, o]));
  const filledCount = MAHALLA_SEVEN.filter((r) => byRole[r.role]?.fullName).length;

  const openEditor = (role) => setFields({ activeRole: role, drawerOpen: true });
  const closeDrawer = () => setFields({ drawerOpen: false, activeRole: null });

  const onClear = (role, label) => {
    if (!window.confirm(`"${label}" yozuvini o'chirasizmi?`)) return;
    removeMutation.mutate(role, {
      onSuccess: () => toast.success("Yozuv o'chirildi"),
      onError: (err) => toast.error(err?.response?.data?.message || "O'chirib bo'lmadi"),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5 flex items-center gap-2">
        <Landmark className="size-5 text-emerald-500" />
        <h1 className="text-lg font-bold">Mahalla yettiligi</h1>
        <span className="rounded-md border border-[rgb(var(--card-border))] bg-card/40 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground/60">
          {filledCount}/7
        </span>
      </div>

      {isLoading ? (
        <div className="grid h-64 place-items-center text-foreground/40">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MAHALLA_SEVEN.map(({ role, label, icon: Icon, accent }) => {
            const person = byRole[role];
            const filled = Boolean(person?.fullName);
            return (
              <div key={role} className="flex flex-col rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[rgb(var(--card-border))] bg-background">
                    <Icon className={`size-5 ${accent}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/45">{label}</p>
                    <p className={`truncate text-sm font-bold ${filled ? "" : "text-foreground/35"}`}>
                      {filled ? person.fullName : "Kiritilmagan"}
                    </p>
                  </div>
                </div>

                {filled && (
                  <div className="mt-3 space-y-1.5 border-t border-[rgb(var(--card-border))] pt-3">
                    {person.phone && <InfoLine icon={Phone}>{person.phone}</InfoLine>}
                    {person.receptionDays && <InfoLine icon={Clock}>{person.receptionDays}</InfoLine>}
                    {person.office && <InfoLine icon={MapPin}>{person.office}</InfoLine>}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => openEditor(role)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
                  >
                    {filled ? <Pencil className="size-3.5" /> : <Plus className="size-3.5" />}
                    {filled ? "Tahrirlash" : "Qo'shish"}
                  </button>
                  {filled && (
                    <button
                      type="button"
                      onClick={() => onClear(role, label)}
                      className="grid size-8 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="O'chirish"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <OfficialFormDrawer open={drawerOpen} role={activeRole} official={activeRole ? byRole[activeRole] : null} onClose={closeDrawer} />
    </div>
  );
};

export default BoshqaruvYettilikPage;
