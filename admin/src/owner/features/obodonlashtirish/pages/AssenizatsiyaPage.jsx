// Gaz mashinasi / assenizatsiya — admin analitikasi. Buyurtma asosida (SLA),
// hajm, qabul nuqtasi (compliance). Milliy chastota normasi yo'q.
import { Droplets, ListChecks, Clock, Boxes, XCircle } from "lucide-react";

import { formatDateUz } from "@/shared/utils/formatDate";
import GlassStatCard from "@/shared/components/ui/glass/GlassStatCard";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import ChartCard from "@/shared/components/ui/chart/ChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import DataTable from "@/shared/components/ui/table/DataTable";
import ObodPageHeader from "../components/ObodPageHeader";
import {
  ASSEN_PLACE,
  ASSEN_ORDERS,
  ASSEN_ORDER_TREND,
  ASSEN_BY_MAHALLA,
  ASSEN_BY_STATUS,
  STATUS_LABELS,
  ORDER_STATUS,
  assenSummary as s,
} from "../mock/assenizatsiya.data";

// Yangi → yuborildi → bajarildi tartibida, yangilari ustda
const order = { new: 0, dispatched: 1, done: 2, rejected: 3 };
const rows = [...ASSEN_ORDERS].sort((a, b) => order[a.status] - order[b.status]);

const columns = [
  { key: "number", header: "Buyurtma", render: (r) => <span className="font-medium">{r.number}</span> },
  { key: "address", header: "Manzil", render: (r) => r.address },
  { key: "created", header: "Yuborilgan", render: (r) => formatDateUz(r.createdDate) },
  {
    key: "completed",
    header: "Bajarilgan",
    render: (r) => (r.completedDate ? formatDateUz(r.completedDate) : "—"),
  },
  {
    key: "sla",
    header: "SLA",
    align: "center",
    render: (r) => (r.slaDays != null ? <span className="tabular-nums">{r.slaDays} kun</span> : "—"),
  },
  {
    key: "volume",
    header: "Hajm",
    align: "right",
    render: (r) => (r.volume ? <span className="tabular-nums">{r.volume} m³</span> : "—"),
  },
  { key: "reception", header: "Qabul nuqtasi", render: (r) => r.reception || "—" },
  {
    key: "status",
    header: "Holat",
    align: "center",
    render: (r) => <StatusBadge tone={ORDER_STATUS[r.status].tone}>{ORDER_STATUS[r.status].label}</StatusBadge>,
  },
];

const AssenizatsiyaPage = () => (
  <div className="flex flex-col gap-5">
    <ObodPageHeader
      title="Gaz mashinasi — Assenizatsiya"
      subtitle={`Suyuq maishiy chiqindi (septik) bo'shatish · buyurtma asosida · ${ASSEN_PLACE}`}
      legal="Asos: VM 95-son — maxsus transport, qabul nuqtasiga topshirish · milliy SLA normasi yo'q · demo"
    />

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <GlassStatCard label="Jami buyurtma" value={s.total} icon={ListChecks} accent="cyan" />
      <GlassStatCard label="Bajarildi" value={s.done} icon={Droplets} accent="emerald" />
      <GlassStatCard label="Jarayonda" value={s.inProgress} icon={Clock} accent="yellow" />
      <GlassStatCard label="O'rtacha SLA" value={s.avgSla} suffix=" kun" icon={Clock} accent="purple" />
      <GlassStatCard label="Bo'shatilgan hajm" value={s.volume} suffix=" m³" icon={Boxes} accent="cyan" glow />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="Buyurtmalar dinamikasi — 12 oy"
        insight={`Joriy oy: ${ASSEN_ORDER_TREND.at(-1).value} buyurtma`}
      >
        <TrendChart data={ASSEN_ORDER_TREND} color="#0891b2" unit="ta" />
      </ChartCard>

      <ChartCard
        title="Holat bo'yicha taqsimot"
        insight={`${s.done} bajarildi · ${s.inProgress} jarayonda · ${s.rejected} rad`}
      >
        <DonutChart data={ASSEN_BY_STATUS} labelMap={STATUS_LABELS} />
      </ChartCard>
    </div>

    <ChartCard title="Mahalla bo'yicha buyurtmalar" insight="Suyuq chiqindi bo'shatish so'rovlari geografiyasi">
      <BreakdownBar data={[...ASSEN_BY_MAHALLA].sort((a, b) => b.value - a.value)} color="#0891b2" />
    </ChartCard>

    <ChartCard title="Buyurtmalar reyestri" insight={`Jami ${s.total} buyurtma · yangilari yuqorida`}>
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} />
    </ChartCard>
  </div>
);

export default AssenizatsiyaPage;
