// IIB — Material Dashboard uslubi + funksional tablar (CRUD). Kartalar/grafiklar jadvaldan hisoblanadi.
import { useMemo, useState } from "react";
import { Siren, ShieldCheck, Loader, PhoneCall, Car, Gavel } from "lucide-react";
import { MdRoot, MdNavbar, MdTabs, MdStatCard, MdChartCard, MdTable } from "@/shared/components/ui/md/primitives";

const TABS = ["Umumiy", "Hodisalar", "Patrullar", "Jinoyatlar"];
const TYPES = ["Bezorilik", "Mulkiy", "YHQ", "Boshqa"];

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
  { key: "num", label: "Raqam", type: "text" },
  { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "date", label: "Sana", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: caseTone, options: ["Tergov", "Sudda", "Yopilgan"].map((t) => ({ value: t, label: t })) },
];

const IibDashboardPage = () => {
  const [tab, setTab] = useState("Umumiy");
  const [inc, setInc] = useState([
    { id: "i1", type: "Bezorilik", place: "Bozor atrofi", time: "02:51", status: "Jarayonda" },
    { id: "i2", type: "Mulkiy", place: "Sanoat zonasi", time: "03:14", status: "Yangi" },
    { id: "i3", type: "YHQ", place: "Markaziy ko'cha", time: "01:42", status: "Hal qilindi" },
    { id: "i4", type: "Boshqa", place: "Yangi daha", time: "23:27", status: "Hal qilindi" },
  ]);
  const [pat, setPat] = useState([
    { id: "p1", crew: "Ekipaj-1", zone: "Markaziy", officers: 2, status: "Patrulda" },
    { id: "p2", crew: "Ekipaj-2", zone: "Bozor", officers: 2, status: "Chaqiruvda" },
    { id: "p3", crew: "Ekipaj-3", zone: "Sanoat", officers: 3, status: "Bazada" },
  ]);
  const [cases, setCases] = useState([
    { id: "c1", num: "J-118", type: "Mulkiy", date: "12.03.2026", status: "Tergov" },
    { id: "c2", num: "J-077", type: "Bezorilik", date: "28.02.2026", status: "Sudda" },
    { id: "c3", num: "J-051", type: "YHQ", date: "15.02.2026", status: "Yopilgan" },
  ]);

  const s = useMemo(() => {
    const done = inc.filter((r) => r.status === "Hal qilindi").length;
    const prog = inc.filter((r) => r.status === "Jarayonda").length;
    const rate = inc.length ? Math.round((done / inc.length) * 100) : 0;
    const byType = TYPES.map((t) => inc.filter((r) => r.type === t).length);
    return { total: inc.length, done, prog, rate, byType };
  }, [inc]);

  return (
    <MdRoot>
      <MdNavbar crumb="IIB" title="IIB — Sarnovul MFY operativ" />
      <MdTabs tabs={TABS} active={tab} onChange={setTab} color="error" />

      {tab === "Umumiy" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MdStatCard color="dark" icon={Siren} title="Jami hodisalar" count={s.total} note="bu oy" />
            <MdStatCard color="warning" icon={Loader} title="Jarayonda" count={s.prog} note="ko'rib chiqilmoqda" />
            <MdStatCard color="success" icon={ShieldCheck} title="Hal qilingan" count={s.done} delta={`${s.rate}%`} note="aniqlanish darajasi" />
            <MdStatCard color="info" icon={PhoneCall} title="102 chaqiruvlar" count="486" delta="+5%" note="o'tgan haftaga nisbatan" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MdChartCard color="error" type="bar" labels={TYPES} values={s.byType} title="Hodisa turlari" description="Joriy oy kesimi" date="hozir yangilandi" />
            <MdChartCard color="info" type="line" labels={["00", "04", "08", "12", "16", "20"]} values={[3, 1, 4, 6, 5, 7]} title="Chaqiruvlar dinamikasi (24s)" description="(+12%) kechagi kunga nisbatan" date="4 daqiqa oldin" />
            <MdChartCard color="dark" type="line" labels={["Du", "Se", "Ch", "Pa", "Ju"]} values={[12, 9, 14, 11, s.total]} title="Haftalik tendensiya" description="Hodisalar trendi" date="yangilandi" />
          </div>
        </>
      )}
      {tab === "Hodisalar" && <MdTable title="Hodisalar jurnali" subtitle="Yangi hodisa qo'shing — Umumiy statistika yangilanadi" color="error" columns={INC_COLS} rows={inc} setRows={setInc} />}
      {tab === "Patrullar" && <MdTable title="Patrul ekipajlari" subtitle="Ekipajlar holati" color="info" columns={PAT_COLS} rows={pat} setRows={setPat} />}
      {tab === "Jinoyatlar" && <MdTable title="Jinoyat ishlari" subtitle="Tergov reyestri" color="dark" columns={CASE_COLS} rows={cases} setRows={setCases} />}
    </MdRoot>
  );
};

export default IibDashboardPage;
