import { cn } from "@/shared/utils/cn";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONE,
  SUBSCRIBER_STATUS_LABELS,
  SUBSCRIBER_STATUS_TONE,
} from "../constants/svet.ui";

const StatusBadge = ({ status, kind = "request" }) => {
  const labels =
    kind === "subscriber" ? SUBSCRIBER_STATUS_LABELS : REQUEST_STATUS_LABELS;
  const tones =
    kind === "subscriber" ? SUBSCRIBER_STATUS_TONE : REQUEST_STATUS_TONE;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[status] || "bg-zinc-50 text-zinc-600 border-zinc-200",
      )}
    >
      {labels[status] || status}
    </span>
  );
};

export default StatusBadge;
