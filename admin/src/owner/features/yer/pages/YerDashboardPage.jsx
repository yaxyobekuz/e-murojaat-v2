import useObjectState from "@/shared/hooks/useObjectState";
import { useYerAnalytics } from "../hooks/useYerAnalytics";
import YerFilters from "../components/YerFilters";
import KpiStrip from "../components/KpiStrip";
import MapSection from "../components/map/MapSection";
import DashboardRowA from "../components/DashboardRowA";
import DashboardRowB from "../components/DashboardRowB";

const YerDashboardPage = () => {
  const { state, setField } = useObjectState({ region: "", type: "" });
  const { data: summary } = useYerAnalytics("summary");

  return (
    <div className="flex flex-col gap-5">
      {/* Header + filters */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Yer / Mol-mulk analitikasi</h1>
          <p className="mt-0.5 text-sm text-foreground/50">
            Davlat yer kadastri va mulk solig'i bo'yicha umumiy ko'rsatkichlar
          </p>
        </div>
        <YerFilters value={state} onChange={setField} />
      </div>

      <KpiStrip summary={summary} />
      <DashboardRowA />
      <MapSection />
      <DashboardRowB />
    </div>
  );
};

export default YerDashboardPage;
