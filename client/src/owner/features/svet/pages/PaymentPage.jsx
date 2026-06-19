import { cn } from "@/shared/utils/cn";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyAccount } from "../hooks/useMyAccount";
import { useCreatePayment } from "../hooks/useCreatePayment";
import {
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_METHOD_LABELS,
} from "../constants/svet.ui";

const QUICK_AMOUNTS = [50000, 100000, 200000];

const PaymentPage = () => {
  const { data, isLoading } = useMyAccount();
  const pay = useCreatePayment();
  const { amountUzs, method, setField } = useObjectState({
    amountUzs: "",
    method: "click",
  });

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-5 text-xl font-semibold tracking-tight">To'lov qilish</h1>
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Hisob topilmadi
        </div>
      </div>
    );
  }

  const { subscriber: s, payments = [] } = data;
  const amount = Number(amountUzs) || 0;

  const submit = () => {
    if (amount < 1000) return;
    pay.mutate(
      { amountUzs: amount, method },
      { onSuccess: () => setField("amountUzs", "") },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-semibold tracking-tight">To'lov qilish</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-zinc-500">Joriy balans</p>
          <p className="mt-1 text-lg font-semibold tabular-nums">{formatMoney(s.balanceUzs)}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Qarzdorlik</p>
          <p
            className={cn(
              "mt-1 text-lg font-semibold tabular-nums",
              s.debtUzs > 0 ? "text-rose-600" : "text-zinc-900",
            )}
          >
            {formatMoney(s.debtUzs)}
          </p>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">To'lov summasi</label>
            <Input
              type="number"
              min="0"
              value={amountUzs}
              onChange={(e) => setField("amountUzs", e.target.value)}
              placeholder="0"
            />
            <div className="flex gap-2 pt-1">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => setField("amountUzs", String(q))}
                  className="rounded-[2px] border px-3 py-1.5 text-xs tabular-nums text-zinc-600 hover:border-amber-300 hover:text-amber-700"
                >
                  {q.toLocaleString("uz-UZ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">To'lov usuli</label>
            <Select
              value={method}
              onChange={(v) => setField("method", v)}
              options={PAYMENT_METHOD_OPTIONS}
            />
          </div>

          <Button
            onClick={submit}
            disabled={pay.isPending || amount < 1000}
            className="w-full"
          >
            {pay.isPending ? "Yuborilmoqda..." : "To'lash"}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-semibold">To'lovlar tarixi</h3>
        {!payments.length ? (
          <p className="text-sm text-zinc-400">To'lovlar yo'q</p>
        ) : (
          <div className="divide-y">
            {payments.map((p, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div>
                  <p className="font-medium tabular-nums text-zinc-900">{formatMoney(p.amountUzs)}</p>
                  <p className="text-xs text-zinc-400">{PAYMENT_METHOD_LABELS[p.method] || p.method}</p>
                </div>
                <time className="text-xs text-zinc-400">{formatDateUz(p.paidAt)}</time>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentPage;
