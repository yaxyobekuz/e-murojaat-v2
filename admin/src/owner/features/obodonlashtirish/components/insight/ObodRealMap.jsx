// Real Google 3D xarita (photorealistik Andijon, Baliqchi) — voronoi sxema o'rniga.
// ObodMapBackground (Google Maps 3D) ni panel ichida ko'rsatadi, accent overlay bilan.
import { useState } from "react";

import { hexA } from "@/shared/components/ui/command/primitives";
import ObodMapBackground from "../map/ObodMapBackground";

// showGreen=true → yashil zonalar + daraxtlar (Yashil makon bo'limi uchun)
// plantings → real ekish nuqtalari (har biri 🌳 marker)
export const ObodRealMap = ({ accent = "#22c55e", height = 340, showGreen = false, plantings = null, markers = null, zones = null, bare = false, range, label, legend }) => {
  const [activeId, setActiveId] = useState(null);
  return (
    <div className="relative w-full overflow-hidden rounded-xl border" style={{ height, borderColor: hexA(accent, 0.2) }}>
      <ObodMapBackground showGreen={showGreen} activeId={activeId} onSelect={setActiveId} plantings={plantings} markers={markers} zones={zones} bare={bare} range={range} />

      {/* accent ramka glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl" style={{ boxShadow: `inset 0 0 32px ${hexA(accent, 0.18)}` }} />

      {label && (
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border bg-popover/90 px-2.5 py-1 backdrop-blur-md"
          style={{ borderColor: hexA(accent, 0.35) }}>
          <span className="size-1.5 animate-pulse rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/80">{label}</span>
        </div>
      )}

      {legend && (
        <div className="pointer-events-none absolute bottom-2 left-3 flex flex-wrap gap-2.5 rounded-lg bg-popover/90 px-2 py-1 text-[9px] text-foreground/70 backdrop-blur-sm">
          {legend.map((l, i) => (
            <span key={i} className="flex items-center gap-1"><span className="size-2 rounded-sm" style={{ background: l.color }} /> {l.label}</span>
          ))}
        </div>
      )}
    </div>
  );
};
