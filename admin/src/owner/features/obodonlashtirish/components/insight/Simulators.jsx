// Interaktiv "wow" panellar: Impact simulyatori + 2026→2030 prognoz slayderi.
import { motion } from "framer-motion";
import { TreePine, Wind, Cloud } from "lucide-react";

import { hexA } from "@/shared/components/ui/command/primitives";
import useObjectState from "@/shared/hooks/useObjectState";

// Bir daraxt: ~118 kg CO₂/yil yutadi, ~100 kg O₂/yil ajratadi (demo koeffitsient)
const CO2_PER_TREE = 118;
const O2_PER_TREE = 100;
// 1 mahalla yashil qoplamasi uchun ~4000 daraxt (demo)
const TREES_PER_MAHALLA = 4000;

// ── "Agar yana N ko'chat eksak" simulyatori ──
export const ImpactSimulator = ({ basePlanted, baseCoverage, accent }) => {
  const { extra, setField } = useObjectState({ extra: 10000 });
  const totalTrees = basePlanted + extra;
  // har 4000 daraxt ≈ +0.6% qoplama (demo)
  const addedCoverage = Math.round((extra / TREES_PER_MAHALLA) * 0.6 * 10) / 10;
  const newCoverage = Math.round((baseCoverage + addedCoverage) * 10) / 10;
  const co2 = Math.round((extra * CO2_PER_TREE) / 1000); // tonna/yil
  const mahallas = (extra / TREES_PER_MAHALLA).toFixed(1);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-foreground/60">Agar yana ekilsa:</span>
        <span className="font-mono text-base font-bold tabular-nums" style={{ color: accent }}>+{extra.toLocaleString("uz-UZ")} ko'chat</span>
      </div>
      <input type="range" min={0} max={50000} step={1000} value={extra}
        onChange={(e) => setField("extra", Number(e.target.value))}
        className="mt-3 w-full accent-emerald-400" style={{ accentColor: accent }} />
      <div className="mt-1 flex justify-between text-[9px] text-foreground/30"><span>0</span><span>50 000</span></div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: TreePine, label: "Jami daraxt", value: totalTrees.toLocaleString("uz-UZ") },
          { icon: Cloud, label: "Qo'shilgan qoplama", value: `+${addedCoverage}%` },
          { icon: Wind, label: "CO₂ yutilishi", value: `${co2.toLocaleString("uz-UZ")} t/yil` },
        ].map((c, i) => (
          <div key={i} className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-2.5 text-center">
            <c.icon className="mx-auto size-4" style={{ color: accent }} />
            <div className="mt-1.5 font-mono text-[13px] font-bold tabular-nums text-foreground">{c.value}</div>
            <div className="text-[9px] text-foreground/40">{c.label}</div>
          </div>
        ))}
      </div>

      <motion.div key={newCoverage} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}
        className="mt-3 rounded-xl border p-2.5 text-center text-[11.5px]"
        style={{ borderColor: hexA(accent, 0.3), background: hexA(accent, 0.06) }}>
        Ko'kalamzorlik <span className="font-bold text-foreground">{baseCoverage}%</span> →{" "}
        <span className="font-mono font-bold" style={{ color: accent }}>{newCoverage}%</span>
        {" "}· taxminan <span className="font-bold text-foreground">{mahallas}</span> mahalla qamrovi
      </motion.div>
    </div>
  );
};

// ── 2026 → 2030 prognoz slayderi ──
export const FutureProjection = ({ baseYear = 2026, baseCoverage, target = 30, accent }) => {
  const { year, setField } = useObjectState({ year: 2026 });
  const endYear = 2030;
  const span = endYear - baseYear;
  const progress = (year - baseYear) / span;
  // chiziqli interpolatsiya base → target
  const coverage = Math.round((baseCoverage + (target - baseCoverage) * progress) * 10) / 10;
  const treesCum = Math.round(28000 + (200000 - 28000) * progress); // demo yillik kümülativ

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-foreground/60">Prognoz yili</span>
        <span className="font-mono text-xl font-bold tabular-nums" style={{ color: accent, textShadow: `0 0 12px ${hexA(accent, 0.5)}` }}>{year}</span>
      </div>
      <input type="range" min={baseYear} max={endYear} step={1} value={year}
        onChange={(e) => setField("year", Number(e.target.value))}
        className="mt-3 w-full" style={{ accentColor: accent }} />
      <div className="mt-1 flex justify-between text-[9px] text-foreground/30">
        {[2026, 2027, 2028, 2029, 2030].map((y) => <span key={y} className={year === y ? "font-bold text-foreground/70" : ""}>{y}</span>)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3 text-center">
          <div className="font-mono text-2xl font-bold tabular-nums" style={{ color: accent }}>{coverage}%</div>
          <div className="text-[10px] text-foreground/45">Ko'kalamzorlik</div>
          <div className="mt-1 text-[9px] text-foreground/30">maqsad: {target}%</div>
        </div>
        <div className="rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-3 text-center">
          <div className="font-mono text-2xl font-bold tabular-nums text-foreground">{treesCum.toLocaleString("uz-UZ")}</div>
          <div className="text-[10px] text-foreground/45">Ekilgan ko'chat (küm.)</div>
          <div className="mt-1 text-[9px] text-foreground/30">{year} yilga</div>
        </div>
      </div>
      <div className="mt-2 text-center text-[10px] text-foreground/40">
        PF-47 maqsadi: 2030 yilga {target}% ko'kalamzorlik
      </div>
    </div>
  );
};
