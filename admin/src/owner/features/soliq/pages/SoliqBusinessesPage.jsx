// Bizneslar ro'yxati — jadval (faoliyat turi ikoni, STIR, manzil, soliq, qarz, yig'im%).
// Qatorga bossa o'ngdan biznes statistikasi paneli ochiladi (joylashuv + yillik + tarix).
// Tepada: qidiruv + tur filtri (chip) + checkbox filtrlar (Yirik/Qarzdor/Yangi).
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import InputSearch from "@/shared/components/ui/input/InputSearch";
import GlassCard from "@/shared/components/ui/glass/GlassCard";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import {
  BUSINESSES,
  BUSINESS_TYPES,
  COLLECTION_TIERS,
  filterBusinesses,
} from "../mock/soliq.businesses";
import BusinessFilters from "../components/BusinessFilters";
import BusinessDetailPanel from "../components/BusinessDetailPanel";

const TYPE_KEYS = Object.keys(BUSINESS_TYPES);

const SoliqBusinessesPage = () => {
  const { query, typeKey, filters, activeId, setField } = useObjectState({
    query: "",
    typeKey: null,
    filters: { large: false, debtor: false, isNew: false },
    activeId: null,
  });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return filterBusinesses(BUSINESSES, {
      ...filters,
      types: typeKey ? [typeKey] : undefined,
    }).filter(
      (b) =>
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.stir.includes(q) ||
        b.address.toLowerCase().includes(q),
    );
  }, [query, typeKey, filters]);

  const active = useMemo(() => BUSINESSES.find((b) => b.id === activeId) || null, [activeId]);

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
              <div className="truncate text-[11px] text-foreground/45">{b.typeLabel}</div>
            </div>
          </div>
        );
      },
    },
    { key: "stir", header: "STIR", render: (b) => <span className="text-foreground/70">{b.stir}</span> },
    { key: "address", header: "Manzil", render: (b) => <span className="text-foreground/60">{b.address}</span> },
    { key: "assessed", header: "Hisoblangan", align: "right", render: (b) => formatMoney(b.assessedYear) },
    {
      key: "debt",
      header: "Qarz",
      align: "right",
      render: (b) =>
        b.debtYear > 0 ? (
          <span className="font-semibold text-rose-400">{formatMoney(b.debtYear)}</span>
        ) : (
          <span className="text-foreground/30">—</span>
        ),
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
    {
      key: "status",
      header: "Holati",
      render: (b) => <GlassStatusBadge tone="done">Faol</GlassStatusBadge>,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Bizneslar</h1>
        <p className="mt-0.5 text-sm text-foreground/50">
          Sarnovul MFY bo'yicha ro'yxatdagi bizneslar — soliq holati bilan
        </p>
      </div>

      {/* qidiruv + checkbox filtr */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-72">
          <InputSearch
            value={query}
            onChange={(e) => setField("query", e.target.value)}
            placeholder="Nom, STIR yoki manzil bo'yicha qidirish"
          />
        </div>
        <BusinessFilters filters={filters} onChange={(f) => setField("filters", f)} />
      </div>

      {/* faoliyat turi chip filtri */}
      <div className="flex flex-wrap gap-1.5">
        <Chip active={!typeKey} onClick={() => setField("typeKey", null)}>
          Barchasi
        </Chip>
        {TYPE_KEYS.map((k) => {
          const t = BUSINESS_TYPES[k];
          const Icon = t.icon;
          return (
            <Chip key={k} active={typeKey === k} color={t.color} onClick={() => setField("typeKey", typeKey === k ? null : k)}>
              <Icon className="size-3.5" />
              {t.label}
            </Chip>
          );
        })}
      </div>

      <div className="flex gap-4">
        <GlassCard className={cn("p-0 transition-all", active ? "flex-1" : "w-full")}>
          <div className="flex items-center justify-between px-4 pt-3 text-[12px] text-foreground/50">
            <span>{rows.length} ta biznes</span>
          </div>
          <div className="p-2">
            <DataTable
              variant="glass"
              columns={columns}
              rows={rows}
              getKey={(b) => b.id}
              onRowClick={(b) => setField("activeId", b.id === activeId ? null : b.id)}
              emptyText="Biznes topilmadi"
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

const Chip = ({ active, color, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
      active
        ? "border-transparent text-white"
        : "border-[rgb(var(--card-border))] text-foreground/70 hover:text-foreground",
    )}
    style={active ? { backgroundColor: color || "#2563eb" } : undefined}
  >
    {children}
  </button>
);

export default SoliqBusinessesPage;
