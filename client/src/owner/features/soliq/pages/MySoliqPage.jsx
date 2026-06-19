import { Wallet, AlertTriangle, ReceiptText } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import DataTable from "@/shared/components/ui/table/DataTable";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { Skeleton } from "@/shared/components/shadcn/skeleton";
import { MODAL } from "@/shared/constants/modals";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { regionLabel } from "@/shared/data/regions";

import PayModal from "../components/PayModal";
import { useMyTaxpayerQuery } from "../hooks/useMySoliq";
import {
  taxTypeLabel,
  statusLabel,
  STATUS_TONE,
  methodLabel,
} from "../utils/soliq.constants";

const MySoliqPage = () => {
  const { openModal } = useModal();
  const { data, isLoading } = useMyTaxpayerQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card title="Mening soliqlarim">
        <p className="text-sm text-muted-foreground mt-2">Ma'lumot topilmadi.</p>
      </Card>
    );
  }

  const { taxpayer, assessments, payments, debt_uzs } = data;
  const totalAssessed = assessments.reduce((s, a) => s + a.amount_uzs, 0);

  const assessmentColumns = [
    { key: "taxType", header: "Soliq turi", render: (r) => taxTypeLabel(r.taxType) },
    { key: "year", header: "Yil" },
    { key: "amount_uzs", header: "Summa", align: "right", render: (r) => formatMoney(r.amount_uzs) },
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
          <Button className="h-7 px-3 text-xs" onClick={() => openModal(MODAL.SOLIQ_PAY, { assessment: r })}>
            To'lash
          </Button>
        ) : (
          <span className="text-xs text-emerald-600">✓ To'langan</span>
        ),
    },
  ];

  const paymentColumns = [
    { key: "paidAt", header: "Sana", render: (r) => formatDateUz(r.paidAt) },
    { key: "amount_uzs", header: "Summa", align: "right", render: (r) => formatMoney(r.amount_uzs) },
    { key: "method", header: "Usul", render: (r) => methodLabel(r.method) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Mening soliqlarim</h1>
        <p className="text-sm text-muted-foreground">
          {taxpayer.fullName} · STIR {taxpayer.stir} · {regionLabel(taxpayer.region)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Jami hisoblangan" value={totalAssessed} isMoney icon={ReceiptText} tone="info" />
        <StatCard label="Qarzdorlik" value={debt_uzs} isMoney icon={AlertTriangle} tone={debt_uzs > 0 ? "negative" : "positive"} />
        <StatCard label="Soliqlar soni" value={assessments.length} icon={Wallet} />
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Soliqlar</h2>
        <DataTable columns={assessmentColumns} rows={assessments} emptyText="Soliq yo'q" />
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-2">To'lovlar tarixi</h2>
        <DataTable columns={paymentColumns} rows={payments} emptyText="To'lov yo'q" />
      </div>

      <ModalWrapper name={MODAL.SOLIQ_PAY} title="Soliq to'lash">
        <PayModal />
      </ModalWrapper>
    </div>
  );
};

export default MySoliqPage;
