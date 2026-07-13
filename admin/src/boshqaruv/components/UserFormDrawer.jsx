// Foydalanuvchi hisobini yaratish/tahrirlash drawer (faqat owner).
import { useEffect } from "react";
import { toast } from "sonner";
import { Save, UserPlus, UserCog, X } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import { ASSIGNABLE_ROLES, ROLE_LABELS } from "@/shared/constants/roles";
import { useUserSaveMutation } from "../hooks/useUsers";
import FormField from "./FormField";

const roleOptions = ASSIGNABLE_ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r] }));
const activeOptions = [
  { value: "active", label: "Faol" },
  { value: "inactive", label: "Bloklangan" },
];

const createFields = [
  { key: "username", label: "Login", type: "text", full: true, required: true, placeholder: "masalan: soliq" },
  { key: "fullName", label: "F.I.O.", type: "text", full: true, required: true, placeholder: "Familiya Ism" },
  { key: "role", label: "Lavozim", type: "select", options: roleOptions },
  { key: "password", label: "Parol", type: "password", required: true, placeholder: "kamida 4 belgi" },
];
const editFields = [
  { key: "fullName", label: "F.I.O.", type: "text", full: true, required: true },
  { key: "role", label: "Lavozim", type: "select", options: roleOptions },
  { key: "active", label: "Holati", type: "select", options: activeOptions },
  { key: "password", label: "Yangi parol (ixtiyoriy)", type: "password", full: true, placeholder: "o'zgartirmaslik uchun bo'sh qoldiring" },
];

const errMsg = (err) => err?.response?.data?.message || "Amalni bajarib bo'lmadi";

const UserFormDrawer = ({ open, user, onClose }) => {
  const isEdit = Boolean(user?.id);
  const mutation = useUserSaveMutation();
  const { state, setFields, setField } = useObjectState({ username: "", fullName: "", role: "chairman", password: "", active: "active" });

  useEffect(() => {
    if (!open) return;
    setFields(
      user
        ? { username: user.username, fullName: user.fullName, role: user.role, active: user.active ? "active" : "inactive", password: "" }
        : { username: "", fullName: "", role: "chairman", password: "", active: "active" },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  if (!open) return null;

  const onSave = () => {
    if (!state.fullName.trim()) return toast.error("F.I.O. majburiy");
    let body;
    if (isEdit) {
      body = { fullName: state.fullName, role: state.role, active: state.active === "active" };
      if (state.password) body.password = state.password;
    } else {
      if (!state.username.trim()) return toast.error("Login majburiy");
      if (!state.password || state.password.length < 4) return toast.error("Parol kamida 4 belgi");
      body = { username: state.username, fullName: state.fullName, role: state.role, password: state.password };
    }
    mutation.mutate(
      { id: user?.id, body },
      {
        onSuccess: () => {
          toast.success(isEdit ? "Hisob yangilandi" : "Hisob yaratildi");
          onClose();
        },
        onError: (err) => toast.error(errMsg(err)),
      },
    );
  };

  const fields = isEdit ? editFields : createFields;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[460px] flex-col border-l border-[rgb(var(--card-border))] bg-background shadow-2xl">
        <header className="flex items-center justify-between border-b border-[rgb(var(--card-border))] px-5 py-4">
          <div className="flex items-center gap-2">
            {isEdit ? <UserCog className="size-4.5 text-emerald-500" /> : <UserPlus className="size-4.5 text-emerald-500" />}
            <h2 className="text-sm font-bold">{isEdit ? `Hisobni tahrirlash — ${user.username}` : "Yangi hisob"}</h2>
          </div>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-foreground/50 hover:text-foreground">
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
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

export default UserFormDrawer;
