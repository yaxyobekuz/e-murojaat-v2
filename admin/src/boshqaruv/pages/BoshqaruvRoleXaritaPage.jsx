// Mansabdor uchun xarita — bino tanlab, o'z sohasi maydonlarini kiritadi.
import { useState } from "react";

import { MahallaMap, useHousesQuery } from "@/owner/features/asosiy";
import { useBoshqaruvMe } from "../hooks/useBoshqaruvMe";
import RoleHouseEditorPanel from "../components/RoleHouseEditorPanel";

const BoshqaruvRoleXaritaPage = () => {
  const [selected, setSelected] = useState(null);
  const { data: me } = useBoshqaruvMe();
  const { data: houses } = useHousesQuery();

  return (
    <div className="flex h-[calc(100vh-56px)]">
      <div className="relative min-w-0 flex-1">
        <MahallaMap selectedId={selected?.id ?? null} activeFilter={null} onSelect={setSelected} onHover={() => {}} showEntered />
        <div className="absolute left-3 top-3 z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-black/55 px-3 py-2 text-[11px] text-white/80 backdrop-blur-md">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-amber-400" /> Kiritilgan: {houses?.length ?? 0}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-emerald-400" /> Kiritilmagan
          </span>
        </div>
      </div>

      <aside className="w-[500px] shrink-0 overflow-y-auto border-l border-[rgb(var(--card-border))] bg-background">
        <RoleHouseEditorPanel element={selected} role={me?.role} onClear={() => setSelected(null)} />
      </aside>
    </div>
  );
};

export default BoshqaruvRoleXaritaPage;
