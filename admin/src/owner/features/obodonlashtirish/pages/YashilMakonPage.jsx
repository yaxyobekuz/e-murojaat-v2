// Yashil makon — Command Center. Ma'lumot o'zgarmagan. Survival radar, qoplama ringi,
// ekologik impact (O₂/CO₂), impact simulyatori, 2026→2030 prognozi.
import { Activity, Car, Cloud, Database, Droplet, Leaf, MapPin, Sparkles, Sprout, Target, TreePine, Wind } from "lucide-react";

import { CmdRoot, CmdHeader, Panel, Donut } from "@/shared/components/ui/command/primitives";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import DataTable from "@/shared/components/ui/table/DataTable";
import {
  YM_PLACE, YM_PLANTINGS, YM_BY_TYPE, TREE_TYPE, SEASON, ymSummary as s,
} from "../mock/yashilMakon.data";
import { ymImpact as im, ymInsights, ymTrends } from "../mock/insights";
import { InsightCard, ProgressRing, AIInsightPanel, TrendNarrative, SectionTitle, Reveal } from "../components/insight/kit";
import { SurvivalRadar } from "../components/insight/Radar";
import { ImpactSimulator, FutureProjection } from "../components/insight/Simulators";

const ACCENT = "#22c55e";
const TYPE_COLORS = { ornamental: "#22c55e", fruit: "#f59e0b", conifer: "#06b6d4", shrub: "#84cc16" };
const donutData = YM_BY_TYPE.map((d) => ({ name: TREE_TYPE[d.key], value: d.value, color: TYPE_COLORS[d.key] }));

const rows = [...YM_PLANTINGS].sort((a, b) => b.count - a.count);
const columns = [
  { key: "mahalla", header: "Ko'cha", render: (r) => <span className="font-medium text-foreground">{r.mahalla}</span> },
  { key: "site", header: "Joy", render: (r) => r.site },
  { key: "coords", header: "Koordinata", render: (r) => <span className="text-xs text-foreground/50">{r.coords}</span> },
  { key: "type", header: "Turi", render: (r) => TREE_TYPE[r.type] },
  { key: "season", header: "Mavsum", align: "center", render: (r) => <StatusBadge tone={r.season === "spring" ? "done" : "progress"}>{SEASON[r.season]}</StatusBadge> },
  { key: "count", header: "Soni", align: "right", render: (r) => <span className="font-semibold text-foreground">{r.count.toLocaleString("uz-UZ")}</span> },
  { key: "entered", header: "yashilmakon.eco", align: "center", render: (r) => <StatusBadge tone={r.entered ? "done" : "danger"}>{r.entered ? "Kiritilgan" : "Kiritilmagan"}</StatusBadge> },
  { key: "survival", header: "Tirik qolgan", align: "right", render: (r) => `${r.survivalPct}%` },
];

const YashilMakonPage = () => (
  <CmdRoot accent={ACCENT} dark={false} system="Yashil makon platformasi — yashilmakon.eco (demo)" place={YM_PLACE}>
    <CmdHeader brand="YASHIL MAKON MARKAZI" place={YM_PLACE} accent={ACCENT} nav={["Ekologiya", "Ekishlar"]} active="Ekologiya" />

    {/* Insight kartalar — ekologik impact bilan */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <InsightCard i={0} icon={TreePine} label="Ekilgan ko'chat" value={s.planted} accent={ACCENT}
        trend={{ dir: "up", text: "mavsum" }}
        equivalents={[{ icon: TreePine, text: `~${im.mahallasGreen} mahalla yashil qoplamasi` }, { icon: MapPin, text: `${YM_PLANTINGS.length} ekish nuqtasi` }]} />
      <InsightCard i={1} icon={Wind} label="CO₂ yutilishi" value={im.co2} suffix=" t/yil" accent="#06b6d4"
        equivalents={[{ icon: Car, text: `~${Math.round(im.co2 / 4.6)} ta avtomobil chiqindisi` }]} />
      <InsightCard i={2} icon={Cloud} label="O₂ ajralishi" value={im.o2} suffix=" t/yil" accent={ACCENT}
        equivalents={[{ icon: Wind, text: `~${(im.o2 * 2).toLocaleString("uz-UZ")} kishilik kislorod` }]} />
      <InsightCard i={3} icon={Sprout} label="Tirik qolish" value={s.survivalPct} suffix="%" accent={ACCENT}
        trend={{ dir: "up", text: "+8%" }}
        equivalents={[{ icon: Droplet, text: "Sug'orish tizimi faol" }]} />
    </div>

    {/* Progress ringlar */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      <Reveal i={0}><Panel title="Yillik reja" icon={Target} accent={ACCENT}>
        <ProgressRing value={s.planted} target={s.yearPlan} label="Reja bajarilishi" accent={ACCENT} forecast="2026 IV chorak" unit=" ta" />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Tizimga kiritish" icon={Database} accent="#06b6d4">
        <ProgressRing value={s.enteredPct} label="yashilmakon.eco" accent="#06b6d4" forecast="kun yakuniga" />
      </Panel></Reveal>
      <Reveal i={2}><Panel title="Ko'kalamzorlik" icon={Leaf} accent={ACCENT}>
        <ProgressRing value={s.greenCoverage} target={30} label="Qoplama (PF-47)" accent={ACCENT} forecast="2030 maqsad" unit="%" />
      </Panel></Reveal>
      <Reveal i={3}><Panel title="Tirik qolish radari" icon={Sprout} accent={ACCENT}>
        <div className="p-1"><SurvivalRadar data={im.radar} accent={ACCENT} height={188} /></div>
      </Panel></Reveal>
    </div>

    {/* AI + trend + tur */}
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="AI ekologik tahlil" icon={Activity} accent={ACCENT}><AIInsightPanel insights={ymInsights} accent={ACCENT} /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tendensiya" icon={Sparkles} accent={ACCENT}><TrendNarrative items={ymTrends} accent={ACCENT} /></Panel></Reveal>
      <Reveal i={2}><Panel title="Ko'chat turlari" icon={TreePine} accent={ACCENT}><div className="p-2"><Donut data={donutData} accent={ACCENT} height={196} /></div></Panel></Reveal>
    </div>

    {/* WOW: simulyator + prognoz */}
    <div className="space-y-2">
      <SectionTitle accent={ACCENT}>Stsenariy modellashtirish</SectionTitle>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Reveal i={0}><Panel title="Impact simulyatori" icon={Sparkles} accent={ACCENT} source="Modellashtirish (demo)">
          <ImpactSimulator basePlanted={s.planted} baseCoverage={s.greenCoverage} accent={ACCENT} />
        </Panel></Reveal>
        <Reveal i={1}><Panel title="2026 → 2030 prognozi" icon={Target} accent={ACCENT} source="PF-47 prognoz (demo)">
          <FutureProjection baseCoverage={s.greenCoverage} target={30} accent={ACCENT} />
        </Panel></Reveal>
      </div>
    </div>

    <Reveal i={0}><Panel title="Ekish yozuvlari — qayerga ekildi" icon={Database} accent={ACCENT} bodyClass="p-2">
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} variant="glass" />
    </Panel></Reveal>
  </CmdRoot>
);

export default YashilMakonPage;
