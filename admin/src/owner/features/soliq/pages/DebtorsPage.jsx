import { useNavigate } from "react-router-dom";

import useObjectState from "@/shared/hooks/useObjectState";
import DataTable from "@/shared/components/ui/table/DataTable";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import { formatMoney } from "@/shared/utils/formatMoney";
import { regionLabel } from "@/shared/data/regions";

import SoliqFilterBar from "../components/SoliqFilterBar";
import { useDebtorsQuery } from "../hooks/useSoliqQueries";
import { taxTypeLabel, statusLabel, STATUS_TONE } from "../utils/soliq.constants";

const DebtorsPage = () => {
  const navigate = useNavigate();
  const { region, page, setField, setFields } = useObjectState({ region: "", page: 1 });

  const { data, isLoading } = useDebtorsQuery({ region, page, limit: 20 });
  const rows = data?.items || [];
  const meta = data?.meta || { pages: 1 };

  const columns = [
    {
      key: "taxpayer",
      header: "F.I.Sh / Tashkilot",
      render: (r) => <span className="font-medium">{r.taxpayer?.fullName || "—"}</span>,
    },
    { key: "stir", header: "STIR", render: (r) => r.taxpayer?.stir || "—" },
    { key: "region", header: "Viloyat", render: (r) => regionLabel(r.region) },
    { key: "taxType", header: "Soliq turi", render: (r) => taxTypeLabel(r.taxType) },
    { key: "penya_uzs", header: "Penya", align: "right", render: (r) => formatMoney(r.penya_uzs) },
    {
      key: "debt",
      header: "Qarz",
      align: "right",
      render: (r) => <span className="font-semibold text-rose-600">{formatMoney(r.debt_uzs)}</span>,
    },
    {
      key: "status",
      header: "Holat",
      render: (r) => <StatusBadge tone={STATUS_TONE[r.status]}>{statusLabel(r.status)}</StatusBadge>,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Qarzdorlik</h1>
        <p className="text-sm text-muted-foreground">
          Qarzdor hisob-kitoblar (penya bo'yicha tartiblangan)
        </p>
      </div>

      <SoliqFilterBar
        filters={{ region }}
        setField={(k, v) => setFields({ [k]: v, page: 1 })}
        show={["region"]}
      />

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        onRowClick={(r) => r.taxpayer?._id && navigate(`/owner/soliq/taxpayers/${r.taxpayer._id}`)}
        emptyText="Qarzdorlik topilmadi"
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

export default DebtorsPage;
