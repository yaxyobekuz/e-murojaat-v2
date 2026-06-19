import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, AlertTriangle } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useAppeal } from "../hooks/useAppeals";
import StatusBadge from "../components/StatusBadge";
import AppealTimeline from "../components/AppealTimeline";
import AppealActionModal from "../components/AppealActionModal";
import { CATEGORY_LABELS } from "../constants/murojaat.ui";

const OPEN = ["yangi", "korib_chiqilmoqda", "yonaltirildi"];

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 text-sm">
    <span className="text-zinc-500">{label}</span>
    <span className="text-right font-medium text-zinc-900">{value}</span>
  </div>
);

const AppealWorkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { data: appeal, isLoading } = useAppeal(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-zinc-400">Yuklanmoqda...</div>;
  }
  if (!appeal) {
    return <div className="p-6 text-sm text-zinc-400">Murojaat topilmadi</div>;
  }

  const isClosed = appeal.status === "yopildi";
  const overdue =
    OPEN.includes(appeal.status) &&
    appeal.deadline &&
    new Date(appeal.deadline) < new Date();

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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight tabular-nums">
              {appeal.appealNumber}
            </h1>
            <StatusBadge status={appeal.type} kind="type" />
            <StatusBadge status={appeal.status} />
            {appeal.result && <StatusBadge status={appeal.result} kind="result" />}
          </div>
          <p className="mt-1 text-sm text-zinc-500">{appeal.subject}</p>
        </div>
        {!isClosed && (
          <Button
            onClick={() =>
              openModal(MODAL.MUROJAAT_APPEAL_ACTION, {
                appealId: appeal._id,
                currentStatus: appeal.status,
                organizationId: appeal.organizationId?._id || "",
              })
            }
          >
            <Pencil className="size-4" /> Ish ko'rish
          </Button>
        )}
      </div>

      {overdue && (
        <div className="mb-5 flex items-center gap-2 rounded-[2px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertTriangle className="size-4" /> Javob berish muddati o'tib ketgan
          ({formatDateUz(appeal.deadline)})
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Murojaat ma'lumotlari">
          <div className="divide-y">
            <Row label="Arizachi" value={appeal.applicantName || "-"} />
            <Row label="JSHSHIR" value={appeal.applicantJshshir} />
            <Row label="Viloyat" value={appeal.region || "-"} />
            <Row label="Soha" value={CATEGORY_LABELS[appeal.category] || appeal.category} />
            <Row label="Tashkilot" value={appeal.organizationId?.name || "Yo'naltirilmagan"} />
            <Row label="Yuborilgan" value={formatDateUz(appeal.createdAt)} />
            <Row label="Muddat" value={formatDateUz(appeal.deadline)} />
          </div>
        </Card>

        <Card title="Murojaat matni">
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-700">
            {appeal.body}
          </p>
          {appeal.operatorNote && (
            <div className="mt-4 rounded-[2px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <span className="font-medium">Ichki izoh: </span>
              {appeal.operatorNote}
            </div>
          )}
        </Card>
      </div>

      {!!appeal.replies?.length && (
        <Card title="Rasmiy javoblar" className="mt-5">
          <div className="mt-2 space-y-3">
            {appeal.replies.map((reply, i) => (
              <div key={reply._id || i} className="rounded-[2px] border bg-zinc-50/60 p-3">
                <p className="text-sm text-zinc-700">{reply.body}</p>
                <p className="mt-1 text-xs text-zinc-400">{formatDateUz(reply.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Holatlar tarixi" className="mt-5">
        <div className="pt-4">
          <AppealTimeline events={appeal.events} />
        </div>
      </Card>

      <ModalWrapper name={MODAL.MUROJAAT_APPEAL_ACTION} title="Murojaat ustida ish">
        <AppealActionModal />
      </ModalWrapper>
    </div>
  );
};

export default AppealWorkPage;
