// Bizneslar xaritasini to'liq fon sifatida lazy yuklaydi.
import { lazy, Suspense } from "react";

const BusinessMap3D = lazy(() => import("./BusinessMap3D"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center bg-card text-foreground/40">
    <p className="text-xs">Xarita tayyorlanmoqda…</p>
  </div>
);

const BusinessMapBackground = (props) => (
  <Suspense fallback={<Fallback />}>
    <BusinessMap3D {...props} />
  </Suspense>
);

export default BusinessMapBackground;
