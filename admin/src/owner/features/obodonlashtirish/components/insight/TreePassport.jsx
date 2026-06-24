// Daraxt pasporti — qidiruv + reyestr + bosilgan daraxt pasport kartochkasi (foto, timeline).
import { Search, TreePine, Ruler, Calendar, Droplets, MapPin, X } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import useObjectState from "@/shared/hooks/useObjectState";
import { TREES, TREE_HEALTH } from "../../mock/treePassport.data";

const ACCENT = "#22c55e";

// Pasport kartochkasi (tanlangan daraxt)
const PassportCard = ({ tree, onClose }) => (
  <div className="relative overflow-hidden rounded-xl border bg-card p-4" style={{ borderColor: hexA(ACCENT, 0.3), boxShadow: `0 0 24px ${hexA(ACCENT, 0.12)}` }}>
    <button onClick={onClose} className="absolute right-2 top-2 text-foreground/40 hover:text-foreground"><X className="size-4" /></button>
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* foto */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg border border-[rgb(var(--card-border))] sm:w-44">
        <img src={tree.photo} alt={tree.id} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-1.5 top-1.5"><StatusBadge tone={TREE_HEALTH[tree.health].tone}>{TREE_HEALTH[tree.health].label}</StatusBadge></span>
      </div>
      {/* ma'lumot */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TreePine className="size-4" style={{ color: ACCENT }} />
          <span className="font-mono text-[15px] font-bold tabular-nums" style={{ color: ACCENT }}>{tree.id}</span>
        </div>
        <div className="mt-0.5 text-[12px] text-foreground/70">{tree.typeLabel} · {tree.mahalla}</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Ruler, k: "Bo'y", v: `${tree.height} sm` },
            { icon: TreePine, k: "Diametr", v: `${tree.diameter} sm` },
            { icon: Calendar, k: "Yosh", v: `${tree.age} yil` },
          ].map((m, i) => (
            <div key={i} className="rounded-lg border border-[rgb(var(--card-border))] bg-foreground/[0.02] px-2 py-1.5">
              <div className="text-[9px] uppercase tracking-wider text-foreground/40">{m.k}</div>
              <div className="font-mono text-[13px] font-semibold tabular-nums text-foreground">{m.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-foreground/55">
          <span className="flex items-center gap-1"><MapPin className="size-3" />{tree.coords}</span>
          <span className="flex items-center gap-1"><Droplets className="size-3" />Oxirgi parvarish: {tree.lastCareDate}</span>
        </div>
      </div>
    </div>
    {/* timeline */}
    <div className="mt-3 border-t pt-2" style={{ borderColor: "rgb(var(--card-border))" }}>
      <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-foreground/35">Pasport tarixi</div>
      {tree.events.map((e, i) => (
        <div key={i} className="flex items-start gap-2 py-1">
          <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
          <div className="leading-tight">
            <span className="text-[11.5px] font-medium text-foreground/85">{e.label}</span>
            <span className="ml-1.5 font-mono text-[10px] text-foreground/40">{e.date}</span>
            <div className="text-[10px] text-foreground/45">{e.note}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TreePassport = () => {
  const { q, health, active, setField } = useObjectState({ q: "", health: "", active: null });

  const filtered = TREES.filter((t) => {
    if (q && !t.id.toLowerCase().includes(q.toLowerCase()) && !t.mahalla.toLowerCase().includes(q.toLowerCase())) return false;
    if (health && t.health !== health) return false;
    return true;
  }).slice(0, 40);

  const selected = active ? TREES.find((t) => t.id === active) : null;

  return (
    <div className="p-3">
      {/* qidiruv + filtr */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground/40" />
          <input value={q} onChange={(e) => setField("q", e.target.value)} placeholder="Daraxt ID yoki mahalla..."
            className="w-full rounded-lg border border-[rgb(var(--card-border))] bg-foreground/[0.03] py-1.5 pl-8 pr-3 text-[12px] text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-1" style={{ "--tw-ring-color": hexA(ACCENT, 0.5) }} />
        </div>
        <div className="flex gap-1">
          {[["", "Hammasi"], ...Object.entries(TREE_HEALTH).map(([k, v]) => [k, v.label])].map(([k, label]) => (
            <button key={k} onClick={() => setField("health", k)}
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={health === k ? { borderColor: hexA(ACCENT, 0.5), background: hexA(ACCENT, 0.12), color: ACCENT } : { borderColor: "rgb(var(--card-border))", color: "hsl(var(--muted-foreground))" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* tanlangan pasport */}
      {selected && <div className="mt-3"><PassportCard tree={selected} onClose={() => setField("active", null)} /></div>}

      {/* reyestr */}
      <div className="glass-table mt-3 max-h-[320px] overflow-y-auto rounded-lg border border-[rgb(var(--card-border))]">
        <table className="w-full text-[12px] [&_tbody_tr]:bg-transparent [&_tbody_tr:last-child]:bg-transparent">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-[rgb(var(--card-border))] text-foreground/55">
              <th className="px-3 py-2 text-left font-medium">Daraxt ID</th>
              <th className="px-3 py-2 text-left font-medium">Tur</th>
              <th className="px-3 py-2 text-left font-medium">Mahalla</th>
              <th className="px-3 py-2 text-right font-medium">Bo'y</th>
              <th className="px-3 py-2 text-center font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} onClick={() => setField("active", t.id)}
                className="cursor-pointer border-b border-[rgb(var(--card-border))] transition-colors last:border-0 hover:bg-foreground/[0.03]">
                <td className="px-3 py-2 font-mono tabular-nums" style={{ color: active === t.id ? ACCENT : undefined }}>{t.id}</td>
                <td className="px-3 py-2 text-foreground/70">{t.typeLabel}</td>
                <td className="px-3 py-2 text-foreground/70">{t.mahalla}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground/80">{t.height} sm</td>
                <td className="px-3 py-2 text-center"><StatusBadge tone={TREE_HEALTH[t.health].tone}>{TREE_HEALTH[t.health].label}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="grid place-items-center py-8 text-[12px] text-foreground/40">Topilmadi</div>}
      </div>
      <div className="mt-1.5 text-[10px] text-foreground/35">{filtered.length} ta ko'rsatilmoqda · qatorni bosib pasportni oching</div>
    </div>
  );
};
