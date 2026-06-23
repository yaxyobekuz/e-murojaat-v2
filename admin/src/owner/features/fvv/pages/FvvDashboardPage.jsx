// FVV — "Smart Operation Center". Header navlari funksional tab: Umumiy + Hodisalar/
// Brigadalar/Texnika/Profilaktika (har biri boshqariladigan CRUD jadval).
import { useMemo, useState } from "react";
import { Flame, Droplets, LifeBuoy, Truck, Video, Activity, MapPin, Gauge, Radio, ShieldAlert, Siren, CheckCircle2, Wrench, ClipboardCheck } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, RadialGauge, RatingList, CmdTable, hexA } from "@/shared/components/ui/command/primitives";
import Ops3DMap from "@/shared/components/ui/command/Ops3DMap";

const A = "#f59e0b";
const CY = "#22d3ee";
const NAV = ["Umumiy", "Hodisalar", "Brigadalar", "Texnika", "Profilaktika"];

const BigStat = ({ icon: Icon, label, value, accent, subs, source }) => (
  <Panel title={label} icon={Icon} accent={accent} source={source}>
    <div className="px-3 py-3">
      <div className="font-mono text-[28px] font-bold leading-none tabular-nums" style={{ color: accent, textShadow: `0 0 18px ${hexA(accent, 0.6)}` }}>{value}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {subs.map((s, i) => (
          <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-foreground/40">{s.k}</div>
            <div className="font-mono text-[15px] font-semibold tabular-nums text-foreground">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  </Panel>
);

const NET = [
  { icon: Droplets, label: "Gidrantlar", value: 16, c: CY },
  { icon: ShieldAlert, label: "Qism", value: 1, c: A },
  { icon: Truck, label: "Texnika", value: 5, c: A },
  { icon: Droplets, label: "Suv ombori", value: 2, c: CY },
  { icon: Video, label: "Kameralar", value: 28, c: "#22c55e" },
  { icon: Radio, label: "Brigadalar", value: 3, c: A },
];
const RATINGS = [["Markaziy", 98], ["Bog' mahalla", 96], ["Maktab-7", 95], ["Park", 94], ["Stadion", 92], ["Yangi qurilish", 90], ["Bozor atrofi", 84], ["Sanoat zonasi", 71]].map(([label, pct]) => ({ label, pct }));

// ── seksiya ma'lumotlari ──
const TYPES = ["Yong'in", "Qutqaruv", "Gaz", "Tabiiy ofat"];
const incTone = (v) => (v === "Bartaraf etildi" ? "yashil" : v === "Joyida" ? "sariq" : "kok");
const INC_COLS = [
  { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "place", label: "Joy", type: "text" }, { key: "time", label: "Vaqt", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: incTone, options: ["Yo'lda", "Joyida", "Bartaraf etildi"].map((t) => ({ value: t, label: t })) },
];
const briTone = (v) => (v === "Navbatda" ? "yashil" : v === "Chaqiruvda" ? "sariq" : "kulrang");
const BRI_COLS = [
  { key: "name", label: "Brigada", type: "text" }, { key: "members", label: "A'zolar", type: "number" }, { key: "post", label: "Joylashuv", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: briTone, options: ["Navbatda", "Chaqiruvda", "Dam"].map((t) => ({ value: t, label: t })) },
];
const texTone = (v) => (v === "Soz" ? "yashil" : v === "Ta'mirda" ? "qizil" : "sariq");
const TEX_COLS = [
  { key: "type", label: "Turi", type: "select", options: ["Avtotsisterna", "Avtonarvon", "Qutqaruv", "Shtab"].map((t) => ({ value: t, label: t })) },
  { key: "plate", label: "Raqam", type: "text" }, { key: "water", label: "Suv (L)", type: "number" },
  { key: "status", label: "Holat", type: "status", tone: texTone, options: ["Soz", "Ta'mirda", "Tayyor"].map((t) => ({ value: t, label: t })) },
];
const profTone = (v) => (v === "Yaxshi" ? "yashil" : v === "Kamchilik" ? "sariq" : "qizil");
const PROF_COLS = [
  { key: "object", label: "Obyekt", type: "text" }, { key: "date", label: "Sana", type: "text" }, { key: "owner", label: "Mas'ul", type: "text" },
  { key: "result", label: "Natija", type: "status", tone: profTone, options: ["Yaxshi", "Kamchilik", "Xavf"].map((t) => ({ value: t, label: t })) },
];

const FvvDashboardPage = () => {
  const [tab, setTab] = useState("Umumiy");
  const [inc, setInc] = useState([
    { id: "i1", type: "Yong'in", place: "Sanoat zonasi", time: "03:14", status: "Joyida" },
    { id: "i2", type: "Gaz", place: "Gaz taqsimlagich", time: "02:40", status: "Yo'lda" },
    { id: "i3", type: "Qutqaruv", place: "Eski shahar", time: "01:10", status: "Bartaraf etildi" },
  ]);
  const [bri, setBri] = useState([
    { id: "b1", name: "Brigada-1", members: 6, post: "13-qism", status: "Navbatda" },
    { id: "b2", name: "Brigada-2", members: 5, post: "13-qism", status: "Navbatda" },
    { id: "b3", name: "Brigada-3", members: 6, post: "Sanoat zonasi", status: "Chaqiruvda" },
  ]);
  const [tex, setTex] = useState([
    { id: "t1", type: "Avtotsisterna", plate: "30 A 101 FV", water: 6000, status: "Soz" },
    { id: "t2", type: "Avtonarvon", plate: "30 A 102 FV", water: 0, status: "Soz" },
    { id: "t3", type: "Qutqaruv", plate: "30 A 103 FV", water: 3000, status: "Ta'mirda" },
  ]);
  const [prof, setProf] = useState([
    { id: "p1", object: "41-maktab", date: "12.03.2026", owner: "Inspektor A.", result: "Yaxshi" },
    { id: "p2", object: "Bozor", date: "28.02.2026", owner: "Inspektor B.", result: "Kamchilik" },
    { id: "p3", object: "Gaz shoxobcha", date: "15.02.2026", owner: "Inspektor A.", result: "Xavf" },
  ]);

  const incK = useMemo(() => ({ total: inc.length, fires: inc.filter((r) => r.type === "Yong'in").length, done: inc.filter((r) => r.status === "Bartaraf etildi").length }), [inc]);
  const briReady = bri.filter((b) => b.status === "Navbatda").length;

  return (
    <CmdRoot accent={A} system="FVV operativ AT — 101" place="Sarnovul MFY, Baliqchi tumani">
      <CmdHeader brand="FVV SMART CENTER" place="SARNOVUL MFY · FAVQULODDA OPERATSIYALAR MARKAZI" nav={NAV} accent={A} active={tab} onNav={setTab} />

      {tab === "Umumiy" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Panel title="Bugungi chaqiruvlar" icon={Activity} accent={CY} source="101 chaqiruv markazi"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: CY, textShadow: `0 0 18px ${hexA(CY, 0.6)}` }}>{incK.total}</div><div className="text-right text-[11px] text-foreground/50"><div>Yong'in {incK.fires}</div><div>Bartaraf {incK.done}</div></div></div></Panel>
            <Panel title="Hodisalar holati" icon={Flame} accent={A} source="101 — hodisa reyestri"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: A, textShadow: `0 0 18px ${hexA(A, 0.6)}` }}>96%</div><div className="text-right text-[11px] text-foreground/50"><div>Bartaraf etish</div><div>O'rtacha 6 daq</div></div></div></Panel>
            <Panel title="Aholi qamrovi" icon={MapPin} accent="#22c55e" source="MFY reyestri"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#22c55e", textShadow: "0 0 18px rgba(34,197,94,0.55)" }}>4 860</div><div className="text-right text-[11px] text-foreground/50"><div>Honadon 1 120</div><div>Bino 142</div></div></div></Panel>
          </div>

          <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "30rem" }}>
            <div className="flex flex-col gap-3 xl:col-span-3">
              <BigStat icon={Flame} label="Yong'in" value="1 732" accent="#ef4444" source="101 — yong'in" subs={[{ k: "Faol", v: incK.fires }, { k: "Bartaraf", v: 184 }, { k: "O'rtacha javob", v: "6 daq" }, { k: "Zarar", v: "past" }]} />
              <BigStat icon={Droplets} label="Gaz / suv" value="2 162" accent={CY} source="Gidrant reyestri" subs={[{ k: "Gidrant", v: 16 }, { k: "Faol", v: 14 }, { k: "Gaz signal", v: 4 }, { k: "Qamrov", v: "88%" }]} />
            </div>
            <div className="flex flex-col gap-3 xl:col-span-6">
              <Panel title="Sarnovul MFY — 3D operativ xarita" icon={MapPin} accent={A} right="REAL 3D · LIVE" source="FVV GIS · 3D footage" className="flex-1" bodyClass="relative">
                <Ops3DMap height={430} />
                <div className="pointer-events-none absolute bottom-2 left-3 rounded bg-black/55 px-2 py-1 text-[9.5px] text-white/70 backdrop-blur">Sichqoncha: aylantirish · Scroll: yaqinlashtirish</div>
              </Panel>
            </div>
            <div className="flex flex-col gap-3 xl:col-span-3">
              <Panel title="Hududiy xavfsizlik reytingi" icon={Gauge} accent={A} source="FVV tahlil moduli" className="flex-1" bodyClass="min-h-0"><RatingList items={RATINGS} accent={A} /></Panel>
              <Panel title="Texnika tayyorligi" icon={Truck} accent={A} source="Texnika reyestri">
                <div className="flex flex-col py-1.5">
                  <BarRow label="Avtotsisterna" value="2/2" pct={100} accent="#22c55e" /><BarRow label="Avtonarvon" value="1/1" pct={100} accent="#22c55e" />
                  <BarRow label="Qutqaruv mashina" value="1/2" pct={50} accent={A} /><BarRow label="Suv ta'minoti" value="88" unit="%" pct={88} accent={CY} />
                </div>
              </Panel>
            </div>
          </div>

          <Panel title="Fizik tarmoq — Sarnovul MFY" icon={LifeBuoy} accent={CY} source="FVV infratuzilma reyestri">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-6">
              {NET.map((n, i) => (<div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"><span className="grid size-9 place-items-center rounded-lg" style={{ background: hexA(n.c, 0.14), color: n.c }}><n.icon className="size-4" /></span><div className="leading-tight"><div className="font-mono text-[18px] font-bold tabular-nums text-foreground">{n.value}</div><div className="text-[10px] text-foreground/45">{n.label}</div></div></div>))}
            </div>
          </Panel>
        </>
      )}

      {tab === "Hodisalar" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile icon={Siren} label="Jami hodisa" value={incK.total} accent={A} highlight />
            <StatTile icon={Flame} label="Yong'in" value={incK.fires} accent="#ef4444" />
            <StatTile icon={CheckCircle2} label="Bartaraf etildi" value={incK.done} accent="#22c55e" />
            <StatTile icon={Activity} label="Jarayonda" value={inc.length - incK.done} accent={CY} />
          </div>
          <CmdTable title="Hodisalar jurnali" icon={Siren} accent={A} columns={INC_COLS} rows={inc} setRows={setInc} source="101 — hodisa reyestri" right="CRUD" />
        </>
      )}

      {tab === "Brigadalar" && (
        <>
          <Panel title="Brigadalar tayyorligi" icon={ShieldAlert} accent={A} source="Navbatchilik tizimi">
            <div className="flex flex-wrap items-center justify-around py-1">
              {bri.map((b) => <RadialGauge key={b.id} value={b.status === "Navbatda" ? 100 : b.status === "Chaqiruvda" ? 60 : 30} label={b.name} sub={b.status} accent={b.status === "Navbatda" ? "#22c55e" : A} size={92} />)}
            </div>
          </Panel>
          <CmdTable title="Brigadalar ro'yxati" icon={Radio} accent={A} columns={BRI_COLS} rows={bri} setRows={setBri} source="Shaxsiy tarkib" right={`${briReady}/${bri.length} navbatda`} />
        </>
      )}

      {tab === "Texnika" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile icon={Truck} label="Jami texnika" value={tex.length} accent={A} highlight />
            <StatTile icon={CheckCircle2} label="Soz" value={tex.filter((t) => t.status === "Soz").length} accent="#22c55e" />
            <StatTile icon={Wrench} label="Ta'mirda" value={tex.filter((t) => t.status === "Ta'mirda").length} accent="#ef4444" />
            <StatTile icon={Droplets} label="Suv zaxira" value={`${tex.reduce((a, t) => a + Number(t.water || 0), 0).toLocaleString("uz-UZ")} L`} accent={CY} />
          </div>
          <CmdTable title="Texnika reyestri" icon={Truck} accent={A} columns={TEX_COLS} rows={tex} setRows={setTex} source="Texnika reyestri" right="CRUD" />
        </>
      )}

      {tab === "Profilaktika" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatTile icon={ClipboardCheck} label="Tekshiruvlar" value={prof.length} accent={A} highlight />
            <StatTile icon={CheckCircle2} label="Yaxshi" value={prof.filter((p) => p.result === "Yaxshi").length} accent="#22c55e" />
            <StatTile icon={Activity} label="Kamchilik" value={prof.filter((p) => p.result === "Kamchilik").length} accent="#f59e0b" />
            <StatTile icon={ShieldAlert} label="Xavf" value={prof.filter((p) => p.result === "Xavf").length} accent="#ef4444" />
          </div>
          <CmdTable title="Profilaktika tekshiruvlari" icon={ClipboardCheck} accent={A} columns={PROF_COLS} rows={prof} setRows={setProf} source="Profilaktika moduli" right="CRUD" />
        </>
      )}
    </CmdRoot>
  );
};

export default FvvDashboardPage;
