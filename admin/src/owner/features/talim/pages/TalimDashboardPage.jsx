// Ta'lim — Material Dashboard uslubi. Maktablar jadvali CRUD; kartalar/grafiklar undan hisoblanadi.
import { useMemo, useState } from "react";
import { School, Users, GraduationCap, Activity } from "lucide-react";
import { MdRoot, MdNavbar, MdStatCard, MdChartCard, MdTable } from "@/shared/components/ui/md/primitives";

const INIT = [
  { id: "s1", name: "41-maktab", pupils: 1840, teachers: 108, att: 95 },
  { id: "s2", name: "7-IDUM", pupils: 1320, teachers: 84, att: 92 },
  { id: "s3", name: "12-maktab", pupils: 1700, teachers: 94, att: 96 },
];
const COLUMNS = [
  { key: "name", label: "Maktab", type: "text" },
  { key: "pupils", label: "O'quvchilar", type: "number" },
  { key: "teachers", label: "O'qituvchilar", type: "number" },
  { key: "att", label: "Davomat %", type: "number" },
];

const TalimDashboardPage = () => {
  const [rows, setRows] = useState(INIT);
  const s = useMemo(() => {
    const pupils = rows.reduce((a, r) => a + Number(r.pupils || 0), 0);
    const teachers = rows.reduce((a, r) => a + Number(r.teachers || 0), 0);
    const att = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r.att || 0), 0) / rows.length) : 0;
    return { schools: rows.length, pupils, teachers, att };
  }, [rows]);

  return (
    <MdRoot>
      <MdNavbar crumb="Ta'lim" title="Ta'lim — Sarnovul MFY" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MdStatCard color="dark" icon={School} title="Maktablar" count={s.schools} delta="+1" note="bu chorakda" />
        <MdStatCard color="info" icon={Users} title="O'quvchilar" count={s.pupils.toLocaleString("uz-UZ")} delta="+3%" note="o'tgan yilga nisbatan" />
        <MdStatCard color="success" icon={GraduationCap} title="O'qituvchilar" count={s.teachers} delta="+12" note="yangi pedagog" />
        <MdStatCard color="primary" icon={Activity} title="O'rtacha davomat" count={`${s.att}%`} note="hozir yangilandi" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MdChartCard color="info" type="bar" labels={rows.map((r) => r.name)} values={rows.map((r) => r.pupils)} title="Maktablar bo'yicha o'quvchilar" description="Joriy o'quv yili" date="hozir yangilandi" />
        <MdChartCard color="success" type="line" labels={["Du", "Se", "Ch", "Pa", "Ju"]} values={[92, 94, 91, 95, s.att]} title="Davomat dinamikasi" description="(+2%) bu hafta o'sish" date="4 daqiqa oldin" />
        <MdChartCard color="dark" type="line" labels={["Sen", "Okt", "Noy", "Dek", "Yan"]} values={[88, 90, 93, 92, s.att]} title="Yillik tendensiya" description="Davomat trendi" date="yangilandi" />
      </div>

      <div className="mt-8">
        <MdTable title="Maktablar reyestri" subtitle="Qo'shish/o'chirish — kartalar avtomatik yangilanadi" color="info" columns={COLUMNS} rows={rows} setRows={setRows} />
      </div>
    </MdRoot>
  );
};

export default TalimDashboardPage;
