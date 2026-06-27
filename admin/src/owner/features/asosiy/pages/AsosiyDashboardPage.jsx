// Asosiy modul — Sarnovul mahallasi to'liq ekranli interaktiv xaritasi.
// Xarita = orqa fon (full-screen, background image kabi). Ustidan: 16 modul kartasi,
// o'ng panel (overview/element), pastki jonli panel — barchasi shisha (glass) overlay sifatida.
import { useMemo } from "react";

import useObjectState from "@/shared/hooks/useObjectState";
import { MAP_ELEMENTS } from "../data/mapElements";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import MahallaMap from "../components/MahallaMap";
import OverviewPanel from "../components/OverviewPanel";
import DetailPanel from "../components/DetailPanel";

const AsosiyDashboardPage = () => {
  const { selectedId, hoveredId, setField, setFields } = useObjectState({
    selectedId: null,
    hoveredId: null,
  });

  const selectedEl = useMemo(
    () => MAP_ELEMENTS.find((e) => e.id === selectedId) || null,
    [selectedId],
  );

  const select = (el) => setFields({ selectedId: el ? el.id : null });

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
      {/* 16 modul kartasi — yuqori chap (o'ng panel ustiga chiqmaydi) */}
      <div className="absolute left-3 top-3 z-10 right-[440px] xl:right-[500px]">
        <TopBar />
      </div>

      {/* o'ng panel — overview yoki tanlangan element */}
      <div className="absolute bottom-16 right-3 top-3 z-20 w-[420px] max-w-[calc(100%-1.5rem)] xl:w-[480px]">
        <div className="surface-overlay flex h-full flex-col overflow-hidden rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl">
          {selectedEl ? (
            <DetailPanel element={selectedEl} onClose={() => select(null)} />
          ) : (
            <OverviewPanel />
          )}
        </div>
      </div>

      {/* pastki jonli panel */}
      <div className="absolute bottom-3 left-3 z-20 right-[440px] xl:right-[500px]">
        <BottomBar />
      </div>
    </div>
  );
};

export default AsosiyDashboardPage;
