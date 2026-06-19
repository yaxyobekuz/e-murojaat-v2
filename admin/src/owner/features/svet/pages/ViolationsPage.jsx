import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useViolations } from "../hooks/useViolations";
import SvetFilterBar from "../components/SvetFilterBar";
import ViolationTable from "../components/ViolationTable";
import SvetNav from "../components/SvetNav";
import {
  VIOLATION_TYPE_OPTIONS,
  VIOLATION_STATUS_OPTIONS,
} from "../constants/svet.ui";

const ViolationsPage = () => {
  const { state, setFields } = useObjectState({
    search: "",
    region: "",
    type: "",
    status: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useViolations(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          E-dalolatnoma — qoidabuzarliklar
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Elektr qoidabuzarliklari — {meta?.total ?? 0} ta
        </p>
      </div>

      <SvetNav />

      <div className="mb-4">
        <SvetFilterBar
          value={state}
          onChange={setFields}
          filters={[
            "region",
            { key: "type", placeholder: "Turi", allLabel: "Barcha turlar", options: VIOLATION_TYPE_OPTIONS },
            { key: "status", placeholder: "Holat", allLabel: "Barcha holatlar", options: VIOLATION_STATUS_OPTIONS },
          ]}
        />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <ViolationTable items={data?.items || []} />
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

export default ViolationsPage;
