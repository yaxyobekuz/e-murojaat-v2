import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Input from "@/shared/components/ui/input/Input";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useMyAccount } from "../hooks/useMyAccount";
import { SVET_ACCENT } from "../constants/svet.ui";

const Row = ({ label, value, strong }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
  </div>
);

const Calculator = ({ tariff, norm }) => {
  const { kwh, setField } = useObjectState({ kwh: "" });
  const n = Number(kwh) || 0;
  const within = Math.min(n, norm);
  const over = Math.max(0, n - norm);
  const total = within * tariff.socialPricePerKwh + over * tariff.pricePerKwh;

  return (
    <Card>
      <h3 className="mb-3 font-semibold">Tarif kalkulyatori</h3>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700">Sarf (kVt·soat)</label>
        <Input
          type="number"
          min="0"
          value={kwh}
          onChange={(e) => setField("kwh", e.target.value)}
          placeholder="Masalan: 250"
        />
      </div>
      <div className="mt-3 divide-y border-t pt-1">
        <Row label={`Norma ichida (${within} kVt·soat)`} value={formatMoney(within * tariff.socialPricePerKwh)} />
        <Row label={`Normadan ortiq (${over} kVt·soat)`} value={formatMoney(over * tariff.pricePerKwh)} />
        <Row label="Jami" value={formatMoney(total)} strong />
      </div>
    </Card>
  );
};

const UsagePage = () => {
  const { data, isLoading } = useMyAccount();

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="mb-5 text-xl font-semibold tracking-tight">Sarf monitoringi</h1>
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Sizga elektr hisobi biriktirilmagan
        </div>
      </div>
    );
  }

  const { subscriber: s, usage = [], tariff } = data;
  const chartData = usage.map((u) => {
    const d = new Date(u.date);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return { month: `${mm}.${d.getFullYear()}`, value: u.usageKwh };
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">Sarf monitoringi</h1>

      <Card>
        <h3 className="mb-2 font-semibold">Oylik sarf (12 oy)</h3>
        <TrendChart data={chartData} color={SVET_ACCENT} unit="kVt·soat" />
      </Card>

      <Calculator tariff={tariff} norm={s.socialNormKwh} />
    </div>
  );
};

export default UsagePage;
