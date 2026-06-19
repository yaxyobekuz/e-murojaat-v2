import { Link } from "react-router-dom";
import { Flame, Wallet, CreditCard, Gauge, LineChart } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyAccount } from "../hooks/useGazAccount";
import StatusBadge from "../components/StatusBadge";
import { METER_TYPE_LABELS } from "../constants/gaz.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2.5 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const MyAccountPage = () => {
  const { data, isLoading } = useMyAccount();

  if (isLoading) {
    return <p className="mx-auto max-w-2xl px-4 py-6 text-sm text-zinc-400">Yuklanmoqda...</p>;
  }
  if (!data?.subscriber) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Sizga biriktirilgan gaz hisobi topilmadi
        </div>
      </div>
    );
  }

  const { subscriber: s, tariff } = data;
  const meter = s.meterId;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mening gaz hisobim</h1>
          <p className="mt-1 text-sm text-zinc-500">{s.fullName}</p>
        </div>
        <StatusBadge status={s.status} kind="subscriber" />
      </div>

      {/* Balance / debt highlight */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <Wallet className="size-4" /> Balans
          </div>
          <p className="text-2xl font-semibold tabular-nums text-emerald-600">
            {formatMoney(s.balanceUzs)}
          </p>
        </Card>
        <Card>
          <div className="mb-1 flex items-center gap-1.5 text-xs text-zinc-500">
            <Flame className="size-4" /> Qarzdorlik
          </div>
          <p className="text-2xl font-semibold tabular-nums text-rose-600">
            {s.debtUzs ? formatMoney(s.debtUzs) : "0 so'm"}
          </p>
        </Card>
      </div>

      <div className="mb-4 flex gap-2">
        <Link to="/owner/gaz/tolov" className="flex-1">
          <Button className="w-full">
            <CreditCard className="size-4" /> To'lov qilish
          </Button>
        </Link>
        <Link to="/owner/gaz/sarf" className="flex-1">
          <Button variant="secondary" className="w-full">
            <LineChart className="size-4" /> Sarf monitoringi
          </Button>
        </Link>
      </div>

      <Card title="Hisob ma'lumotlari">
        <div className="divide-y">
          <Row label="Shaxsiy hisob raqami" value={s.accountNumber} />
          <Row label="Viloyat" value={s.region} />
          <Row label="Manzil" value={`${s.district}, ${s.address}`} />
          {tariff && <Row label="Joriy tarif" value={`${formatMoney(tariff.pricePerM3)} / m³`} />}
        </div>
      </Card>

      {meter && (
        <Card title="Hisoblagich" className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
            <Gauge className="size-4" /> {METER_TYPE_LABELS[meter.type] || meter.type}
          </div>
          <div className="divide-y">
            <Row label="Seriya raqami" value={meter.serialNumber} />
            <Row label="O'rnatilgan" value={formatDateUz(meter.installedAt)} />
            <Row label="Qiyoslash muddati" value={formatDateUz(meter.calibrationDue)} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyAccountPage;
