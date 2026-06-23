// Yoshlar Command Center — bosh dashboard. Glassmorphism + ko'k/cyan accent, dark.
// Tepada KPI grid (10), markazda 3D mahalla xaritasi (heatmap + risk glow) + reyting,
// pastda 10 maxsus bo'lim. O'ngda mahalla paneli, AI yordamchi suzuvchi panel.
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Radar as RadarIcon } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAHALLAS, youthTotals, radarProfile, problematicMahallas, PLACE_LABEL } from "../mock/youth.data";
import KpiGrid from "../components/KpiGrid";
import YouthMapBackground from "../components/map/YouthMapBackground";
import MahallaPanel from "../components/MahallaPanel";
import MahallaRankList from "../components/MahallaRankList";
import AIAssistant from "../components/AIAssistant";
import SectionsStrip from "../components/SectionsStrip";
import YouthRadar from "../components/YouthRadar";

const YoshlarDashboardPage = () => {
  const { activeId, mission, missionIdx, setField, setFields } = useObjectState({
    activeId: null,
    mission: false,
    missionIdx: 0,
  });

  const totals = useMemo(() => youthTotals(), []);
  const active = useMemo(() => MAHALLAS.find((m) => m.id === activeId) || null, [activeId]);
  const problems = useMemo(() => problematicMahallas(), []);
  const missionTarget = mission ? problems[missionIdx % problems.length]?.id : null;

  // Mission Mode — keyingi muammoli mahallaga o'tish (kamera flyTo + panel)
  const toggleMission = () => {
    if (mission) {
      setFields({ mission: false });
      return;
    }
    setFields({ mission: true, missionIdx: 0, activeId: problems[0].id });
  };

  return (
    <div className="relative min-h-[calc(100vh-7rem)] w-full overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(120%_120%_at_50%_0%,#0d1424_0%,#070a12_60%)] p-4">
      {/* fon grid + glow */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(6,182,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.18)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="pointer-events-none absolute -left-32 top-10 size-72 rounded-full bg-cyan-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="relative flex flex-col gap-4">
        {/* sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-end justify-between gap-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 animate-pulse rounded-full bg-cyan-400" />
              <h1 className="bg-gradient-to-r from-cyan-200 via-white to-blue-200 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                Yoshlar Analitikasi
              </h1>
            </div>
            <p className="mt-0.5 text-[12px] text-white/45">
              Yoshlar ishlari agentligi · {PLACE_LABEL} · 15 mahalla real-time monitoring
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/55 backdrop-blur-xl">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Tizim faol · {new Date().toLocaleDateString("uz-UZ")}
          </div>
        </motion.div>

        {/* KPI grid (10) */}
        <KpiGrid totals={totals} />

        {/* xarita + reyting + radar */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          {/* xarita */}
          <div className="relative h-[480px] overflow-hidden rounded-2xl border border-white/10">
            <YouthMapBackground
              mahallas={MAHALLAS}
              activeId={activeId}
              missionTarget={missionTarget}
              onSelect={(id) => setFields({ activeId: id === activeId ? null : id, mission: false })}
            />
            {/* o'ngda mahalla paneli */}
            <div className="pointer-events-none absolute bottom-3 right-3 top-3 z-20 overflow-y-auto">
              <AnimatePresence>
                {active && (
                  <div className="pointer-events-auto">
                    <MahallaPanel mahalla={active} onClose={() => setField("activeId", null)} />
                  </div>
                )}
              </AnimatePresence>
            </div>
            {/* mission indikatori */}
            <AnimatePresence>
              {mission && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-3 top-3 z-20 flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/15 px-3 py-1.5 text-[11px] font-semibold text-rose-200 backdrop-blur-xl"
                >
                  <span className="size-1.5 animate-ping rounded-full bg-rose-400" />
                  MISSION MODE · {problems[missionIdx % problems.length]?.shortName}
                  <button
                    onClick={() => setFields({ missionIdx: missionIdx + 1, activeId: problems[(missionIdx + 1) % problems.length].id })}
                    className="ml-1 rounded-md bg-rose-400/20 px-1.5 py-0.5 hover:bg-rose-400/30"
                  >
                    keyingisi →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* o'ng ustun — reyting + umumiy radar */}
          <div className="flex flex-col gap-4">
            <div className="h-[280px]">
              <MahallaRankList mahallas={MAHALLAS} activeId={activeId} onSelect={(id) => setField("activeId", id)} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b0f17]/70 p-3 backdrop-blur-xl">
              <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-white/70">
                <RadarIcon className="size-3.5 text-cyan-300" /> {active ? active.shortName : "Umumiy"} profil
              </div>
              <YouthRadar data={radarProfile(active)} color={active ? "#22d3ee" : "#06b6d4"} height={170} />
            </div>
          </div>
        </div>

        {/* 10 maxsus bo'lim */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-white">Yo'nalishlar</h2>
            <span className="text-[12px] text-white/40">10 ta strategik bo'lim</span>
          </div>
          <SectionsStrip />
        </div>
      </div>

      {/* suzuvchi AI yordamchi */}
      <div className="fixed bottom-6 right-6 z-50">
        <AIAssistant onMission={toggleMission} missionActive={mission} />
      </div>
    </div>
  );
};

export default YoshlarDashboardPage;
