// Suzuvchi AI yordamchi paneli — pastki o'ngda. Yopiq holatda pulslangan tugma;
// ochilganda hudud bo'yicha AI xulosalari + "Mission Mode" tugmasi (kamera muammoli
// mahallaga uchadi). insights — tayyor matnlar (deterministik formuladan).
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Crosshair, ShieldAlert, TrendingUp, PlaneTakeoff, Sparkles } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import {
  MAHALLAS, youthTotals, problematicMahallas,
  aiRiskScore, aiOpportunityScore, aiEmploymentForecast,
} from "../mock/youth.data";

const buildInsights = () => {
  const t = youthTotals();
  const worst = problematicMahallas()[0];
  const best = [...MAHALLAS].sort((a, b) => aiOpportunityScore(b) - aiOpportunityScore(a))[0];
  const avgForecast = Math.round(MAHALLAS.reduce((s, m) => s + aiEmploymentForecast(m), 0) / MAHALLAS.length);
  return [
    {
      icon: ShieldAlert,
      tone: "text-rose-300",
      title: "Risk aniqlash",
      text: `Eng yuqori risk — ${worst.name} (risk ${aiRiskScore(worst)}/100). Ishsizlik va migratsiya bosimi yuqori. Tezkor aralashuv tavsiya etiladi.`,
    },
    {
      icon: TrendingUp,
      tone: "text-cyan-300",
      title: "Imkoniyat tahlili",
      text: `Eng katta imkoniyat — ${best.name} (indeks ${aiOpportunityScore(best)}/100). IT va tadbirkorlik markazi sifatida kuchaytirish mumkin.`,
    },
    {
      icon: PlaneTakeoff,
      tone: "text-amber-300",
      title: "Migratsiya tahlili",
      text: `Hududda ${t.migration.toLocaleString("uz-UZ")} nafar migratsiya bosimi ostida. Mahalliy ish o'rinlari yaratish migratsiyani ~12% kamaytiradi (prognoz).`,
    },
    {
      icon: Sparkles,
      tone: "text-emerald-300",
      title: "Bandlik prognozi",
      text: `Kelgusi 6 oyda o'rtacha bandlik ${avgForecast}% ga yetishi kutilmoqda. Grant + bootcamp dasturlari bilan +4-6% qo'shimcha o'sish mumkin.`,
    },
  ];
};

const AIAssistant = ({ onMission, missionActive }) => {
  const [open, setOpen] = useState(false);
  const insights = buildInsights();

  return (
    <>
      {/* trigger */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="relative grid size-14 place-items-center rounded-full border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 backdrop-blur-xl"
        style={{ boxShadow: "0 0 28px rgba(6,182,212,0.5)" }}
        aria-label="AI yordamchi"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/30" />
        {open ? <X className="size-6" /> : <Bot className="size-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="absolute bottom-16 right-0 w-80 overflow-hidden rounded-2xl border border-cyan-400/20 bg-card/90 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Bot className="size-4" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-foreground">AI Komandir</div>
                  <div className="text-[10px] text-cyan-300/70">Yoshlar tahlil yordamchisi</div>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> onlayn
              </span>
            </div>

            <div className="flex max-h-[46vh] flex-col gap-2 overflow-y-auto p-3">
              {insights.map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.title} className="rounded-xl border border-foreground/10 bg-muted/40 p-2.5">
                    <div className={cn("flex items-center gap-1.5 text-[11px] font-semibold", it.tone)}>
                      <Icon className="size-3.5" /> {it.title}
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-foreground/70">{it.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-foreground/10 p-3">
              <button
                type="button"
                onClick={onMission}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors",
                  missionActive
                    ? "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                    : "bg-cyan-500/90 text-white hover:bg-cyan-500",
                )}
              >
                <Crosshair className="size-4" />
                {missionActive ? "Mission Mode faol — to'xtatish" : "Mission Mode'ni ishga tushirish"}
              </button>
              <p className="mt-1.5 text-center text-[10px] text-foreground/40">
                AI kamerani muammoli mahallalarga avtomatik olib boradi
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
