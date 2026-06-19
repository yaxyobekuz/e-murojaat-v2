import { useNavigate } from "react-router-dom";
import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useMyAccount } from "../hooks/useGazAccount";
import { useCreatePayment } from "../hooks/useGazMutations";
import { PAYMENT_METHOD_OPTIONS } from "../constants/gaz.ui";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { data } = useMyAccount();
  const pay = useCreatePayment();
  const debt = data?.subscriber?.debtUzs || 0;

  const { amount, method, setField } = useObjectState({
    amount: "",
    method: "click",
  });

  const submit = () => {
    const value = Number(amount);
    if (!value || value <= 0) return;
    pay.mutate(
      { amount: value, method },
      { onSuccess: () => navigate("/owner/gaz/hisobim") },
    );
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">To'lov qilish</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Hisobni to'ldiring yoki qarzdorlikni yoping (demo to'lov)
      </p>

      {debt > 0 && (
        <div className="mb-4 rounded-[2px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Joriy qarzdorlik: <b>{formatMoney(debt)}</b>
        </div>
      )}

      <Card>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Summa (so'm)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setField("amount", e.target.value)}
              placeholder={debt > 0 ? String(debt) : "100000"}
            />
            {debt > 0 && (
              <button
                type="button"
                onClick={() => setField("amount", String(debt))}
                className="text-xs text-blue-600 hover:underline"
              >
                Qarzdorlik summasini qo'yish
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">To'lov usuli</label>
            <Select
              value={method}
              onChange={(v) => setField("method", v)}
              placeholder="Usulni tanlang"
              options={PAYMENT_METHOD_OPTIONS}
            />
          </div>

          <Button
            onClick={submit}
            disabled={!amount || pay.isPending}
            className="w-full"
          >
            {pay.isPending ? "To'lanmoqda..." : "To'lash"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PaymentPage;
