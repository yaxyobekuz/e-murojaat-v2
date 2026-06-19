// FVV — analitika dashboard
import {
  Flame,
  PhoneCall,
  Clock,
  ShieldCheck,
  CircleCheck,
  LifeBuoy,
  Truck,
  Users,
} from "lucide-react";

import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import TrendChart from "@/shared/components/ui/charts/TrendChart";
import DonutChart from "@/shared/components/ui/charts/DonutChart";
import BreakdownBar from "@/shared/components/ui/charts/BreakdownBar";
import { fvvData } from "../data/fvv.data";

const Insight = ({ children }) => (
  <p className="mt-3 text-xs text-zinc-500">{children}</p>
);

const FvvDashboardPage = () => {
  const k = fvvData.kpis();
  const trend = fvvData.trend();
  const dist = fvvData.typeDistribution();
  const top = fvvData.topByReadiness();
  const regions = fvvData.regionBreakdown();
  const totalIncidents = dist.reduce((s, d) => s + d.value, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">FVV — boshqaruv paneli</h1>
        <p className="mt-1 text-sm text-zinc-500">Andijon viloyati favqulodda vaziyatlar qismlari monitoringi</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Faol favqulodda vaziyatlar" value={k.activeIncidents} icon={Flame} suffix=" ta" tone="negative" />
        <StatCard label="Bugungi chaqiruvlar" value={k.todayIncidents} icon={PhoneCall} suffix=" ta" tone="info" />
        <StatCard label="O'rtacha javob" value={k.avgResponse} icon={Clock} suffix=" daq" />
        <StatCard label="Normaga rioya" value={k.compliance} icon={ShieldCheck} suffix="%" tone="positive" />
        <StatCard label="Bugun bartaraf etilgan" value={k.todayResolved} icon={CircleCheck} suffix=" ta" tone="positive" />
        <StatCard label="Qutqarilganlar (30 kun)" value={k.rescued30} icon={LifeBuoy} suffix=" ta" tone="info" />
        <StatCard label="Faol texnika" value={k.vehiclesActive} icon={Truck} suffix=" ta" hint={`${k.vehiclesActive}/${k.vehiclesTotal} texnika`} />
        <StatCard label="Aholi tayyorgarligi" value={k.trainingPct} icon={Users} suffix="%" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Hodisalar dinamikasi">
          <TrendChart data={trend} suffix=" ta" />
          <Insight>So'nggi 12 oy favqulodda vaziyatlar soni dinamikasi.</Insight>
        </Card>
        <Card title="Hodisa turlari">
          <DonutChart data={dist} centerLabel="hodisa" centerValue={totalIncidents} />
          <Insight>Hodisalar turlari bo'yicha taqsimoti — eng ko'p ulush yong'inlar.</Insight>
        </Card>
        <Card title="Tayyorlik bo'yicha TOP qismlar">
          <BreakdownBar data={top} suffix="%" />
          <Insight>Tayyorlik = faol texnika ulushi (faol / jami).</Insight>
        </Card>
        <Card title="Hududlar kesimida hodisalar">
          <BreakdownBar data={regions} suffix="" color="#5b8def" />
          <Insight>Tumanlar bo'yicha hodisalar soni taqsimoti.</Insight>
        </Card>
      </div>

      {/* Table */}
      <Card title="Qismlar ro'yxati" className="mt-6">
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-zinc-400">
                <th className="px-3 py-2.5 font-medium">Nomi</th>
                <th className="px-3 py-2.5 font-medium">Hudud</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Hodisa (30 kun)</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">O'rtacha javob</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Tayyorlik</th>
                <th className="px-3 py-2.5 font-medium tabular-nums">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {fvvData.units.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-zinc-50">
                  <td className="px-3 py-2.5 font-medium text-gray-900">{u.name}</td>
                  <td className="px-3 py-2.5 text-zinc-600">{u.region}</td>
                  <td className="px-3 py-2.5 tabular-nums text-zinc-700">{u.incidents30}</td>
                  <td className="px-3 py-2.5 tabular-nums text-zinc-700">{u.avgResponse} daq</td>
                  <td className="px-3 py-2.5 tabular-nums font-medium text-emerald-600">{u.readiness}%</td>
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

export default FvvDashboardPage;
