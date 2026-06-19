import { cn } from "@/shared/utils/cn";
import {
  REQUEST_STATUS_LABELS,
  REQUEST_STATUS_TONE,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_TONE,
} from "../constants/yer.ui";

// kind: "request" | "property"
const StatusBadge = ({ status, kind = "request" }) => {
  const labels = kind === "property" ? PROPERTY_STATUS_LABELS : REQUEST_STATUS_LABELS;
  const tones = kind === "property" ? PROPERTY_STATUS_TONE : REQUEST_STATUS_TONE;

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
