// Aqlli chiqindi idishlari — STATISTIKA EMAS. Har chelak vizual to'ladi (suyuqlik animatsiyasi),
// rang: yashil→sariq→qizil. Mahalla tanlanadi, olib ketish ETA + chiqindi tarkibi.
import { motion } from "framer-motion";
import { Trash2, Truck, Recycle, Clock, AlertTriangle, Package, Box } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import { useCountUp } from "@/shared/components/ui/counter/AnimatedCounter";
import useObjectState from "@/shared/hooks/useObjectState";
import {
  BINS_BY_MAHALLA, binMahallaStats, binSummary, BIN_STATUS, fillStatus,
  wasteComposition, wasteSummary,
} from "../../mock/smartBins.data";

const ACCENT = "#22d3ee";

// Bitta chelak — vizual to'ladi (suyuqlik)
const Bin = ({ bin, i }) => {
  const st = BIN_STATUS[bin.status];
  const col = st.color;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-[rgb(var(--card-border))] bg-card p-2.5">
      {/* chelak SVG */}
      <div className="relative" style={{ width: 56, height: 70 }}>
        <svg viewBox="0 0 56 72" className="h-full w-full">
          <defs>
            <clipPath id={`bin-${bin.id}`}>
              <path d="M8,18 L48,18 L44,68 Q44,70 42,70 L14,70 Q12,70 12,68 Z" />
            </clipPath>
          </defs>
          {/* idish ichi (bo'sh fon) */}
          <path d="M8,18 L48,18 L44,68 Q44,70 42,70 L14,70 Q12,70 12,68 Z" fill="hsl(var(--muted))" />
          {/* to'lgan suyuqlik — pastdan ko'tariladi */}
          <motion.rect x="0" width="56" clipPath={`url(#bin-${bin.id})`} fill={col} fillOpacity={0.85}
            initial={{ y: 72, height: 0 }} animate={{ y: 72 - (bin.fill / 100) * 54, height: (bin.fill / 100) * 54 }}
            transition={{ delay: 0.2 + i * 0.04, duration: 1, ease: "easeOut" }} />
          {/* to'la bo'lsa — ogohlantirish puls */}
          {bin.status === "full" && (
            <motion.path d="M8,18 L48,18 L44,68 Q44,70 42,70 L14,70 Q12,70 12,68 Z" fill="none" stroke={col} strokeWidth={2}
              animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
          )}
          {/* idish konturi + qopqoq */}
          <path d="M8,18 L48,18 L44,68 Q44,70 42,70 L14,70 Q12,70 12,68 Z" fill="none" stroke="hsl(var(--foreground)/0.3)" strokeWidth={1.5} />
          <rect x="5" y="12" width="46" height="6" rx="2" fill="hsl(var(--foreground)/0.35)" />
          <rect x="24" y="7" width="8" height="5" rx="1.5" fill="hsl(var(--foreground)/0.35)" />
        </svg>
        {/* foiz overlay */}
        <div className="absolute inset-x-0 bottom-[26px] text-center">
          <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: bin.fill > 45 ? "#fff" : "hsl(var(--foreground))", textShadow: bin.fill > 45 ? "0 1px 2px rgba(0,0,0,0.5)" : "none" }}>{bin.fill}%</span>
        </div>
      </div>
      {/* ko'cha + ETA */}
      <div className="text-center leading-tight">
        <div className="max-w-[72px] truncate text-[10px] font-medium text-foreground/75">{bin.street}</div>
        <div className="flex items-center justify-center gap-0.5 text-[9px]" style={{ color: col }}>
          <Clock className="size-2.5" /> {bin.etaHours}s
        </div>
      </div>
    </motion.div>
  );
};

