// Axlat mashinasi (QMC) — admin analitikasi. Reys jadvali, oxirgi kelgan vaqt,
// kelmay qolgan marshrutlar, hajm (rejada vs kelgan), operator reytingi.
import { Truck, CheckCircle2, AlertTriangle, Boxes, Wallet } from "lucide-react";

import { formatMoney } from "@/shared/utils/formatMoney";
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
  AXLAT_PLACE,
  AXLAT_ROUTES,
  AXLAT_VOLUME_TREND,
  AXLAT_BY_MAHALLA,
  AXLAT_OPERATOR_RATING,
  RATING_LABELS,
  RATING_COLORS,
  ROUTE_STATUS,
  SCHEDULE_NORM,
  axlatSummary as s,
} from "../mock/axlat.data";

// Kelmay qolganlar ustda — diqqat markazida
const rows = [...AXLAT_ROUTES].sort((a, b) => {
  const order = { missed: 0, late: 1, done: 2 };
  return order[a.status] - order[b.status];
});

const columns = [
  { key: "name", header: "Marshrut", render: (r) => <span className="font-medium">{r.name}</span> },
  { key: "mahalla", header: "Mahalla", render: (r) => r.mahalla },
  { key: "norm", header: "Jadval normasi", render: (r) => SCHEDULE_NORM[r.norm] },
  {
    key: "last",
    header: "Oxirgi kelgan",
    render: (r) =>
      r.status === "missed" ? (
        <span className="text-rose-600">Kelmadi</span>
      ) : (
        <span>
          {formatDateUz(r.lastDate)} {r.lastArrival}
          {r.lateMin > 0 && <span className="text-amber-600"> (+{r.lateMin} daq)</span>}
        </span>
      ),
  },
  { key: "next", header: "Keyingi reja", render: (r) => formatDateUz(r.nextPlanned) },
  {
    key: "volume",
    header: "Hajm (kelgan / reja)",
    align: "right",
    render: (r) => (
      <span className="tabular-nums">
        {r.collectedVolume} / {r.plannedVolume} m³
      </span>
    ),
  },
  {
    key: "status",
    header: "Holat",
    align: "center",
    render: (r) => <StatusBadge tone={ROUTE_STATUS[r.status].tone}>{ROUTE_STATUS[r.status].label}</StatusBadge>,
  },
];

const AxlatPage = () => (
  <div className="flex flex-col gap-5">
    <ObodPageHeader
      title="Axlat mashinasi — QMC"
      subtitle={`Qattiq maishiy chiqindi olib chiqish monitoringi · ${AXLAT_PLACE}`}
      legal="Norma: VM 95-son (06.02.2019) — ko'p qavatli 1×/kun, xususiy 1×/3 kun · demo ma'lumot"
    />

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <GlassStatCard label="Marshrutlar (bugun)" value={s.routes} icon={Truck} accent="cyan" />
      <GlassStatCard label="Bajarildi" value={s.completionPct} suffix="%" icon={CheckCircle2} accent="emerald" />
      <GlassStatCard label="Kelmay qolgan" value={s.missed} icon={AlertTriangle} accent="yellow" glow />
      <GlassStatCard label="To'plangan hajm (oy)" value={s.collectedVolume} suffix=" m³" icon={Boxes} accent="purple" />
      <GlassStatCard label="Tarif yig'imi (oy)" value={s.tariffRevenue} isMoney icon={Wallet} accent="yellow" />
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard
        title="To'plangan chiqindi hajmi — 12 oy"
        insight={`Yozda biroz yuqori. Joriy oy: ${AXLAT_VOLUME_TREND.at(-1).value.toLocaleString("uz-UZ")} m³`}
      >
        <TrendChart data={AXLAT_VOLUME_TREND} color="#0d9488" unit="m³" />
      </ChartCard>

      <ChartCard
        title="Operator reytingi (VM 648-son)"
        insight={`${s.done} yashil · ${s.late} sariq · ${s.missed} qizil marshrut`}
      >
        <DonutChart data={AXLAT_OPERATOR_RATING} labelMap={RATING_LABELS} colors={RATING_COLORS} />
      </ChartCard>
    </div>

    <ChartCard title="Mahalla bo'yicha reyslar (oylik)" insight="Eng ko'p xizmat ko'rsatilgan mahallalar">
      <BreakdownBar data={[...AXLAT_BY_MAHALLA].sort((a, b) => b.value - a.value)} color="#0d9488" />
    </ChartCard>

    <ChartCard
      title="Marshrutlar reyestri"
      insight={`Jami ${s.routes} · ${formatMoney(s.tariffRevenue)} oylik tarif · kelmay qolganlar yuqorida`}
    >
      <DataTable columns={columns} rows={rows} getKey={(r) => r.id} />
    </ChartCard>
  </div>
);

export default AxlatPage;
