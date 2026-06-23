// Obodonlashtirish — Ijroiya panel (Executive Overview). 4 modulni birlashtiradi:
// tuman salomatlik indeksi (87/100), modul ballari, umumiy impact, nishonlar.
import { useNavigate } from "react-router-dom";
import { Truck, Droplets, TreePine, Sparkles, Gauge, Wind, Ruler, Boxes, Award, Activity } from "lucide-react";

import { CmdRoot, CmdHeader, Panel } from "@/shared/components/ui/command/primitives";
import { axlatSummary } from "../mock/axlat.data";
import { ymSummary } from "../mock/yashilMakon.data";
import { hasharSummary } from "../mock/hashar.data";
import {
  districtHealth, axlatImpact, assenImpact, ymImpact, hasharImpact, obodBadges,
} from "../mock/insights";
import { InsightCard, ExecScore, ModuleTile, AIInsightPanel, BadgeStrip, SectionTitle, Reveal } from "../components/insight/kit";

const ACCENT = "#10b981";
const PLACE = "Baliqchi tumani, Andijon";

const execInsights = [
  { text: `Tuman salomatlik indeksi ${districtHealth.score}/100 — 4 yo'nalish bo'yicha umumlashtirilgan baho.`, tone: "#10b981" },
  { text: `Eng kuchli yo'nalish: ko'kalamzorlashtirish (tirik qolish ${ymSummary.survivalPct}%).`, tone: "#22c55e" },
  { text: axlatSummary.missed > 0 ? `Chiqindi xizmatida ${axlatSummary.missed} kelmay qolgan marshrut — e'tibor talab.` : "Chiqindi xizmati to'liq nazoratda.", tone: axlatSummary.missed > 0 ? "#f59e0b" : "#22c55e" },
];

const ObodExecPage = () => {
  const navigate = useNavigate();
  return (
    <CmdRoot accent={ACCENT} system="Obodonlashtirish ijroiya paneli (demo)" place={PLACE}>
      <CmdHeader brand="OBODONLASHTIRISH — IJROIYA MARKAZI" place={PLACE} accent={ACCENT} nav={["Umumiy", "Modullar"]} active="Umumiy" />

      {/* Hero — tuman salomatlik indeksi */}
      <Reveal i={0}>
        <Panel title="Tuman salomatlik indeksi" icon={Gauge} accent={ACCENT} source="4 modul umumlashmasi (demo)">
          <ExecScore score={districtHealth.score} parts={districtHealth.parts} accent={ACCENT} />
        </Panel>
      </Reveal>

      {/* Modul ballari — bosib o'tish mumkin */}
      <SectionTitle accent={ACCENT}>Modullar bo'yicha ballar</SectionTitle>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <ModuleTile i={0} icon={Truck} title="Axlat mashinasi" sub="Chiqindi boshqaruvi" accent="#22d3ee"
          score={axlatImpact.cleanlinessIndex} onClick={() => navigate("/owner/obodonlashtirish/axlat")} />
        <ModuleTile i={1} icon={Droplets} title="Gaz mashinasi" sub="Assenizatsiya SLA" accent="#3b82f6"
          score={assenImpact.efficiency} onClick={() => navigate("/owner/obodonlashtirish/assenizatsiya")} />
        <ModuleTile i={2} icon={TreePine} title="Yashil makon" sub="Ko'chat & ekologiya" accent="#22c55e"
          score={ymSummary.survivalPct} onClick={() => navigate("/owner/obodonlashtirish/yashil-makon")} />
        <ModuleTile i={3} icon={Sparkles} title="Tozalov & hashar" sub="Jamoatchilik faolligi" accent="#b794f6"
          score={hasharImpact.engagement} onClick={() => navigate("/owner/obodonlashtirish/hashar")} />
      </div>

      {/* Umumiy impact — 4 modul bo'ylab */}
      <SectionTitle accent={ACCENT}>Umumiy ta'sir (oylik)</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <InsightCard i={0} icon={Boxes} label="Yig'ilgan chiqindi" value={axlatSummary.collectedVolume} suffix=" m³" accent="#22d3ee" decimals={1}
          equivalents={[{ icon: "🚛", text: `${axlatImpact.trucks} ta mashina` }]} />
        <InsightCard i={1} icon={TreePine} label="Ekilgan ko'chat" value={ymSummary.planted} accent="#22c55e"
          equivalents={[{ icon: "🌳", text: `~${ymImpact.mahallasGreen} mahalla qoplamasi` }]} />
        <InsightCard i={2} icon={Wind} label="CO₂ yutilishi" value={ymImpact.co2} suffix=" t/yil" accent="#06b6d4"
          equivalents={[{ icon: "🌍", text: "Ekologik foyda" }]} />
        <InsightCard i={3} icon={Ruler} label="Tozalangan maydon" value={hasharSummary.area} suffix=" ga" accent="#b794f6" decimals={1}
          equivalents={[{ icon: "⚽", text: `${hasharImpact.fields} futbol maydoni` }]} />
      </div>

      {/* AI xulosa + nishonlar */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Reveal i={0}><Panel title="AI ijroiya xulosasi" icon={Activity} accent={ACCENT}><AIInsightPanel insights={execInsights} accent={ACCENT} /></Panel></Reveal>
        <Reveal i={1}><Panel title="Tuman yutuqlari" icon={Award} accent={ACCENT}><BadgeStrip badges={obodBadges} /></Panel></Reveal>
      </div>
    </CmdRoot>
  );
};

export default ObodExecPage;
