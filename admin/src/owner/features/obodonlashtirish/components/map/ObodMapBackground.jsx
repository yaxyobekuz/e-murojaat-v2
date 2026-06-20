// Xaritani to'liq fon sifatida ko'rsatadi (lazy). Controlled props ObodMap3D ga uzatiladi.
import { lazy, Suspense } from "react";

const ObodMap3D = lazy(() => import("./ObodMap3D"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center bg-card text-foreground/40">
    <p className="text-xs">Xarita tayyorlanmoqda…</p>
  </div>
);

const ObodMapBackground = (props) => (
  <Suspense fallback={<Fallback />}>
    <ObodMap3D {...props} />
  </Suspense>
);

export default ObodMapBackground;
