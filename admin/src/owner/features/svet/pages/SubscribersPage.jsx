import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useSubscribers } from "../hooks/useSubscribers";
import SvetFilterBar from "../components/SvetFilterBar";
import SubscriberTable from "../components/SubscriberTable";
import SvetNav from "../components/SvetNav";
import {
  SUBSCRIBER_TYPE_OPTIONS,
  SUBSCRIBER_STATUS_OPTIONS,
} from "../constants/svet.ui";

const SubscribersPage = () => {
  const { state, setFields } = useObjectState({
    search: "",
    region: "",
    type: "",
    status: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useSubscribers(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Abonentlar reyestri</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Elektr abonentlari — {meta?.total ?? 0} ta
        </p>
      </div>

      <SvetNav />

      <div className="mb-4">
        <SvetFilterBar
          value={state}
          onChange={setFields}
          filters={[
            "region",
            { key: "type", placeholder: "Tur", allLabel: "Barcha turlar", options: SUBSCRIBER_TYPE_OPTIONS },
            { key: "status", placeholder: "Holat", allLabel: "Barcha holatlar", options: SUBSCRIBER_STATUS_OPTIONS },
          ]}
        />
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

export default SubscribersPage;
