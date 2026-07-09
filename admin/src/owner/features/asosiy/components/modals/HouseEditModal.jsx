// Xonadon ma'lumotlarini kiritish/tahrirlash — ModalWrapper ichida render qilinadi.
// data orqali keladi: osmId, defaults (server'dagi joriy yozuv yoki OSM'dan boshlang'ich).
import { toast } from "sonner";

import useObjectState from "@/shared/hooks/useObjectState";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import Button from "@/shared/components/ui/button/Button";
import { useHouseMutation } from "../../hooks/useHouseMutation";

const OWNERSHIP_OPTIONS = [
  { value: "Xususiy", label: "Xususiy" },
  { value: "Davlat", label: "Davlat" },
  { value: "Yuridik shaxs", label: "Yuridik shaxs" },
];

const FieldRow = ({ label, children }) => (
  <div>
    <p className="mb-1.5 text-xs font-medium text-foreground/55">{label}</p>
    {children}
  </div>
);

const HouseEditModal = ({ osmId, defaults = {}, close }) => {
  const mutation = useHouseMutation();
  const { state, setField } = useObjectState({
    name: defaults.name || "",
    owner: defaults.owner || "",
    phone: defaults.phone || "",
    members: defaults.members ?? "",
    ownership: defaults.ownership || "Xususiy",
    address: defaults.address || "",
    notes: defaults.notes || "",
  });

  if (!osmId) return null;

  const onSave = () => {
    mutation.mutate(
      { osmId, body: { ...state, members: state.members === "" ? null : Number(state.members) } },
      {
        onSuccess: () => {
          toast.success("Xonadon ma'lumotlari saqlandi");
          close?.();
        },
        onError: (err) =>
          toast.error(
            err?.response?.status === 401
              ? "Sessiya tugagan — boshqaruv paneliga qayta kiring"
              : "Saqlab bo'lmadi — server ishlayotganini tekshiring",
          ),
      },
    );
  };

  return (
    <div className="flex flex-col gap-3.5 pt-2">
      <p className="rounded-xl bg-muted/50 px-3 py-2 font-mono text-xs text-foreground/55">OSM ID: {osmId}</p>

      <FieldRow label="Xonadon nomi">
        <Input value={state.name} onChange={(e) => setField("name", e.target.value)} placeholder="Masalan: ABDUSAMAT xonadoni" />
      </FieldRow>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="Egasi (F.I.O.)">
          <Input value={state.owner} onChange={(e) => setField("owner", e.target.value)} placeholder="Familiya I." />
        </FieldRow>
        <FieldRow label="Telefon">
          <Input value={state.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+998 90 123-45-67" />
        </FieldRow>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FieldRow label="A'zolar soni">
          <Input
            type="number"
            min="0"
            value={state.members}
            onChange={(e) => setField("members", e.target.value)}
            placeholder="0"
          />
        </FieldRow>
        <FieldRow label="Mulkchilik">
          <Select value={state.ownership} onChange={(v) => setField("ownership", v)} options={OWNERSHIP_OPTIONS} />
        </FieldRow>
      </div>
      <FieldRow label="Manzil">
        <Input value={state.address} onChange={(e) => setField("address", e.target.value)} placeholder="Ko'cha, uy raqami" />
      </FieldRow>
      <FieldRow label="Izoh">
        <textarea
          value={state.notes}
          onChange={(e) => setField("notes", e.target.value)}
          rows={3}
          placeholder="Qo'shimcha ma'lumot..."
          className="w-full resize-none rounded-lg border border-[rgb(var(--card-border))] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/35 focus:border-foreground/30"
        />
      </FieldRow>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" onClick={() => close?.()}>Bekor qilish</Button>
        <Button onClick={onSave} disabled={mutation.isPending}>
          {mutation.isPending ? "Saqlanmoqda…" : "Saqlash"}
        </Button>
      </div>
    </div>
  );
};

export default HouseEditModal;
