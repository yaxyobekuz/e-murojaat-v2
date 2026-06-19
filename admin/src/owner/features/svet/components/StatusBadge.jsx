import { cn } from "@/shared/utils/cn";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONE,
  SUBSCRIBER_STATUS_LABELS,
  SUBSCRIBER_STATUS_TONE,
  VIOLATION_STATUS_LABELS,
  VIOLATION_STATUS_TONE,
} from "../constants/svet.ui";

// kind: "request" | "subscriber" | "violation"
const MAPS = {
  request: { labels: REQUEST_STATUS_LABELS, tones: REQUEST_STATUS_TONE },
  subscriber: { labels: SUBSCRIBER_STATUS_LABELS, tones: SUBSCRIBER_STATUS_TONE },
  violation: { labels: VIOLATION_STATUS_LABELS, tones: VIOLATION_STATUS_TONE },
};

const StatusBadge = ({ status, kind = "request" }) => {
  const { labels, tones } = MAPS[kind] || MAPS.request;

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
