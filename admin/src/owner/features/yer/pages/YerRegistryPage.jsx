import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import useObjectState from "@/shared/hooks/useObjectState";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import InputSearch from "@/shared/components/ui/input/InputSearch";

import { useYerProperties } from "../hooks/useYerProperties";
import YerFilters from "../components/YerFilters";
import {
  TYPE_LABELS,
  OWNERSHIP_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_TONE,
} from "../mock/yer.data";

const LIMIT = 12;

const columns = [
  { key: "cadastreNumber", header: "Kadastr raqami", render: (r) => <span className="font-medium">{r.cadastreNumber}</span> },
  { key: "type", header: "Turi", render: (r) => TYPE_LABELS[r.type] },
  { key: "region", header: "Ko'cha", render: (r) => `${r.region} ko'chasi` },
  { key: "areaM2", header: "Maydon", align: "right", render: (r) => `${r.areaM2.toLocaleString("uz-UZ")} m²` },
  { key: "valueUzs", header: "Qiymati", align: "right", render: (r) => formatMoney(r.valueUzs) },
  { key: "ownershipType", header: "Egalik", render: (r) => OWNERSHIP_LABELS[r.ownershipType] },
  {
    key: "status",
    header: "Holati",
    render: (r) => (
      <GlassStatusBadge tone={PROPERTY_STATUS_TONE[r.status]}>
        {PROPERTY_STATUS_LABELS[r.status]}
      </GlassStatusBadge>
    ),
  },
  { key: "registeredAt", header: "Sana", render: (r) => formatDateUz(r.registeredAt) },
];

const YerRegistryPage = () => {
  const { state, setField, setFields } = useObjectState({
    region: "",
    type: "",
    search: "",
    page: 1,
  });

  const { data, isFetching } = useYerProperties({ ...state, limit: LIMIT });
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  const onFilter = (key, value) => setFields({ [key]: value, page: 1 });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mulklar reyestri</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Jami {total.toLocaleString("uz-UZ")} ta obyekt ro'yxatda
          </p>
        </div>
        <YerFilters value={state} onChange={onFilter}>
          <InputSearch
            value={state.search}
            onChange={(e) => onFilter("search", e.target.value)}
            placeholder="Kadastr, manzil..."
            className="h-10 w-56 rounded-full !bg-card/60"
          />
        </YerFilters>
      </div>

      <GlassCard className="p-0">
        <div className="p-2">
          <DataTable variant="glass" columns={columns} rows={rows} isLoading={isFetching} getKey={(r) => r.id} />
        </div>
      </GlassCard>

      <Pagination
        currentPage={state.page}
        totalPages={totalPages}
        onPageChange={(p) => setField("page", p)}
        hasNextPage={state.page < totalPages}
        hasPrevPage={state.page > 1}
      />
    </div>
  );
};

export default YerRegistryPage;
