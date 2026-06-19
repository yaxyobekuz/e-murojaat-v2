import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import { useUpdateRequestStatus } from "../hooks/useUpdateRequestStatus";
import { NEXT_STATUS_OPTIONS } from "../constants/yer.ui";

// Rendered inside ModalWrapper -> receives { close, requestId, currentStatus }
const UpdateStatusModal = ({ close, requestId, currentStatus }) => {
  const { status, comment, invoiceAmount, setField } = useObjectState({
    status: "",
    comment: "",
    invoiceAmount: "",
  });
  const mutation = useUpdateRequestStatus(requestId);

  const submit = () => {
    if (!status) return;
    const body = { status, comment: comment || undefined };
    if (status === "tolov" && invoiceAmount) {
      body.invoiceAmount = Number(invoiceAmount);
    }
    if (status === "bajarildi") body.paid = true;
    mutation.mutate(body, { onSuccess: () => close?.() });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Yangi holat</label>
        <Select
          value={status}
          onChange={(v) => setField("status", v)}
          placeholder="Holatni tanlang"
          options={NEXT_STATUS_OPTIONS.filter((o) => o.value !== currentStatus)}
        />
      </div>

      {status === "tolov" && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700">Invoys summasi (so'm)</label>
          <Input
            type="number"
            value={invoiceAmount}
            onChange={(e) => setField("invoiceAmount", e.target.value)}
            placeholder="450000"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Izoh</label>
        <Input
          type="textarea"
          value={comment}
          onChange={(e) => setField("comment", e.target.value)}
          placeholder="Operator izohi (ixtiyoriy)"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={() => close?.()}>
          Bekor qilish
        </Button>
        <Button onClick={submit} disabled={!status || mutation.isPending}>
          {mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
