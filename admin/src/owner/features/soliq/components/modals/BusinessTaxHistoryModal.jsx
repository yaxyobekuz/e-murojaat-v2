// "Soliq tarixi" modal tanasi — tanlangan biznesning 12 oylik soliq tarixi
// (hisoblangan / yig'ilgan / qarz) + yillik yakun. business prop ModalWrapper data orqali keladi.
import { formatMoney } from "@/shared/utils/formatMoney";
import { COLLECTION_TIERS } from "../../mock/soliq.businesses";

const Total = ({ label, value, valueClass = "" }) => (
  <div className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-3 py-2">
    <div className="text-[11px] text-foreground/50">{label}</div>
    <div className={`mt-0.5 text-[14px] font-semibold tabular-nums ${valueClass}`}>{value}</div>
  </div>
);

const BusinessTaxHistoryModal = ({ business }) => {
  if (!business) return null;
  const { monthly } = business;

  return (
    <div className="flex flex-col gap-4">
      {/* sarlavha ostidagi rekvizit */}
      <div className="text-[13px] text-foreground/60">
        <span className="font-medium text-foreground/80">{business.name}</span> · STIR {business.stir} · 2025 yil
      </div>

      {/* yillik yakun */}
      <div className="grid grid-cols-3 gap-2">
        <Total label="Hisoblangan" value={formatMoney(business.assessedYear)} />
        <Total label="Yig'ilgan" value={formatMoney(business.collectedYear)} valueClass="text-emerald-500" />
        <Total label="Qarz" value={formatMoney(business.debtYear)} valueClass="text-rose-500" />
      </div>

      {/* oylik jadval */}
      <div className="overflow-hidden rounded-xl border border-[rgb(var(--card-border))]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgb(var(--card-border))] bg-card/50 text-[12px] text-foreground/55">
              <th className="px-3 py-2 text-left font-medium">Oy</th>
              <th className="px-3 py-2 text-right font-medium">Hisoblangan</th>
              <th className="px-3 py-2 text-right font-medium">Yig'ilgan</th>
              <th className="px-3 py-2 text-right font-medium">Qarz</th>
              <th className="px-3 py-2 text-right font-medium">Yig'im</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m) => {
              const rate = m.assessed ? Math.round((m.collected / m.assessed) * 100) : 0;
              const tier = rate >= 90 ? "high" : rate >= 70 ? "mid" : rate >= 50 ? "low" : "veryLow";
              return (
                <tr key={m.month} className="border-b border-[rgb(var(--card-border))] last:border-0 tabular-nums">
                  <td className="px-3 py-2 font-medium">{m.month}</td>
                  <td className="px-3 py-2 text-right text-foreground/75">{formatMoney(m.assessed)}</td>
                  <td className="px-3 py-2 text-right text-emerald-500">{formatMoney(m.collected)}</td>
                  <td className="px-3 py-2 text-right">
                    {m.debt > 0 ? (
                      <span className="text-rose-500">{formatMoney(m.debt)}</span>
                    ) : (
                      <span className="text-foreground/30">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: COLLECTION_TIERS[tier].color }}>
                    {rate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessTaxHistoryModal;
