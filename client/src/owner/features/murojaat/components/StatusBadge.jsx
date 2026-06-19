import { cn } from "@/shared/utils/cn";
import {
  APPEAL_STATUS_LABELS,
  APPEAL_STATUS_TONE,
  APPEAL_RESULT_LABELS,
  APPEAL_RESULT_TONE,
} from "../constants/murojaat.ui";

// kind: "status" | "result"
const StatusBadge = ({ status, kind = "status" }) => {
  const labels = kind === "result" ? APPEAL_RESULT_LABELS : APPEAL_STATUS_LABELS;
  const tones = kind === "result" ? APPEAL_RESULT_TONE : APPEAL_STATUS_TONE;
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
