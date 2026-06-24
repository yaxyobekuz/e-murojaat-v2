// Obodonlashtirish — YAGONA umumiy sahifa. 4 modul (Axlat, Gaz, Yashil makon, Hashar)
// bitta tartibli sahifada bo'limlar sifatida. Ma'lumot o'zgarmagan — mavjud mock + insights.
import {
  Truck, Droplets, TreePine, Sparkles, Gauge, Wind, Cloud, Ruler, Boxes, Award, Activity,
  CheckCircle2, AlertTriangle, Clock, ListChecks, Target, Database, Leaf, Sprout, Users, Trophy,
  Waypoints, MapPin, Radio,
} from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
import { CmdRoot, CmdHeader, Panel, Donut, BarRow } from "@/shared/components/ui/command/primitives";
import { axlatSummary, AXLAT_OPERATOR_RATING, RATING_LABELS } from "../mock/axlat.data";
import { assenSummary, ASSEN_BY_MAHALLA } from "../mock/assenizatsiya.data";
import { ymSummary, YM_PLANTINGS, YM_BY_MAHALLA } from "../mock/yashilMakon.data";
import { hasharSummary } from "../mock/hashar.data";
import {
  districtHealth, axlatImpact, assenImpact, ymImpact, hasharImpact, obodBadges,
  axlatMapLegend, assenMapLegend, hasharMapLegend,
} from "../mock/insights";
import {
  InsightCard, ExecScore, AIInsightPanel, BadgeStrip, Leaderboard, ProgressRing,
  SectionBanner, AnchorNav, Reveal,
} from "../components/insight/kit";
import { GasFlow } from "../components/insight/GasFlow";
import { ObodRealMap } from "../components/insight/ObodRealMap";

const PLACE = "Baliqchi tumani, Andijon";
const C = { exec: "#10b981", axlat: "#22d3ee", gaz: "#3b82f6", ym: "#22c55e", hashar: "#b794f6", live: "#34d399" };

const NAV = [
  { id: "live", label: "Jonli kuzatuv", icon: Radio, color: C.live },
  { id: "exec", label: "Umumiy", icon: Gauge, color: C.exec },
  { id: "axlat", label: "Axlat", icon: Truck, color: C.axlat },
  { id: "gaz", label: "Gaz mashinasi", icon: Droplets, color: C.gaz },
  { id: "ym", label: "Yashil makon", icon: TreePine, color: C.ym },
  { id: "hashar", label: "Hashar", icon: Sparkles, color: C.hashar },
];

const ymMaxMahalla = Math.max(...YM_BY_MAHALLA.map((m) => m.value), 1);
const axlatDonut = AXLAT_OPERATOR_RATING.map((d, i) => ({ name: RATING_LABELS[d.key], value: d.value, color: ["#16a34a", "#d97706", "#dc2626"][i] }));
const flowNodes = [...ASSEN_BY_MAHALLA].sort((a, b) => b.value - a.value).slice(0, 8).map((m) => ({ name: m.key, value: m.value }));
const hasharBoard = hasharImpact.leaderboard;

const execInsights = [
  { text: `Tuman salomatlik indeksi ${districtHealth.score}/100 — 4 yo'nalish umumlashmasi.`, tone: C.exec },
  { text: `Ko'kalamzorlik: tirik qolish ${ymSummary.survivalPct}% · CO₂ ${ymImpact.co2.toLocaleString("uz-UZ")} t/yil yutilmoqda.`, tone: "#22c55e" },
  { text: axlatSummary.missed > 0 ? `Chiqindi xizmatida ${axlatSummary.missed} kelmay qolgan marshrut — e'tibor talab.` : "Chiqindi xizmati to'liq nazoratda.", tone: axlatSummary.missed > 0 ? "#f59e0b" : "#22c55e" },
];

// Ixcham bo'lim qobig'i
const Kpis = ({ children }) => <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;