export const SmartBins = () => {
  const { mahalla, setField } = useObjectState({ mahalla: BINS_BY_MAHALLA[0].mahalla });
  const current = BINS_BY_MAHALLA.find((m) => m.mahalla === mahalla) || BINS_BY_MAHALLA[0];
  const stat = binMahallaStats.find((s) => s.mahalla === mahalla);

  const avgFill = useCountUp(binSummary.avgFill, 1200);

  return (
    <div className="p-3">
      {/* KPI qatori */}
      <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          { icon: Trash2, label: "Jami chelaklar", value: binSummary.totalBins, suffix: "", c: ACCENT },
          { icon: AlertTriangle, label: "O'rtacha to'lganlik", value: avgFill, suffix: "%", c: avgFill > 70 ? "#ef4444" : avgFill > 45 ? "#f59e0b" : "#22c55e" },
          { icon: Truck, label: "O'rtacha olib ketish", value: binSummary.avgEta, suffix: " soat", c: ACCENT },
          { icon: AlertTriangle, label: "To'la chelaklar", value: binSummary.full, suffix: "", c: "#ef4444" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-[rgb(var(--card-border))] bg-card px-3 py-2">
            <m.icon className="size-4" style={{ color: m.c }} />
            <div className="mt-1 font-mono text-[18px] font-bold tabular-nums text-foreground">
              {typeof m.value === "number" ? m.value : m.value}{m.suffix}
            </div>
            <div className="text-[10px] text-foreground/45">{m.label}</div>
          </div>
        ))}
      </div>

      {/* mahalla tanlash */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-foreground/50">Mahalla:</span>
        {BINS_BY_MAHALLA.map(({ mahalla: m }) => {
          const ms = binMahallaStats.find((s) => s.mahalla === m);
          const active = m === mahalla;
          const c = ms.avgFill > 70 ? "#ef4444" : ms.avgFill > 45 ? "#f59e0b" : "#22c55e";
          return (
            <button key={m} onClick={() => setField("mahalla", m)}
              className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={active ? { borderColor: hexA(ACCENT, 0.5), background: hexA(ACCENT, 0.12), color: ACCENT } : { borderColor: "rgb(var(--card-border))", color: "hsl(var(--muted-foreground))" }}>
              <span className="size-1.5 rounded-full" style={{ background: c }} /> {m}
            </button>
          );
        })}
      </div>

      {/* 10 ta chelak — tanlangan mahalla */}
      <div className="rounded-xl border border-[rgb(var(--card-border))] bg-muted/20 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-semibold text-foreground">{mahalla} MFY — 10 ta chelak</span>
          <span className="text-[11px] text-foreground/55">O'rtacha to'lganlik: <b style={{ color: stat.avgFill > 70 ? "#ef4444" : stat.avgFill > 45 ? "#f59e0b" : "#22c55e" }}>{stat.avgFill}%</b> · {stat.full} ta to'la</span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {current.bins.map((b, i) => <Bin key={b.id} bin={b} i={i} />)}
        </div>
        {/* legenda */}
        <div className="mt-2 flex flex-wrap gap-3 text-[9.5px] text-foreground/50">
          {Object.values(BIN_STATUS).map((s) => (
            <span key={s.label} className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ background: s.color }} /> {s.label} ({s.from}%+)</span>
          ))}
        </div>
      </div>

      {/* chiqindi tarkibi + olib ketish */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* chiqindi turlari */}
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Recycle className="size-3.5" style={{ color: ACCENT }} />
            <span className="text-[12px] font-semibold text-foreground">Chiqindi tarkibi (oylik)</span>
            <span className="ml-auto text-[10px] text-foreground/50">{wasteSummary.recyclablePct}% qayta ishlanadi</span>
          </div>
          {/* stacked bar */}
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            {wasteComposition.map((w) => (
              <motion.div key={w.key} initial={{ width: 0 }} animate={{ width: `${w.pct}%` }} transition={{ duration: 0.9 }}
                title={`${w.label}: ${w.pct}%`} style={{ background: w.color }} />
            ))}
          </div>
          {/* turlar ro'yxati */}
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
            {wasteComposition.map((w) => (
              <div key={w.key} className="flex items-center gap-1.5 text-[11px]">
                <span className="size-2.5 rounded-sm" style={{ background: w.color }} />
                <span className="flex-1 text-foreground/70">{w.label}</span>
                <span className="font-mono tabular-nums text-foreground/55">{w.tons} t</span>
                <b className="w-8 text-right font-mono tabular-nums" style={{ color: w.color }}>{w.pct}%</b>
              </div>
            ))}
          </div>
          {/* plastik ajratib */}
          <div className="mt-2 flex items-center gap-2 rounded-lg border px-2.5 py-1.5" style={{ borderColor: hexA("#3b82f6", 0.3), background: hexA("#3b82f6", 0.06) }}>
            <Package className="size-4 text-blue-500" />
            <span className="text-[11px] text-foreground/70">Plastik chiqindi: <b className="font-mono text-blue-600 dark:text-blue-400">{wasteSummary.plasticTons} t/oy</b> ({wasteSummary.plasticPct}%) — qayta ishlashga yaroqli</span>
          </div>
        </div>

        {/* olib ketish jadvali */}
        <div className="rounded-xl border border-[rgb(var(--card-border))] bg-card p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Truck className="size-3.5" style={{ color: ACCENT }} />
            <span className="text-[12px] font-semibold text-foreground">Mahalla bo'yicha to'lganlik & olib ketish</span>
          </div>
          <div className="space-y-1.5">
            {[...binMahallaStats].sort((a, b) => b.avgFill - a.avgFill).map((s) => {
              const c = s.avgFill > 70 ? "#ef4444" : s.avgFill > 45 ? "#f59e0b" : "#22c55e";
              return (
                <div key={s.mahalla} className="flex items-center gap-2 text-[11px]">
                  <span className="w-16 shrink-0 truncate text-foreground/70">{s.mahalla}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.avgFill}%` }} transition={{ duration: 0.8 }}
                      className="h-full rounded-full" style={{ background: c, boxShadow: `0 0 6px ${hexA(c, 0.5)}` }} />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono tabular-nums" style={{ color: c }}>{s.avgFill}%</span>
                  {s.full > 0 && <span className="flex items-center gap-0.5 text-[9.5px] text-rose-500"><AlertTriangle className="size-2.5" />{s.full}</span>}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-[rgb(var(--card-border))] bg-muted/30 px-2.5 py-1.5 text-[10.5px] text-foreground/60">
            <Box className="size-3.5" style={{ color: ACCENT }} />
            Ko'p qavatli: 1×/kun · xususiy sektor: 1×/3 kun (VM 95-son normasi)
          </div>
        </div>
      </div>
    </div>
  );
};
