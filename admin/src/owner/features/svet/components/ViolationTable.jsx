import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import StatusBadge from "./StatusBadge";
import { VIOLATION_TYPE_LABELS } from "../constants/svet.ui";

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const ViolationTable = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Qoidabuzarliklar topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2px] border bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b bg-zinc-50/60">
          <tr>
            <Th>Dalolatnoma №</Th>
            <Th>Hisob raqami</Th>
            <Th>Turi</Th>
            <Th>Viloyat</Th>
            <Th className="text-right">Jarima</Th>
            <Th>Sana</Th>
            <Th>Holat</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((v) => (
            <tr key={v._id} className="hover:bg-zinc-50/60">
              <Td className="font-medium tabular-nums">{v.actNumber}</Td>
              <Td className="tabular-nums">{v.accountNumber}</Td>
              <Td>{VIOLATION_TYPE_LABELS[v.type] || v.type}</Td>
              <Td>{v.region || "-"}</Td>
              <Td className="text-right tabular-nums">{formatMoney(v.fineUzs)}</Td>
              <Td className="tabular-nums">{formatDateUz(v.date)}</Td>
              <Td>
                <StatusBadge status={v.status} kind="violation" />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViolationTable;
