import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useRequests } from "../hooks/useRequests";
import SvetFilterBar from "../components/SvetFilterBar";
import RequestTable from "../components/RequestTable";
import SvetNav from "../components/SvetNav";
import {
  REQUEST_STATUS_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "../constants/svet.ui";

const RequestsPage = () => {
  const { state, setFields } = useObjectState({
    search: "",
    region: "",
    status: "",
    serviceType: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useRequests(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Elektr xizmat arizalari</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelgan elektr arizalari — {meta?.total ?? 0} ta
        </p>
      </div>

      <SvetNav />

      <div className="mb-4">
        <SvetFilterBar
          value={state}
          onChange={setFields}
          filters={[
            "region",
            { key: "status", placeholder: "Holat", allLabel: "Barcha holatlar", options: REQUEST_STATUS_OPTIONS },
            { key: "serviceType", placeholder: "Xizmat turi", allLabel: "Barcha xizmatlar", options: SERVICE_TYPE_OPTIONS },
          ]}
        />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <RequestTable items={data?.items || []} />
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

export default RequestsPage;
