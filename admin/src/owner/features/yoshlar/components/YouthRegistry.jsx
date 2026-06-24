// Yoshlar daftari — ehtiyojmand yoshlar reyestri (qidiruv + filtr + chora holati).
import { Search, BookUser } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import useObjectState from "@/shared/hooks/useObjectState";
import GlowCard from "./ui/GlowCard";
import {
  YOUTH_RECORDS, YOUTH_DIRECTION, NEED_TYPE, MEASURE_STATUS, youthRegistrySummary as s,
} from "../mock/youthRegistry.data";

const TONE = {
  done: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  progress: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  new: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  danger: "bg-rose-500/15 text-rose-500 border-rose-500/30",
};
const Chip = ({ tone, children }) => (
  <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap", TONE[tone] || TONE.new)}>{children}</span>
);

const YouthRegistry = () => {
  const { q, dir, setField } = useObjectState({ q: "", dir: "" });

  const rows = YOUTH_RECORDS.filter((r) => {
    if (q && !r.name.toLowerCase().includes(q.toLowerCase()) && !r.id.toLowerCase().includes(q.toLowerCase()) && !r.mahalla.toLowerCase().includes(q.toLowerCase())) return false;
    if (dir && r.direction !== dir) return false;
    return true;
  }).slice(0, 50);

  return (
    <GlowCard tilt={false} glow="34,211,238" className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/15 text-cyan-400"><BookUser className="size-4" /></span>
        <div className="leading-tight">
          <h3 className="text-[14px] font-semibold text-foreground">Yoshlar daftari</h3>
          <p className="text-[11px] text-foreground/50">Ehtiyojmand yoshlar reyestri va ko'rilgan chora</p>
        </div>
      </div>

      {/* KPI mini */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: "Reyestrda", v: s.total },
          { k: "Bandlik ta'minlandi", v: `${s.resolvedPct}%`, c: "text-emerald-500" },
          { k: "Ko'rib chiqilmoqda", v: s.pending, c: "text-amber-500" },
          { k: "Qizlar ulushi", v: `${s.femalePct}%` },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-3 py-2">
            <div className="font-mono text-[16px] font-bold tabular-nums text-foreground">{m.v}</div>
            <div className="text-[10px] text-foreground/45">{m.k}</div>
          </div>
        ))}
      </div>

      {/* qidiruv + filtr */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground/40" />
          <input value={q} onChange={(e) => setField("q", e.target.value)} placeholder="Ism, ID yoki mahalla..."
            className="w-full rounded-lg border border-[rgb(var(--card-border))] bg-muted/40 py-1.5 pl-8 pr-3 text-[12px] text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-1 focus:ring-cyan-400/50" />
        </div>
        <div className="flex flex-wrap gap-1">
          {[["", "Hammasi"], ...Object.entries(YOUTH_DIRECTION).map(([k, v]) => [k, v.label])].map(([k, label]) => (
            <button key={k} onClick={() => setField("dir", k)}
              className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                dir === k ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-400" : "border-[rgb(var(--card-border))] text-foreground/55 hover:text-foreground")}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* reyestr */}
      <div className="max-h-[340px] overflow-y-auto rounded-lg border border-[rgb(var(--card-border))]">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-[rgb(var(--card-border))] text-foreground/55">
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-left font-medium">Yosh</th>
              <th className="px-3 py-2 text-left font-medium">Mahalla</th>
              <th className="px-3 py-2 text-left font-medium">Yo'nalish</th>
              <th className="px-3 py-2 text-left font-medium">Ehtiyoj</th>
              <th className="px-3 py-2 text-left font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-[rgb(var(--card-border))] transition-colors last:border-0 hover:bg-muted/40">
                <td className="px-3 py-2">
                  <div className="font-mono text-[11px] text-cyan-400">{r.id}</div>
                  <div className="text-[11px] text-foreground/80">{r.name}</div>
                </td>
                <td className="px-3 py-2 font-mono tabular-nums text-foreground/70">{r.age} · {r.gender === "F" ? "Q" : "Y"}</td>
                <td className="px-3 py-2 text-foreground/70">{r.mahalla}</td>
                <td className="px-3 py-2"><Chip tone={YOUTH_DIRECTION[r.direction].tone}>{YOUTH_DIRECTION[r.direction].label}</Chip></td>
                <td className="px-3 py-2 text-foreground/70">{NEED_TYPE[r.need]}</td>
                <td className="px-3 py-2"><Chip tone={MEASURE_STATUS[r.status].tone}>{MEASURE_STATUS[r.status].label}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="grid place-items-center py-8 text-[12px] text-foreground/40">Topilmadi</div>}
      </div>
      <div className="mt-1.5 text-[10px] text-foreground/35">{rows.length} ta ko'rsatilmoqda</div>
    </GlowCard>
  );
};

export default YouthRegistry;
