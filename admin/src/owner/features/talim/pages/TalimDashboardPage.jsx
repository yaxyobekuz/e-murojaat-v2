// Ta'lim — analitika dashboard
import {
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  UserX,
  Percent,
  School,
  Baby,
} from "lucide-react";

import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/charts/TrendChart";
import DonutChart from "@/shared/components/ui/charts/DonutChart";
import BreakdownBar from "@/shared/components/ui/charts/BreakdownBar";
import { talimData } from "../data/talim.data";

const Insight = ({ children }) => (
  <p className="mt-3 text-xs text-zinc-500">{children}</p>
);

const TalimDashboardPage = () => {
  const k = talimData.kpis();
  const trend = talimData.trend();
  const dist = talimData.typeDistribution();
  const top = talimData.topRated();
  const regions = talimData.regionBreakdown();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Ta'lim — boshqaruv paneli</h1>
        <p className="mt-1 text-sm text-zinc-500">Andijon viloyati ta'lim muassasalari monitoringi</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Umumiy obyektlar" value={k.totalInstitutions} icon={Building2} suffix=" ta" />
        <StatCard label="Maktablar" value={k.schools} icon={School} suffix=" ta" tone="info" />
        <StatCard label="Bog'chalar" value={k.kindergartens} icon={Baby} suffix=" ta" tone="warn" />
        <StatCard label="Xususiy maktablar" value={k.privateSchools} icon={GraduationCap} suffix=" ta" />
        <StatCard label="Jami o'quvchilar" value={k.totalStudents} icon={Users} suffix=" ta" />
        <StatCard label="Bugun keldi" value={k.present} icon={UserCheck} suffix=" ta" tone="positive" hint={`${k.presentPct}% davomat`} />
        <StatCard label="Bugun kelmadi" value={k.absent} icon={UserX} suffix=" ta" tone="negative" />
        <StatCard label="O'rtacha davomat" value={k.avgRate} icon={Percent} suffix="%" tone="info" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Davomat dinamikasi">
          <TrendChart data={trend} suffix="%" />
          <Insight>So'nggi 12 oy o'rtacha davomat foizi — barqaror 82–94% oralig'ida.</Insight>
        </Card>
        <Card title="Obyektlar taqsimoti">
          <DonutChart data={dist} centerLabel="obyekt" centerValue={k.totalInstitutions} />
          <Insight>Eng ko'p ulush — umumiy o'rta ta'lim maktablari.</Insight>
        </Card>
        <Card title="Reyting bo'yicha TOP obyektlar">
          <BreakdownBar data={top} suffix=" ball" />
          <Insight>Reyting = davomat (50%) + komissiya (30%) + xavfsizlik (20%).</Insight>
        </Card>
        <Card title="Hududlar kesimida o'quvchilar">
          <BreakdownBar data={regions} suffix="" color="#5b8def" />
          <Insight>Tumanlar bo'yicha o'quvchilar soni taqsimoti.</Insight>
        </Card>
      </div>

      {/* Table */}
      <Card title="Obyektlar ro'yxati" className="mt-6">
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2.5 font-medium">Nomi</th>
                <th className="px-3 py-2.5 font-medium">Tur</th>
                <th className="px-3 py-2.5 font-medium">Hudud</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">O'quvchi</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Davomat</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {talimData.institutions.map((i) => (
                <tr key={i.id} className="border-b last:border-0 hover:bg-zinc-50">
                  <td className="px-3 py-2.5 font-medium text-gray-900">{i.name}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{i.typeLabel}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{i.region}</td>
                  <td className="px-3 py-2.5 tabular-nums text-zinc-700">{i.students}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium text-emerald-600">{i.attendanceRate}%</td>
                  <td className="px-3 py-2.5 tabular-nums font-semibold text-gray-900">{i.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TalimDashboardPage;
