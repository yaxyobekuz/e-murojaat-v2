import { cn } from "@/shared/utils/cn";
import {
  APPEAL_STATUS_LABELS,
  APPEAL_STATUS_TONE,
  APPEAL_RESULT_LABELS,
  APPEAL_RESULT_TONE,
  APPEAL_TYPE_LABELS,
  APPEAL_TYPE_TONE,
} from "../constants/murojaat.ui";

const MAPS = {
  status: { labels: APPEAL_STATUS_LABELS, tones: APPEAL_STATUS_TONE },
  result: { labels: APPEAL_RESULT_LABELS, tones: APPEAL_RESULT_TONE },
  type: { labels: APPEAL_TYPE_LABELS, tones: APPEAL_TYPE_TONE },
};

// kind: "status" | "result" | "type"
const StatusBadge = ({ status, kind = "status" }) => {
  const { labels, tones } = MAPS[kind] || MAPS.status;
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
