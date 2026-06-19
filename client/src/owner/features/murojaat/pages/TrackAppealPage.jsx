import { useState } from "react";
import { Search } from "lucide-react";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import Input from "@/shared/components/ui/input/Input";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useTrackAppeal } from "../hooks/useTrackAppeal";
import StatusBadge from "../components/StatusBadge";
import AppealTimeline from "../components/AppealTimeline";
import { CATEGORY_LABELS, APPEAL_TYPE_LABELS } from "../constants/murojaat.ui";

const TrackAppealPage = () => {
  const [number, setNumber] = useState("");
  const track = useTrackAppeal();
  const appeal = track.data;

  const submit = () => {
    if (number.trim().length < 3) return;
    track.mutate(number.trim());
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-xl font-semibold tracking-tight">Holatni tekshirish</h1>
      <p className="mb-5 text-sm text-zinc-500">
        Murojaat raqamingiz orqali holatni kuzating (masalan: M-2026-0001234)
      </p>

      <Card>
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-zinc-700">Murojaat raqami</label>
            <Input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="M-2026-0000001"
            />
          </div>
          <Button onClick={submit} disabled={track.isPending}>
            <Search className="size-4" /> Tekshirish
          </Button>
        </div>
      </Card>

      {appeal && (
        <Card className="mt-5">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold tabular-nums">{appeal.appealNumber}</h2>
            <StatusBadge status={appeal.status} />
            {appeal.result && <StatusBadge status={appeal.result} kind="result" />}
          </div>
          <p className="mb-1 text-sm font-medium text-zinc-900">{appeal.subject}</p>
          <p className="mb-4 text-xs text-zinc-400">
            {APPEAL_TYPE_LABELS[appeal.type]} · {CATEGORY_LABELS[appeal.category]} ·{" "}
            {formatDateUz(appeal.createdAt)}
          </p>

          {!!appeal.replies?.length && (
            <div className="mb-5 space-y-2">
              <p className="text-sm font-medium text-zinc-700">Rasmiy javob</p>
              {appeal.replies.map((reply, i) => (
                <div
                  key={reply._id || i}
                  className="rounded-[2px] border border-emerald-200 bg-emerald-50/60 p-3 text-sm text-zinc-700"
                >
                  {reply.body}
                </div>
              ))}
            </div>
          )}

          <AppealTimeline events={appeal.events} />
        </Card>
      )}
    </div>
  );
};

export default TrackAppealPage;
