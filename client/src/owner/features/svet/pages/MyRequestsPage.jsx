import { useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyRequests } from "../hooks/useMyRequests";
import StatusBadge from "../components/StatusBadge";
import RequestTimeline from "../components/RequestTimeline";
import { SERVICE_TYPE_LABELS } from "../constants/svet.ui";

const MyRequestsPage = () => {
  const { data: items, isLoading } = useMyRequests();
  const [openId, setOpenId] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mening arizalarim</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Yuborilgan arizalar va ularning holati
          </p>
        </div>
        <Link to="/owner/elektr/ariza">
          <Button>
            <FilePlus2 className="size-4" /> Yangi ariza
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Yuklanmoqda...</p>
      ) : !items?.length ? (
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Hali ariza yuborilmagan
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((r) => {
            const isOpen = openId === r._id;
            return (
              <Card key={r._id} className="!p-0">
                <button
                  onClick={() => setOpenId(isOpen ? null : r._id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-zinc-900">
                        {r.requestNumber}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-500">
                      {SERVICE_TYPE_LABELS[r.serviceType] || r.serviceType}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {formatDateUz(r.createdAt)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn("size-5 text-zinc-300 transition", isOpen && "rotate-180")}
                  />
                </button>

                {isOpen && (
                  <div className="border-t p-4 pt-5">
                    <RequestTimeline events={r.events} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequestsPage;
