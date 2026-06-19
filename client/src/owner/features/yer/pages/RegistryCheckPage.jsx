import { Search, MapPin } from "lucide-react";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useCheckRegistry } from "../hooks/useCheckRegistry";
import StatusBadge from "../components/StatusBadge";
import {
  PROPERTY_TYPE_LABELS,
  OWNERSHIP_TYPE_LABELS,
} from "../constants/yer.ui";

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

  const p = check.data;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Reyestrdan ko'chirma</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Kadastr raqamini kiriting va mulk holatini tekshiring
      </p>

      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setField("value", e.target.value)}
          placeholder="10:01:01:01:0001"
          className="flex-1"
        />
        <Button type="submit" disabled={check.isPending}>
          <Search className="size-4" /> Tekshirish
        </Button>
      </form>

      {check.isError && (
        <div className="mt-4 rounded-[2px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {check.error?.response?.data?.message || "Obyekt topilmadi"}
        </div>
      )}

      {p && (
        <Card className="mt-4">
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="size-4 text-emerald-600" />
            <h3 className="font-semibold">{PROPERTY_TYPE_LABELS[p.type] || p.type}</h3>
            <StatusBadge status={p.status} kind="property" />
          </div>
          <div className="divide-y">
            <Row label="Kadastr raqami" value={p.cadastreNumber} />
            <Row label="Manzil" value={`${p.region}, ${p.district}`} />
            <Row label="Maydon" value={`${p.areaM2} m²`} />
            <Row label="Qiymat" value={formatMoney(p.valueUzs)} />
            <Row label="Egalik turi" value={OWNERSHIP_TYPE_LABELS[p.ownershipType] || p.ownershipType} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default RegistryCheckPage;
