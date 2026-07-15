// Rol-scoped house editor — mansabdor faqat o'z sohasidagi bino maydonlarini tahrirlaydi.
import { useEffect } from "react";
import { toast } from "sonner";
import { MousePointerClick, Save } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import { useHouseQuery, useHouseMutation } from "@/owner/features/asosiy";
import { houseFieldsForRole, houseToForm, formToHouseBody } from "../data/houseFields";
import FormField from "./FormField";
import HouseResidentsSection from "./HouseResidentsSection";

const errMsg = (err) =>
  err?.response?.status === 401 ? "Sessiya tugagan — qayta kiring" : err?.response?.data?.message || "Amalni bajarib bo'lmadi";

const RoleHouseEditorPanel = ({ element, role, onClear }) => {
  const osmId = element?.osmId || null;
  const { data: house } = useHouseQuery(osmId);
  const mutation = useHouseMutation();
  const fields = houseFieldsForRole(role);
  const { state, setFields, setField } = useObjectState(Object.fromEntries(fields.map((f) => [f.key, ""])));

  useEffect(() => {
    setFields(houseToForm(house, role));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osmId, house, role]);

  if (!element)
    return (
      <div className="grid h-full place-items-center px-8 text-center text-foreground/45">
        <div className="flex flex-col items-center gap-3">
          <MousePointerClick className="size-8 text-foreground/25" />
          <p className="text-sm font-medium">Xaritadan uyni tanlang</p>
          <p className="text-xs leading-relaxed">Uyni bosib, o'z sohangiz bo'yicha ma'lumotni shu yerda kiritasiz.</p>
        </div>
      </div>
    );

  if (!osmId)
    return <div className="grid h-full place-items-center px-8 text-center text-sm text-foreground/45">Faqat binolar tahrirlanadi</div>;

  const onSave = () =>
    mutation.mutate(
      { osmId, body: formToHouseBody(state, role) },
      { onSuccess: () => toast.success("Saqlandi"), onError: (err) => toast.error(errMsg(err)) },
    );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold leading-tight">{element.name || "Nomsiz bino"}</h2>
          <p className="mt-0.5 font-mono text-[11px] text-foreground/40">OSM {osmId}</p>
        </div>
        <button type="button" onClick={onClear} className="text-xs text-foreground/45 hover:text-foreground">Tozalash</button>
      </div>

      {role === "chairman" && <HouseResidentsSection osmId={osmId} onFillCounts={(d) => setFields(d)} />}

      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <FormField key={field.key} field={field} value={state[field.key]} onChange={(v) => setField(field.key, v)} />
        ))}
      </div>

      <Button onClick={onSave} disabled={mutation.isPending}>
        <Save className="size-4" /> {mutation.isPending ? "Saqlanmoqda…" : "Saqlash"}
      </Button>
    </div>
  );
};

export default RoleHouseEditorPanel;
