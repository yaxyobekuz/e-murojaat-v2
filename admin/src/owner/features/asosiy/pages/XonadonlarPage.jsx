// Xonadonlar ma'lumotlari — alohida boshqaruv sahifasi (/owner/xonadonlar).
// Ommaviy dashboardda tahrirlash yo'q; barcha kiritish/tahrirlash faqat shu yerda.
// Ro'yxat: OSM'da chizilgan barcha binolar + server'dagi kiritilgan yozuvlar (osmId bo'yicha).
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Home, Pencil, Trash2 } from "lucide-react";

import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import useModal from "@/shared/hooks/useModal";
import useObjectState from "@/shared/hooks/useObjectState";
import { MODAL } from "@/shared/constants/modals";
import { qk } from "@/shared/lib/query/keys";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import DataTable from "@/shared/components/ui/table/DataTable";
import { housesAPI } from "../api/houses.api";
import { useHousesQuery } from "../hooks/useHousesQuery";
import HouseEditModal from "../components/modals/HouseEditModal";
import snapshotUrl from "../data/chinobodOsm.geojson?url";

const STATUS_OPTIONS = [
  { value: "all", label: "Hammasi" },
  { value: "filled", label: "Kiritilgan" },
  { value: "empty", label: "Kiritilmagan" },
];

// OSM snapshot'dan binolar ro'yxati (osmId + nom)
const useOsmBuildings = () =>
  useQuery({
    queryKey: qk.houses.buildings(),
    queryFn: async () => {
      const res = await fetch(snapshotUrl);
      const geo = await res.json();
      return geo.features
        .filter((f) => f.properties.kind === "building" && f.properties.osmId)
        .map((f) => ({ osmId: String(f.properties.osmId), osmName: f.properties.name || null }));
    },
    staleTime: Infinity,
  });

const XonadonlarPage = () => {
  const { state, setField } = useObjectState({ search: "", status: "all" });
  const { data: buildings, isLoading: bLoading } = useOsmBuildings();
  const { data: houses, isLoading: hLoading } = useHousesQuery();
  const { openModal } = useModal(MODAL.ASOSIY_HOUSE_EDIT);
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: (osmId) => housesAPI.remove(osmId),
    onSuccess: (_res, osmId) => {
      queryClient.invalidateQueries({ queryKey: qk.houses.all() });
      queryClient.removeQueries({ queryKey: qk.houses.one(osmId) });
      toast.success("Xonadon yozuvi o'chirildi");
    },
    onError: () => toast.error("O'chirib bo'lmadi — server ishlayotganini tekshiring"),
  });

  const houseMap = new Map((houses || []).map((h) => [String(h.osmId), h]));
  const q = state.search.trim().toLowerCase();

  const rows = (buildings || [])
    .map((b) => ({ ...b, house: houseMap.get(b.osmId) || null }))
    .filter((r) => {
      if (state.status === "filled" && !r.house) return false;
      if (state.status === "empty" && r.house) return false;
      if (!q) return true;
      return [r.osmName, r.osmId, r.house?.name, r.house?.owner, r.house?.address, r.house?.phone]
        .some((v) => v?.toLowerCase?.().includes(q));
    })
    // kiritilganlar > nomlangan binolar > nomsizlar
    .sort((a, b) => (b.house ? 2 : b.osmName ? 1 : 0) - (a.house ? 2 : a.osmName ? 1 : 0));

  const filled = (buildings || []).filter((b) => houseMap.has(b.osmId)).length;

  const onEdit = (r) =>
    openModal(MODAL.ASOSIY_HOUSE_EDIT, {
      osmId: r.osmId,
      defaults: r.house || { name: r.osmName || "" },
    });

  const columns = [
    {
      key: "name",
      header: "Xonadon",
      render: (r) => (
        <div>
          <p className="font-medium">{r.house?.name || r.osmName || "Nomsiz bino"}</p>
          <p className="font-mono text-[11px] text-foreground/40">OSM {r.osmId}</p>
        </div>
      ),
    },
    { key: "owner", header: "Egasi", render: (r) => r.house?.owner || "—" },
    { key: "phone", header: "Telefon", render: (r) => r.house?.phone || "—" },
    { key: "members", header: "A'zolar", align: "center", render: (r) => r.house?.members ?? "—" },
    { key: "address", header: "Manzil", render: (r) => r.house?.address || "—" },
    {
      key: "status",
      header: "Holat",
      align: "center",
      render: (r) =>
        r.house ? (
          <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Kiritilgan</span>
        ) : (
          <span className="rounded-md border border-zinc-400/30 bg-zinc-400/10 px-2 py-0.5 text-[11px] font-medium text-foreground/45">Kiritilmagan</span>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(r)}
            className="grid size-7 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/55 transition-colors hover:text-emerald-500"
            title={r.house ? "Tahrirlash" : "Ma'lumot kiritish"}
          >
            <Pencil className="size-3.5" />
          </button>
          {r.house && (
            <button
              type="button"
              onClick={() => removeMutation.mutate(r.osmId)}
              disabled={removeMutation.isPending}
              className="grid size-7 place-items-center rounded-lg border border-[rgb(var(--card-border))] text-foreground/55 transition-colors hover:text-red-500"
              title="Yozuvni o'chirish"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <Home className="size-5 text-emerald-500" /> Xonadonlar ma'lumotlari
          </h1>
          <p className="mt-0.5 text-sm text-foreground/55">
            Sarnovul MFY — {buildings?.length ?? "…"} bino, {filled} tasi kiritilgan
            {buildings?.length ? ` (${Math.round((filled / buildings.length) * 100)}%)` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={state.search}
            onChange={(e) => setField("search", e.target.value)}
            placeholder="Qidirish (nom, egasi, OSM id...)"
            className="w-64"
          />
          <Select value={state.status} onChange={(v) => setField("status", v)} options={STATUS_OPTIONS} className="w-40" />
        </div>
      </div>

      <DataTable
        variant="glass"
        columns={columns}
        rows={rows}
        isLoading={bLoading || hLoading}
        getKey={(r) => r.osmId}
        emptyText="Bino topilmadi"
      />

      <ModalWrapper
        name={MODAL.ASOSIY_HOUSE_EDIT}
        title="Xonadon ma'lumotlari"
        description="Ma'lumotlar server'da OSM bino identifikatori bo'yicha saqlanadi"
      >
        <HouseEditModal />
      </ModalWrapper>
    </div>
  );
};

export default XonadonlarPage;
