import { Search, Gauge } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useCheckRegistry } from "../hooks/useGazMutations";
import StatusBadge from "../components/StatusBadge";
import { METER_TYPE_LABELS } from "../constants/gaz.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2.5 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const RegistryCheckPage = () => {
  const { value, setField } = useObjectState({ value: "" });
  const check = useCheckRegistry();

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) check.mutate(value.trim());
  };

  const s = check.data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Abonentni tekshirish</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Shaxsiy hisob raqamini kiriting va abonent holatini tekshiring
      </p>

      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setField("value", e.target.value)}
          placeholder="1234567890"
          className="flex-1"
        />
        <Button type="submit" disabled={check.isPending}>
          <Search className="size-4" /> Tekshirish
        </Button>
      </form>

      {check.isError && (
        <div className="mt-4 rounded-[2px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {check.error?.response?.data?.message || "Abonent topilmadi"}
        </div>
      )}

      {s && (
        <Card className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <Gauge className="size-4 text-blue-600" />
            <h3 className="font-semibold">{s.fullName}</h3>
            <StatusBadge status={s.status} kind="subscriber" />
          </div>
          <div className="divide-y">
            <Row label="Hisob raqami" value={s.accountNumber} />
            <Row label="Manzil" value={`${s.region}, ${s.district}`} />
            <Row label="Qarzdorlik" value={s.debtUzs ? formatMoney(s.debtUzs) : "0 so'm"} />
            {s.meterId && (
              <Row label="Hisoblagich" value={METER_TYPE_LABELS[s.meterId.type] || s.meterId.type} />
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistryCheckPage;
