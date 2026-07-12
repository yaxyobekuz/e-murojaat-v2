// Mahalla yettiligi a'zosini qo'shish/tahrirlash uchun o'ngdan chiqadigan drawer.
import { useEffect } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import { useOfficialSaveMutation } from "../hooks/useOfficialMutations";
import { OFFICIAL_FIELDS, emptyOfficial, officialToForm, roleMeta } from "../data/officials";
import FormField from "./FormField";

const errMsg = (err) =>
  err?.response?.status === 401
    ? "Sessiya tugagan — qayta kiring"
    : err?.response?.data?.message || "Amalni bajarib bo'lmadi";

const OfficialFormDrawer = ({ open, role, official, onClose }) => {
  const meta = roleMeta(role);
  const Icon = meta.icon;
  const isEdit = Boolean(official?.fullName);
  const mutation = useOfficialSaveMutation();
  const { state, setFields, setField } = useObjectState(emptyOfficial());

  useEffect(() => {
    if (open) setFields(official ? officialToForm(official) : emptyOfficial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, role]);

  if (!open) return null;

  const onSave = () => {
    if (!state.fullName.trim()) return toast.error("F.I.O. majburiy");
    mutation.mutate(
      { role, body: state },
      {
        onSuccess: () => {
          toast.success("Ma'lumotlar saqlandi");
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
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg border border-[rgb(var(--card-border))] bg-card/40">
              <Icon className={`size-4.5 ${meta.accent}`} />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/45">
                {isEdit ? "Tahrirlash" : "Yangi a'zo"}
              </p>
              <h2 className="text-sm font-bold leading-tight">{meta.label}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-foreground/50 hover:text-foreground">
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {OFFICIAL_FIELDS.map((field) => (
              <FormField key={field.key} field={field} value={state[field.key]} onChange={(v) => setField(field.key, v)} />
            ))}
          </div>
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

export default OfficialFormDrawer;
