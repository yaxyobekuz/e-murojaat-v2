// Aholi qo'shish/tahrirlash uchun o'ngdan chiqadigan drawer forma.
import { useEffect } from "react";
import { toast } from "sonner";
import { Save, UserPlus, UserCog, X } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import { useResidentSaveMutation } from "../hooks/useResidentMutations";
import { RESIDENT_SECTIONS, emptyResident, residentToForm, formToBody } from "../data/residentFields";
import FormField from "./FormField";

const errMsg = (err) =>
  err?.response?.status === 401
    ? "Sessiya tugagan — qayta kiring"
    : err?.response?.data?.message || "Amalni bajarib bo'lmadi";

const HOUSEHOLD_ROLE_FIELD = {
  key: "householdRole",
  label: "Xonadondagi roli",
  type: "select",
  options: [
    { value: "member", label: "Xonadon a'zosi" },
    { value: "owner", label: "Uy egasi" },
  ],
};

const ResidentFormDrawer = ({ open, resident, houseOsmId, onClose }) => {
  const isEdit = Boolean(resident?.id);
  const mutation = useResidentSaveMutation();
  const { state, setFields, setField } = useObjectState({ ...emptyResident(), householdRole: "member" });

  // uy konteksti — bino editoridan ochilsa yoki fuqaro allaqachon uyga bog'langan bo'lsa
  const houseCtx = houseOsmId || resident?.houseOsmId || null;

  useEffect(() => {
    if (open)
      setFields({
        ...(resident ? residentToForm(resident) : emptyResident()),
        householdRole: resident?.householdRole || "member",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, resident?.id]);

  if (!open) return null;

  const onSave = () => {
    if (!state.fullName.trim()) return toast.error("F.I.O. majburiy");
    mutation.mutate(
      { id: resident?.id, body: { ...formToBody(state), houseOsmId: houseCtx, householdRole: state.householdRole } },
      {
        onSuccess: () => {
          toast.success(isEdit ? "Ma'lumotlar saqlandi" : "Fuqaro qo'shildi");
          onClose();
        },
        onError: (err) => toast.error(errMsg(err)),
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative flex h-full w-full max-w-[520px] flex-col border-l border-[rgb(var(--card-border))] bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-[rgb(var(--card-border))] px-5 py-4">
          <div className="flex items-center gap-2">
            {isEdit ? <UserCog className="size-4.5 text-emerald-500" /> : <UserPlus className="size-4.5 text-emerald-500" />}
            <h2 className="text-sm font-bold">{isEdit ? "Fuqaro ma'lumotlarini tahrirlash" : "Yangi fuqaro qo'shish"}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-foreground/50 hover:text-foreground">
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {houseCtx && (
            <div>
              <p className="mb-3 border-b border-[rgb(var(--card-border))] pb-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/45">
                Xonadon
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <p className="mb-1.5 text-xs font-medium text-foreground/55">Biriktirilgan uy</p>
                  <div className="flex h-10 items-center rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-3 font-mono text-xs text-foreground/60">
                    OSM {houseCtx}
                  </div>
                </div>
                <FormField field={HOUSEHOLD_ROLE_FIELD} value={state.householdRole} onChange={(v) => setField("householdRole", v)} />
              </div>
            </div>
          )}
          {RESIDENT_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-3 border-b border-[rgb(var(--card-border))] pb-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/45">
                {section.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {section.fields.map((field) => (
                  <FormField key={field.key} field={field} value={state[field.key]} onChange={(v) => setField(field.key, v)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer className="flex items-center gap-2 border-t border-[rgb(var(--card-border))] px-5 py-4">
          <Button onClick={onSave} disabled={mutation.isPending} className="flex-1">
            <Save className="size-4" /> {mutation.isPending ? "Saqlanmoqda…" : "Saqlash"}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>
            Bekor qilish
          </Button>
        </footer>
      </aside>
    </div>
  );
};

export default ResidentFormDrawer;
