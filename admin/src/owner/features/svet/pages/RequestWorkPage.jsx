import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useRequest } from "../hooks/useRequests";
import StatusBadge from "../components/StatusBadge";
import RequestTimeline from "../components/RequestTimeline";
import UpdateStatusModal from "../components/UpdateStatusModal";
import { SERVICE_TYPE_LABELS } from "../constants/svet.ui";

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const RequestWorkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { data: req, isLoading } = useRequest(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }
  if (!req) {
    return <div className="p-6 text-sm text-zinc-400">Ariza topilmadi</div>;
  }

  const isTerminal = ["bajarildi", "rad_etildi"].includes(req.status);
  const sub = req.subscriberId;

  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="size-4" /> Orqaga
      </button>

      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight tabular-nums">
              {req.requestNumber}
            </h1>
            <StatusBadge status={req.status} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {SERVICE_TYPE_LABELS[req.serviceType] || req.serviceType}
          </p>
        </div>
        {!isTerminal && (
          <Button
            onClick={() =>
              openModal(MODAL.SVET_REQUEST_STATUS, {
                requestId: req._id,
                currentStatus: req.status,
              })
            }
          >
            <Pencil className="size-4" /> Holatni o'zgartirish
          </Button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Ariza ma'lumotlari">
          <div className="divide-y">
            <Row label="Arizachi" value={req.applicantName || "-"} />
            <Row label="JSHSHIR" value={req.applicantJshshir} />
            <Row label="Viloyat" value={req.region || "-"} />
            <Row label="Yuborilgan" value={formatDateUz(req.createdAt)} />
            <Row
              label="Invoys"
              value={req.invoiceAmount ? formatMoney(req.invoiceAmount) : "-"}
            />
            <Row label="To'langan" value={req.paid ? "Ha" : "Yo'q"} />
          </div>
        </Card>

        <Card title="Abonent">
          {sub ? (
            <div className="divide-y">
              <Row label="Hisob raqami" value={sub.accountNumber} />
              <Row label="To'liq ism" value={sub.fullName} />
              <Row label="Viloyat" value={sub.region} />
              <Row label="Manzil" value={sub.address} />
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Abonent biriktirilmagan</p>
          )}
        </Card>
      </div>

      <Card title="Holatlar tarixi" className="mt-5">
        <div className="pt-4">
          <RequestTimeline events={req.events} />
        </div>
      </Card>

      <ModalWrapper name={MODAL.SVET_REQUEST_STATUS} title="Holatni o'zgartirish">
        <UpdateStatusModal />
      </ModalWrapper>
    </div>
  );
};

export default RequestWorkPage;
