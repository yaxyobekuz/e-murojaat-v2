// Asosiy modul — Andijon shahri to'liq ekranli 3D interaktiv xaritasi.
// Xarita = orqa fon (full-screen, Mapbox GL). Ustidan: 16 modul kartasi,
// o'ng panel (overview/element), pastki jonli panel — barchasi shisha (glass) overlay sifatida.
import useObjectState from "@/shared/hooks/useObjectState";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import MahallaMap from "../components/MahallaMap";
import OverviewPanel from "../components/OverviewPanel";
import DetailPanel from "../components/DetailPanel";

const AsosiyDashboardPage = () => {
  const { selectedEl, hoveredId, setField, setFields } = useObjectState({
    selectedEl: null,
    hoveredId: null,
  });

  const selectedId = selectedEl?.id ?? null;
  const select = (el) => setFields({ selectedEl: el || null });

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05070b] text-foreground">
      {/* ===== ORQA FON: interaktiv xarita (full-screen) ===== */}
      <div className="absolute inset-0">
        <MahallaMap
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={select}
          onHover={(id) => setField("hoveredId", id)}
        />
      </div>

      {/* ===== USTKI QATLAM: floating chrome (xaritaga xalaqit bermaydi) ===== */}
      {/* 16 modul kartasi — to'liq kenglik (chapdan o'ngga) */}
      <div className="absolute left-3 right-3 top-3 z-30">
        <TopBar />
      </div>

      {/* o'ng panel — overview yoki tanlangan element. Top va bottom bar orasidagi balandlikni egallaydi */}
      <div className="absolute right-3 top-[148px] bottom-[76px] z-20 w-[420px] max-w-[calc(100%-1.5rem)] xl:w-[480px]">
        <div className="surface-overlay flex h-full flex-col overflow-hidden rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl">
          {selectedEl ? (
            <DetailPanel element={selectedEl} onClose={() => select(null)} />
          ) : (
            <OverviewPanel />
          )}
        </div>
      </div>

      {/* pastki jonli panel — to'liq kenglik (chapdan o'ngga) */}
      <div className="absolute left-3 right-3 bottom-3 z-30">
        <BottomBar />
      </div>
    </div>
  );
};

export default AsosiyDashboardPage;
