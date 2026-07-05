import { motion } from "framer-motion";
import { Building2, Factory, Home, MapPin, Route, Users } from "lucide-react";

import AnimatedCounter from "@/shared/components/ui/counter/AnimatedCounter";
import { PASSPORT } from "../data/sarnovul.data";

const Stat = ({ icon: Icon, label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
  >
    <span className="grid size-10 place-items-center rounded-xl bg-white/15">
      <Icon className="size-5 text-white/85" strokeWidth={2} />
    </span>
    <div className="leading-tight">
      <AnimatedCounter value={value} duration={1400} className="text-2xl font-bold tabular-nums text-white" />
      <div className="text-[11.5px] text-white/65">{label}</div>
    </div>
  </motion.div>
);

const SarnovulHero = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#155e75] p-6 text-white shadow-lg md:p-8">
    {/* nafas oluvchi nur dog'lari */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-emerald-300/25 blur-3xl"
    />
    <motion.div
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.35, 0.2] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      className="pointer-events-none absolute -bottom-20 left-1/4 size-56 rounded-full bg-cyan-300/20 blur-3xl"
    />

    <div className="relative flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Building2 className="size-8 text-emerald-200" strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{PASSPORT.name}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="size-3.5" />
              {PASSPORT.district}, {PASSPORT.region}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-sm">
          Mahalla raqamli pasporti
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Home} label="Xonadon" value={PASSPORT.households} delay={0.1} />
        <Stat icon={Users} label="Aholi soni" value={PASSPORT.population} delay={0.2} />
        <Stat icon={Factory} label="Korxonalar" value={PASSPORT.enterprises} delay={0.3} />
        <Stat icon={Route} label="Ko'chalar" value={PASSPORT.streets} delay={0.4} />
      </div>
    </div>
  </div>
);

export default SarnovulHero;
