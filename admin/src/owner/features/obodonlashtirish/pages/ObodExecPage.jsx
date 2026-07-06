// Obodonlashtirish — YAGONA umumiy sahifa. 4 modul (Axlat, Gaz, Yashil makon, Hashar)
// bitta tartibli sahifada bo'limlar sifatida. Ma'lumot o'zgarmagan — mavjud mock + insights.
import { Activity, AlertTriangle, Award, Banknote, BarChart3, Boxes, Car, CheckCircle2, ClipboardList, Clock, Cloud, Database, Droplet, Droplets, Fuel, Gauge, Globe, HardHat, Hourglass, Leaf, ListChecks, MapPin, Medal, MessageSquareWarning, Radio, Ruler, ScanLine, ShieldCheck, Sparkles, Sprout, Sun, Target, Trash2, TreePine, TrendingUp, Trophy, Truck, User, Users, Volleyball, Vote, Wallet, Waypoints, Wind, Zap } from "lucide-react";

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
import { TreePassport } from "../components/insight/TreePassport";
import { RatingTable } from "../components/insight/RatingTable";
import { ParticipatoryBudget } from "../components/insight/ParticipatoryBudget";
import { EcoCitizen } from "../components/insight/EcoCitizen";
import { CitizenReports } from "../components/insight/CitizenReports";
import { SmartBins } from "../components/insight/SmartBins";
import AxlatBinsMap from "../components/insight/AxlatBinsMap";
import { treeSummary } from "../mock/treePassport.data";
import { ratingSummary } from "../mock/operatorRating.data";
import { pbSummary } from "../mock/participatoryBudget.data";
import { ecoSummary } from "../mock/ecoCitizen.data";
import { reportsSummary } from "../mock/citizenReports.data";

const PLACE = "Sarnovul MFY, Baliqchi tumani, Andijon";
const C = { exec: "#10b981", axlat: "#22d3ee", gaz: "#3b82f6", ym: "#22c55e", hashar: "#b794f6", live: "#34d399", rating: "#f59e0b", budget: "#f59e0b", eco: "#22c55e", reports: "#8b5cf6" };

const NAV = [
  { id: "live", label: "Jonli kuzatuv", icon: Radio, color: C.live },
  { id: "exec", label: "Umumiy", icon: Gauge, color: C.exec },
  { id: "budget", label: "Tashabbusli budjet", icon: Vote, color: C.budget },
  { id: "reports", label: "Xalq nazorati", icon: MessageSquareWarning, color: C.reports },
  { id: "eco", label: "Eko-faol fuqaro", icon: Leaf, color: C.eco },
  { id: "axlat", label: "Axlat", icon: Truck, color: C.axlat },
  { id: "bins", label: "Chiqindi idishlari", icon: Trash2, color: C.axlat },
  { id: "gaz", label: "Gaz mashinasi", icon: Droplets, color: C.gaz },
  { id: "ym", label: "Yashil makon", icon: TreePine, color: C.ym },
  { id: "passport", label: "Daraxt pasporti", icon: ScanLine, color: C.ym },
  { id: "hashar", label: "Hashar", icon: Sparkles, color: C.hashar },
  { id: "rating", label: "Reyting", icon: Trophy, color: C.rating },
];

const ymMaxMahalla = Math.max(...YM_BY_MAHALLA.map((m) => m.value), 1);
const axlatDonut = AXLAT_OPERATOR_RATING.map((d, i) => ({ name: RATING_LABELS[d.key], value: d.value, color: ["#16a34a", "#d97706", "#dc2626"][i] }));
const flowNodes = [...ASSEN_BY_MAHALLA].sort((a, b) => b.value - a.value).slice(0, 8).map((m) => ({ name: m.key, value: m.value }));
const hasharBoard = hasharImpact.leaderboard;

const execInsights = [
  { text: `Mahalla salomatlik indeksi ${districtHealth.score}/100 — 4 yo'nalish umumlashmasi.`, tone: C.exec },
  { text: `Ko'kalamzorlik: tirik qolish ${ymSummary.survivalPct}% · CO₂ ${ymImpact.co2.toLocaleString("uz-UZ")} t/yil yutilmoqda.`, tone: "#22c55e" },
  { text: axlatSummary.missed > 0 ? `Chiqindi xizmatida ${axlatSummary.missed} kelmay qolgan marshrut — e'tibor talab.` : "Chiqindi xizmati to'liq nazoratda.", tone: axlatSummary.missed > 0 ? "#f59e0b" : "#22c55e" },
];

