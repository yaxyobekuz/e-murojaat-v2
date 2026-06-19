import { useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Card from "@/shared/components/ui/card/Card";
import Button from "@/shared/components/ui/button/Button";
import { formatDateUz } from "@/shared/utils/formatDate";
import { useMyAppeals } from "../hooks/useMyAppeals";
import StatusBadge from "../components/StatusBadge";
import AppealTimeline from "../components/AppealTimeline";
import { CATEGORY_LABELS, APPEAL_TYPE_LABELS } from "../constants/murojaat.ui";

const MyAppealsPage = () => {
  const { data: items, isLoading } = useMyAppeals();
  const [openId, setOpenId] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mening murojaatlarim</h1>
          <p className="mt-1 text-sm text-zinc-500">Yuborilgan murojaatlar va ularning holati</p>
        </div>
        <Link to="/owner/murojaat/yangi">
          <Button>
            <FilePlus2 className="size-4" /> Yangi murojaat
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-zinc-400">Yuklanmoqda...</p>
      ) : !items?.length ? (
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Hali murojaat yuborilmagan
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
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold tabular-nums text-zinc-900">
                        {r.appealNumber}
                      </span>
                      <StatusBadge status={r.status} />
                      {r.result && <StatusBadge status={r.result} kind="result" />}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-700">{r.subject}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {APPEAL_TYPE_LABELS[r.type]} · {CATEGORY_LABELS[r.category]} ·{" "}
                      {formatDateUz(r.createdAt)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn("size-5 text-zinc-300 transition", isOpen && "rotate-180")}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-5 border-t p-4 pt-5">
                    {!!r.replies?.length && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-zinc-700">Rasmiy javob</p>
                        {r.replies.map((reply, i) => (
                          <div
                            key={reply._id || i}
                            className="rounded-[2px] border border-emerald-200 bg-emerald-50/60 p-3 text-sm text-zinc-700"
                          >
                            {reply.body}
                            <p className="mt-1 text-xs text-zinc-400">
                              {formatDateUz(reply.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <AppealTimeline events={r.events} />
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

export default MyAppealsPage;
