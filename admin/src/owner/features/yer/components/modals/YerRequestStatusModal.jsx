// Status + timeline editor. Rendered inside ModalWrapper (receives request via data).
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/formatDate";
import Select from "@/shared/components/ui/select/Select";
import Button from "@/shared/components/ui/button/Button";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { qk } from "@/shared/lib/query/keys";
import {
  REQUEST_STATUS,
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONE,
} from "../../mock/yer.data";

const TERMINAL = ["bajarildi", "rad_etildi"];

const statusOptions = REQUEST_STATUS.map((s) => ({
  value: s,
  label: REQUEST_STATUS_LABELS[s],
}));

const YerRequestStatusModal = ({ request, close }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(request?.status || "yangi");

  if (!request) return null;

  const isTerminal = TERMINAL.includes(request.status);

  const onSave = () => {
    if (isTerminal) {
      toast.error("Ariza yakunlangan — holatni o'zgartirib bo'lmaydi");
      return;
    }
    // Optimistically patch every cached requests list
    queryClient.setQueriesData({ queryKey: qk.yer.requests() }, (old) => {
      if (!old?.rows) return old;
      return {
        ...old,
        rows: old.rows.map((r) => (r.id === request.id ? { ...r, status } : r)),
      };
    });
    toast.success("Holat yangilandi");
    close?.();
  };

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
        <span className="font-medium">{request.requestNumber}</span>
        <GlassStatusBadge tone={REQUEST_STATUS_TONE[request.status]}>
          {REQUEST_STATUS_LABELS[request.status]}
        </GlassStatusBadge>
      </div>

      {/* Timeline */}
      <div>
        <p className="mb-2 text-xs font-medium text-foreground/55">Holatlar tarixi</p>
        <ol className="relative ml-2 border-l border-[rgb(var(--card-border))]">
          {request.events.map((e, i) => (
            <li key={i} className="mb-3 ml-4 last:mb-0">
              <span className="absolute -left-[7px] mt-1 grid size-3.5 place-items-center rounded-full bg-brand-purple text-white">
                <CheckCircle2 className="size-2.5" />
              </span>
              <p className="text-sm">{e.note}</p>
              <p className="text-xs text-foreground/45">{formatDateUz(e.at)}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Status change */}
      {!isTerminal && (
        <div>
          <p className="mb-1.5 text-xs font-medium text-foreground/55">Yangi holat</p>
          <Select value={status} onChange={setStatus} options={statusOptions} />
        </div>
      )}

      <div className={cn("flex justify-end gap-2", isTerminal && "opacity-60")}>
        <Button variant="outline" onClick={() => close?.()}>
          Yopish
        </Button>
        <Button onClick={onSave} disabled={isTerminal}>
          Saqlash
        </Button>
      </div>
    </div>
  );
};

export default YerRequestStatusModal;
