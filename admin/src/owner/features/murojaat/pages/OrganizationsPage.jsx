import { Plus } from "lucide-react";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import Button from "@/shared/components/ui/button/Button";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import MurojaatNav from "../components/MurojaatNav";
import OrganizationCreateModal from "../components/OrganizationCreateModal";
import { useOrganizations } from "../hooks/useOrganizations";
import { ORGANIZATION_TYPE_LABELS } from "../constants/murojaat.ui";

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{children}</th>
);
const Td = ({ children }) => (
  <td className="px-4 py-3 text-sm text-zinc-700">{children}</td>
);

const OrganizationsPage = () => {
  const { openModal } = useModal();
  const { data: orgs, isLoading } = useOrganizations();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tashkilotlar</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Murojaatlarga javob beradigan organlar — {orgs?.length ?? 0} ta
          </p>
        </div>
        <Button onClick={() => openModal(MODAL.MUROJAAT_ORG_CREATE)}>
          <Plus className="size-4" /> Tashkilot qo'shish
        </Button>
      </div>

      <MurojaatNav />

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          Yuklanmoqda...
        </div>
      ) : !orgs?.length ? (
        <div className="rounded-[2px] border bg-white p-8 text-center text-sm text-zinc-400">
          Tashkilotlar yo'q
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[2px] border bg-white">
          <table className="w-full border-collapse">
            <thead className="border-b bg-zinc-50/60">
              <tr>
                <Th>Nomi</Th>
                <Th>Turi</Th>
                <Th>Viloyat</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orgs.map((o) => (
                <tr key={o._id} className="hover:bg-zinc-50/60">
                  <Td>{o.name}</Td>
                  <Td>{ORGANIZATION_TYPE_LABELS[o.type] || o.type}</Td>
                  <Td>{o.region || "-"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalWrapper name={MODAL.MUROJAAT_ORG_CREATE} title="Tashkilot qo'shish">
        <OrganizationCreateModal />
      </ModalWrapper>
    </div>
  );
};

export default OrganizationsPage;
