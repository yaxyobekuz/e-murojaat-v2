// IIB — Smart Center (dark). Markazda CCTV nazorat (begona odam/mashina kirgani -> footage).
// Header navlari funksional tab: Umumiy + Hodisalar/Patrullar/Jinoyatlar (CRUD).
import { useMemo, useState } from "react";
import { Siren, ShieldCheck, Activity, PhoneCall, Car, Video, MapPin, Gauge, Radio, Users, Camera, AlertTriangle } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, RatingList, CctvMonitor, CmdTable, hexA } from "@/shared/components/ui/command/primitives";

const A = "#b794f6";
const CY = "#22d3ee";
const NAV = ["Umumiy", "Hodisalar", "Patrullar", "Jinoyatlar"];
const TYPES = ["Bezorilik", "Mulkiy", "YHQ", "Boshqa"];

const BigStat = ({ icon: Icon, label, value, accent, subs, source }) => (
  <Panel title={label} icon={Icon} accent={accent} source={source}>
    <div className="px-3 py-3">
      <div className="font-mono text-[28px] font-bold leading-none tabular-nums" style={{ color: accent, textShadow: `0 0 18px ${hexA(accent, 0.6)}` }}>{value}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">{subs.map((s, i) => (<div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"><div className="text-[9px] uppercase tracking-wider text-foreground/40">{s.k}</div><div className="font-mono text-[15px] font-semibold tabular-nums text-foreground">{s.v}</div></div>))}</div>
    </div>
  </Panel>
);

const EVENTS = [
  { id: "e1", kind: "avto", title: "Begona avtomashina kirdi", plate: "95 A 472 KM", place: "Sanoat zonasi", time: "03:14", cam: "CAM-041" },
  { id: "e2", kind: "odam", title: "Notanish shaxs aniqlandi", place: "Maktab-7 hovlisi", time: "02:51", cam: "CAM-072" },
  { id: "e3", kind: "avto", title: "Ro'yxatdan o'tmagan avto", plate: "30 B 109 AA", place: "Bozor kirishi", time: "02:03", cam: "CAM-015" },
  { id: "e4", kind: "odam", title: "Tungi shubhali harakat", place: "Avtostansiya", time: "01:42", cam: "CAM-028" },
  { id: "e5", kind: "avto", title: "Tezlik oshirish", plate: "01 A 777 BC", place: "Markaziy ko'cha", time: "00:58", cam: "CAM-003" },
];
const NET = [
  { icon: Camera, label: "Kameralar", value: 28, c: CY }, { icon: Car, label: "Avto nazorat", value: 6, c: A },
  { icon: AlertTriangle, label: "Begona kirish", value: 5, c: "#ef4444" }, { icon: Radio, label: "Patrul", value: 4, c: A },
  { icon: Users, label: "Xodimlar", value: 32, c: "#22c55e" }, { icon: ShieldCheck, label: "Postlar", value: 7, c: CY },
];
const RATINGS = [["Markaziy", 98], ["Maktab-7", 95], ["Park", 94], ["Stadion", 92], ["Bog' mahalla", 90], ["Bozor atrofi", 82], ["Eski shahar", 74], ["Sanoat zonasi", 68]].map(([label, pct]) => ({ label, pct }));

const incTone = (v) => (v === "Hal qilindi" ? "yashil" : v === "Jarayonda" ? "sariq" : "kok");
const INC_COLS = [
  { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "place", label: "Joy", type: "text" }, { key: "time", label: "Vaqt", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: incTone, options: ["Yangi", "Jarayonda", "Hal qilindi"].map((t) => ({ value: t, label: t })) },
];
const patTone = (v) => (v === "Patrulda" ? "yashil" : v === "Chaqiruvda" ? "sariq" : "kulrang");
const PAT_COLS = [
  { key: "crew", label: "Ekipaj", type: "text" }, { key: "zone", label: "Hudud", type: "text" }, { key: "officers", label: "Xodim", type: "number" },
  { key: "status", label: "Holat", type: "status", tone: patTone, options: ["Patrulda", "Chaqiruvda", "Bazada"].map((t) => ({ value: t, label: t })) },
];
const caseTone = (v) => (v === "Yopilgan" ? "yashil" : v === "Sudda" ? "sariq" : "kok");
const CASE_COLS = [
  { key: "num", label: "Raqam", type: "text" }, { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "date", label: "Sana", type: "text" }, { key: "status", label: "Holat", type: "status", tone: caseTone, options: ["Tergov", "Sudda", "Yopilgan"].map((t) => ({ value: t, label: t })) },
];

