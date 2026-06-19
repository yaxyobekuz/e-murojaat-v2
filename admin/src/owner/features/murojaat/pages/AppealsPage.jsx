import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useAppeals } from "../hooks/useAppeals";
import MurojaatFilterBar from "../components/MurojaatFilterBar";
import AppealTable from "../components/AppealTable";
import MurojaatNav from "../components/MurojaatNav";
import {
  APPEAL_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  APPEAL_STATUS_OPTIONS,
} from "../constants/murojaat.ui";

const OVERDUE_OPTIONS = [{ value: "true", label: "Faqat muddati o'tgan" }];

const AppealsPage = () => {
  const { state, setFields } = useObjectState({
    search: "",
    region: "",
    type: "",
    category: "",
    status: "",
    overdue: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useAppeals(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Murojaatlar navbati</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kelgan murojaatlar — {meta?.total ?? 0} ta
        </p>
      </div>

      <MurojaatNav />

      <div className="mb-4">
        <MurojaatFilterBar
          value={state}
          onChange={setFields}
          filters={[
            "region",
            { key: "type", placeholder: "Tur", allLabel: "Barcha turlar", options: APPEAL_TYPE_OPTIONS },
            { key: "category", placeholder: "Soha", allLabel: "Barcha sohalar", options: CATEGORY_OPTIONS },
            { key: "status", placeholder: "Holat", allLabel: "Barcha holatlar", options: APPEAL_STATUS_OPTIONS },
            { key: "overdue", placeholder: "Muddat", allLabel: "Barchasi", options: OVERDUE_OPTIONS },
          ]}
        />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <AppealTable items={data?.items || []} />
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

export default AppealsPage;
