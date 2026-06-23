// Yoshlar moduli — hozircha bo'sh sahifa (keyin to'ldiriladi).
import { Users } from "lucide-react";

const YoshlarDashboardPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Yoshlar</h1>
      <p className="mt-0.5 text-sm text-foreground/50">Yoshlar bilan ishlash moduli</p>
    </div>

    <div className="surface flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-orange-500/15 text-orange-400">
        <Users className="size-7" strokeWidth={2} />
      </span>
      <h2 className="text-base font-semibold">Bo'lim tayyorlanmoqda</h2>
      <p className="max-w-sm text-sm text-foreground/50">
        Yoshlar moduli hozircha bo'sh. Tez orada bu yerda ma'lumotlar va analitika paydo bo'ladi.
      </p>
    </div>
  </div>
);

export default YoshlarDashboardPage;
