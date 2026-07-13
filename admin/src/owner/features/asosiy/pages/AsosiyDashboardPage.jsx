// Asosiy modul — Sarnovul mahallasi to'liq ekranli 3D interaktiv xaritasi.
// Xarita = orqa fon (full-screen, MapLibre GL). Ustidan: 16 modul kartasi,
// o'ng panel (overview/element), pastki filtr + jonli panel — barchasi shisha (glass) overlay.
import useObjectState from "@/shared/hooks/useObjectState";
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import FilterBar from "../components/FilterBar";
import LeftBar from "../components/LeftBar";
import MahallaMap from "../components/MahallaMap";
import OverviewPanel from "../components/OverviewPanel";
import DetailPanel from "../components/DetailPanel";
import { MAP_FILTERS, elementInfo } from "../data/elementData";
import { useMahallaStats } from "../hooks/useMahallaStats";

const AsosiyDashboardPage = () => {
  const stats = useMahallaStats();
  const { selectedEl, hoveredId, activeFilter, setField, setFields } = useObjectState({
    selectedEl: null,
    hoveredId: null,
    activeFilter: null,
  });

  const selectedId = selectedEl?.id ?? null;
  const select = (el) => setFields({ selectedEl: el || null });

  // tanlangan xonadonning faol filter bo'yicha status tone'i (yon panel rangi mos bo'lishi uchun)
  const filterDef = MAP_FILTERS.find((f) => f.key === activeFilter);
  const statusTone =
    filterDef && selectedEl ? filterDef.statusOf(elementInfo(selectedEl)) : null;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05070b] text-foreground">
      {/* ===== ORQA FON: interaktiv xarita (full-screen) ===== */}
      <div className="absolute inset-0">
        <MahallaMap
          selectedId={selectedId}
          hoveredId={hoveredId}
          activeFilter={activeFilter}
          onSelect={select}
          onHover={(id) => setField("hoveredId", id)}
        />
      </div>

      {/* ===== USTKI QATLAM: floating chrome (xaritaga xalaqit bermaydi) ===== */}
      {/* 16 modul kartasi — chap kartadan o'ngga, o'ng chetgacha */}
      <div className="absolute left-3 right-3 top-3 z-30 md:left-[320px]">
        <TopBar cards={stats.topCards} />
      </div>

      {/* chap panel — tepadan boshlanadi (top bar chap chetdan boshlanmaydi), pastki blokni kesmaydi */}
      <div className="absolute left-3 top-3 bottom-[160px] z-20 hidden w-[300px] max-w-[calc(100%-1.5rem)] md:block">
        <LeftBar feeds={stats.leftFeeds} />
      </div>

      {/* o'ng panel — overview yoki tanlangan element. Pastki blok endi o'ng tomonni bo'sh qoldiradi */}
      <div className="absolute right-3 top-[134px] bottom-3 z-20 w-[420px] max-w-[calc(100%-1.5rem)] xl:w-[480px] [perspective:1400px]">
        <div className="surface-overlay flex h-full flex-col overflow-hidden rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl">
          {/* key har almashganda animatsiyani qaytadan ishga tushiradi */}
          <div key={selectedId ?? "overview"} className="asosiy-panel-swap flex h-full flex-col overflow-hidden">
            {selectedEl ? (
              <DetailPanel element={selectedEl} statusTone={statusTone} onClose={() => select(null)} />
            ) : (
              <OverviewPanel overview={stats.overview} />
            )}
          </div>
        </div>
      </div>

      {/* pastki blok — filtr paneli + jonli panel. Chap chetdan boshlanadi (chap karta ostida), o'ng kartadan oldin tugaydi */}
      <div className="absolute left-3 right-3 bottom-3 z-30 flex flex-col gap-2 md:right-[444px] xl:right-[504px]">
        <FilterBar active={activeFilter} onChange={(k) => setField("activeFilter", k)} />
        <BottomBar stats={stats.bottomStats} />
      </div>
    </div>
  );
};

export default AsosiyDashboardPage;
