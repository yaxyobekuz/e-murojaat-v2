// Ta'lim — Smart Center (dark). Markazda DAVOMAT (necha % keldi, oxirgi davomat, blok bo'yicha).
// Header navlari funksional tab: Umumiy + Maktablar/O'qituvchilar/Xodimlar (CRUD).
import { useMemo, useState } from "react";
import { School, Users, GraduationCap, Activity, UserCog, BookOpen, ClipboardCheck, Gauge } from "lucide-react";
import { CmdRoot, CmdHeader, Panel, StatTile, BarRow, RadialGauge, AreaSpark, RatingList, CmdTable, hexA } from "@/shared/components/ui/command/primitives";

const A = "#22d3ee";
const NAV = ["Umumiy", "Maktablar", "O'qituvchilar", "Xodimlar"];

const BigStat = ({ icon: Icon, label, value, accent, subs, source }) => (
  <Panel title={label} icon={Icon} accent={accent} source={source}>
    <div className="px-3 py-3">
      <div className="font-mono text-[28px] font-bold leading-none tabular-nums" style={{ color: accent, textShadow: `0 0 18px ${hexA(accent, 0.6)}` }}>{value}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">{subs.map((s, i) => (<div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-1.5"><div className="text-[9px] uppercase tracking-wider text-foreground/40">{s.k}</div><div className="font-mono text-[15px] font-semibold tabular-nums text-foreground">{s.v}</div></div>))}</div>
    </div>
  </Panel>
);

const SCHOOL_COLS = [
  { key: "name", label: "Maktab", type: "text" }, { key: "pupils", label: "O'quvchilar", type: "number" },
  { key: "teachers", label: "O'qituvchilar", type: "number" }, { key: "att", label: "Davomat %", type: "number" },
];
const TEACHER_COLS = [
  { key: "name", label: "F.I.O", type: "text" }, { key: "school", label: "Maktab", type: "text" },
  { key: "subject", label: "Fan", type: "text" }, { key: "exp", label: "Staj", type: "number" },
];
const STAFF_COLS = [
  { key: "name", label: "F.I.O", type: "text" },
  { key: "role", label: "Lavozim", type: "select", options: ["Direktor", "O'rinbosar", "Metodist", "Xizmat", "Texnik"].map((t) => ({ value: t, label: t })) },
  { key: "school", label: "Maktab", type: "text" },
];
const NET = [
  { icon: School, label: "Maktablar", value: 3, c: A }, { icon: BookOpen, label: "Sinflar", value: 142, c: "#a78bfa" },
  { icon: Users, label: "O'quvchilar", value: "4 860", c: "#22c55e" }, { icon: GraduationCap, label: "O'qituvchilar", value: 286, c: A },
  { icon: ClipboardCheck, label: "Bog'cha", value: 1, c: "#f59e0b" }, { icon: UserCog, label: "Xodimlar", value: 64, c: "#94a3b8" },
];

