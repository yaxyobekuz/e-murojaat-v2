// IIB — analitika dashboard
import {
  Shield,
  FileText,
  ShieldCheck,
  Clock,
  Phone,
  TriangleAlert,
  Users,
  Activity,
} from "lucide-react";

import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/charts/TrendChart";
import DonutChart from "@/shared/components/ui/charts/DonutChart";
import BreakdownBar from "@/shared/components/ui/charts/BreakdownBar";
import { iibData } from "../data/iib.data";

const Insight = ({ children }) => (
  <p className="mt-3 text-xs text-zinc-500">{children}</p>
);

const IibDashboardPage = () => {
  const k = iibData.kpis();
  const trend = iibData.trend();
  const dist = iibData.typeDistribution();
  const top = iibData.topByClearance();
  const regions = iibData.regionBreakdown();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">IIB — boshqaruv paneli</h1>
        <p className="mt-1 text-sm text-zinc-500">Andijon viloyati ichki ishlar bo'limlari monitoringi</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Bo'limlar" value={k.totalUnits} icon={Shield} suffix=" ta" />
        <StatCard label="Jinoyatlar (30 kun)" value={k.totalCrimes30} icon={FileText} suffix=" ta" tone="info" />
        <StatCard label="Ochilish darajasi" value={k.clearanceRate} icon={ShieldCheck} suffix="%" tone="positive" />
        <StatCard label="O'rtacha javob" value={k.avgResponse} icon={Clock} suffix=" daq" />
        <StatCard label="Bugungi 112 chaqiruv" value={k.todayCalls} icon={Phone} suffix=" ta" tone="info" />
        <StatCard label="Faol holatlar" value={k.openCases} icon={FileText} suffix=" ta" tone="negative" />
        <StatCard label="YTH (30 kun)" value={k.accidents30} icon={TriangleAlert} suffix=" ta" tone="warn" />
        <StatCard label="Aholi ishonchi" value={k.trustIndex} icon={Users} suffix="%" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Jinoyatchilik dinamikasi">
          <TrendChart data={trend} suffix="" />
          <Insight>So'nggi 12 oy ro'yxatga olingan jinoyatlar dinamikasi.</Insight>
        </Card>
        <Card title="Jinoyat turlari">
          <DonutChart data={dist} centerLabel="holat" centerValue={k.totalCrimes30} />
          <Insight>Jinoyatlar turlar bo'yicha taqsimoti — eng ko'p ulush o'g'irlik.</Insight>
        </Card>
        <Card title="Ochilish bo'yicha TOP bo'limlar">
          <BreakdownBar data={top} suffix="%" />
          <Insight>Eng yuqori ochilish darajasiga ega bo'limlar.</Insight>
        </Card>
        <Card title="Hududlar kesimida jinoyatlar">
          <BreakdownBar data={regions} suffix="" color="#5b8def" />
          <Insight>Tumanlar bo'yicha jinoyatlar soni taqsimoti.</Insight>
        </Card>
      </div>

      {/* Table */}
      <Card title="Bo'limlar ro'yxati" className="mt-6">
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2.5 font-medium">Nomi</th>
                <th className="px-3 py-2.5 font-medium">Hudud</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Jinoyat (30 kun)</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Ochilish</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">O'rtacha javob</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {iibData.units.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-zinc-50">
                  <td className="px-3 py-2.5 font-medium text-gray-900">{u.name}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{u.region}</td>
                  <td className="px-3 py-2.5 tabular-nums text-zinc-700">{u.crimes30}</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium text-emerald-600">{u.clearance}%</td>
                  <td className="px-3 py-2.5 tabular-nums text-zinc-700">{u.avgResponse} daq</td>
                  <td className="px-3 py-2.5 tabular-nums font-semibold text-gray-900">{u.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default IibDashboardPage;
