import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import { REGIONS } from "@/shared/data/regions";
import { TAXPAYER_TYPE_LABELS } from "../utils/soliq.constants";
import { useCreateTaxpayerMutation } from "../hooks/useSoliqMutations";

const regionSelectOptions = REGIONS.map((r) => ({ label: r.label, value: r.key }));
const typeSelectOptions = Object.entries(TAXPAYER_TYPE_LABELS).map(([value, label]) => ({ label, value }));

// ModalWrapper `close` ni props orqali beradi.
const TaxpayerCreateModal = ({ close }) => {
  const { mutate, isPending } = useCreateTaxpayerMutation();
  const { stir, jshshir, type, fullName, region, phone, setField, state } =
    useObjectState({
      stir: "",
      jshshir: "",
      type: "jismoniy",
      fullName: "",
      region: "toshkent_shahri",
      phone: "",
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!stir || !fullName || !region) return;
    const body = { ...state };
    if (!body.jshshir) delete body.jshshir;
    mutate(body, { onSuccess: () => close?.() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <InputField
        required
        label="STIR (9 raqam)"
        name="stir"
        value={stir}
        maxLength={9}
        placeholder="301234567"
        onChange={(e) => setField("stir", e.target.value.replace(/\D/g, ""))}
      />
      <SelectField
        label="Turi"
        name="type"
        value={type}
        options={typeSelectOptions}
        onChange={(v) => setField("type", v)}
      />
      <InputField
        required
        label="F.I.Sh / Tashkilot nomi"
        name="fullName"
        value={fullName}
        placeholder="Karimov Akmal"
        onChange={(e) => setField("fullName", e.target.value)}
      />
      {type !== "yuridik" && (
        <InputField
          label="JSHSHIR (14 raqam)"
          name="jshshir"
          value={jshshir}
          maxLength={14}
          placeholder="30101990010011"
          onChange={(e) => setField("jshshir", e.target.value.replace(/\D/g, ""))}
        />
      )}
      <SelectField
        required
        label="Viloyat"
        name="region"
        value={region}
        options={regionSelectOptions}
        onChange={(v) => setField("region", v)}
      />
      <InputField
        label="Telefon"
        name="phone"
        value={phone}
        placeholder="+998901234567"
        onChange={(e) => setField("phone", e.target.value)}
      />

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close?.()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button className="flex-1" disabled={isPending}>
          Saqlash{isPending && "..."}
        </Button>
      </div>
    </form>
  );
};

export default TaxpayerCreateModal;
