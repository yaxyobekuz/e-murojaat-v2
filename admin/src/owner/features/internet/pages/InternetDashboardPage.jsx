import useObjectState from "@/shared/hooks/useObjectState";
import GlassChartCard from "@/shared/components/ui/glass/GlassChartCard";
import TrendChart from "@/shared/components/ui/chart/TrendChart";
import DonutChart from "@/shared/components/ui/chart/DonutChart";
import BreakdownBar from "@/shared/components/ui/chart/BreakdownBar";
import { useInternetAnalytics } from "../hooks/useInternetAnalytics";
import InternetFilters from "../components/InternetFilters";
import KpiStrip from "../components/KpiStrip";
import StreetTable from "../components/StreetTable";
import InternetCoverageMap from "../components/InternetCoverageMap";

const labelOf = (data) => (key) => data.find((d) => d.key === key)?.label || key;

const InternetDashboardPage = () => {
  const { state, setField } = useObjectState({ streetId: "" });
  const { data: summary } = useInternetAnalytics("summary", { streetId: state.streetId });
  const { data: speed } = useInternetAnalytics("speedTrend", { streetId: state.streetId });
  const { data: providers } = useInternetAnalytics("providers");
  const { data: coverage } = useInternetAnalytics("coverageByStreet");
  const { data: tech } = useInternetAnalytics("techMix", { streetId: state.streetId });
  const { data: streetRows } = useInternetAnalytics("streetRows");

  const critical = summary?.critical ?? 0;
  const fiberPct = summary?.fiberPct ?? 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Internet ta'minoti analitikasi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Ko'cha darajasida internet qamrovi, tezlik, optik tolali ulanish va shikoyatlar
          </p>
        </div>
        <InternetFilters value={state} onChange={setField} />
      </div>

      <KpiStrip summary={summary} />

      <InternetCoverageMap />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassChartCard
          title="O'rtacha tezlik dinamikasi (Mbit/s)"
          insight="So'nggi 12 oyda o'rtacha ulanish tezligi barqaror o'smoqda"
        >
          <TrendChart data={speed || []} color="#06b6d4" unit="Mbit/s" />
        </GlassChartCard>

        <GlassChartCard
          title="Provayderlar ulushi (qamrov bo'yicha)"
          insight="Bozorda yetakchi provayder qamrovning eng katta ulushini egallaydi"
        >
          <DonutChart data={providers || []} labelOf={labelOf(providers || [])} />
        </GlassChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassChartCard
          title="Ko'cha kesimida qamrov (%)"
          insight={
            critical
              ? `${critical} ta ko'chada qamrov past — optik tarmoqni kengaytirish kerak`
              : "Barcha ko'chalarda qamrov me'yorda"
          }
        >
          <BreakdownBar data={coverage || []} color="#06b6d4" />
        </GlassChartCard>

        <GlassChartCard
          title="Ulanish texnologiyasi tarkibi"
          insight={`Optik tolali (FTTH) ulushi — ${fiberPct}%`}
        >
          <DonutChart data={tech || []} labelOf={labelOf(tech || [])} />
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

export default InternetDashboardPage;
