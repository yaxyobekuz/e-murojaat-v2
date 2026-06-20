// Full-width glass section hosting the soliq choropleth map + rang izohi (legend).
import { lazy, Suspense } from "react";
import { Map as MapIcon } from "lucide-react";

import GlassCard from "@/shared/components/ui/glass/GlassCard";
import { MAP_PLACE_LABEL, TAX_STATUS } from "../../mock/soliq.mapAreas";

const SoliqMap = lazy(() => import("./SoliqMap3D"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center rounded-xl bg-card text-foreground/40">
    <p className="text-xs">Xarita tayyorlanmoqda…</p>
  </div>
);

const LegendItem = ({ color, label }) => (
  <span className="flex items-center gap-1.5 text-[11px] text-foreground/55">
    <span className="size-2.5 rounded-sm" style={{ backgroundColor: color }} />
    {label}
  </span>
);

const SoliqMapSection = () => (
  <GlassCard glow className="flex flex-col">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-500">
          <MapIcon className="size-[18px]" strokeWidth={2} />
        </span>
        <div>
          <h3 className="text-sm font-semibold">Photorealistic 3D soliq xaritasi</h3>
          <p className="mt-0.5 text-xs text-foreground/45">
            {MAP_PLACE_LABEL} — hududni bosib batafsil ma'lumotni ko'ring
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <LegendItem color={TAX_STATUS.paid.color} label={TAX_STATUS.paid.label} />
        <LegendItem color={TAX_STATUS.partial.color} label={TAX_STATUS.partial.label} />
        <LegendItem color={TAX_STATUS.unpaid.color} label={TAX_STATUS.unpaid.label} />
      </div>
    </div>

    <div className="mt-3 h-[460px] w-full">
      <Suspense fallback={<Fallback />}>
        <SoliqMap />
      </Suspense>
    </div>
  </GlassCard>
);

export default SoliqMapSection;