const TalimDashboardPage = () => {
  const [tab, setTab] = useState("Umumiy");
  const [schools, setSchools] = useState([
    { id: "s1", name: "41-maktab", pupils: 1840, teachers: 108, att: 95 },
    { id: "s2", name: "7-IDUM", pupils: 1320, teachers: 84, att: 92 },
    { id: "s3", name: "12-maktab", pupils: 1700, teachers: 94, att: 96 },
  ]);
  const [teachers, setTeachers] = useState([
    { id: "t1", name: "Karimov A.", school: "41-maktab", subject: "Matematika", exp: 14 },
    { id: "t2", name: "To'xtasinova M.", school: "7-IDUM", subject: "Ona tili", exp: 9 },
  ]);
  const [staff, setStaff] = useState([
    { id: "x1", name: "Yusupov D.", role: "Direktor", school: "41-maktab" },
    { id: "x2", name: "Aliyeva N.", role: "Metodist", school: "7-IDUM" },
  ]);

  const s = useMemo(() => {
    const pupils = schools.reduce((a, r) => a + Number(r.pupils || 0), 0);
    const tt = schools.reduce((a, r) => a + Number(r.teachers || 0), 0);
    const att = schools.length ? Math.round(schools.reduce((a, r) => a + Number(r.att || 0), 0) / schools.length) : 0;
    const present = Math.round((pupils * att) / 100);
    return { count: schools.length, pupils, teachers: tt, att, present };
  }, [schools]);

  return (
    <CmdRoot accent={A} system="Ta'lim AT — EMIS" place="Sarnovul MFY, Baliqchi tumani">
      <CmdHeader brand="TA'LIM SMART CENTER" place="SARNOVUL MFY · TA'LIM MONITORING MARKAZI" nav={NAV} accent={A} active={tab} onNav={setTab} />

      {tab === "Umumiy" && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Panel title="Bugungi davomat" icon={Activity} accent={A} source="EMIS — kunlik davomat"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: A, textShadow: `0 0 18px ${hexA(A, 0.6)}` }}>{s.att}%</div><div className="text-right text-[11px] text-foreground/50"><div>Keldi {s.present.toLocaleString("uz-UZ")}</div><div>Jami {s.pupils.toLocaleString("uz-UZ")}</div></div></div></Panel>
            <Panel title="Maktablar" icon={School} accent="#a78bfa" source="Maktab AT"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#a78bfa", textShadow: "0 0 18px rgba(167,139,250,0.55)" }}>{s.count}</div><div className="text-right text-[11px] text-foreground/50"><div>O'qituvchi {s.teachers}</div><div>Sinf 142</div></div></div></Panel>
            <Panel title="Qamrov" icon={Users} accent="#22c55e" source="EMIS reyestri"><div className="flex items-end justify-between px-4 py-3"><div className="font-mono text-[30px] font-bold tabular-nums" style={{ color: "#22c55e", textShadow: "0 0 18px rgba(34,197,94,0.55)" }}>{s.pupils.toLocaleString("uz-UZ")}</div><div className="text-right text-[11px] text-foreground/50"><div>O'g'il/qiz 51/49</div><div>Bog'cha 210</div></div></div></Panel>
          </div>

          <div className="grid gap-3 xl:grid-cols-12" style={{ minHeight: "30rem" }}>
            <div className="flex flex-col gap-3 xl:col-span-3">
              <BigStat icon={GraduationCap} label="Pedagoglar" value={s.teachers} accent="#a78bfa" source="EMIS — kadrlar" subs={[{ k: "Oliy toif.", v: 96 }, { k: "1-toif.", v: 110 }, { k: "Yosh", v: 48 }, { k: "Yuklama", v: "1.4" }]} />
              <BigStat icon={BookOpen} label="Sinf bosqichlari" value="142" accent={A} source="EMIS" subs={[{ k: "1-4", v: 58 }, { k: "5-9", v: 62 }, { k: "10-11", v: 22 }, { k: "O'rtacha", v: 34 }]} />
            </div>

            {/* markaz — DAVOMAT (karta o'rnida) */}
            <div className="flex flex-col gap-3 xl:col-span-6">
              <Panel title="Davomat monitoringi — Sarnovul MFY" icon={Gauge} accent={A} right="JONLI" source="EMIS — davomat" className="flex-1" bodyClass="min-h-0">
                <div className="grid h-full gap-3 p-3 md:grid-cols-2">
                  <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] py-3">
                    <RadialGauge value={s.att} label="Bugun keldi" sub={`${s.present.toLocaleString("uz-UZ")} / ${s.pupils.toLocaleString("uz-UZ")}`} accent={A} size={150} />
                    <div className="mt-1 flex gap-4 text-center text-[11px]">
                      <div><div className="font-mono text-base font-bold text-emerald-400">{s.att}%</div><div className="text-foreground/45">Bugun</div></div>
                      <div><div className="font-mono text-base font-bold text-foreground/80">93%</div><div className="text-foreground/45">Kecha</div></div>
                      <div><div className="font-mono text-base font-bold text-foreground/80">94%</div><div className="text-foreground/45">Hafta</div></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="px-1 pb-1 text-[10px] uppercase tracking-wider text-foreground/45">Maktablar bo'yicha davomat</div>
                    {schools.map((sc) => <BarRow key={sc.id} label={sc.name} value={sc.att} unit="%" pct={sc.att} accent={sc.att >= 94 ? "#22c55e" : sc.att >= 88 ? A : "#f59e0b"} />)}
                    <div className="mt-2 px-1 pb-1 text-[10px] uppercase tracking-wider text-foreground/45">Haftalik dinamika</div>
                    <AreaSpark accent={A} seed={2} height={110} />
                  </div>
                </div>
              </Panel>
            </div>

            <div className="flex flex-col gap-3 xl:col-span-3">
              <Panel title="Davomat reytingi (sinflar)" icon={Activity} accent={A} source="EMIS reyting" className="flex-1" bodyClass="min-h-0">
                <RatingList items={[["10-A", 99], ["9-B", 98], ["5-A", 97], ["7-V", 96], ["3-A", 95], ["11-A", 93], ["8-B", 90], ["6-V", 88]].map(([label, pct]) => ({ label, pct }))} accent={A} />
              </Panel>
              <Panel title="Bildirishnomalar" icon={ClipboardCheck} accent={A} source="EMIS xabarnoma">
                <div className="flex flex-col py-1.5"><BarRow label="SMS yuborildi" value="312" pct={88} accent={A} /><BarRow label="Javob olindi" value="276" pct={78} accent="#22c55e" /><BarRow label="Sababsiz" value="42" pct={14} accent="#f59e0b" /></div>
              </Panel>
            </div>
          </div>

          <Panel title="Ta'lim infratuzilmasi — Sarnovul MFY" icon={School} accent="#a78bfa" source="EMIS reyestri">
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-6">{NET.map((n, i) => (<div key={i} className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"><span className="grid size-9 place-items-center rounded-lg" style={{ background: hexA(n.c, 0.14), color: n.c }}><n.icon className="size-4" /></span><div className="leading-tight"><div className="font-mono text-[18px] font-bold tabular-nums text-foreground">{n.value}</div><div className="text-[10px] text-foreground/45">{n.label}</div></div></div>))}</div>
          </Panel>
        </>
      )}

      {tab === "Maktablar" && (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4"><StatTile icon={School} label="Maktablar" value={s.count} accent={A} highlight /><StatTile icon={Users} label="O'quvchilar" value={s.pupils.toLocaleString("uz-UZ")} accent="#22c55e" /><StatTile icon={GraduationCap} label="O'qituvchilar" value={s.teachers} accent="#a78bfa" /><StatTile icon={Activity} label="O'rtacha davomat" value={`${s.att}%`} accent={A} /></div>
          <CmdTable title="Maktablar reyestri" icon={School} accent={A} columns={SCHOOL_COLS} rows={schools} setRows={setSchools} source="Maktab AT (EMIS)" right="CRUD" />
        </>
      )}
      {tab === "O'qituvchilar" && <CmdTable title="O'qituvchilar" icon={GraduationCap} accent={A} columns={TEACHER_COLS} rows={teachers} setRows={setTeachers} source="EMIS — kadrlar" right="CRUD" />}
      {tab === "Xodimlar" && <CmdTable title="Xodimlar" icon={UserCog} accent={A} columns={STAFF_COLS} rows={staff} setRows={setStaff} source="EMIS — xodimlar" right="CRUD" />}
    </CmdRoot>
  );
};

export default TalimDashboardPage;
