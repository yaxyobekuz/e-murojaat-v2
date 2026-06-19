import { useParams } from "react-router-dom";

import useModal from "@/shared/hooks/useModal";
import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import BackLink from "@/shared/components/ui/link/BackLink";
import DataTable from "@/shared/components/ui/table/DataTable";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { Skeleton } from "@/shared/components/shadcn/skeleton";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { regionLabel } from "@/shared/data/regions";

import PayModal from "../components/PayModal";
import { useTaxpayerQuery } from "../hooks/useSoliqQueries";
import {
  taxTypeLabel,
  taxpayerTypeLabel,
  statusLabel,
  STATUS_TONE,
  methodLabel,
} from "../utils/soliq.constants";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-1.5 border-b last:border-0 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="font-medium text-zinc-800 text-right">{value}</span>
  </div>
);

const TaxpayerDetailPage = () => {
  const { id } = useParams();
  const { openModal } = useModal();
  const { data, isLoading } = useTaxpayerQuery(id);

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <BackLink to="/owner/soliq/taxpayers" label="Soliq to'lovchilar" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const { taxpayer, assessments, payments, debt_uzs } = data;

  const assessmentColumns = [
    { key: "taxType", header: "Soliq turi", render: (r) => taxTypeLabel(r.taxType) },
    { key: "year", header: "Yil" },
    { key: "amount_uzs", header: "Summa", align: "right", render: (r) => formatMoney(r.amount_uzs) },
    { key: "paidAmount_uzs", header: "To'langan", align: "right", render: (r) => formatMoney(r.paidAmount_uzs) },
    { key: "penya_uzs", header: "Penya", align: "right", render: (r) => formatMoney(r.penya_uzs) },
    {
      key: "status",
      header: "Holat",
      render: (r) => <StatusBadge tone={STATUS_TONE[r.status]}>{statusLabel(r.status)}</StatusBadge>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) =>
        r.status !== "tolandi" ? (
          <Button
            variant="outline"
            className="h-7 px-2 text-xs"
            onClick={() => openModal(MODAL.SOLIQ_PAY, { assessment: r })}
          >
            To'lash
          </Button>
        ) : null,
    },
  ];

  const paymentColumns = [
    { key: "paidAt", header: "Sana", render: (r) => formatDateUz(r.paidAt) },
    { key: "amount_uzs", header: "Summa", align: "right", render: (r) => formatMoney(r.amount_uzs) },
    { key: "method", header: "Usul", render: (r) => methodLabel(r.method) },
  ];

  return (
    <div className="space-y-4">
      <BackLink to="/owner/soliq/taxpayers" label="Soliq to'lovchilar" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Ma'lumot" className="lg:col-span-1">
          <div className="mt-3">
            <InfoRow label="F.I.Sh / Tashkilot" value={taxpayer.fullName} />
            <InfoRow label="STIR" value={taxpayer.stir} />
            {taxpayer.jshshir && <InfoRow label="JSHSHIR" value={taxpayer.jshshir} />}
            <InfoRow label="Turi" value={taxpayerTypeLabel(taxpayer.type)} />
            <InfoRow label="Viloyat" value={regionLabel(taxpayer.region)} />
            {taxpayer.district && <InfoRow label="Tuman" value={taxpayer.district} />}
            <InfoRow label="Telefon" value={taxpayer.phone || "—"} />
            <InfoRow
              label="Umumiy qarz"
              value={
                <span className={debt_uzs > 0 ? "text-rose-600" : "text-emerald-600"}>
                  {formatMoney(debt_uzs)}
                </span>
              }
            />
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Soliqlar</h2>
            <DataTable columns={assessmentColumns} rows={assessments} emptyText="Soliq yo'q" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 mb-2">To'lovlar tarixi</h2>
            <DataTable columns={paymentColumns} rows={payments} emptyText="To'lov yo'q" />
          </div>
        </div>
      </div>

      <ModalWrapper name={MODAL.SOLIQ_PAY} title="Soliq to'lash">
        <PayModal />
      </ModalWrapper>
    </div>
  );
};

export default TaxpayerDetailPage;
