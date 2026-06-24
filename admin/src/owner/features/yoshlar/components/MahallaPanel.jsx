// Mahalla tanlanganda o'ngdan chiqadigan panel — score, asosiy raqamlar, radar profil
// va 5 AI qatlami (risk, imkoniyat, bandlik prognozi, migratsiya, karyera tavsiyasi).
import { motion } from "framer-motion";
import { X, ShieldAlert, TrendingUp, Briefcase, PlaneTakeoff, Lightbulb } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import {
  SCORE_TIERS, tierOfScore, radarProfile,
  aiRiskScore, aiOpportunityScore, aiEmploymentForecast, aiMigrationLevel, aiCareerRecommendation,
} from "../mock/youth.data";
import AIBadge from "./ui/AIBadge";
import YouthRadar from "./YouthRadar";

const Stat = ({ label, value, tone = "text-foreground" }) => (
  <div className="rounded-xl border border-foreground/10 bg-muted/40 px-2.5 py-2">
    <div className="text-[10px] text-foreground/45">{label}</div>
    <div className={cn("mt-0.5 text-[15px] font-bold tabular-nums", tone)}>{value}</div>
  </div>
);

const AIRow = ({ icon: Icon, label, value, tone = "text-cyan-300", bar }) => (
  <div className="rounded-xl border border-foreground/10 bg-muted/40 p-2.5">
    <div className="flex items-center gap-1.5 text-[11px] text-foreground/55">
      <Icon className="size-3.5" /> {label}
    </div>
    <div className={cn("mt-1 text-[13px] font-semibold", tone)}>{value}</div>
    {typeof bar === "number" && (
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${bar}%` }}
          transition={{ duration: 0.8 }}
          style={{ background: "currentColor" }}
        />
      </div>
    )}
  </div>
);

const MahallaPanel = ({ mahalla, onClose }) => {
  if (!mahalla) return null;
  const tier = SCORE_TIERS[tierOfScore(mahalla.score)];
  const risk = aiRiskScore(mahalla);
  const opp = aiOpportunityScore(mahalla);
  const forecast = aiEmploymentForecast(mahalla);
  const mig = aiMigrationLevel(mahalla);
  const career = aiCareerRecommendation(mahalla);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
      className="w-[330px] overflow-hidden rounded-2xl border border-foreground/10 bg-card/80 backdrop-blur-2xl shadow-2xl"
    >
      <div className="flex flex-col gap-3 p-4">
        {/* sarlavha + score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="grid size-12 place-items-center rounded-2xl text-lg font-bold text-white"
              style={{ background: `radial-gradient(circle at 35% 30%, rgba(${tier.glow},0.9), rgba(${tier.glow},0.5))`, boxShadow: `0 0 22px rgba(${tier.glow},0.6)` }}
            >
              {mahalla.score}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">{mahalla.name}</h3>
              <span className="text-[11px] font-medium" style={{ color: tier.color }}>{tier.label}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Yopish" className="grid size-7 place-items-center rounded-lg text-foreground/50 hover:bg-foreground/10 hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* asosiy raqamlar */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Yoshlar" value={mahalla.youth.toLocaleString("uz-UZ")} tone="text-cyan-300" />
          <Stat label="Ishsiz" value={mahalla.unemployed} tone="text-rose-300" />
          <Stat label="Talaba" value={mahalla.students} tone="text-emerald-300" />
          <Stat label="IT" value={mahalla.itLearners} tone="text-cyan-300" />
          <Stat label="Tadbirkor" value={mahalla.entrepreneurs} tone="text-emerald-300" />
          <Stat label="Iqtidorli" value={mahalla.talented} tone="text-yellow-300" />
        </div>

        {/* radar */}
        <div className="rounded-xl border border-foreground/10 bg-muted/40 pt-2">
          <div className="px-3 text-[11px] font-medium text-foreground/55">Yoshlar profili</div>
          <YouthRadar data={radarProfile(mahalla)} color={tier.color} height={170} />
        </div>

        {/* AI qatlamlari */}
        <div className="flex items-center gap-2">
          <AIBadge /> <span className="text-[12px] font-medium text-foreground/70">Sun'iy intellekt tahlili</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-rose-300">
            <AIRow icon={ShieldAlert} label="Risk darajasi" value={`${risk}/100`} tone="text-rose-300" bar={risk} />
          </div>
          <div className="text-cyan-300">
            <AIRow icon={TrendingUp} label="Imkoniyat indeksi" value={`${opp}/100`} tone="text-cyan-300" bar={opp} />
          </div>
          <div className="text-emerald-300">
            <AIRow icon={Briefcase} label="Bandlik prognozi (6 oy)" value={`${forecast}%`} tone="text-emerald-300" bar={forecast} />
          </div>
          <AIRow icon={PlaneTakeoff} label="Migratsiya bosimi" value={`${mig.level} (${mig.value}%)`} tone={mig.tone === "danger" ? "text-rose-300" : mig.tone === "progress" ? "text-amber-300" : "text-emerald-300"} />
        </div>

        {/* karyera tavsiyasi */}
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
            <Lightbulb className="size-3.5" /> AI karyera tavsiyasi
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-foreground/75">{career}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MahallaPanel;
