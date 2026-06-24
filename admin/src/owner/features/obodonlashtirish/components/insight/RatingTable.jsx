// Operator/mahalla reytingi — 7 metrikli jadval + qatorni bosganda metrik breakdown.
import { Trophy, Info } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import useObjectState from "@/shared/hooks/useObjectState";
import { OPERATOR_RATINGS, RATING_METRICS } from "../../mock/operatorRating.data";

const ACCENT = "#10b981";
const MEDAL = ["#fbbf24", "#cbd5e1", "#d97706"];

// Metrik breakdown — tanlangan mahalla
const Breakdown = ({ row }) => (
  <div className="border-t bg-foreground/[0.015] p-3" style={{ borderColor: "rgb(var(--card-border))" }}>
    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
      {row.name} — metrik tahlili (aholi: {row.population.toLocaleString("uz-UZ")})
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {RATING_METRICS.map((m) => {
        const v = row.norm[m.key];
        const col = v >= 70 ? "#22c55e" : v >= 50 ? "#f59e0b" : "#ef4444";
        return (
          <div key={m.key} className="flex items-center gap-2">
            <div className="w-28 shrink-0">
              <div className="text-[11px] text-foreground/75">{m.label}</div>
              <div className="text-[9px] text-foreground/35">×{m.weight}</div>
            </div>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
              <div className="h-full rounded-full" style={{ width: `${v}%`, background: col, boxShadow: `0 0 6px ${hexA(col, 0.5)}` }} />
            </div>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums" style={{ color: col }}>{v}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export const RatingTable = () => {
  const { open, showMethod, setField } = useObjectState({ open: null, showMethod: false });

  return (
    <div className="p-2">
      {/* metodologiya tugma */}
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-[10px] text-foreground/40">Qatorni bosib metrik tahlilni oching</span>
        <button onClick={() => setField("showMethod", !showMethod)} className="flex items-center gap-1 text-[10px] text-foreground/55 hover:text-foreground">
          <Info className="size-3" /> Ball qanday hisoblanadi?
        </button>
      </div>
      {showMethod && (
        <div className="mb-2 rounded-lg border border-[rgb(var(--card-border))] bg-foreground/[0.02] p-2.5 text-[10.5px] text-foreground/60">
          Umumiy ball = 7 metrikning <b className="text-foreground/80">vaznli o'rtachasi</b> (0–100). Vaznlar: {RATING_METRICS.map((m) => `${m.label} ×${m.weight}`).join(" · ")}. Manba: xalqnazorati.uz metodologiyasi (demo).
        </div>
      )}

      <div className="glass-table overflow-hidden rounded-lg border border-[rgb(var(--card-border))]">
        <table className="w-full text-[12px] [&_tbody_tr]:bg-transparent [&_tbody_tr:last-child]:bg-transparent">
          <thead className="bg-card">
            <tr className="border-b border-[rgb(var(--card-border))] text-foreground/55">
              <th className="px-3 py-2 text-left font-medium">#</th>
              <th className="px-3 py-2 text-left font-medium">Mahalla / operator</th>
              <th className="px-3 py-2 text-right font-medium">Bajarilgan</th>
              <th className="px-3 py-2 text-right font-medium">Kechikkan</th>
              <th className="px-3 py-2 text-right font-medium">Faollik</th>
              <th className="px-3 py-2 text-right font-medium">Umumiy ball</th>
              <th className="px-3 py-2 text-center font-medium">Daraja</th>
            </tr>
          </thead>
          <tbody>
            {OPERATOR_RATINGS.map((row, i) => {
              const isOpen = open === row.name;
              const medalColor = i < 3 ? MEDAL[i] : "hsl(var(--muted-foreground))";
              return (
                <>
                  <tr key={row.name} onClick={() => setField("open", isOpen ? null : row.name)}
                    className="cursor-pointer border-b border-[rgb(var(--card-border))] transition-colors hover:bg-foreground/[0.03]"
                    style={isOpen ? { background: hexA(ACCENT, 0.05) } : undefined}>
                    <td className="px-3 py-2">
                      <span className="grid size-6 place-items-center rounded-md font-mono text-[11px] font-bold" style={{ background: hexA(i < 3 ? MEDAL[i] : "#64748b", 0.15), color: medalColor }}>
                        {i < 3 ? <Trophy className="size-3" /> : i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">{row.name}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground/80">{row.raw.resolved}%</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums" style={{ color: row.raw.overdue > 0 ? "#ef4444" : undefined }}>{row.raw.overdue}</td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums text-foreground/80">{row.raw.activity}</td>
                    <td className="px-3 py-2 text-right font-mono text-[14px] font-bold tabular-nums" style={{ color: ACCENT, textShadow: `0 0 10px ${hexA(ACCENT, 0.4)}` }}>{row.score}</td>
                    <td className="px-3 py-2 text-center"><StatusBadge tone={row.tierTone}>{row.tier}</StatusBadge></td>
                  </tr>
                  {isOpen && <tr key={`${row.name}-bd`}><td colSpan={7} className="p-0"><Breakdown row={row} /></td></tr>}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
