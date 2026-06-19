import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import Button from "@/shared/components/ui/button/Button";
import DataTable from "@/shared/components/ui/table/DataTable";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import SelectField from "@/shared/components/ui/select/SelectField";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { MODAL } from "@/shared/constants/modals";
import { regionLabel } from "@/shared/data/regions";

import SoliqFilterBar from "../components/SoliqFilterBar";
import TaxpayerCreateModal from "../components/TaxpayerCreateModal";
import { useTaxpayersQuery } from "../hooks/useSoliqQueries";
import { taxpayerTypeLabel, taxpayerTypeOptions } from "../utils/soliq.constants";

const TaxpayersListPage = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { region, type, search, page, setField, setFields } = useObjectState({
    region: "",
    type: "",
    search: "",
    page: 1,
  });

  const params = { region, type, search, page, limit: 20 };
  const { data, isLoading } = useTaxpayersQuery(params);
  const rows = data?.items || [];
  const meta = data?.meta || { pages: 1 };

  const onFilter = (key, value) => setFields({ [key]: value, page: 1 });

  const columns = [
    { key: "fullName", header: "F.I.Sh / Tashkilot", render: (r) => <span className="font-medium">{r.fullName}</span> },
    { key: "stir", header: "STIR" },
    { key: "type", header: "Turi", render: (r) => taxpayerTypeLabel(r.type) },
    { key: "region", header: "Viloyat", render: (r) => regionLabel(r.region) },
    { key: "phone", header: "Telefon", render: (r) => r.phone || "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Soliq to'lovchilar</h1>
          <p className="text-sm text-muted-foreground">Jami: {meta.total ?? "—"}</p>
        </div>
        <Button onClick={() => openModal(MODAL.SOLIQ_TAXPAYER_CREATE)}>
          <Plus className="size-4" /> Qo'shish
        </Button>
      </div>

      <SoliqFilterBar
        filters={{ region, search }}
        setField={onFilter}
        show={["region", "search"]}
      >
        <SelectField
          label="Turi"
          name="type"
          className="min-w-[160px]"
          value={type}
          options={taxpayerTypeOptions}
          onChange={(v) => onFilter("type", v)}
        />
      </SoliqFilterBar>

      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        onRowClick={(r) => navigate(`/owner/soliq/taxpayers/${r._id}`)}
        emptyText="Soliq to'lovchi topilmadi"
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

      <ModalWrapper name={MODAL.SOLIQ_TAXPAYER_CREATE} title="Soliq to'lovchi qo'shish">
        <TaxpayerCreateModal />
      </ModalWrapper>
    </div>
  );
};

export default TaxpayersListPage;
