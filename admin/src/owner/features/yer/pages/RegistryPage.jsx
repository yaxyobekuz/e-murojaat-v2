import useObjectState from "@/shared/hooks/useObjectState";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useProperties } from "../hooks/useProperties";
import YerFilterBar from "../components/YerFilterBar";
import PropertyTable from "../components/PropertyTable";
import YerNav from "../components/YerNav";
import {
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_STATUS_LABELS,
} from "../constants/yer.ui";

const STATUS_OPTIONS = Object.entries(PROPERTY_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const RegistryPage = () => {
  const { state, setFields } = useObjectState({
    search: "",
    region: "",
    type: "",
    status: "",
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useProperties(state);
  const meta = data?.meta;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Reyestr boshqaruvi</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Ko'chmas mulk obyektlari — {meta?.total ?? 0} ta
        </p>
      </div>

      <YerNav />

      <div className="mb-4">
        <YerFilterBar
          value={state}
          onChange={setFields}
          filters={[
            "region",
            { key: "type", placeholder: "Tur", allLabel: "Barcha turlar", options: PROPERTY_TYPE_OPTIONS },
            { key: "status", placeholder: "Holat", allLabel: "Barcha holatlar", options: STATUS_OPTIONS },
          ]}
        />
      </div>

      {isLoading && !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : (
        <PropertyTable items={data?.items || []} />
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

export default RegistryPage;
