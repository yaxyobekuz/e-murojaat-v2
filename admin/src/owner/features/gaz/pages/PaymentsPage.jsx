import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { formatMoney } from "@/shared/utils/formatMoney";
import { usePayments } from "../hooks/usePayments";
import GazFilterBar from "../components/GazFilterBar";
import PaymentTable from "../components/PaymentTable";
import GazNav from "../components/GazNav";
import { PAYMENT_METHOD_LABELS } from "../constants/gaz.ui";

const METHOD_OPTIONS = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const PaymentsPage = () => {
  const { state, setFields } = useObjectState({ method: "", page: 1, limit: 20 });
  const { data, isLoading } = usePayments(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">To'lovlar</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Jami {meta?.total ?? 0} ta to'lov
          {meta?.totalAmount ? ` — ${formatMoney(meta.totalAmount)}` : ""}
        </p>
      </div>

      <GazNav />

      <div className="mb-4">
        <GazFilterBar
          value={state}
          onChange={setFields}
          searchable={false}
          filters={[
            { key: "method", placeholder: "To'lov usuli", allLabel: "Barcha usullar", options: METHOD_OPTIONS },
          ]}
        />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <PaymentTable items={data?.items || []} />
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

export default PaymentsPage;
