import useObjectState from "@/shared/hooks/useObjectState";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import { useSuyuqGazAnalytics } from "../hooks/useSuyuqGazAnalytics";
import SuyuqGazFilters from "../components/SuyuqGazFilters";
import KpiStrip from "../components/KpiStrip";
import StreetTable from "../components/StreetTable";
import SuyuqGazFleetMap from "../components/SuyuqGazFleetMap";
import DeliveryLogPanel from "../components/DeliveryLogPanel";

const labelOf = (data) => (key) => data.find((d) => d.key === key)?.label || key;

const SuyuqGazDashboardPage = () => {
  const { state, setField } = useObjectState({ streetId: "", truckId: "" });
  const { data: summary } = useSuyuqGazAnalytics("summary", { streetId: state.streetId });
  const { data: delivery } = useSuyuqGazAnalytics("deliveryTrend", { streetId: state.streetId });
  const { data: sources } = useSuyuqGazAnalytics("sources");
  const { data: fulfillment } = useSuyuqGazAnalytics("fulfillmentByStreet");
  const { data: debt } = useSuyuqGazAnalytics("debtByStreet");
  const { data: streetRows } = useSuyuqGazAnalytics("streetRows");

  const critical = summary?.critical ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Suyultirilgan gaz ta'minoti analitikasi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Quvur gazi yo'q ko'chalarda ballonli gaz ta'minoti, talab qondirish va qarzdorlik
          </p>
        </div>
        <SuyuqGazFilters value={state} onChange={setField} />
      </div>

      <KpiStrip summary={summary} />

      <GlassChartCard
        title="Ballon yetkazib beruvchi mashinalar — jonli kuzatuv"
        insight="Mashina marshrut bo'ylab harakatlanadi; to'xtash nuqtasi yashil bo'lsa — ballon almashtirilgan (kelgan/ketgan vaqt o'ngdagi panelda)"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <SuyuqGazFleetMap selectedTruckId={state.truckId} onSelectTruck={(id) => setField("truckId", id)} />
          <div className="lg:max-h-[460px] lg:overflow-y-auto lg:pr-1">
            <DeliveryLogPanel selectedTruckId={state.truckId} onSelectTruck={(id) => setField("truckId", id)} />
          </div>
        </div>
      </GlassChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassChartCard
          title="Yetkazib berilgan ballon dinamikasi (dona)"
          insight="Talab qishda cho'qqiga chiqadi — isitish mavsumida ta'minotni kuchaytirish kerak"
        >
          <TrendChart data={delivery || []} color="#06b6d4" unit="dona" />
        </GlassChartCard>

        <GlassChartCard
          title="Ta'minot manbasi taqsimoti"
          insight="Ballon asosan gaz to'ldirish shoxobchalari orqali yetkaziladi"
        >
          <DonutChart data={sources || []} labelOf={labelOf(sources || [])} />
        </GlassChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassChartCard
          title="Ko'cha kesimida talab qondirish (%)"
          insight={
            critical
              ? `${critical} ta ko'chada ta'minot yetishmaydi — birinchi navbatda zaxira yo'naltirish kerak`
              : "Barcha ko'chalarda talab qondirilgan"
          }
        >
          <BreakdownBar data={fulfillment || []} color="#06b6d4" />
        </GlassChartCard>

        <GlassChartCard
          title="Ko'cha kesimida qarzdorlik (so'm)"
          insight="Eng katta qarzdorlik past ta'minotli ko'chalarda to'plangan"
        >
          <BreakdownBar data={debt || []} color="#f59e0b" isMoney />
        </GlassChartCard>
      </div>

      <GlassChartCard
        title="Ko'cha kesimida to'liq ko'rsatkichlar"
        insight="Qatorni bosib ko'chani tanlang — yuqoridagi tahlillar shu ko'cha bo'yicha filtrlanadi"
      >
        <StreetTable
          rows={streetRows || []}
          selectedId={state.streetId}
          onSelect={(id) => setField("streetId", id)}
        />
      </GlassChartCard>
    </div>
  );
};

export default SuyuqGazDashboardPage;
