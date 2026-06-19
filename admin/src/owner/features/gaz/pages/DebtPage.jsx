import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { formatMoney } from "@/shared/utils/formatMoney";
import { useDebtors } from "../hooks/usePayments";
import GazFilterBar from "../components/GazFilterBar";
import SubscriberTable from "../components/SubscriberTable";
import GazNav from "../components/GazNav";

const DebtPage = () => {
  const { state, setFields } = useObjectState({ region: "", page: 1, limit: 20 });
  const { data, isLoading } = useDebtors(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Qarzdorlik</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Qarzdor abonentlar — {meta?.total ?? 0} ta
          {meta?.totalDebt ? ` — umumiy qarz ${formatMoney(meta.totalDebt)}` : ""}
        </p>
      </div>

      <GazNav />

      <div className="mb-4">
        <GazFilterBar value={state} onChange={setFields} searchable={false} filters={["region"]} />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <SubscriberTable items={data?.items || []} />
      )}

      {meta && meta.pages > 1 && (
        <div className="mt-5 flex justify-center">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.pages}
            hasNextPage={meta.page < meta.pages}
            hasPrevPage={meta.page > 1}
            onPageChange={(page) => setFields({ page })}
          />
        </div>
      )}
    </div>
  );
};

export default DebtPage;
