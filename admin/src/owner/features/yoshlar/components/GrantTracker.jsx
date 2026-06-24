// Grant / ish o'rni kuzatuvi — ariza oqimi (yangi→ko'rib→berildi) + summa + ish o'rni.
import { Banknote, Briefcase, FileCheck2 } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import useObjectState from "@/shared/hooks/useObjectState";
import GlowCard from "./ui/GlowCard";
import {
  GRANTS, GRANT_TYPE, GRANT_STATUS, GRANTS_BY_TYPE, grantsSummary as s,
} from "../mock/grants.data";

const TONE = {
  done: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  progress: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  new: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  danger: "bg-rose-500/15 text-rose-500 border-rose-500/30",
};
const Chip = ({ tone, children }) => (
  <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10.5px] font-medium whitespace-nowrap", TONE[tone] || TONE.new)}>{children}</span>
);

const maxType = Math.max(...GRANTS_BY_TYPE.map((t) => t.value), 1);

const GrantTracker = () => {
  const { status, setField } = useObjectState({ status: "" });

  const rows = GRANTS.filter((g) => !status || g.status === status)
    .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);

  return (
    <GlowCard tilt={false} glow="52,211,153" className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400"><Banknote className="size-4" /></span>
        <div className="leading-tight">
          <h3 className="text-[14px] font-semibold text-foreground">Grant va ish o'rni kuzatuvi</h3>
          <p className="text-[11px] text-foreground/50">Ariza → ko'rib chiqildi → berildi · ajratilgan mablag'</p>
        </div>
      </div>

      {/* KPI mini */}
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { icon: FileCheck2, k: "Arizalar", v: s.total },
          { icon: Banknote, k: "Ajratilgan", v: formatMoney(s.totalAmount), c: "text-emerald-500", small: true },
          { icon: Briefcase, k: "Yangi ish o'rni", v: s.totalJobs, c: "text-cyan-400" },
          { icon: FileCheck2, k: "Tasdiqlangan", v: `${s.approvedPct}%` },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/40 px-3 py-2">
            <div className={cn("font-mono font-bold tabular-nums text-foreground", m.small ? "text-[12px]" : "text-[16px]", m.c)}>{m.v}</div>
            <div className="text-[10px] text-foreground/45">{m.k}</div>
          </div>
        ))}
      </div>

      {/* tur bo'yicha bar */}
      <div className="mb-3 space-y-1.5">
        {GRANTS_BY_TYPE.map((t) => (
          <div key={t.key} className="flex items-center gap-2 text-[11px]">
            <span className="w-28 shrink-0 text-foreground/70">{GRANT_TYPE[t.key].label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full rounded-full" style={{ width: `${(t.value / maxType) * 100}%`, background: GRANT_TYPE[t.key].color, boxShadow: `0 0 6px ${GRANT_TYPE[t.key].color}80` }} />
            </div>
            <span className="w-6 text-right font-mono tabular-nums text-foreground/60">{t.value}</span>
          </div>
        ))}
      </div>

      {/* filtr */}
      <div className="mb-2 flex flex-wrap gap-1">
        {[["", "Hammasi"], ...Object.entries(GRANT_STATUS).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <button key={k} onClick={() => setField("status", k)}
            className={cn("rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              status === k ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-400" : "border-[rgb(var(--card-border))] text-foreground/55 hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {/* jadval */}
      <div className="max-h-[300px] overflow-y-auto rounded-lg border border-[rgb(var(--card-border))]">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-card">
            <tr className="border-b border-[rgb(var(--card-border))] text-foreground/55">
              <th className="px-3 py-2 text-left font-medium">Ariza</th>
              <th className="px-3 py-2 text-left font-medium">Tur</th>
              <th className="px-3 py-2 text-right font-medium">Summa</th>
              <th className="px-3 py-2 text-center font-medium">Ish o'rni</th>
              <th className="px-3 py-2 text-center font-medium">Holat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-b border-[rgb(var(--card-border))] transition-colors last:border-0 hover:bg-muted/40">
                <td className="px-3 py-2">
                  <div className="font-mono text-[11px] text-emerald-400">{g.id}</div>
                  <div className="text-[11px] text-foreground/80">{g.applicant} · {g.mahalla}</div>
                </td>
                <td className="px-3 py-2 text-foreground/70">{GRANT_TYPE[g.type].label}</td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground/80">{g.amount ? formatMoney(g.amount) : "—"}</td>
                <td className="px-3 py-2 text-center font-mono tabular-nums text-cyan-400">{g.jobs || "—"}</td>
                <td className="px-3 py-2 text-center"><Chip tone={GRANT_STATUS[g.status].tone}>{GRANT_STATUS[g.status].label}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-1.5 text-[10px] text-foreground/35">{rows.length} ta · {formatDateUz(GRANTS[0]?.date)} dan</div>
    </GlowCard>
  );
};

export default GrantTracker;
