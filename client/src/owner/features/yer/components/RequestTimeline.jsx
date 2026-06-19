import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/formatDate";
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_TONE } from "../constants/yer.ui";

const RequestTimeline = ({ events = [] }) => {
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
              (REQUEST_STATUS_TONE[e.status] || "").includes("emerald")
                ? "bg-emerald-500 ring-emerald-200"
                : (REQUEST_STATUS_TONE[e.status] || "").includes("rose")
                  ? "bg-rose-500 ring-rose-200"
                  : "bg-blue-500 ring-blue-200",
            )}
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-zinc-900">
              {REQUEST_STATUS_LABELS[e.status] || e.status}
            </p>
            <time className="text-xs text-zinc-400">{formatDateUz(e.createdAt)}</time>
          </div>
          {e.comment && <p className="mt-0.5 text-sm text-zinc-500">{e.comment}</p>}
        </li>
      ))}
    </ol>
  );
};

export default RequestTimeline;
