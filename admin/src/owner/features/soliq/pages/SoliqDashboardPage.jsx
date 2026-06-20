import SoliqKpiStrip from "../components/SoliqKpiStrip";
import SoliqMapSection from "../components/map/SoliqMapSection";

const SoliqDashboardPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Soliq analitikasi</h1>
      <p className="mt-0.5 text-sm text-foreground/50">
        Hududlar bo'yicha soliq to'lash holati — yashil to'lagan, sariq yarim, qizil qarzdor
      </p>
    </div>

    <SoliqKpiStrip />
    <SoliqMapSection />
  </div>
);

export default SoliqDashboardPage;
