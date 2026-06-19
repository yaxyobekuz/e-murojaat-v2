import Card from "@/shared/components/ui/card/Card";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useMyUsage } from "../hooks/useGazAccount";
import { GAZ_ACCENT } from "../constants/gaz.ui";

const UsagePage = () => {
  const { data, isLoading } = useMyUsage();
  const rows = data || [];
  const totalYear = rows.reduce((sum, r) => sum + (r.value || 0), 0);
  const lastMonth = rows[rows.length - 1];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Sarf monitoringi</h1>
      <p className="mb-5 text-sm text-zinc-500">So'nggi 12 oydagi gaz iste'moli (m³)</p>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Yuklanmoqda...</p>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Card>
              <p className="mb-1 text-xs text-zinc-500">Yillik sarf</p>
              <p className="text-2xl font-semibold tabular-nums">{totalYear} m³</p>
            </Card>
            <Card>
              <p className="mb-1 text-xs text-zinc-500">Oxirgi oy ({lastMonth?.month})</p>
              <p className="text-2xl font-semibold tabular-nums">
                {lastMonth?.value || 0} m³
              </p>
              {lastMonth?.amountUzs ? (
                <p className="mt-0.5 text-xs text-zinc-400">{formatMoney(lastMonth.amountUzs)}</p>
              ) : null}
            </Card>
          </div>

          <Card title="Oylik sarf grafigi">
            <div className="pt-3">
              <TrendChart data={rows} color={GAZ_ACCENT} unit="m³" />
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default UsagePage;