const ObodExecPage = () => (
  <CmdRoot accent={C.exec} system="Obodonlashtirish ijroiya paneli (demo)" place={PLACE}>
    <CmdHeader brand="OBODONLASHTIRISH — IJROIYA MARKAZI" place={PLACE} accent={C.exec} nav={["Umumiy"]} active="Umumiy" />

    <AnchorNav items={NAV} accent={C.exec} />

    {/* ══════════ JONLI KUZATUV ══════════ */}
    <SectionBanner id="live" icon={Radio} title="Jonli kuzatuv — yashil makon" sub="Ekilgan daraxtlar xaritada · har nuqta — real ekish joyi" accent={C.live} />
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_300px]">
      <Reveal i={0}>
        <Panel title="Daraxtlar xaritasi (real 3D)" icon={MapPin} accent={C.live} source="Google 3D · ekilgan ko'chat joylari" bodyClass="p-2">
          <ObodRealMap accent={C.live} height={400} showGreen plantings={YM_PLANTINGS} label="Jonli · ekilgan ko'chatlar" />
        </Panel>
      </Reveal>
      <Reveal i={1}>
        <Panel title="Mahalla bo'yicha ekilgan" icon={TreePine} accent={C.live} source="Jami daraxt soni — demo">
          <div className="py-2">
            {[...YM_BY_MAHALLA].sort((a, b) => b.value - a.value).map((m) => (
              <BarRow key={m.key} label={m.key} value={m.value.toLocaleString("uz-UZ")} pct={(m.value / ymMaxMahalla) * 100} accent={C.live} unit=" ta" />
            ))}
          </div>
        </Panel>
      </Reveal>
    </div>

    {/* ══════════ UMUMIY ══════════ */}
    <SectionBanner id="exec" icon={Gauge} title="Umumiy ko'rinish" sub="Tuman salomatlik indeksi va modul ballari" accent={C.exec} />
    <Reveal i={0}>
      <Panel title="Tuman salomatlik indeksi" icon={Gauge} accent={C.exec} source="4 modul umumlashmasi (demo)">
        <ExecScore score={districtHealth.score} parts={districtHealth.parts} accent={C.exec} />
      </Panel>
    </Reveal>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="AI ijroiya xulosasi" icon={Activity} accent={C.exec}><AIInsightPanel insights={execInsights} accent={C.exec} /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tuman yutuqlari" icon={Award} accent={C.exec}><BadgeStrip badges={obodBadges} /></Panel></Reveal>
    </div>

    {/* ══════════ AXLAT ══════════ */}
    <SectionBanner id="axlat" icon={Truck} title="Axlat mashinasi" sub="Qattiq maishiy chiqindi — VM 95/648-son" accent={C.axlat} />
    <Kpis>
      <InsightCard i={0} icon={Boxes} label="To'plangan hajm" value={axlatSummary.collectedVolume} suffix=" m³" accent={C.axlat} decimals={1}
        equivalents={[{ icon: "🚛", text: `${axlatImpact.trucks} ta mashina` }]} />
      <InsightCard i={1} icon={CheckCircle2} label="Bajarildi" value={axlatSummary.completionPct} suffix="%" accent="#22c55e"
        equivalents={[{ icon: "✅", text: `${axlatSummary.done}/${axlatSummary.routes} marshrut` }]} />
      <InsightCard i={2} icon={AlertTriangle} label="Kelmay qolgan" value={axlatSummary.missed} accent="#ef4444"
        equivalents={[{ icon: "⚠️", text: axlatImpact.missedRoutes.map((r) => r.mahalla).join(", ") || "yo'q" }]} />
      <InsightCard i={3} icon={Gauge} label="Tozalik indeksi" value={axlatImpact.cleanlinessIndex} suffix="/100" accent={C.axlat}
        equivalents={[{ icon: "📊", text: `Ishonchlilik ${axlatImpact.reliabilityScore}` }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Marshrut xaritasi (real 3D)" icon={MapPin} accent={C.axlat} source="Google 3D · Baliqchi, Andijon" className="lg:col-span-2" bodyClass="p-2">
        <ObodRealMap accent={C.axlat} height={300} label="Xizmat hududi" legend={axlatMapLegend} />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Operator reytingi (VM 648)" icon={Gauge} accent={C.axlat}><div className="p-2"><Donut data={axlatDonut} accent={C.axlat} height={250} /></div></Panel></Reveal>
    </div>

    {/* ══════════ GAZ MASHINASI ══════════ */}
    <SectionBanner id="gaz" icon={Droplets} title="Gaz mashinasi — assenizatsiya" sub="Suyuq chiqindi · buyurtma asosida" accent={C.gaz} />
    <Kpis>
      <InsightCard i={0} icon={ListChecks} label="Jami buyurtma" value={assenSummary.total} accent={C.gaz}
        equivalents={[{ icon: "✅", text: `${assenSummary.done} bajarildi` }]} />
      <InsightCard i={1} icon={Clock} label="O'rtacha SLA" value={assenSummary.avgSla} suffix=" kun" accent={C.gaz} decimals={1}
        equivalents={[{ icon: "⚡", text: assenImpact.heat[0] ? `Tez: ${assenImpact.heat[0].label}` : "—" }]} />
      <InsightCard i={2} icon={Boxes} label="Bo'shatilgan hajm" value={assenSummary.volume} suffix=" m³" accent={C.gaz}
        equivalents={[{ icon: "🛢️", text: `${Math.round(assenSummary.volume / 8)} sisterna` }]} />
      <InsightCard i={3} icon={Gauge} label="Samaradorlik" value={assenImpact.efficiency} suffix="/100" accent={C.gaz}
        equivalents={[{ icon: "⏳", text: `${assenSummary.inProgress} jarayonda` }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="Suyuq chiqindi oqimi" icon={Waypoints} accent={C.gaz} source="Mahalla → qabul nuqtasi (demo)">
        <GasFlow nodes={flowNodes} accent={C.gaz} height={280} />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Xizmat xaritasi (real 3D)" icon={MapPin} accent={C.gaz} source="Google 3D · Baliqchi, Andijon" bodyClass="p-2">
        <ObodRealMap accent={C.gaz} height={280} label="Xizmat hududi" legend={assenMapLegend} />
      </Panel></Reveal>
    </div>

    {/* ══════════ YASHIL MAKON ══════════ */}
    <SectionBanner id="ym" icon={TreePine} title="Yashil makon" sub="Ko'chat ekish · ekologik ta'sir · yashilmakon.eco" accent={C.ym} />
    <Kpis>
      <InsightCard i={0} icon={TreePine} label="Ekilgan ko'chat" value={ymSummary.planted} accent={C.ym}
        equivalents={[{ icon: "🌳", text: `~${ymImpact.mahallasGreen} mahalla qoplamasi` }]} />
      <InsightCard i={1} icon={Wind} label="CO₂ yutilishi" value={ymImpact.co2} suffix=" t/yil" accent="#06b6d4"
        equivalents={[{ icon: "🌍", text: "Ekologik foyda" }]} />
      <InsightCard i={2} icon={Cloud} label="O₂ ajralishi" value={ymImpact.o2} suffix=" t/yil" accent={C.ym}
        equivalents={[{ icon: "🫁", text: `~${(ymImpact.o2 * 2).toLocaleString("uz-UZ")} kishilik` }]} />
      <InsightCard i={3} icon={Sprout} label="Tirik qolish" value={ymSummary.survivalPct} suffix="%" accent={C.ym}
        equivalents={[{ icon: "💧", text: "Sug'orish faol" }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      <Reveal i={0}><Panel title="Yillik reja" icon={Target} accent={C.ym}><ProgressRing value={ymSummary.planted} target={ymSummary.yearPlan} label="Reja" accent={C.ym} forecast="2026 IV ch." unit=" ta" /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tizimga kiritish" icon={Database} accent="#06b6d4"><ProgressRing value={ymSummary.enteredPct} label="yashilmakon.eco" accent="#06b6d4" /></Panel></Reveal>
      <Reveal i={2}><Panel title="Ko'kalamzorlik" icon={Leaf} accent={C.ym}><ProgressRing value={ymSummary.greenCoverage} target={30} label="Qoplama" accent={C.ym} forecast="2030" unit="%" /></Panel></Reveal>
      <Reveal i={3}><Panel title="Ekish xaritasi (real 3D)" icon={MapPin} accent={C.ym} source="Google 3D · ekilgan joylar" bodyClass="p-1"><ObodRealMap accent={C.ym} height={210} showGreen plantings={YM_PLANTINGS} label="Ekilgan joylar" /></Panel></Reveal>
    </div>

    {/* ══════════ HASHAR ══════════ */}
    <SectionBanner id="hashar" icon={Sparkles} title="Tozalov & hashar" sub="Jamoatchilik faolligi · «Eng toza mahalla» · PQ-234" accent={C.hashar} />
    <Kpis>
      <InsightCard i={0} icon={Sparkles} label="Tadbirlar" value={hasharSummary.events} accent={C.hashar}
        equivalents={[{ icon: "🤝", text: `${hasharSummary.participants.toLocaleString("uz-UZ")} ishtirokchi` }]} />
      <InsightCard i={1} icon={Ruler} label="Tozalangan maydon" value={hasharSummary.area} suffix=" ga" accent={C.hashar} decimals={1}
        equivalents={[{ icon: "⚽", text: `${hasharImpact.fields} futbol maydoni` }]} />
      <InsightCard i={2} icon={Users} label="Faollik bali" value={hasharImpact.engagement} suffix="/100" accent={C.hashar}
        equivalents={[{ icon: "📈", text: "+12% o'sish" }]} />
      <InsightCard i={3} icon={Trophy} label="Top mahalla" value={hasharSummary.topMahalla.value} suffix=" ball" accent="#fbbf24"
        equivalents={[{ icon: "🏆", text: hasharSummary.topMahalla.key }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="«Eng toza mahalla» chempionati" icon={Trophy} accent={C.hashar}><Leaderboard items={hasharBoard} accent={C.hashar} unit=" ball" /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tozalik xaritasi (real 3D)" icon={MapPin} accent={C.hashar} source="Google 3D · Baliqchi, Andijon" bodyClass="p-2"><ObodRealMap accent={C.hashar} height={300} label="Mahalla hududi" legend={hasharMapLegend} /></Panel></Reveal>
    </div>
  </CmdRoot>
);

export default ObodExecPage;
