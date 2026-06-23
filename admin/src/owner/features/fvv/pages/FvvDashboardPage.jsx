// FVV — Material Dashboard uslubi. Chaqiruvlar jadvali CRUD; kartalar/grafiklar undan hisoblanadi.
import { useMemo, useState } from "react";
import { Flame, Truck, CheckCircle2, PhoneCall } from "lucide-react";
import { MdRoot, MdNavbar, MdStatCard, MdChartCard, MdTable } from "@/shared/components/ui/md/primitives";

const TYPES = ["Yong'in", "Qutqaruv", "Gaz", "Tabiiy ofat"];
const INIT = [
  { id: "f1", type: "Yong'in", place: "Sanoat zonasi", time: "03:14", status: "Joyida" },
  { id: "f2", type: "Gaz", place: "Gaz taqsimlagich", time: "02:40", status: "Yo'lda" },
  { id: "f3", type: "Qutqaruv", place: "Eski shahar", time: "01:10", status: "Bartaraf etildi" },
  { id: "f4", type: "Yong'in", place: "Transformator", time: "22:05", status: "Bartaraf etildi" },
];
const statusTone = (v) => (v === "Bartaraf etildi" ? "yashil" : v === "Joyida" ? "sariq" : "kok");
const COLUMNS = [
  { key: "type", label: "Tur", type: "select", options: TYPES.map((t) => ({ value: t, label: t })) },
  { key: "place", label: "Joy", type: "text" },
  { key: "time", label: "Vaqt", type: "text" },
  { key: "status", label: "Holat", type: "status", tone: statusTone, options: ["Yo'lda", "Joyida", "Bartaraf etildi"].map((t) => ({ value: t, label: t })) },
];

const FvvDashboardPage = () => {
  const [rows, setRows] = useState(INIT);
  const s = useMemo(() => {
    const fires = rows.filter((r) => r.type === "Yong'in").length;
    const done = rows.filter((r) => r.status === "Bartaraf etildi").length;
    const rate = rows.length ? Math.round((done / rows.length) * 100) : 0;
    const byType = TYPES.map((t) => rows.filter((r) => r.type === t).length);
    return { total: rows.length, fires, done, rate, byType };
  }, [rows]);

  return (
    <MdRoot>
      <MdNavbar crumb="FVV" title="FVV — Sarnovul MFY favqulodda" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MdStatCard color="dark" icon={PhoneCall} title="Chaqiruvlar" count={s.total} note="bu oy" />
        <MdStatCard color="error" icon={Flame} title="Yong'inlar" count={s.fires} note="faol/yopilgan" />
        <MdStatCard color="success" icon={CheckCircle2} title="Bartaraf etilgan" count={s.done} delta={`${s.rate}%`} note="bartaraf etish" />
        <MdStatCard color="warning" icon={Truck} title="Brigadalar" count="3" note="navbatda" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MdChartCard color="warning" type="bar" labels={TYPES} values={s.byType} title="Hodisa toifalari" description="Joriy oy kesimi" date="hozir yangilandi" />
        <MdChartCard color="error" type="line" labels={["00", "04", "08", "12", "16", "20"]} values={[1, 0, 2, 3, 2, 4]} title="Chaqiruvlar dinamikasi (24s)" description="(+8%) kechagi kunga nisbatan" date="4 daqiqa oldin" />
        <MdChartCard color="dark" type="line" labels={["Du", "Se", "Ch", "Pa", "Ju"]} values={[4, 3, 5, 4, s.total]} title="Haftalik tendensiya" description="Chaqiruvlar trendi" date="yangilandi" />
      </div>

      <div className="mt-8">
        <MdTable title="Chaqiruvlar jurnali" subtitle="Yangi chaqiruv qo'shing — statistika avtomatik yangilanadi" color="warning" columns={COLUMNS} rows={rows} setRows={setRows} />
      </div>
    </MdRoot>
  );
};

export default FvvDashboardPage;
