import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import useModal from "@/shared/hooks/useModal";
import useObjectState from "@/shared/hooks/useObjectState";
import { MODAL } from "@/shared/constants/modals";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import { useYerRequests } from "../hooks/useYerRequests";
import YerFilters from "../components/YerFilters";
import YerRequestStatusModal from "../components/modals/YerRequestStatusModal";
import {
  SERVICE_LABELS,
  REQUEST_STATUS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONE,
} from "../mock/yer.data";

const LIMIT = 12;

const statusFilterOptions = [
  { value: "", label: "Barcha holatlar" },
  ...REQUEST_STATUS.map((s) => ({ value: s, label: REQUEST_STATUS_LABELS[s] })),
];

const columns = [
  { key: "requestNumber", header: "Ariza raqami", render: (r) => <span className="font-medium">{r.requestNumber}</span> },
  { key: "serviceType", header: "Xizmat turi", render: (r) => SERVICE_LABELS[r.serviceType] },
  { key: "applicantName", header: "Arizachi" },
  { key: "region", header: "Viloyat" },
  { key: "invoiceAmount", header: "Summa", align: "right", render: (r) => (r.invoiceAmount ? formatMoney(r.invoiceAmount) : "—") },
  {
    key: "status",
    header: "Holati",
    render: (r) => (
      <GlassStatusBadge tone={REQUEST_STATUS_TONE[r.status]}>
        {REQUEST_STATUS_LABELS[r.status]}
      </GlassStatusBadge>
    ),
  },
  { key: "createdAt", header: "Sana", render: (r) => formatDateUz(r.createdAt) },
];

const YerRequestsPage = () => {
  const { openModal } = useModal();
  const { state, setField, setFields } = useObjectState({
    region: "",
    status: "",
    page: 1,
  });

  const { data, isFetching } = useYerRequests({ ...state, limit: LIMIT });
  const rows = data?.rows || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT) || 1;

  const onFilter = (key, value) => setFields({ [key]: value, page: 1 });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Arizalar navbati</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Jami {total.toLocaleString("uz-UZ")} ta ariza — qatorni bosib holatini boshqaring
          </p>
        </div>
        <YerFilters value={state} onChange={onFilter} statusOptions={statusFilterOptions} />
      </div>

      <GlassCard className="p-0">
        <div className="p-2">
          <DataTable
            variant="glass"
            columns={columns}
            rows={rows}
            isLoading={isFetching}
            getKey={(r) => r.id}
            onRowClick={(r) => openModal(MODAL.YER_REQUEST_STATUS, { request: r })}
          />
        </div>
      </GlassCard>

      <Pagination
        currentPage={state.page}
        totalPages={totalPages}
        onPageChange={(p) => setField("page", p)}
        hasNextPage={state.page < totalPages}
        hasPrevPage={state.page > 1}
      />

      <ModalWrapper
        name={MODAL.YER_REQUEST_STATUS}
        title="Ariza ustida ish"
        description="Holatni o'zgartiring yoki tarixni ko'ring"
      >
        <YerRequestStatusModal />
      </ModalWrapper>
    </div>
  );
};

export default YerRequestsPage;
