import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import { formatMoney } from "@/shared/utils/formatMoney";
import { METHOD_LABELS, taxTypeLabel } from "../utils/soliq.constants";
import { usePayMutation } from "../hooks/useSoliqMutations";

const methodOptions = Object.entries(METHOD_LABELS).map(([value, label]) => ({ label, value }));

// ModalWrapper `assessment` (data) va `close` ni props orqali beradi.
const PayModal = ({ assessment, close }) => {
  const owed = assessment
    ? assessment.amount_uzs + assessment.penya_uzs - assessment.paidAmount_uzs
    : 0;
  const { mutate, isPending } = usePayMutation();
  const { amount_uzs, method, setField } = useObjectState({
    amount_uzs: owed,
    method: "click",
  });

  if (!assessment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount_uzs || amount_uzs <= 0) return;
    mutate(
      { id: assessment._id, body: { amount_uzs: Number(amount_uzs), method } },
      { onSuccess: () => close?.() },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="rounded-[2px] bg-zinc-50 border p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-zinc-500">Soliq turi</span>
          <span className="font-medium">{taxTypeLabel(assessment.taxType)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">To'lanishi kerak</span>
          <span className="font-semibold text-rose-600">{formatMoney(owed)}</span>
        </div>
      </div>

      <InputField
        required
        type="number"
        label="To'lov summasi (so'm)"
        name="amount_uzs"
        value={amount_uzs}
        onChange={(e) => setField("amount_uzs", e.target.value)}
      />
      <SelectField
        label="To'lov usuli"
        name="method"
        value={method}
        options={methodOptions}
        onChange={(v) => setField("method", v)}
      />

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" className="flex-1" onClick={() => close?.()} disabled={isPending}>
          Bekor qilish
        </Button>
        <Button className="flex-1" disabled={isPending}>
          To'lash{isPending && "..."}
        </Button>
      </div>
    </form>
  );
};

export default PayModal;
