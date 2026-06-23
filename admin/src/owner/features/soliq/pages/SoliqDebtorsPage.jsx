// Qarzdorlar — faqat qarzi bor bizneslar (qarz bo'yicha kamayish tartibida).
// Tepada qarzdorlik KPI lari, ostida jadval. Qatorga bossa biznes paneli ochiladi.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import DataTable from "@/shared/components/ui/table/DataTable";
import { BUSINESSES, BUSINESS_TYPES, COLLECTION_TIERS } from "../mock/soliq.businesses";
import BusinessDetailPanel from "../components/BusinessDetailPanel";

const debtors = BUSINESSES.filter((b) => b.isDebtor).sort((a, b) => b.debtYear - a.debtYear);
const totalDebt = debtors.reduce((s, b) => s + b.debtYear, 0);
const critical = debtors.filter((b) => b.rate < 50).length; // juda past yig'im

const Kpi = ({ label, value, valueClass = "" }) => (
  <GlassCard className="flex flex-col gap-1">
    <span className="text-[13px] text-foreground/55">{label}</span>
    <span className={cn("text-2xl font-semibold tabular-nums", valueClass)}>{value}</span>
  </GlassCard>
);

const SoliqDebtorsPage = () => {
  const { activeId, setField } = useObjectState({ activeId: null });
  const active = useMemo(() => debtors.find((b) => b.id === activeId) || null, [activeId]);

  const columns = [
    {
      key: "name",
      header: "Biznes",
      render: (b) => {
        const type = BUSINESS_TYPES[b.typeKey];
        const Icon = type.icon;
        return (
          <div className="flex items-center gap-2.5">
            <span
              className="grid size-8 shrink-0 place-items-center rounded-lg"
              style={{ backgroundColor: `${type.color}26`, color: type.color }}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate font-medium">{b.name}</div>
              <div className="truncate text-[11px] text-foreground/45">{b.stir}</div>
            </div>
          </div>
        );
      },
    },
    { key: "address", header: "Manzil", render: (b) => <span className="text-foreground/60">{b.address}</span> },
    { key: "assessed", header: "Hisoblangan", align: "right", render: (b) => formatMoney(b.assessedYear) },
    {
      key: "debt",
      header: "Qarz",
      align: "right",
      render: (b) => <span className="font-semibold text-rose-400">{formatMoney(b.debtYear)}</span>,
    },
    {
      key: "rate",
      header: "Yig'im",
      align: "right",
      render: (b) => (
        <span className="font-semibold" style={{ color: COLLECTION_TIERS[b.tier].color }}>
          {b.rate}%
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Qarzdor bizneslar</h1>
        <p className="mt-0.5 text-sm text-foreground/50">
          Soliq qarzi bo'yicha bizneslar ro'yxati — eng katta qarzdan boshlab
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Kpi label="Qarzdor bizneslar" value={debtors.length} />
        <Kpi label="Umumiy qarz" value={formatMoney(totalDebt)} valueClass="text-rose-400" />
        <Kpi label="Kritik (yig'im < 50%)" value={critical} valueClass="text-amber-400" />
      </div>

      <div className="flex gap-4">
        <GlassCard className={cn("p-0 transition-all", active ? "flex-1" : "w-full")}>
          <div className="p-2">
            <DataTable
              variant="glass"
              columns={columns}
              rows={debtors}
              getKey={(b) => b.id}
              onRowClick={(b) => setField("activeId", b.id === activeId ? null : b.id)}
              emptyText="Qarzdor topilmadi"
            />
          </div>
        </GlassCard>

        {active && (
          <div className="sticky top-4 h-fit">
            <BusinessDetailPanel business={active} onClose={() => setField("activeId", null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SoliqDebtorsPage;
