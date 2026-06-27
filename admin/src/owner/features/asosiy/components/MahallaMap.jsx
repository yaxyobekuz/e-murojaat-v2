// Sarnovul interaktiv xaritasi — xarita.svg elementlarini React SVG sifatida chizadi,
// har biri bosiladi/hover bo'ladi. Erkin pan + zoom. Tanlangan element yonib turadi (glow + pulse).
import { useEffect, useMemo, useRef } from "react";
import { Plus, Minus, Maximize, Crosshair } from "lucide-react";

import { cn } from "@/shared/utils/cn";
import { usePanZoom } from "../hooks/usePanZoom";
import { MAP_ELEMENTS, MAP_CENTER, VIEWBOX, ELEMENT_TYPES } from "../data/mapElements";

// turlar bo'yicha tartiblash — yo'llar pastda, uy/zavod tepada (bosish qulay)
const Z = { yol: 0, dala: 1, uy: 2, zavod: 3 };
const ORDERED = [...MAP_ELEMENTS].sort((a, b) => (Z[a.type] ?? 1) - (Z[b.type] ?? 1));

// bitta element (1 yoki bir nechta rect/path shakldan iborat — masalan <g> ichidagi dala)
function Shape({ el, state, onSelect, onHover }) {
  const meta = ELEMENT_TYPES[el.type];
  const isRoad = el.type === "yol";
  const selected = state === "selected";
  const hovered = state === "hover";
  const dim = state === "dim";

  const stroke = isRoad ? meta.color : selected ? "#fff" : hovered ? "#fff" : "rgba(255,255,255,.5)";
  const fill = isRoad ? "none" : meta.color;
  const opacity = dim ? 0.16 : 1;
  const fillOpacity = isRoad ? 0 : selected ? 1 : hovered ? 0.95 : 0.78;
  const baseW = isRoad ? Number(el.attrs.strokeWidth) || 23 : selected ? 16 : 6;
  const strokeWidth = isRoad ? (selected ? baseW * 1.9 : hovered ? baseW * 1.4 : baseW) : baseW;

  const common = {
    style: {
      cursor: "pointer",
      transition: "fill-opacity .2s, opacity .2s, filter .2s, stroke-width .2s",
      filter: selected ? `drop-shadow(0 0 30px ${meta.color})` : hovered ? `drop-shadow(0 0 12px ${meta.color})` : undefined,
    },
    fill,
    fillOpacity,
    stroke,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    opacity,
    onClick: (e) => {
      e.stopPropagation();
      onSelect(el);
    },
    onPointerEnter: () => onHover(el.id),
    onPointerLeave: () => onHover(null),
  };

  return (
    <g>
      {el.shapes.map((s, i) =>
        s.tag === "rect" ? (
          <rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} rx="6" transform={s.transform || undefined} {...common} />
        ) : (
          <path key={i} d={s.d} transform={s.transform || undefined} {...common} />
        ),
      )}
    </g>
  );
}

const MahallaMap = ({ selectedId, hoveredId, onSelect, onHover }) => {
  const containerRef = useRef(null);
  const { t, animating, onPointerDown, onPointerMove, endDrag, zoomBy, focusOn, fitTo, setT } = usePanZoom(containerRef, {
    initial: { x: 0, y: 0, k: 0.12 },
  });
  const didInit = useRef(false);

  // boshlang'ich: butun xaritaga sig'dirish
  useEffect(() => {
    if (didInit.current) return;
    const id = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      fitTo(MAP_CENTER, 900);
      didInit.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [fitTo]);

  // tanlanganda elementга uchib borish
  const selectedEl = useMemo(() => MAP_ELEMENTS.find((e) => e.id === selectedId) || null, [selectedId]);
  useEffect(() => {
    if (!selectedEl || !containerRef.current) return;
    const target = selectedEl.type === "yol" ? 0.4 : 0.9;
    focusOn(selectedEl.cx, selectedEl.cy, target, 700);
  }, [selectedEl, focusOn]);

  const stateOf = (id) => {
    if (selectedId) return id === selectedId ? "selected" : "dim";
    if (hoveredId === id) return "hover";
    return "normal";
  };

  const handlePointerUp = (e) => {
    const moved = endDrag(e);
    // sudramasdan bo'sh joyga bosilsa — tanlovni bekor qil
    if (!moved && e.target === e.currentTarget) onSelect(null);
  };

  const resetView = () => {
    onSelect(null);
    fitTo(MAP_CENTER, 700);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(130% 130% at 50% 0%, rgba(34,211,238,.08), transparent 55%), radial-gradient(100% 100% at 80% 90%, rgba(168,85,247,.06), transparent 60%), #06080d",
        touchAction: "none",
        cursor: animating ? "default" : "grab",
      }}
    >
      {/* nozik grid fon */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,150,180,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,180,.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={endDrag}
      >
        <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>
          {/* xarita ramkasi */}
          <rect x="0" y="0" width={VIEWBOX.w} height={VIEWBOX.h} fill="rgba(255,255,255,.012)" stroke="rgba(255,255,255,.05)" strokeWidth={6} />
          {ORDERED.map((el) => (
            <Shape key={el.id} el={el} state={stateOf(el.id)} onSelect={onSelect} onHover={onHover} />
          ))}

          {/* tanlangan element ustida pulslanuvchi marker */}
          {selectedEl && (
            <g transform={`translate(${selectedEl.cx} ${selectedEl.cy})`} className="pointer-events-none">
              <circle r={90 / t.k} fill="none" stroke={ELEMENT_TYPES[selectedEl.type].color} strokeWidth={4 / t.k}>
                <animate attributeName="r" values={`${40 / t.k};${150 / t.k}`} dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle r={16 / t.k} fill="#fff" />
              <circle r={9 / t.k} fill={ELEMENT_TYPES[selectedEl.type].color} />
            </g>
          )}

        </g>
      </svg>

      {/* chap panel — zoom boshqaruvi (vertikal markazda) */}
      <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
        <MapBtn onClick={() => zoomBy(1.4)} title="Kattalashtirish"><Plus className="size-4" /></MapBtn>
        <MapBtn onClick={() => zoomBy(1 / 1.4)} title="Kichraytirish"><Minus className="size-4" /></MapBtn>
        <MapBtn onClick={() => fitTo(MAP_CENTER, 600)} title="Hammasini ko'rsatish"><Maximize className="size-4" /></MapBtn>
        {selectedId && (
          <MapBtn onClick={resetView} title="Tanlovni tozalash" accent><Crosshair className="size-4" /></MapBtn>
        )}
      </div>
    </div>
  );
};

function MapBtn({ onClick, title, accent, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "grid size-9 place-items-center rounded-xl border backdrop-blur-md transition-colors",
        accent
          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300 hover:bg-cyan-400/25"
          : "border-[rgb(var(--card-border))] bg-card/60 text-foreground/70 hover:bg-card/90 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export default MahallaMap;
