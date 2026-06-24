// Eko Faol Fuqaro — oilalar eko-ball reytingi + Yashil oila status + ball turlari.
import { Leaf, Trophy } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import { ECO_FAMILIES, ECO_ACTIONS } from "../../mock/ecoCitizen.data";

const ACCENT = "#22c55e";
const MEDAL = ["#fbbf24", "#cbd5e1", "#d97706"];

export const EcoCitizen = () => {
  const maxPoints = Math.max(...ECO_FAMILIES.map((f) => f.points), 1);
  return (
    <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-[1fr_280px]">
      {/* reyting */}
      <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card">
        <div className="border-b border-[rgb(var(--card-border))] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-foreground/55">
          Eko-faol oilalar reytingi
        </div>
        <div className="max-h-[320px] overflow-y-auto p-1.5">
          {ECO_FAMILIES.map((f, i) => {
            const color = i < 3 ? MEDAL[i] : ACCENT;
            return (
              <div key={f.id} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-muted/40">
                <span className="grid size-6 shrink-0 place-items-center rounded-md font-mono text-[11px] font-bold" style={{ background: hexA(color, 0.15), color }}>
                  {i < 3 ? <Trophy className="size-3" /> : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[12px] font-medium text-foreground">{f.name}</span>
                    {f.greenFamily && <span className="rounded px-1 py-px text-[8.5px] font-bold" style={{ background: hexA(ACCENT, 0.16), color: ACCENT }}>🌿 YASHIL OILA</span>}
                  </div>
                  <div className="text-[10px] text-foreground/45">{f.mahalla} · {f.trees} daraxt · {f.solar} kW quyosh</div>
                </div>
                <div className="h-1 w-16 shrink-0 overflow-hidden rounded-full bg-foreground/5">
                  <div className="h-full rounded-full" style={{ width: `${(f.points / maxPoints) * 100}%`, background: color }} />
                </div>
                <span className="w-14 shrink-0 text-right font-mono text-[12px] font-bold tabular-nums" style={{ color }}>{f.points.toLocaleString("uz-UZ")}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ball turlari */}
      <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground/55">
          <Leaf className="size-3.5" style={{ color: ACCENT }} /> Ball qanday yig'iladi
        </div>
        <div className="space-y-1.5">
          {ECO_ACTIONS.map((a) => (
            <div key={a.key} className="flex items-center justify-between rounded-lg border border-[rgb(var(--card-border))] bg-muted/40 px-2.5 py-1.5">
              <span className="flex items-center gap-1.5 text-[11.5px] text-foreground/75"><span>{a.icon}</span> {a.label}</span>
              <span className="font-mono text-[12px] font-bold tabular-nums" style={{ color: ACCENT }}>+{a.points}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[9.5px] text-foreground/40">ecofaolfuqaro.uz uslubida · ONE ID orqali</div>
      </div>
    </div>
  );
};
