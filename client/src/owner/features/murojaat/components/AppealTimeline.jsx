import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/formatDate";
import { APPEAL_STATUS_LABELS, APPEAL_STATUS_TONE } from "../constants/murojaat.ui";

// Vertical event timeline for an appeal
const AppealTimeline = ({ events = [] }) => {
  if (!events.length) {
    return <p className="text-sm text-zinc-400">Hodisalar yo'q</p>;
  }

  return (
    <ol className="relative space-y-5 border-l border-zinc-200 pl-5">
      {events.map((e, i) => (
        <li key={e._id || i} className="relative">
          <span
            className={cn(
              "absolute -left-[26px] top-0.5 size-3 rounded-full border-2 border-white ring-2",
              (APPEAL_STATUS_TONE[e.status] || "").includes("emerald")
                ? "bg-emerald-500 ring-emerald-200"
                : (APPEAL_STATUS_TONE[e.status] || "").includes("indigo")
                  ? "bg-indigo-500 ring-indigo-200"
                  : (APPEAL_STATUS_TONE[e.status] || "").includes("amber")
                    ? "bg-amber-500 ring-amber-200"
                    : "bg-blue-500 ring-blue-200",
            )}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-zinc-900">
              {APPEAL_STATUS_LABELS[e.status] || e.status}
            </p>
            <time className="text-xs text-zinc-400">{formatDateUz(e.createdAt)}</time>
          </div>
          {e.comment && <p className="mt-0.5 text-sm text-zinc-500">{e.comment}</p>}
        </li>
      ))}
    </ol>
  );
};

export default AppealTimeline;
