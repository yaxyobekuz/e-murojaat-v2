// Ta'lim — Material Dashboard uslubi + funksional tablar (CRUD). Kartalar/grafiklar jadvaldan hisoblanadi.
import { useMemo, useState } from "react";
import { School, Users, GraduationCap, Activity, UserCog } from "lucide-react";
import { MdRoot, MdNavbar, MdTabs, MdStatCard, MdChartCard, MdTable } from "@/shared/components/ui/md/primitives";

const TABS = ["Umumiy", "Maktablar", "O'qituvchilar", "Xodimlar"];

const SCHOOL_COLS = [
  { key: "name", label: "Maktab", type: "text" }, { key: "pupils", label: "O'quvchilar", type: "number" },
  { key: "teachers", label: "O'qituvchilar", type: "number" }, { key: "att", label: "Davomat %", type: "number" },
];
const TEACHER_COLS = [
  { key: "name", label: "F.I.O", type: "text" }, { key: "school", label: "Maktab", type: "text" },
  { key: "subject", label: "Fan", type: "text" }, { key: "exp", label: "Staj (yil)", type: "number" },
];
const STAFF_COLS = [
  { key: "name", label: "F.I.O", type: "text" },
  { key: "role", label: "Lavozim", type: "select", options: ["Direktor", "O'rinbosar", "Metodist", "Xizmat", "Texnik"].map((t) => ({ value: t, label: t })) },
  { key: "school", label: "Maktab", type: "text" },
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
    { id: "t3", name: "Rasulov B.", school: "12-maktab", subject: "Fizika", exp: 21 },
  ]);
  const [staff, setStaff] = useState([
    { id: "x1", name: "Yusupov D.", role: "Direktor", school: "41-maktab" },
    { id: "x2", name: "Aliyeva N.", role: "Metodist", school: "7-IDUM" },
  ]);

  const s = useMemo(() => {
    const pupils = schools.reduce((a, r) => a + Number(r.pupils || 0), 0);
    const tt = schools.reduce((a, r) => a + Number(r.teachers || 0), 0);
    const att = schools.length ? Math.round(schools.reduce((a, r) => a + Number(r.att || 0), 0) / schools.length) : 0;
    return { count: schools.length, pupils, teachers: tt, att };
  }, [schools]);

  return (
    <MdRoot>
      <MdNavbar crumb="Ta'lim" title="Ta'lim — Sarnovul MFY" />
      <MdTabs tabs={TABS} active={tab} onChange={setTab} color="info" />

      {tab === "Umumiy" && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MdStatCard color="dark" icon={School} title="Maktablar" count={s.count} delta="+1" note="bu chorakda" />
            <MdStatCard color="info" icon={Users} title="O'quvchilar" count={s.pupils.toLocaleString("uz-UZ")} delta="+3%" note="o'tgan yilga nisbatan" />
            <MdStatCard color="success" icon={GraduationCap} title="O'qituvchilar" count={s.teachers} delta={`+${teachers.length}`} note="reyestrda" />
            <MdStatCard color="primary" icon={Activity} title="O'rtacha davomat" count={`${s.att}%`} note="hozir yangilandi" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <MdChartCard color="info" type="bar" labels={schools.map((r) => r.name)} values={schools.map((r) => r.pupils)} title="Maktablar bo'yicha o'quvchilar" description="Joriy o'quv yili" date="hozir yangilandi" />
            <MdChartCard color="success" type="line" labels={["Du", "Se", "Ch", "Pa", "Ju"]} values={[92, 94, 91, 95, s.att]} title="Davomat dinamikasi" description="(+2%) bu hafta" date="4 daqiqa oldin" />
            <MdChartCard color="dark" type="line" labels={["Sen", "Okt", "Noy", "Dek", "Yan"]} values={[88, 90, 93, 92, s.att]} title="Yillik tendensiya" description="Davomat trendi" date="yangilandi" />
          </div>
        </>
      )}
      {tab === "Maktablar" && <MdTable title="Maktablar reyestri" subtitle="Qo'shish/o'chirish — Umumiy kartalar yangilanadi" color="info" columns={SCHOOL_COLS} rows={schools} setRows={setSchools} />}
      {tab === "O'qituvchilar" && <MdTable title="O'qituvchilar" subtitle="Pedagoglar reyestri" color="success" columns={TEACHER_COLS} rows={teachers} setRows={setTeachers} />}
      {tab === "Xodimlar" && <MdTable title="Xodimlar" subtitle="Boshqaruv va texnik xodimlar" color="dark" columns={STAFF_COLS} rows={staff} setRows={setStaff} />}
    </MdRoot>
  );
};

export default TalimDashboardPage;
