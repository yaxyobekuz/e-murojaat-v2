import { Users, Wallet, AlertTriangle, Percent, TrendingUp } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import Card from "@/shared/components/ui/card/Card";
import StatCard from "@/shared/components/ui/card/StatCard";
import ChartCard from "@/shared/components/ui/chart/ChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import { formatMoney } from "@/shared/utils/formatMoney";
import { regionLabel } from "@/shared/data/regions";

import LocationFilter from "../components/LocationFilter";
import MahallaOverview from "../components/MahallaOverview";
import {
  useSummaryQuery,
  useTimeseriesQuery,
  useBreakdownQuery,
} from "../hooks/useSoliqQueries";
import { taxTypeLabel, taxpayerTypeLabel } from "../utils/soliq.constants";

const KPI_ICONS = {
  taxpayers: Users,
  collected: Wallet,
  debt: AlertTriangle,
  collectionRate: Percent,
  penya: TrendingUp,
};
const KPI_TONE = {
  taxpayers: "info",
  collected: "positive",
  debt: "negative",
  collectionRate: "default",
  penya: "warn",
};

// Bo'sh maydonlarni tashlab, faqat tanlangan hudud filtrini qaytaradi.
const cleanLoc = ({ region, district, settlement, mahalla }) => {
  const p = {};
  if (region) p.region = region;
  if (district) p.district = district;
  if (settlement) p.settlement = settlement;
  if (mahalla) p.mahalla = mahalla;
  return p;
};

const SoliqDashboardPage = () => {
  const { region, district, settlement, mahalla, setFields, state } = useObjectState({
    region: "",
    district: "",
    settlement: "",
    mahalla: "",
  });
  const params = cleanLoc(state);

  const { data: kpis = [] } = useSummaryQuery(params);
  const { data: trend = [] } = useTimeseriesQuery({ ...params, months: 12 });
  const { data: byTaxType = [] } = useBreakdownQuery({ ...params, by: "taxType" });
  const { data: byRegion = [] } = useBreakdownQuery({ by: "region" });
  const { data: byType = [] } = useBreakdownQuery({ ...params, by: "type" });

  const topRegion = byRegion[0];
  const topTax = byTaxType[0];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Soliq — analitika</h1>
        <p className="text-sm text-muted-foreground">
          Hududni tanlab (viloyat → tuman → mahalla) soliq holatini ko'ring
        </p>
      </div>

      <Card>
        <LocationFilter value={state} onChange={(next) => setFields(next)} />
      </Card>

      {/* Mahalla tanlangan bo'lsa — mahalla "kartochkasi" (KPI + holat + yo'nalish + qarzdorlar) */}
      {mahalla ? (
        <MahallaOverview mahalla={mahalla} />
      ) : (
        <>
          {/* Umumiy KPI qatori */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {kpis.map((k) => (
              <StatCard
                key={k.key}
                label={k.label}
                value={k.value}
                suffix={k.suffix || ""}
                isMoney={!!k.isMoney}
                icon={KPI_ICONS[k.key]}
                tone={KPI_TONE[k.key] || "default"}
              />
            ))}
          </div>

          {/* Grafiklar gridi */}
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard
              title="Oylik soliq dinamikasi (12 oy)"
              insight={trend.length ? `So'nggi oy: ${formatMoney(trend[trend.length - 1].value)}` : ""}
            >
              <TrendChart data={trend} color="#1E4FD8" isMoney />
            </ChartCard>

            <ChartCard
              title="Soliq turlari bo'yicha"
              insight={topTax ? `Eng ko'p: ${taxTypeLabel(topTax.key)}` : ""}
            >
              <DonutChart data={byTaxType} labelOf={taxTypeLabel} isMoney />
            </ChartCard>

            <ChartCard
              title="Viloyatlar kesimida yig'ilgan soliq"
              insight={topRegion ? `Yetakchi: ${regionLabel(topRegion.key)} — ${formatMoney(topRegion.value)}` : ""}
            >
              <BreakdownBar data={byRegion.slice(0, 8)} labelOf={regionLabel} color="#1E4FD8" isMoney />
            </ChartCard>

            <ChartCard title="Soliq to'lovchi turlari" insight="Jismoniy / YaTT / yuridik ulushi">
              <DonutChart
                data={byType}
                labelOf={taxpayerTypeLabel}
                colors={["#1E4FD8", "#0EA5E9", "#8B5CF6"]}
              />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default SoliqDashboardPage;
