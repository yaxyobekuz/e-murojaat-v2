import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useSubscriber } from "../hooks/useSubscribers";
import StatusBadge from "../components/StatusBadge";
import {
  SUBSCRIBER_TYPE_LABELS,
  METER_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  SVET_ACCENT,
} from "../constants/svet.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const monthLabel = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${mm}.${d.getFullYear()}`;
};

const SubscriberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSubscriber(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }
  if (!data?.subscriber) {
    return <div className="p-6 text-sm text-zinc-400">Abonent topilmadi</div>;
  }

  const { subscriber, usage = [], payments = [] } = data;
  const meter = subscriber.meter || {};
  const usageData = usage.map((u) => ({
    month: monthLabel(u.date),
    value: u.usageKwh,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-4" /> Orqaga
      </button>

      <div className="mb-5 flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          {subscriber.fullName}
        </h1>
        <StatusBadge status={subscriber.status} kind="subscriber" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Abonent ma'lumotlari">
          <div className="divide-y">
            <Row label="Hisob raqami" value={subscriber.accountNumber} />
            <Row label="JSHSHIR" value={subscriber.subscriberJshshir} />
            <Row
              label="Tur"
              value={SUBSCRIBER_TYPE_LABELS[subscriber.type] || subscriber.type}
            />
            <Row label="Hudud" value={`${subscriber.region}, ${subscriber.district}`} />
            <Row label="Manzil" value={subscriber.address} />
            <Row
              label="Ijtimoiy norma"
              value={`${subscriber.socialNormKwh} kVt·soat`}
            />
            <Row label="Balans" value={formatMoney(subscriber.balanceUzs)} />
            <Row label="Qarzdorlik" value={formatMoney(subscriber.debtUzs)} />
          </div>
        </Card>

        <Card title="Hisoblagich">
          <div className="divide-y">
            <Row label="Seriya raqami" value={meter.serialNumber || "-"} />
            <Row label="Turi" value={METER_TYPE_LABELS[meter.type] || meter.type || "-"} />
            <Row label="O'rnatilgan" value={formatDateUz(meter.installedAt)} />
            <Row label="Kalibrlash muddati" value={formatDateUz(meter.calibrationDue)} />
          </div>
        </Card>
      </div>

      <Card title="Oylik elektr sarfi" className="mt-5">
        <div className="pt-4">
          <TrendChart data={usageData} color={SVET_ACCENT} unit="kVt·soat" />
        </div>
      </Card>

      <Card title="So'nggi to'lovlar" className="mt-5">
        {payments.length ? (
          <div className="mt-4 overflow-x-auto rounded-[2px] border">
            <table className="w-full border-collapse">
              <thead className="border-b bg-zinc-50/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Summa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Usul</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p, i) => (
                  <tr key={i} className="hover:bg-zinc-50/60">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 tabular-nums">
                      {formatMoney(p.amountUzs)}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700">
                      {PAYMENT_METHOD_LABELS[p.method] || p.method}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700 tabular-nums">
                      {formatDateUz(p.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-400">To'lovlar yo'q</p>
        )}
      </Card>
    </div>
  );
};

export default SubscriberDetailPage;