const IibDashboardPage = () => {
  const [tab, setTab] = useState("Umumiy");
  const [inc, setInc] = useState([
    { id: "i1", type: "Bezorilik", place: "Bozor atrofi", time: "02:51", status: "Jarayonda" },
    { id: "i2", type: "Mulkiy", place: "Sanoat zonasi", time: "03:14", status: "Yangi" },
    { id: "i3", type: "YHQ", place: "Markaziy ko'cha", time: "01:42", status: "Hal qilindi" },
  ]);
  const [pat, setPat] = useState([
    { id: "p1", crew: "Ekipaj-1", zone: "Markaziy", officers: 2, status: "Patrulda" },
    { id: "p2", crew: "Ekipaj-2", zone: "Bozor", officers: 2, status: "Chaqiruvda" },
  ]);
  const [cases, setCases] = useState([
    { id: "c1", num: "J-118", type: "Mulkiy", date: "12.03.2026", status: "Tergov" },
    { id: "c2", num: "J-077", type: "Bezorilik", date: "28.02.2026", status: "Sudda" },
  ]);
  const k = useMemo(() => ({ total: inc.length, done: inc.filter((r) => r.status === "Hal qilindi").length, prog: inc.filter((r) => r.status === "Jarayonda").length }), [inc]);

  return (
    <CmdRoot accent={A} system="IIB yagona AT — 102" place="Sarnovul MFY, Baliqchi tumani">
      <CmdHeader brand="IIB SMART CENTER" place="SARNOVUL MFY · JAMOAT XAVFSIZLIGI MARKAZI" nav={NAV} accent={A} active={tab} onNav={setTab} />

      {tab === "Umumiy" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Panel title="Bugungi chaqiruvlar" icon={PhoneCall} accent={CY} source="102 chaqiruv markazi"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: CY, textShadow: `0 0 18px ${hexA(CY, 0.6)}` }}>32</div><div className="text-right text-[11px] text-foreground/50"><div>Jamoat tartibi 18</div><div>YHQ 9 · Boshqa 5</div></div></div></Panel>
            <Panel title="Begona kirishlar" icon={AlertTriangle} accent="#ef4444" source="CCTV avto-nazorat"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#ef4444", textShadow: "0 0 18px rgba(239,68,68,0.55)" }}>{EVENTS.length}</div><div className="text-right text-[11px] text-foreground/50"><div>Avto {EVENTS.filter((e) => e.kind === "avto").length}</div><div>Shaxs {EVENTS.filter((e) => e.kind === "odam").length}</div></div></div></Panel>
            <Panel title="Aniqlanish darajasi" icon={ShieldCheck} accent="#22c55e" source="Yagona jinoyat reyestri"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#22c55e", textShadow: "0 0 18px rgba(34,197,94,0.55)" }}>94%</div><div className="text-right text-[11px] text-foreground/50"><div>Ochilgan 86</div><div>Tergovda 12</div></div></div></Panel>
          </div>

          <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "30rem" }}>
            <div className="flex flex-col gap-3 xl:col-span-3">
              <BigStat icon={Siren} label="Hodisalar" value="486" accent={A} source="102 — hodisa reyestri" subs={[{ k: "Bugun", v: k.total }, { k: "Jarayonda", v: k.prog }, { k: "Hal", v: k.done }, { k: "O'rtacha", v: "7 daq" }]} />
              <BigStat icon={Car} label="Avto nazorat" value="2 162" accent={CY} source="ANPR tizimi" subs={[{ k: "O'tdi", v: "12 480" }, { k: "Begona", v: 6 }, { k: "Qidiruvda", v: 1 }, { k: "Qamrov", v: "78%" }]} />
            </div>
            <div className="flex flex-col gap-3 xl:col-span-6">
              <Panel title="CCTV nazorat — begona kirishlar" icon={Video} accent={A} right="JONLI · footage" source="IIB CCTV tarmog'i" className="flex-1" bodyClass="min-h-0">
                <CctvMonitor events={EVENTS} accent={A} />
              </Panel>
            </div>
            <div className="flex flex-col gap-3 xl:col-span-3">
              <Panel title="Hududiy xavfsizlik reytingi" icon={Gauge} accent={A} source="IIB tahlil moduli" className="flex-1" bodyClass="min-h-0"><RatingList items={RATINGS} accent={A} /></Panel>
              <Panel title="Patrul qamrovi" icon={Radio} accent={A} source="Patrul boshqaruv tizimi">
                <div className="flex flex-col py-1.5"><BarRow label="Patrul qamrovi" value="86" unit="%" pct={86} accent={A} /><BarRow label="Aniqlanish" value="92" unit="%" pct={92} accent="#22c55e" /><BarRow label="Kamera qamrovi" value="78" unit="%" pct={78} accent={CY} /></div>
              </Panel>
            </div>
          </div>

          <Panel title="Fizik tarmoq — Sarnovul MFY" icon={Camera} accent={CY} source="IIB infratuzilma reyestri">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-6">{NET.map((n, i) => (<div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"><span className="grid size-9 place-items-center rounded-lg" style={{ background: hexA(n.c, 0.14), color: n.c }}><n.icon className="size-4" /></span><div className="leading-tight"><div className="font-mono text-[18px] font-bold tabular-nums text-foreground">{n.value}</div><div className="text-[10px] text-foreground/45">{n.label}</div></div></div>))}</div>
          </Panel>
        </>
      )}

      {tab === "Hodisalar" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><StatTile icon={Siren} label="Jami" value={k.total} accent={A} highlight /><StatTile icon={Activity} label="Jarayonda" value={k.prog} accent="#f59e0b" /><StatTile icon={ShieldCheck} label="Hal qilingan" value={k.done} accent="#22c55e" /><StatTile icon={PhoneCall} label="102" value="486" accent={CY} /></div>
          <CmdTable title="Hodisalar jurnali" icon={Siren} accent={A} columns={INC_COLS} rows={inc} setRows={setInc} source="102 — hodisa reyestri" right="CRUD" />
        </>
      )}
      {tab === "Patrullar" && <CmdTable title="Patrul ekipajlari" icon={Radio} accent={A} columns={PAT_COLS} rows={pat} setRows={setPat} source="Patrul boshqaruv" right="CRUD" />}
      {tab === "Jinoyatlar" && <CmdTable title="Jinoyat ishlari" icon={ShieldCheck} accent={A} columns={CASE_COLS} rows={cases} setRows={setCases} source="Yagona jinoyat reyestri" right="CRUD" />}
    </CmdRoot>
  );
};

export default IibDashboardPage;
