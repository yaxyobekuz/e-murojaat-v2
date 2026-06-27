import { LayoutDashboard } from "lucide-react";

const AsosiyDashboardPage = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Asosiy</h1>
      <p className="mt-0.5 text-sm text-foreground/50">Sarnovul MFY — umumiy ko'rinish</p>
    </div>

    <div className="surface flex min-h-[360px] flex-col items-center justify-center gap-3 p-10 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-purple/15 text-brand-purple">
        <LayoutDashboard className="size-7" />
      </span>
      <p className="text-sm font-medium">Bu modul hozircha bo'sh</p>
      <p className="max-w-sm text-xs text-foreground/45">Tez orada to'ldiriladi</p>
    </div>
  </div>
);

export default AsosiyDashboardPage;
