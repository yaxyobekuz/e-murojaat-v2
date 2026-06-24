import { Search } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import { useMskAppeals } from "../hooks/useMskAppeals";
import { useMskAnalytics } from "../hooks/useMskAnalytics";
import MskFilters from "../components/MskFilters";
import AppealsTable from "../components/AppealsTable";
import AppealDetailModal from "../components/modals/AppealDetailModal";

const LIMIT = 12;

const Stat = ({ label, value, color }) => (
  <div className="flex flex-col">
    <span className="text-lg font-semibold tabular-nums" style={color ? { color } : undefined}>{value ?? "—"}</span>
    <span className="text-[11px] text-foreground/50">{label}</span>
  </div>
);

const MskAppealsPage = () => {
  const { state, setField, setFields } = useObjectState({
    category: "", status: "", gender: "", ageBucket: "", street: "", source: "", priority: "", search: "", page: 1,
  });
  const { openModal } = useModal();

  const { search, page, ...filterOnly } = state;
  const { data, isLoading } = useMskAppeals({ ...state, limit: LIMIT });
  const { data: summary } = useMskAnalytics("summary", filterOnly);

  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const onFilter = (k, v) => setFields({ [k]: v, page: 1 });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">MSK — arizalar</h1>
        <p className="mt-0.5 text-sm text-foreground/50">Sarnovul MFY maishiy xizmat arizalari. Qatorni bosib tafsilotni ko'ring</p>
      </div>

      <GlassCard className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Jami arizalar" value={total} />
        <Stat label="Ochiq arizalar" value={summary?.open} color="#f59e0b" />
        <Stat label="Muddati o'tgan" value={summary?.overdue} color="#ef4444" />
        <Stat label="Bajarilish darajasi" value={summary ? `${summary.completionRate}%` : "—"} color="#10b981" />
      </GlassCard>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => onFilter("search", e.target.value)}
            placeholder="Raqam, ism, manzil yoki xodim bo'yicha qidirish..."
            className="h-10 w-full rounded-full border border-[rgb(var(--card-border))] bg-card/60 pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:border-rose-400/50"
          />
        </div>
        <MskFilters value={state} onChange={onFilter} />
      </div>

      <AppealsTable
        rows={data?.rows || []}
        isLoading={isLoading}
        onRowClick={(row) => openModal(MODAL.MSK_APPEAL_DETAIL, { appeal: row })}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setField("page", p)}
        hasNextPage={page < totalPages}
        hasPrevPage={page > 1}
      />

      <ModalWrapper name={MODAL.MSK_APPEAL_DETAIL} title="Ariza tafsiloti" className="max-w-lg">
        <AppealDetailModal />
      </ModalWrapper>
    </div>
  );
};

export default MskAppealsPage;
