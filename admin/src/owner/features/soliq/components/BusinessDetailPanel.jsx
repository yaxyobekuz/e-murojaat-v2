// O'ng suzuvchi panel — biznes tanlanganda: rekvizitlar + yillik soliq statistikasi +
// oylik yig'im dinamikasi grafigi. Skrinshotdagi karta.
import { X, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { BUSINESS_TYPES } from "../mock/soliq.businesses";
import BusinessTaxHistoryModal from "./modals/BusinessTaxHistoryModal";

const shortMln = (n) => `${(n / 1_000_000).toFixed(1)} mln so'm`;

const StatBox = ({ label, value, valueClass = "", sub }) => (
  <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 px-3 py-2.5">
    <div className="text-[11px] text-foreground/50">{label}</div>
    <div className={cn("mt-0.5 text-[15px] font-semibold tabular-nums", valueClass)}>{value}</div>
    {sub && <div className="mt-0.5 text-[11px] tabular-nums text-emerald-400">{sub}</div>}
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 text-[13px]">
    <span className="text-foreground/55">{label}</span>
    <span className="font-medium tabular-nums">{value}</span>
  </div>
);

const BusinessDetailPanel = ({ business, onClose }) => {
  const { openModal } = useModal();
  if (!business) return null;
  const type = BUSINESS_TYPES[business.typeKey];
  const Icon = type.icon;
  const up = business.momDelta >= 0;

  const chartData = business.monthly.map((m) => ({ month: m.month, value: m.collected }));

  return (
    <div className="surface flex w-[340px] flex-col overflow-hidden rounded-2xl shadow-2xl">
      <div className="flex flex-col gap-3 p-4">
        {/* sarlavha */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold">{business.name}</h3>
              <GlassStatusBadge tone="done">Faol</GlassStatusBadge>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[12px] text-foreground/50">
              <span
                className="grid size-5 place-items-center rounded-md"
                style={{ backgroundColor: `${type.color}26`, color: type.color }}
              >
                <Icon className="size-3" />
              </span>
              {business.typeLabel}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="grid size-7 shrink-0 place-items-center rounded-lg text-foreground/50 hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* rekvizitlar */}
        <div className="border-t border-[rgb(var(--card-border))] pt-1">
          <Row label="STIR" value={business.stir} />
          <div className="flex items-start justify-between gap-3 py-1.5 text-[13px]">
            <span className="text-foreground/55">Manzil</span>
            <span className="flex max-w-[60%] items-start gap-1 text-right font-medium">
              <MapPin className="mt-0.5 size-3 shrink-0 text-foreground/40" />
              {business.address}
            </span>
          </div>
          <Row label="Faoliyat turi" value={business.typeLabel} />
          <Row label="Ochilgan sana" value={business.openedAt} />
          <Row label="Xodimlar soni" value={`${business.employees} nafar`} />
        </div>

        {/* soliq statistikasi */}
        <div className="border-t border-[rgb(var(--card-border))] pt-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-[13px] font-semibold">Soliq statistikasi</h4>
            <span className="rounded-md border border-[rgb(var(--card-border))] px-2 py-0.5 text-[11px] text-foreground/55">
              2025 yil
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatBox label="Hisoblangan soliq" value={shortMln(business.assessedYear)} />
            <StatBox
              label="Yig'ilgan soliq"
              value={shortMln(business.collectedYear)}
              valueClass="text-emerald-400"
              sub={`${business.rate}%`}
            />
            <StatBox label="Qarzdorlik" value={shortMln(business.debtYear)} valueClass="text-rose-400" />
            <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card/40 px-3 py-2.5">
              <div className="text-[11px] text-foreground/50">O'tgan oyga nisbatan</div>
              <div
                className={cn(
                  "mt-0.5 flex items-center gap-1 text-[15px] font-semibold tabular-nums",
                  up ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {up ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                {up ? "+" : ""}
                {business.momDelta}%
              </div>
            </div>
          </div>
        </div>

        {/* oylik dinamika */}
        <div className="border-t border-[rgb(var(--card-border))] pt-3">
          <h4 className="mb-1 text-[13px] font-semibold">Oylik yig'im dinamikasi</h4>
          <div className="text-[10px] text-foreground/40">mln so'm</div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={chartData} margin={{ top: 8, right: 6, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="bizTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <Tooltip
                formatter={(v) => [formatMoney(v), "Yig'ilgan"]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid rgba(148,163,184,0.25)",
                  background: "#0f172a",
                  fontSize: 12,
                  color: "#e2e8f0",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fill="url(#bizTrend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* harakatlar */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-xl bg-blue-600 px-3 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-700"
          >
            Batafsil ma'lumot
          </button>
          <button
            type="button"
            onClick={() => openModal(MODAL.SOLIQ_BUSINESS_HISTORY, { business })}
            className="rounded-xl border border-[rgb(var(--card-border))] px-3 py-2.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-card/60"
          >
            Soliq tarixi
          </button>
        </div>
      </div>

      <ModalWrapper
        name={MODAL.SOLIQ_BUSINESS_HISTORY}
        title="Soliq tarixi"
        className="max-w-2xl !border-[rgb(var(--card-border))] !bg-[hsl(240_6%_9%)] !text-foreground [&_*]:border-[rgb(var(--card-border))]"
      >
        <BusinessTaxHistoryModal />
      </ModalWrapper>
    </div>
  );
};

export default BusinessDetailPanel;
