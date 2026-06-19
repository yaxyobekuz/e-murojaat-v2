import useObjectState from "@/shared/hooks/useObjectState";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import { useUpdateAppeal } from "../hooks/useUpdateAppeal";
import { useOrganizations } from "../hooks/useOrganizations";
import { NEXT_STATUS_OPTIONS, APPEAL_RESULT_OPTIONS } from "../constants/murojaat.ui";

// Rendered inside ModalWrapper -> receives { close, appealId, currentStatus, organizationId }
const AppealActionModal = ({ close, appealId, currentStatus, organizationId }) => {
  const { state, setField } = useObjectState({
    status: "",
    organizationId: organizationId || "",
    reply: "",
    result: "",
    comment: "",
  });
  const { data: orgs } = useOrganizations();
  const mutation = useUpdateAppeal(appealId);

  const orgOptions = [
    { value: "", label: "Tanlanmagan" },
    ...(orgs || []).map((o) => ({ value: o._id, label: o.name })),
  ];

  const closing = state.status === "yopildi";

  const submit = () => {
    const body = {};
    if (state.status) body.status = state.status;
    if (state.comment) body.comment = state.comment;
    if (state.reply.trim()) body.reply = state.reply.trim();
    if (state.organizationId !== (organizationId || "")) {
      body.organizationId = state.organizationId || null;
    }
    if (state.result) body.result = state.result;
    if (closing && !state.result) return;
    if (!Object.keys(body).length) return;
    mutation.mutate(body, { onSuccess: () => close?.() });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Yangi holat</label>
        <Select
          value={state.status}
          onChange={(v) => setField("status", v)}
          placeholder="Holatni tanlang (ixtiyoriy)"
          options={NEXT_STATUS_OPTIONS.filter((o) => o.value !== currentStatus)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Tashkilotga yo'naltirish</label>
        <Select
          value={state.organizationId}
          onChange={(v) => setField("organizationId", v)}
          placeholder="Tashkilotni tanlang"
          options={orgOptions}
        />
      </div>

      {closing && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-700">Natija *</label>
          <Select
            value={state.result}
            onChange={(v) => setField("result", v)}
            placeholder="Natijani tanlang"
            options={APPEAL_RESULT_OPTIONS}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Rasmiy javob</label>
        <Input
          type="textarea"
          value={state.reply}
          onChange={(e) => setField("reply", e.target.value)}
          placeholder="Fuqaroga yuboriladigan javob (ixtiyoriy)"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Ichki izoh</label>
        <Input
          type="textarea"
          value={state.comment}
          onChange={(e) => setField("comment", e.target.value)}
          placeholder="Operator izohi (ixtiyoriy)"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={() => close?.()}>
          Bekor qilish
        </Button>
        <Button onClick={submit} disabled={mutation.isPending || (closing && !state.result)}>
          {mutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>
    </div>
  );
};

export default AppealActionModal;
