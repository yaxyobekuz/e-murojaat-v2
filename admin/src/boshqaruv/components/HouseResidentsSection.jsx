// Uy-fuqaro bog'lanishi — bino editorida xonadon a'zolarini biriktirish/ajratish, uy egasini belgilash.
import { toast } from "sonner";
import { UserPlus, Link2, Crown, Trash2, Pencil, Users, Search, Wand2 } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Input from "@/shared/components/ui/input/Input";
import { useResidentsQuery } from "../hooks/useResidentsQuery";
import { useResidentSaveMutation } from "../hooks/useResidentMutations";
import ResidentFormDrawer from "./ResidentFormDrawer";

const BTN = "inline-flex items-center gap-1.5 rounded-lg border border-[rgb(var(--card-border))] px-2.5 py-1.5 text-[11px] font-medium text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground";

// biriktirilgan fuqarolardan uy demografik hisoblarini chiqaradi (ixtiyoriy to'ldirish uchun)
const deriveCounts = (list) => ({
  owner: list.find((r) => r.householdRole === "owner")?.fullName || "",
  residentsCount: list.length,
  members: list.length,
  menCount: list.filter((r) => r.gender === "Erkak").length,
  womenCount: list.filter((r) => r.gender === "Ayol").length,
  employedCount: list.filter((r) => r.employment === "Ishlaydi").length,
  unemployedCount: list.filter((r) => r.employment === "Ishsiz").length,
  youthLedger: list.filter((r) => r.youthNotebook).length,
  womenLedger: list.filter((r) => r.womenNotebook).length,
});

const HouseResidentsSection = ({ osmId, onFillCounts }) => {
  const { data: residents = [] } = useResidentsQuery({ houseOsmId: osmId });
  const { data: allResidents = [] } = useResidentsQuery();
  const saveMutation = useResidentSaveMutation();
  const { drawerOpen, editing, showAttach, attachQuery, setFields, setField } = useObjectState({
    drawerOpen: false, editing: null, showAttach: false, attachQuery: "",
  });

  const openCreate = () => setFields({ editing: null, drawerOpen: true });
  const openEdit = (r) => setFields({ editing: r, drawerOpen: true });
  const closeDrawer = () => setFields({ drawerOpen: false, editing: null });

  const mutate = (r, body, ok) =>
    saveMutation.mutate({ id: r.id, body }, { onSuccess: () => toast.success(ok), onError: (err) => toast.error(err?.response?.data?.message || "Xatolik") });

  const setOwner = (r) => mutate(r, { householdRole: "owner", houseOsmId: osmId }, "Uy egasi belgilandi");
  const attach = (r) => {
    saveMutation.mutate(
      { id: r.id, body: { houseOsmId: osmId, householdRole: "member" } },
      { onSuccess: () => { toast.success("Biriktirildi"); setFields({ showAttach: false, attachQuery: "" }); }, onError: () => toast.error("Xatolik") },
    );
  };
  const detach = (r) => {
    if (!window.confirm(`"${r.fullName}" ni uydan ajratasizmi?`)) return;
    mutate(r, { houseOsmId: "", householdRole: "member" }, "Uydan ajratildi");
  };

  const q = attachQuery.trim().toLowerCase();
  const unassigned = allResidents.filter((r) => !r.houseOsmId && (!q || (r.fullName || "").toLowerCase().includes(q)));
  const men = residents.filter((r) => r.gender === "Erkak").length;
  const women = residents.filter((r) => r.gender === "Ayol").length;

  return (
    <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Users className="size-4 text-emerald-500" />
        <p className="text-xs font-bold">Xonadon a'zolari</p>
        <span className="ml-auto text-[11px] tabular-nums text-foreground/55">Jami {residents.length} · Erkak {men} · Ayol {women}</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        <button type="button" onClick={openCreate} className={BTN}><UserPlus className="size-3.5" /> Yangi fuqaro</button>
        <button type="button" onClick={() => setField("showAttach", !showAttach)} className={BTN}><Link2 className="size-3.5" /> Mavjud fuqaroni biriktirish</button>
        {onFillCounts && residents.length > 0 && (
          <button type="button" onClick={() => onFillCounts(deriveCounts(residents))} className={BTN}><Wand2 className="size-3.5" /> Hisoblarni to'ldirish</button>
        )}
      </div>

      {showAttach && (
        <div className="mb-2 rounded-lg border border-[rgb(var(--card-border))] bg-background p-2">
          <div className="relative mb-1.5">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground/40" />
            <Input value={attachQuery} onChange={(e) => setField("attachQuery", e.target.value)} placeholder="Biriktirilmagan fuqaroni qidirish..." className="h-9 pl-8 text-xs" />
          </div>
          <div className="max-h-40 space-y-1 overflow-y-auto">
            {unassigned.length === 0 ? (
              <p className="py-2 text-center text-[11px] text-foreground/40">Biriktirilmagan fuqaro yo'q</p>
            ) : (
              unassigned.slice(0, 30).map((r) => (
                <button key={r.id} type="button" onClick={() => attach(r)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-foreground/5">
                  <span className="truncate">{r.fullName}</span>
                  <span className="ml-2 shrink-0 text-[10px] text-foreground/40">{r.gender || "—"}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {residents.length === 0 ? (
        <p className="py-3 text-center text-[11px] text-foreground/40">Hali fuqaro biriktirilmagan</p>
      ) : (
        <div className="space-y-1">
          {residents.map((r) => (
            <div key={r.id} className="flex items-center gap-2 rounded-lg border border-[rgb(var(--card-border))] bg-background px-2.5 py-1.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-xs font-medium">{r.fullName}</p>
                  {r.householdRole === "owner" && (
                    <span className="shrink-0 rounded border border-amber-500/40 bg-amber-500/10 px-1 py-px text-[9px] font-bold text-amber-400">UY EGASI</span>
                  )}
                </div>
                <p className="text-[10px] text-foreground/45">{[r.gender, r.employment].filter(Boolean).join(" · ") || "—"}</p>
              </div>
              {r.householdRole !== "owner" && (
                <button type="button" onClick={() => setOwner(r)} title="Uy egasi qilish" className="grid size-7 place-items-center rounded-lg text-foreground/45 hover:bg-amber-500/10 hover:text-amber-400">
                  <Crown className="size-3.5" />
                </button>
              )}
              <button type="button" onClick={() => openEdit(r)} title="Tahrirlash" className="grid size-7 place-items-center rounded-lg text-foreground/45 hover:bg-foreground/10 hover:text-foreground">
                <Pencil className="size-3.5" />
              </button>
              <button type="button" onClick={() => detach(r)} title="Uydan ajratish" className="grid size-7 place-items-center rounded-lg text-foreground/45 hover:bg-red-500/10 hover:text-red-400">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ResidentFormDrawer open={drawerOpen} resident={editing} houseOsmId={osmId} onClose={closeDrawer} />
    </div>
  );
};

export default HouseResidentsSection;
