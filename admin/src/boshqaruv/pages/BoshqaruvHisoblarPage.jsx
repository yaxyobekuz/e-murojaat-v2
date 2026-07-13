// Hisoblar — foydalanuvchi loginlarini owner qo'lda yaratadi/tahrirlaydi (faqat owner).
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, UserPlus, UserCog } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import { roleLabel } from "@/shared/constants/roles";
import { useBoshqaruvMe } from "../hooks/useBoshqaruvMe";
import { useUsersQuery, useUserDeleteMutation } from "../hooks/useUsers";
import UserFormDrawer from "../components/UserFormDrawer";

const BoshqaruvHisoblarPage = () => {
  const { data: me } = useBoshqaruvMe();
  const { data: users, isLoading } = useUsersQuery();
  const removeMutation = useUserDeleteMutation();
  const { editing, drawerOpen, setFields } = useObjectState({ editing: null, drawerOpen: false });

  if (me && me.role !== "owner") return <Navigate to="/boshqaruv" replace />;

  const openCreate = () => setFields({ editing: null, drawerOpen: true });
  const openEdit = (u) => setFields({ editing: u, drawerOpen: true });
  const closeDrawer = () => setFields({ drawerOpen: false, editing: null });

  const onDelete = (u) => {
    if (!window.confirm(`"${u.username}" hisobini o'chirasizmi?`)) return;
    removeMutation.mutate(u.id, {
      onSuccess: () => toast.success("Hisob o'chirildi"),
      onError: (err) => toast.error(err?.response?.data?.message || "O'chirib bo'lmadi"),
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-5 flex items-center gap-3">
        <UserCog className="size-5 text-emerald-500" />
        <h1 className="text-lg font-bold">Hisoblar</h1>
        <span className="rounded-md border border-[rgb(var(--card-border))] bg-card/40 px-2 py-0.5 text-xs font-semibold text-foreground/60">
          {users?.length ?? 0}
        </span>
        <Button onClick={openCreate} className="ml-auto">
          <UserPlus className="size-4" /> Yangi hisob
        </Button>
      </div>

      <div className="glass-table overflow-hidden rounded-xl border border-[rgb(var(--card-border))]">
        {isLoading ? (
          <div className="grid h-48 place-items-center text-foreground/40">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--card-border))] bg-card/40 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground/45">
                <th className="px-4 py-2.5">Login</th>
                <th className="px-4 py-2.5">F.I.O.</th>
                <th className="px-4 py-2.5">Lavozim</th>
                <th className="px-4 py-2.5">Holati</th>
                <th className="px-4 py-2.5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u) => (
                <tr key={u.id} className="border-b border-[rgb(var(--card-border))] last:border-0 hover:bg-card/30">
                  <td className="px-4 py-2.5 font-mono text-xs">{u.username}</td>
                  <td className="px-4 py-2.5 font-medium">{u.fullName}</td>
                  <td className="px-4 py-2.5 text-foreground/70">{roleLabel(u.role)}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${u.active ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-red-500/40 bg-red-500/10 text-red-400"}`}
                    >
                      {u.active ? "Faol" : "Bloklangan"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" onClick={() => openEdit(u)} className="grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground" title="Tahrirlash">
                        <Pencil className="size-3.5" />
                      </button>
                      <button type="button" onClick={() => onDelete(u)} className="grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-red-500/10 hover:text-red-400" title="O'chirish">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <UserFormDrawer open={drawerOpen} user={editing} onClose={closeDrawer} />
    </div>
  );
};

export default BoshqaruvHisoblarPage;
