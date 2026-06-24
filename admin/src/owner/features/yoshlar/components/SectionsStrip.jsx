// 10 ta maxsus bo'lim — Yoshlar balansi, Yoshlar daftari, Bandlik, Ta'lim, Startaplar,
// Grantlar, Sport, Volontyorlik, Migratsiya, Kelajak liderlari. Har biri 3D glass karta:
// ikon + asosiy raqam + mini progress + qisqa izoh.
import { motion } from "framer-motion";
import {
  Scale, BookMarked, Briefcase, GraduationCap, Rocket,
  Gift, Trophy, HeartHandshake, PlaneTakeoff, Crown,
} from "lucide-react";

import GlowCard from "./ui/GlowCard";
import LiveCounter from "./ui/LiveCounter";
import { youthTotals } from "../mock/youth.data";

const buildSections = () => {
  const t = youthTotals();
  const employed = t.youth - t.unemployed;
  return [
    { icon: Scale, label: "Yoshlar balansi", glow: "6,182,212", value: Math.round((employed / t.youth) * 100), suffix: "%", note: "Ijobiy ko'rsatkichlar ulushi", pct: Math.round((employed / t.youth) * 100) },
    { icon: BookMarked, label: "Yoshlar daftari", glow: "168,139,250", value: t.notebook, note: "Ro'yxatga olingan", pct: Math.round((t.notebook / t.youth) * 100) },
    { icon: Briefcase, label: "Bandlik", glow: "52,211,153", value: employed, note: "Ish bilan ta'minlangan", pct: Math.round((employed / t.youth) * 100) },
    { icon: GraduationCap, label: "Ta'lim", glow: "34,197,94", value: t.students, note: "Talabalar", pct: Math.round((t.students / t.youth) * 100) },
    { icon: Rocket, label: "Startaplar", glow: "16,185,129", value: t.entrepreneurs, note: "Tadbirkor yoshlar", pct: Math.round((t.entrepreneurs / t.youth) * 100) },
    { icon: Gift, label: "Grantlar", glow: "245,158,11", value: 184, note: "Ajratilgan grant (yil)", pct: 62 },
    { icon: Trophy, label: "Sport", glow: "250,204,21", value: Math.round(t.youth * 0.21), note: "Sport bilan shug'ullanuvchi", pct: 21 },
    { icon: HeartHandshake, label: "Volontyorlik", glow: "96,165,250", value: Math.round(t.youth * 0.13), note: "Faol volontyorlar", pct: 13 },
    { icon: PlaneTakeoff, label: "Migratsiya", glow: "239,68,68", value: t.migration, note: "Nazoratdagi migratsiya", pct: Math.round((t.migration / t.youth) * 100) },
    { icon: Crown, label: "Kelajak liderlari", glow: "192,132,252", value: t.talented, note: "Iqtidorli rezerv", pct: Math.round((t.talented / t.youth) * 100) },
  ];
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

const SectionsStrip = () => {
  const sections = buildSections();
  return (
    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <motion.div key={s.label} variants={item}>
            <GlowCard glow={s.glow} className="h-full">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl" style={{ background: `rgba(${s.glow},0.14)`, color: `rgb(${s.glow})` }}>
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-[12px] font-medium text-foreground/70">{s.label}</span>
              </div>
              <div className="mt-3">
                <LiveCounter value={s.value} suffix={s.suffix || ""} live={false} className="text-xl font-bold tabular-nums text-foreground" />
                <div className="mt-1 text-[11px] text-foreground/45">{s.note}</div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, s.pct)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9 }}
                  style={{ background: `rgb(${s.glow})` }}
                />
              </div>
            </GlowCard>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SectionsStrip;
