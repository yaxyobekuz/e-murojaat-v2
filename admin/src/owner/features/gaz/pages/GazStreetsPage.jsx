import { Search } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import { useGazStreets } from "../hooks/useGazStreets";
import GazFilters from "../components/GazFilters";
import StreetTable from "../components/StreetTable";
import StreetDetailModal from "../components/modals/StreetDetailModal";

const GazStreetsPage = () => {
  const { state, setField } = useObjectState({ street: "", supplyType: "", status: "", adequacy: "", search: "" });
  const { openModal } = useModal();
  const { data, isLoading } = useGazStreets(state);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Gaz ta'minoti — ko'chalar reyestri</h1>
        <p className="mt-0.5 text-sm text-foreground/50">Sarnovul MFY ko'chalari bo'yicha to'liq ko'rsatkichlar. Qatorni bosib tafsilotni ko'ring</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
          <input
            value={state.search}
            onChange={(e) => setField("search", e.target.value)}
            placeholder="Ko'cha nomi bo'yicha qidirish..."
            className="h-10 w-full rounded-full border border-[rgb(var(--card-border))] bg-card/60 pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-foreground/40 focus:border-blue-400/50"
          />
        </div>
        <GazFilters value={state} onChange={setField} />
      </div>

      <StreetTable
        rows={data?.rows || []}
        isLoading={isLoading}
        onRowClick={(row) => openModal(MODAL.GAZ_STREET_DETAIL, { streetId: row.id })}
      />

      <ModalWrapper name={MODAL.GAZ_STREET_DETAIL} title="Ko'cha tafsiloti" className="max-w-lg">
        <StreetDetailModal />
      </ModalWrapper>
    </div>
  );
};

export default GazStreetsPage;
