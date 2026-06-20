// Xaritani to'liq fon sifatida ko'rsatadi (kartochka chrome'isiz). Controlled:
// statusFilter / activeId / onSelect props SoliqMap3D ga uzatiladi.
import { lazy, Suspense } from "react";

const SoliqMap3D = lazy(() => import("./SoliqMap3D"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center bg-card text-foreground/40">
    <p className="text-xs">Xarita tayyorlanmoqda…</p>
  </div>
);

const SoliqMapBackground = (props) => (
  <Suspense fallback={<Fallback />}>
    <SoliqMap3D {...props} />
  </Suspense>
);

export default SoliqMapBackground;
