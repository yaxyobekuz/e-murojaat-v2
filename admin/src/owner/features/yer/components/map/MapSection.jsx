// Full-width glass section hosting the Photorealistic 3D map (lazy-loaded).
import { lazy, Suspense } from "react";
import { Globe2 } from "lucide-react";

import GlassCard from "@/shared/components/ui/glass/GlassCard";

const MapboxMap = lazy(() => import("./MapboxMap"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center rounded-xl bg-card text-foreground/40">
    <p className="text-xs">3D xarita tayyorlanmoqda…</p>
  </div>
);

const MapSection = () => (
  <GlassCard glow className="flex flex-col">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-purple/15 text-brand-purple">
          <Globe2 className="size-[18px]" strokeWidth={2} />
        </span>
        <div>
          <h3 className="text-sm font-semibold">Interaktiv 3D kadastr xaritasi</h3>
          <p className="mt-0.5 text-xs text-foreground/45">
            Sarnovul MFY, Baliqchi tumani, Andijon — uchastka yoki binoni bosib ma'lumotini ko'ring
          </p>
        </div>
      </div>
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
        Mapbox GL · Jonli
      </span>
    </div>

    <div className="mt-3 h-[560px] w-full">
      <Suspense fallback={<Fallback />}>
        <MapboxMap />
      </Suspense>
    </div>
  </GlassCard>
);

export default MapSection;
