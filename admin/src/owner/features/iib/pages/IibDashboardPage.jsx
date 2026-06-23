// IIB — Material Dashboard uslubi. Hodisalar jadvali CRUD; kartalar/grafiklar undan hisoblanadi.
import { useMemo, useState } from "react";
import { Siren, ShieldCheck, Loader, PhoneCall } from "lucide-react";
import { MdRoot, MdNavbar, MdStatCard, MdChartCard, MdTable } from "@/shared/components/ui/md/primitives";

const TYPES = ["Bezorilik", "Mulkiy", "YHQ", "Boshqa"];
const INIT = [
  { id: "i1", type: "Bezorilik", place: "Bozor atrofi", time: "02:51", status: "Jarayonda" },
  { id: "i2", type: "Mulkiy", place: "Sanoat zonasi", time: "03:14", status: "Yangi" },
  { id: "i3", type: "YHQ", place: "Markaziy ko'cha", time: "01:42", status: "Hal qilindi" },
  { id: "i4", type: "Boshqa", place: "Yangi daha", time: "23:27", status: "Hal qilindi" },
];
const statusTone = (v) => (v === "Hal qilindi" ? "yashil" : v === "Jarayonda" ? "sariq" : "kok");
const COLUMNS = [
  { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "place", label: "Joy", type: "text" },
  { key: "time", label: "Vaqt", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: statusTone, options: ["Yangi", "Jarayonda", "Hal qilindi"].map((t) => ({ value: t, label: t })) },
];

const IibDashboardPage = () => {
  const [rows, setRows] = useState(INIT);
  const s = useMemo(() => {
    const done = rows.filter((r) => r.status === "Hal qilindi").length;
    const prog = rows.filter((r) => r.status === "Jarayonda").length;
    const rate = rows.length ? Math.round((done / rows.length) * 100) : 0;
    const byType = TYPES.map((t) => rows.filter((r) => r.type === t).length);
    return { total: rows.length, done, prog, rate, byType };
  }, [rows]);

  return (
    <MdRoot>
      <MdNavbar crumb="IIB" title="IIB — Sarnovul MFY operativ" />
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

      <div className="mt-8">
        <MdTable title="Hodisalar jurnali" subtitle="Yangi hodisa qo'shing — statistika avtomatik yangilanadi" color="error" columns={COLUMNS} rows={rows} setRows={setRows} />
      </div>
    </MdRoot>
  );
};

export default IibDashboardPage;
