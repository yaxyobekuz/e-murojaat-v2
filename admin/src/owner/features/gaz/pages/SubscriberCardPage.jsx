import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useSubscriber } from "../hooks/useSubscribers";
import StatusBadge from "../components/StatusBadge";
import PaymentTable from "../components/PaymentTable";
import {
  SUBSCRIBER_TYPE_LABELS,
  METER_TYPE_LABELS,
  GAZ_ACCENT,
} from "../constants/gaz.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const SubscriberCardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSubscriber(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }
  if (!data?.subscriber) {
    return <div className="p-6 text-sm text-zinc-400">Abonent topilmadi</div>;
  }

  const { subscriber: s, usage, payments } = data;
  const meter = s.meterId;

  // Daily usage -> chart points (oldest first)
  const usageChart = [...(usage || [])]
    .reverse()
    .map((u) => ({ month: formatDateUz(u.date), value: u.volumeM3 }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-4" /> Orqaga
      </button>

      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight tabular-nums">
          {s.accountNumber}
        </h1>
        <StatusBadge status={s.status} kind="subscriber" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Abonent ma'lumotlari">
          <div className="divide-y">
            <Row label="Abonent" value={s.fullName} />
            <Row label="Turi" value={SUBSCRIBER_TYPE_LABELS[s.type] || s.type} />
            <Row label="Viloyat" value={s.region} />
            <Row label="Manzil" value={`${s.district}, ${s.address}`} />
            <Row label="Balans" value={formatMoney(s.balanceUzs)} />
            <Row
              label="Qarzdorlik"
              value={
                s.debtUzs ? (
                  <span className="text-rose-600">{formatMoney(s.debtUzs)}</span>
                ) : (
                  "—"
                )
              }
            />
          </div>
        </Card>

        <Card title="Hisoblagich">
          {meter ? (
            <div className="divide-y">
              <Row label="Seriya raqami" value={meter.serialNumber} />
              <Row label="Turi" value={METER_TYPE_LABELS[meter.type] || meter.type} />
              <Row label="O'rnatilgan" value={formatDateUz(meter.installedAt)} />
              <Row label="Oxirgi qiyoslash" value={formatDateUz(meter.lastCalibration)} />
              <Row label="Qiyoslash muddati" value={formatDateUz(meter.calibrationDue)} />
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Hisoblagich biriktirilmagan</p>
          )}
        </Card>
      </div>

      <Card title="Oxirgi 30 kunlik sarf (m³)" className="mt-5">
        <div className="pt-3">
          <TrendChart data={usageChart} color={GAZ_ACCENT} unit="m³" height={220} />
        </div>
      </Card>

      <Card title="So'nggi to'lovlar" className="mt-5">
        <div className="pt-3">
          <PaymentTable
            items={(payments || []).map((p) => ({ ...p, subscriberId: s }))}
          />
        </div>
      </Card>
    </div>
  );
};

export default SubscriberCardPage;
