// Ma'lumot kiritish — domen ko'rsatkichlari (KPI). Owner barcha domenni, mansabdor faqat o'z domenlarini.
import { Loader2, Pencil } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { useBoshqaruvMe } from "../hooks/useBoshqaruvMe";
import { useMahallaIndicatorsQuery } from "../hooks/useMahallaIndicators";
import { domainsForRole } from "../data/domains";
import DomainFormDrawer from "../components/DomainFormDrawer";

const fmt = (v) => (typeof v === "number" ? v.toLocaleString("uz-UZ").replace(/,/g, " ") : v ?? "—");

const BoshqaruvMalumotPage = () => {
  const { data: me } = useBoshqaruvMe();
  const { data: indicators, isLoading } = useMahallaIndicatorsQuery();
  const { activeDomain, drawerOpen, setFields } = useObjectState({ activeDomain: null, drawerOpen: false });

  const domains = domainsForRole(me?.role);
  const openEditor = (domain) => setFields({ activeDomain: domain, drawerOpen: true });
  const closeDrawer = () => setFields({ drawerOpen: false, activeDomain: null });

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-1 flex items-center gap-2">
        <h1 className="text-lg font-bold">Ma'lumot kiritish</h1>
        <span className="rounded-md border border-[rgb(var(--card-border))] bg-card/40 px-2 py-0.5 text-xs font-semibold text-foreground/60">
          {domains.length} bo'lim
        </span>
      </div>
      <p className="mb-5 text-xs text-foreground/50">Bu yerdagi raqamlar asosiy dashboardda jonli ko'rsatiladi.</p>

      {isLoading ? (
        <div className="grid h-64 place-items-center text-foreground/40">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map(({ domain, title, icon: Icon, accent, fields }) => {
            const data = indicators?.[domain] || {};
            const preview = fields.slice(0, 3);
            return (
              <button
                key={domain}
                type="button"
                onClick={() => openEditor(domain)}
                className="group flex flex-col rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-4 text-left shadow-sm transition-colors hover:border-foreground/25"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[rgb(var(--card-border))] bg-background">
                    <Icon className={`size-5 ${accent}`} />
                  </span>
                  <p className="flex-1 text-sm font-bold">{title}</p>
                  <Pencil className="size-3.5 text-foreground/30 group-hover:text-foreground/70" />
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[rgb(var(--card-border))] pt-3">
                  {preview.map((f) => (
                    <div key={f.key} className="flex items-center justify-between text-xs">
                      <span className="truncate text-foreground/55">{f.label}</span>
                      <span className="ml-2 shrink-0 font-semibold tabular-nums">{fmt(data[f.key])}</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <DomainFormDrawer open={drawerOpen} domain={activeDomain} data={activeDomain ? indicators?.[activeDomain] : null} onClose={closeDrawer} />
    </div>
  );
};

export default BoshqaruvMalumotPage;
