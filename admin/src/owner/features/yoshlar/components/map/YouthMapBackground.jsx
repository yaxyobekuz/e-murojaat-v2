// Yoshlar xaritasini lazy yuklaydi (3D chunk alohida bundle bo'ladi).
import { lazy, Suspense } from "react";

const YouthMap3D = lazy(() => import("./YouthMap3D"));

const Fallback = () => (
  <div className="grid h-full w-full place-items-center text-white/40">
    <p className="text-xs">Xarita tayyorlanmoqda…</p>
  </div>
);

const YouthMapBackground = (props) => (
  <Suspense fallback={<Fallback />}>
    <YouthMap3D {...props} />
  </Suspense>
);

export default YouthMapBackground;
