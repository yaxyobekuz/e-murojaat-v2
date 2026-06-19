import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import { useCreateOrganization } from "../hooks/useOrganizations";
import { ORGANIZATION_TYPE_OPTIONS } from "../constants/murojaat.ui";

// Rendered inside ModalWrapper -> receives { close }
const OrganizationCreateModal = ({ close }) => {
  const { name, type, region, setField } = useObjectState({
    name: "",
    type: "",
    region: "",
  });
  const mutation = useCreateOrganization();

  const submit = () => {
    if (!name.trim() || !type) return;
    mutation.mutate(
      { name: name.trim(), type, region: region || undefined },
      { onSuccess: () => close?.() },
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Tashkilot nomi</label>
        <Input
          value={name}
          onChange={(e) => setField("name", e.target.value)}
          placeholder="Masalan: Tuman hokimligi"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Turi</label>
        <Select
          value={type}
          onChange={(v) => setField("type", v)}
          placeholder="Turini tanlang"
          options={ORGANIZATION_TYPE_OPTIONS}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Viloyat</label>
        <Input
          value={region}
          onChange={(e) => setField("region", e.target.value)}
          placeholder="Ixtiyoriy"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={() => close?.()}>
          Bekor qilish
        </Button>
        <Button onClick={submit} disabled={!name.trim() || !type || mutation.isPending}>
          {mutation.isPending ? "Saqlanmoqda..." : "Qo'shish"}
        </Button>
      </div>
    </div>
  );
};

export default OrganizationCreateModal;