// Ixcham bo'lim qobig'i
const Kpis = ({ children }) => <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;

const ObodExecPage = () => (
  <CmdRoot accent={C.exec} dark={false} system="Obodonlashtirish ijroiya paneli (demo)" place={PLACE}>
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
        <Panel title="Ko'cha bo'yicha ekilgan" icon={TreePine} accent={C.live} source="Jami daraxt soni — demo">
          <div className="py-2">
            {[...YM_BY_MAHALLA].sort((a, b) => b.value - a.value).map((m) => (
              <BarRow key={m.key} label={m.key} value={m.value.toLocaleString("uz-UZ")} pct={(m.value / ymMaxMahalla) * 100} accent={C.live} unit=" ta" />
            ))}
          </div>
        </Panel>
      </Reveal>
    </div>

    {/* ══════════ UMUMIY ══════════ */}
    <SectionBanner id="exec" icon={Gauge} title="Umumiy ko'rinish" sub="Mahalla salomatlik indeksi va modul ballari" accent={C.exec} />
    <Reveal i={0}>
      <Panel title="Mahalla salomatlik indeksi" icon={Gauge} accent={C.exec} source="4 modul umumlashmasi (demo)">
        <ExecScore score={districtHealth.score} parts={districtHealth.parts} accent={C.exec} />
      </Panel>
    </Reveal>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="AI ijroiya xulosasi" icon={Activity} accent={C.exec}><AIInsightPanel insights={execInsights} accent={C.exec} /></Panel></Reveal>
      <Reveal i={1}><Panel title="Mahalla yutuqlari" icon={Award} accent={C.exec}><BadgeStrip badges={obodBadges} /></Panel></Reveal>
    </div>

    {/* ══════════ TASHABBUSLI BUDJET ══════════ */}
    <SectionBanner id="budget" icon={Vote} title="Tashabbusli budjet" sub="Fuqarolar loyihalarni taklif qiladi va ovoz beradi · openbudget.uz" accent={C.budget} />
    <Kpis>
      <InsightCard i={0} icon={Vote} label="Jami loyihalar" value={pbSummary.total} accent={C.budget}
        equivalents={[{ icon: Vote, text: `${pbSummary.voting} ta ovoz berilmoqda` }]} />
      <InsightCard i={1} icon={Users} label="Jami ovozlar" value={pbSummary.totalVotes} accent={C.budget}
        equivalents={[{ icon: User, text: "«Bir fuqaro, bir ovoz»" }]} />
      <InsightCard i={2} icon={CheckCircle2} label="G'olib loyihalar" value={pbSummary.won} accent="#22c55e"
        equivalents={[{ icon: HardHat, text: "Moliyalashtirildi" }]} />
      <InsightCard i={3} icon={Wallet} label="Ajratilgan budjet" value={pbSummary.allocated} formatter={formatMoney} accent={C.budget}
        equivalents={[{ icon: Banknote, text: "Mahalla loyihalariga" }]} />
    </Kpis>
    <Reveal i={0}><Panel title="Loyihalar — ovoz berish" icon={Vote} accent={C.budget} source="openbudget.uz uslubi (demo)" bodyClass="p-0"><ParticipatoryBudget /></Panel></Reveal>

    {/* ══════════ XALQ NAZORATI ══════════ */}
    <SectionBanner id="reports" icon={MessageSquareWarning} title="Xalq nazorati — fuqaro shikoyatlari" sub="Foto + manzil bilan xabar · fuqaro tasdiqlashi bilan yopiladi · xalqnazorati.uz" accent={C.reports} />
    <Kpis>
      <InsightCard i={0} icon={MessageSquareWarning} label="Jami shikoyat" value={reportsSummary.total} accent={C.reports}
        equivalents={[{ icon: ClipboardList, text: `${reportsSummary.active} ta jarayonda` }]} />
      <InsightCard i={1} icon={CheckCircle2} label="Fuqaro tasdiqladi" value={reportsSummary.confirmedPct} suffix="%" accent="#22c55e"
        equivalents={[{ icon: CheckCircle2, text: `${reportsSummary.confirmed} ta yopildi` }]} />
      <InsightCard i={2} icon={AlertTriangle} label="Muddati o'tgan" value={reportsSummary.overdue} accent="#ef4444"
        equivalents={[{ icon: Clock, text: "24/72 soat SLA" }]} />
      <InsightCard i={3} icon={Clock} label="O'rtacha javob" value={reportsSummary.avgSla} suffix=" soat" accent={C.reports}
        equivalents={[{ icon: Zap, text: "Hal qilish vaqti" }]} />
    </Kpis>
    <Reveal i={0}><Panel title="Shikoyatlar — foto va holat" icon={MessageSquareWarning} accent={C.reports} source="xalqnazorati.uz uslubi (demo)" bodyClass="p-0"><CitizenReports /></Panel></Reveal>

    {/* ══════════ EKO-FAOL FUQARO ══════════ */}
    <SectionBanner id="eco" icon={Leaf} title="Eko-faol fuqaro" sub="Oilalar eko-ballari · «Yashil oila» status · mukofotlar · ecofaolfuqaro.uz" accent={C.eco} />
    <Kpis>
      <InsightCard i={0} icon={Leaf} label="Eko-ballar (jami)" value={ecoSummary.totalPoints} accent={C.eco}
        equivalents={[{ icon: TreePine, text: `${ecoSummary.totalTrees} daraxt ekilgan` }]} />
      <InsightCard i={1} icon={ShieldCheck} label="Yashil oilalar" value={ecoSummary.greenFamilies} accent="#22c55e"
        equivalents={[{ icon: Sprout, text: `${ecoSummary.families} oiladan` }]} />
      <InsightCard i={2} icon={Sprout} label="Quyosh panellari" value={ecoSummary.totalSolar} suffix=" kW" accent="#eab308"
        equivalents={[{ icon: Sun, text: "+100 ball/kW" }]} />
      <InsightCard i={3} icon={Award} label="Mukofotlar" value={4} accent={C.eco}
        equivalents={[{ icon: Car, text: "Elektromobil · velosiped" }]} />
    </Kpis>
    <Reveal i={0}><Panel title="Eko-faollik reytingi va ball tizimi" icon={Leaf} accent={C.eco} source="ecofaolfuqaro.uz uslubi (demo)" bodyClass="p-0"><EcoCitizen /></Panel></Reveal>

    {/* ══════════ AXLAT ══════════ */}
    <SectionBanner id="axlat" icon={Truck} title="Axlat mashinasi" sub="Qattiq maishiy chiqindi — VM 95/648-son" accent={C.axlat} />
    <Kpis>
      <InsightCard i={0} icon={Boxes} label="To'plangan hajm" value={axlatSummary.collectedVolume} suffix=" m³" accent={C.axlat} decimals={1}
        equivalents={[{ icon: Truck, text: `${axlatImpact.trucks} ta mashina` }]} />
      <InsightCard i={1} icon={CheckCircle2} label="Bajarildi" value={axlatSummary.completionPct} suffix="%" accent="#22c55e"
        equivalents={[{ icon: CheckCircle2, text: `${axlatSummary.done}/${axlatSummary.routes} marshrut` }]} />
      <InsightCard i={2} icon={AlertTriangle} label="Kelmay qolgan" value={axlatSummary.missed} accent="#ef4444"
        equivalents={[{ icon: AlertTriangle, text: axlatImpact.missedRoutes.map((r) => r.mahalla).join(", ") || "yo'q" }]} />
      <InsightCard i={3} icon={Gauge} label="Tozalik indeksi" value={axlatImpact.cleanlinessIndex} suffix="/100" accent={C.axlat}
        equivalents={[{ icon: BarChart3, text: `Ishonchlilik ${axlatImpact.reliabilityScore}` }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <Reveal i={0}><Panel title="Marshrut xaritasi (real 3D)" icon={MapPin} accent={C.axlat} source="Google 3D · Baliqchi, Andijon" className="lg:col-span-2" bodyClass="p-2">
        <ObodRealMap accent={C.axlat} height={300} label="Xizmat hududi" legend={axlatMapLegend} />
      </Panel></Reveal>
      <Reveal i={1}><Panel title="Operator reytingi (VM 648)" icon={Gauge} accent={C.axlat}><div className="p-2"><Donut data={axlatDonut} accent={C.axlat} height={250} /></div></Panel></Reveal>
    </div>

    {/* ══════════ CHIQINDI IDISHLARI (smart bins) ══════════ */}
    <SectionBanner id="bins" icon={Trash2} title="Chiqindi idishlari (aqlli chelaklar)" sub="Har ko'chada chiqindi qutilari · to'lganlik % · olib ketish · chiqindi tarkibi" accent={C.axlat} />
    <Reveal i={0}>
      <Panel title="Chelaklar monitoringi" icon={Trash2} accent={C.axlat} source="Sensorli idish + GPS axlat mashinasi (demo)" bodyClass="p-0">
        <SmartBins />
      </Panel>
    </Reveal>
    <Reveal i={1}>
      <Panel title="Chiqindi qutilari va olib ketuvchi mashinalar (xarita)" icon={MapPin} accent={C.axlat} source="Qutilar to'lganligi + mashina joylashuvi (demo)" bodyClass="p-0">
        <AxlatBinsMap />
      </Panel>
    </Reveal>

    {/* ══════════ GAZ MASHINASI ══════════ */}
    <SectionBanner id="gaz" icon={Droplets} title="Gaz mashinasi — assenizatsiya" sub="Suyuq chiqindi · buyurtma asosida" accent={C.gaz} />
    <Kpis>
      <InsightCard i={0} icon={ListChecks} label="Jami buyurtma" value={assenSummary.total} accent={C.gaz}
        equivalents={[{ icon: CheckCircle2, text: `${assenSummary.done} bajarildi` }]} />
      <InsightCard i={1} icon={Clock} label="O'rtacha SLA" value={assenSummary.avgSla} suffix=" kun" accent={C.gaz} decimals={1}
        equivalents={[{ icon: Zap, text: assenImpact.heat[0] ? `Tez: ${assenImpact.heat[0].label}` : "—" }]} />
      <InsightCard i={2} icon={Boxes} label="Bo'shatilgan hajm" value={assenSummary.volume} suffix=" m³" accent={C.gaz}
        equivalents={[{ icon: Fuel, text: `${Math.round(assenSummary.volume / 8)} sisterna` }]} />
      <InsightCard i={3} icon={Gauge} label="Samaradorlik" value={assenImpact.efficiency} suffix="/100" accent={C.gaz}
        equivalents={[{ icon: Hourglass, text: `${assenSummary.inProgress} jarayonda` }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="Suyuq chiqindi oqimi" icon={Waypoints} accent={C.gaz} source="Ko'cha → qabul nuqtasi (demo)">
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
        equivalents={[{ icon: TreePine, text: `~${ymImpact.mahallasGreen} ko'cha qoplamasi` }]} />
      <InsightCard i={1} icon={Wind} label="CO₂ yutilishi" value={ymImpact.co2} suffix=" t/yil" accent="#06b6d4"
        equivalents={[{ icon: Globe, text: "Ekologik foyda" }]} />
      <InsightCard i={2} icon={Cloud} label="O₂ ajralishi" value={ymImpact.o2} suffix=" t/yil" accent={C.ym}
        equivalents={[{ icon: Wind, text: `~${(ymImpact.o2 * 2).toLocaleString("uz-UZ")} kishilik` }]} />
      <InsightCard i={3} icon={Sprout} label="Tirik qolish" value={ymSummary.survivalPct} suffix="%" accent={C.ym}
        equivalents={[{ icon: Droplet, text: "Sug'orish faol" }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      <Reveal i={0}><Panel title="Yillik reja" icon={Target} accent={C.ym}><ProgressRing value={ymSummary.planted} target={ymSummary.yearPlan} label="Reja" accent={C.ym} forecast="2026 IV ch." unit=" ta" /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tizimga kiritish" icon={Database} accent="#06b6d4"><ProgressRing value={ymSummary.enteredPct} label="yashilmakon.eco" accent="#06b6d4" /></Panel></Reveal>
      <Reveal i={2}><Panel title="Ko'kalamzorlik" icon={Leaf} accent={C.ym}><ProgressRing value={ymSummary.greenCoverage} target={30} label="Qoplama" accent={C.ym} forecast="2030" unit="%" /></Panel></Reveal>
      <Reveal i={3}><Panel title="Ekish xaritasi (real 3D)" icon={MapPin} accent={C.ym} source="Google 3D · ekilgan joylar" bodyClass="p-1"><ObodRealMap accent={C.ym} height={210} showGreen plantings={YM_PLANTINGS} label="Ekilgan joylar" /></Panel></Reveal>
    </div>

    {/* ══════════ DARAXT PASPORTI ══════════ */}
    <SectionBanner id="passport" icon={ScanLine} title="Daraxt pasporti" sub="Har daraxt — unikal ID, foto, bo'y, holat (yashilmakon.eco uslubida)" accent={C.ym} />
    <Kpis>
      <InsightCard i={0} icon={ScanLine} label="Pasportlangan daraxt" value={treeSummary.total} accent={C.ym}
        equivalents={[{ icon: ScanLine, text: "Har biri unikal ID bilan" }]} />
      <InsightCard i={1} icon={ShieldCheck} label="Sog'lom" value={treeSummary.healthyPct} suffix="%" accent="#22c55e"
        equivalents={[{ icon: TreePine, text: `${treeSummary.healthy} ta sog'lom` }]} />
      <InsightCard i={2} icon={Database} label="Tizimga kiritilgan" value={treeSummary.enteredPct} suffix="%" accent="#06b6d4"
        equivalents={[{ icon: Radio, text: "yashilmakon.eco" }]} />
      <InsightCard i={3} icon={TreePine} label="O'rtacha bo'y" value={treeSummary.avgHeight} suffix=" sm" accent={C.ym}
        equivalents={[{ icon: Ruler, text: `${treeSummary.weak} zaif · ${treeSummary.dead} qurigan` }]} />
    </Kpis>
    <Reveal i={0}>
      <Panel title="Daraxt reyestri — ID bo'yicha qidiruv" icon={ScanLine} accent={C.ym} source="Daraxt pasporti registri (demo)" bodyClass="p-0">
        <TreePassport />
      </Panel>
    </Reveal>

    {/* ══════════ HASHAR ══════════ */}
    <SectionBanner id="hashar" icon={Sparkles} title="Tozalov & hashar" sub="Jamoatchilik faolligi · «Eng toza ko'cha» · PQ-234" accent={C.hashar} />
    <Kpis>
      <InsightCard i={0} icon={Sparkles} label="Tadbirlar" value={hasharSummary.events} accent={C.hashar}
        equivalents={[{ icon: Users, text: `${hasharSummary.participants.toLocaleString("uz-UZ")} ishtirokchi` }]} />
      <InsightCard i={1} icon={Ruler} label="Tozalangan maydon" value={hasharSummary.area} suffix=" ga" accent={C.hashar} decimals={1}
        equivalents={[{ icon: Volleyball, text: `${hasharImpact.fields} futbol maydoni` }]} />
      <InsightCard i={2} icon={Users} label="Faollik bali" value={hasharImpact.engagement} suffix="/100" accent={C.hashar}
        equivalents={[{ icon: TrendingUp, text: "+12% o'sish" }]} />
      <InsightCard i={3} icon={Trophy} label="Top ko'cha" value={hasharSummary.topMahalla.value} suffix=" ball" accent="#fbbf24"
        equivalents={[{ icon: Trophy, text: hasharSummary.topMahalla.key }]} />
    </Kpis>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <Reveal i={0}><Panel title="«Eng toza ko'cha» chempionati" icon={Trophy} accent={C.hashar}><Leaderboard items={hasharBoard} accent={C.hashar} unit=" ball" /></Panel></Reveal>
      <Reveal i={1}><Panel title="Tozalik xaritasi (real 3D)" icon={MapPin} accent={C.hashar} source="Google 3D · Baliqchi, Andijon" bodyClass="p-2"><ObodRealMap accent={C.hashar} height={300} label="Mahalla hududi" legend={hasharMapLegend} /></Panel></Reveal>
    </div>

    {/* ══════════ REYTING ══════════ */}
    <SectionBanner id="rating" icon={Trophy} title="Operator / ko'cha reytingi" sub="7 metrikli baholash (xalqnazorati.uz metodologiyasi)" accent={C.rating} />
    <Kpis>
      <InsightCard i={0} icon={Trophy} label="Yetakchi" value={ratingSummary.top.score} suffix=" ball" accent="#fbbf24"
        equivalents={[{ icon: Medal, text: ratingSummary.top.name }]} />
      <InsightCard i={1} icon={ShieldCheck} label="A'lo darajadagilar" value={ratingSummary.excellent} accent="#22c55e"
        equivalents={[{ icon: CheckCircle2, text: `${ratingSummary.count} ko'chadan` }]} />
      <InsightCard i={2} icon={Gauge} label="O'rtacha ball" value={ratingSummary.avg} suffix="/100" accent={C.rating}
        equivalents={[{ icon: BarChart3, text: "7 metrik bo'yicha" }]} />
      <InsightCard i={3} icon={AlertTriangle} label="E'tibor talab" value={ratingSummary.worst.score} suffix=" ball" accent="#ef4444"
        equivalents={[{ icon: AlertTriangle, text: ratingSummary.worst.name }]} />
    </Kpis>
    <Reveal i={0}>
      <Panel title="Reyting jadvali — 7 metrik" icon={Trophy} accent={C.rating} source="xalqnazorati.uz metodologiyasi (demo)" bodyClass="p-0">
        <RatingTable />
      </Panel>
    </Reveal>
  </CmdRoot>
);

export default ObodExecPage;
