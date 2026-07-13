// Aholi ro'yxati — fuqarolarni bittalab kiritish/tahrirlash (server'da saqlanadi).
import { toast } from "sonner";
import { Loader2, Pencil, Search, Trash2, UserPlus, Users } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Input from "@/shared/components/ui/input/Input";
import Button from "@/shared/components/ui/button/Button";
import { useResidentsQuery } from "../hooks/useResidentsQuery";
import { useResidentDeleteMutation } from "../hooks/useResidentMutations";
import ResidentFormDrawer from "../components/ResidentFormDrawer";

const fmtDate = (v) => (v ? v.split("-").reverse().join(".") : "—");

const empByStatus = (v) =>
  v === "Ishlaydi"
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
    : v === "Ishsiz"
      ? "border-red-500/40 bg-red-500/10 text-red-400"
      : "border-zinc-400/30 bg-zinc-400/10 text-foreground/60";

const BoshqaruvAholiPage = () => {
  const { data: residents, isLoading } = useResidentsQuery();
  const removeMutation = useResidentDeleteMutation();
  const { search, drawerOpen, editing, setFields } = useObjectState({ search: "", drawerOpen: false, editing: null });

  const openCreate = () => setFields({ editing: null, drawerOpen: true });
  const openEdit = (r) => setFields({ editing: r, drawerOpen: true });
  const closeDrawer = () => setFields({ drawerOpen: false, editing: null });

  const onDelete = (r) => {
    if (!window.confirm(`"${r.fullName}" yozuvini o'chirasizmi?`)) return;
    removeMutation.mutate(r.id, {
      onSuccess: () => toast.success("Fuqaro o'chirildi"),
      onError: (err) => toast.error(err?.response?.data?.message || "O'chirib bo'lmadi"),
    });
  };

  const q = search.trim().toLowerCase();
  const filtered = (residents || []).filter((r) =>
    !q ? true : [r.fullName, r.jshshir, r.phone, r.address].some((v) => (v || "").toLowerCase().includes(q)),
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-emerald-500" />
          <h1 className="text-lg font-bold">Aholi ro'yxati</h1>
          <span className="rounded-md border border-[rgb(var(--card-border))] bg-card/40 px-2 py-0.5 text-xs font-semibold tabular-nums text-foreground/60">
            {residents?.length ?? 0}
          </span>
        </div>

        <div className="relative ml-auto w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <Input
            value={search}
            onChange={(e) => setFields({ search: e.target.value })}
            placeholder="F.I.O., JSHSHIR, telefon..."
            className="pl-9"
          />
        </div>
        <Button onClick={openCreate}>
          <UserPlus className="size-4" /> Yangi qo'shish
        </Button>
      </div>

      <div className="glass-table overflow-hidden rounded-xl border border-[rgb(var(--card-border))]">
        {isLoading ? (
          <div className="grid h-64 place-items-center text-foreground/40">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="grid h-64 place-items-center px-8 text-center text-foreground/45">
            <div className="flex flex-col items-center gap-2">
              <Users className="size-8 text-foreground/25" />
              <p className="text-sm font-medium">{residents?.length ? "Hech narsa topilmadi" : "Hozircha fuqaro yo'q"}</p>
              <p className="text-xs">“Yangi qo'shish” tugmasi orqali fuqaro kiriting.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgb(var(--card-border))] bg-card/40 text-left text-[11px] font-semibold uppercase tracking-wider text-foreground/45">
                <th className="px-4 py-2.5">F.I.O.</th>
                <th className="px-4 py-2.5">JSHSHIR</th>
                <th className="px-4 py-2.5">Jinsi</th>
                <th className="px-4 py-2.5">Tug'ilgan</th>
                <th className="px-4 py-2.5">Telefon</th>
                <th className="px-4 py-2.5">Manzil</th>
                <th className="px-4 py-2.5">Bandligi</th>
                <th className="px-4 py-2.5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[rgb(var(--card-border))] last:border-0 hover:bg-card/30">
                  <td className="px-4 py-2.5 font-medium">{r.fullName}</td>
                  <td className="px-4 py-2.5 font-mono text-xs tabular-nums text-foreground/60">{r.jshshir || "—"}</td>
                  <td className="px-4 py-2.5 text-foreground/70">{r.gender || "—"}</td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground/70">{fmtDate(r.birthDate)}</td>
                  <td className="px-4 py-2.5 tabular-nums text-foreground/70">{r.phone || "—"}</td>
                  <td className="max-w-[200px] truncate px-4 py-2.5 text-foreground/70">{r.address || "—"}</td>
                  <td className="px-4 py-2.5">
                    {r.employment ? (
                      <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${empByStatus(r.employment)}`}>
                        {r.employment}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground"
                        title="Tahrirlash"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-red-500/10 hover:text-red-400"
                        title="O'chirish"
                      >
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

      <ResidentFormDrawer open={drawerOpen} resident={editing} onClose={closeDrawer} />
    </div>
  );
};

export default BoshqaruvAholiPage;
