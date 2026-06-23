// "Soliq tarixi" modal tanasi — tanlangan biznesning 12 oylik soliq tarixi
// (hisoblangan / yig'ilgan / qarz) + yillik yakun. business prop ModalWrapper data orqali keladi.
// Jadval shared DataTable (variant="glass") orqali — global table {} qoidasidan himoyalangan.
import { formatMoney } from "@/shared/utils/formatMoney";
import DataTable from "@/shared/components/ui/table/DataTable";
import { COLLECTION_TIERS } from "../../mock/soliq.businesses";

const Total = ({ label, value, valueClass = "" }) => (
  <div className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-3 py-2">
    <div className="text-[11px] text-foreground/50">{label}</div>
    <div className={`mt-0.5 text-[14px] font-semibold tabular-nums ${valueClass}`}>{value}</div>
  </div>
);

const tierColor = (rate) =>
  COLLECTION_TIERS[rate >= 90 ? "high" : rate >= 70 ? "mid" : rate >= 50 ? "low" : "veryLow"].color;

const BusinessTaxHistoryModal = ({ business }) => {
  if (!business) return null;

  const rows = business.monthly.map((m) => ({
    ...m,
    rate: m.assessed ? Math.round((m.collected / m.assessed) * 100) : 0,
  }));

  const columns = [
    { key: "month", header: "Oy", render: (r) => <span className="font-medium">{r.month}</span> },
    { key: "assessed", header: "Hisoblangan", align: "right", render: (r) => formatMoney(r.assessed) },
    {
      key: "collected",
      header: "Yig'ilgan",
      align: "right",
      render: (r) => <span className="text-emerald-400">{formatMoney(r.collected)}</span>,
    },
    {
      key: "debt",
      header: "Qarz",
      align: "right",
      render: (r) =>
        r.debt > 0 ? (
          <span className="text-rose-400">{formatMoney(r.debt)}</span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
    },
    {
      key: "rate",
      header: "Yig'im",
      align: "right",
      render: (r) => (
        <span className="font-semibold" style={{ color: tierColor(r.rate) }}>
          {r.rate}%
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[13px] text-foreground/60">
        <span className="font-medium text-foreground/80">{business.name}</span> · STIR {business.stir} · 2025 yil
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Total label="Hisoblangan" value={formatMoney(business.assessedYear)} />
        <Total label="Yig'ilgan" value={formatMoney(business.collectedYear)} valueClass="text-emerald-400" />
        <Total label="Qarz" value={formatMoney(business.debtYear)} valueClass="text-rose-400" />
      </div>

      <div className="max-h-[46vh] overflow-y-auto rounded-xl border border-[rgb(var(--card-border))] p-1">
        <DataTable variant="glass" columns={columns} rows={rows} getKey={(r) => r.month} />
      </div>
    </div>
  );
};

export default BusinessTaxHistoryModal;
