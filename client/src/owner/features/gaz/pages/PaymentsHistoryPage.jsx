import { CreditCard } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyPayments } from "../hooks/useGazAccount";
import { PAYMENT_METHOD_LABELS } from "../constants/gaz.ui";

const PaymentsHistoryPage = () => {
  const { data: items, isLoading } = useMyPayments();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">To'lovlar tarixi</h1>
      <p className="mb-5 text-sm text-zinc-500">Amalga oshirilgan to'lovlar</p>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Yuklanmoqda...</p>
      ) : !items?.length ? (
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Hali to'lov qilinmagan
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((p) => (
            <Card key={p._id} className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <CreditCard className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold tabular-nums text-zinc-900">
                  {formatMoney(p.amountUzs)}
                </p>
                <p className="text-xs text-zinc-400">
                  {PAYMENT_METHOD_LABELS[p.method] || p.method} · {formatDateUz(p.paidAt)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsHistoryPage;
