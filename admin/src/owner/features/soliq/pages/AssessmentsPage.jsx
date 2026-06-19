import { useNavigate } from "react-router-dom";

import useObjectState from "@/shared/hooks/useObjectState";
import DataTable from "@/shared/components/ui/table/DataTable";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import SelectField from "@/shared/components/ui/select/SelectField";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { regionLabel } from "@/shared/data/regions";

import SoliqFilterBar from "../components/SoliqFilterBar";
import { useAssessmentsQuery } from "../hooks/useSoliqQueries";
import {
  taxTypeLabel,
  statusLabel,
  STATUS_TONE,
  taxTypeOptions,
  statusOptions,
} from "../utils/soliq.constants";

const AssessmentsPage = () => {
  const navigate = useNavigate();
  const { region, taxType, status, page, setField, setFields } = useObjectState({
    region: "",
    taxType: "",
    status: "",
    page: 1,
  });

  const { data, isLoading } = useAssessmentsQuery({ region, taxType, status, page, limit: 20 });
  const rows = data?.items || [];
  const meta = data?.meta || { pages: 1 };
  const onFilter = (k, v) => setFields({ [k]: v, page: 1 });

  const columns = [
    {
      key: "taxpayer",
      header: "To'lovchi",
      render: (r) => <span className="font-medium">{r.taxpayer?.fullName || "—"}</span>,
    },
    { key: "taxType", header: "Soliq turi", render: (r) => taxTypeLabel(r.taxType) },
    { key: "region", header: "Viloyat", render: (r) => regionLabel(r.region) },
    { key: "amount_uzs", header: "Summa", align: "right", render: (r) => formatMoney(r.amount_uzs) },
    { key: "paidAmount_uzs", header: "To'langan", align: "right", render: (r) => formatMoney(r.paidAmount_uzs) },
    { key: "dueDate", header: "Muddat", render: (r) => formatDateUz(r.dueDate) },
    {
      key: "status",
      header: "Holat",
      render: (r) => <StatusBadge tone={STATUS_TONE[r.status]}>{statusLabel(r.status)}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Soliqlar (hisob-kitob)</h1>
        <p className="text-sm text-muted-foreground">Jami: {meta.total ?? "—"}</p>
      </div>

      <SoliqFilterBar filters={{ region }} setField={onFilter} show={["region"]}>
        <SelectField
          label="Soliq turi"
          name="taxType"
          className="min-w-[160px]"
          value={taxType}
          options={taxTypeOptions}
          onChange={(v) => onFilter("taxType", v)}
        />
        <SelectField
          label="Holat"
          name="status"
          className="min-w-[160px]"
          value={status}
          options={statusOptions}
          onChange={(v) => onFilter("status", v)}
        />
      </SoliqFilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        onRowClick={(r) => r.taxpayer?._id && navigate(`/owner/soliq/taxpayers/${r.taxpayer._id}`)}
        emptyText="Soliq topilmadi"
      />

      {meta.pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={meta.pages}
          hasPrevPage={page > 1}
          hasNextPage={page < meta.pages}
          onPageChange={(p) => setField("page", p)}
        />
      )}
    </div>
  );
};

export default AssessmentsPage;
