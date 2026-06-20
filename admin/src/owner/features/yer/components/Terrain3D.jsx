// Glass card hosting the lazy-loaded 3D cadaster terrain.
import { lazy, Suspense } from "react";
import { useTheme } from "next-themes";
import { Box } from "lucide-react";

import GlassCard from "@/shared/components/ui/glass/GlassCard";

const TerrainCanvas = lazy(() => import("./TerrainCanvas"));

const TerrainSkeleton = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-foreground/40">
      <div className="grid size-12 animate-pulse place-items-center rounded-2xl bg-brand-purple/15 text-brand-purple">
        <Box className="size-6" strokeWidth={1.5} />
      </div>
      <p className="text-xs">3D xarita yuklanmoqda…</p>
    </div>
  </div>
);

const Terrain3D = () => {
  const { theme } = useTheme();
  const isDark = theme !== "light";

  return (
    <GlassCard glow className="flex flex-col overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">3D Kadastr xaritasi</h3>
          <p className="mt-0.5 text-xs text-foreground/45">Interaktiv relyef modeli</p>
        </div>
        <span className="rounded-full bg-brand-purple/15 px-2 py-0.5 text-[11px] font-medium text-brand-purple">
          Jonli
        </span>
      </div>

      <div className="mt-3 h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-brand-purple/5 to-transparent">
        <Suspense fallback={<TerrainSkeleton />}>
          <TerrainCanvas isDark={isDark} />
        </Suspense>
      </div>
    </GlassCard>
  );
};

export default Terrain3D;
