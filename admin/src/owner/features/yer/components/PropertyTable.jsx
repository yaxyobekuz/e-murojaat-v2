import { formatMoney } from "@/shared/utils/formatMoney";
import StatusBadge from "./StatusBadge";
import { PROPERTY_TYPE_LABELS, OWNERSHIP_TYPE_LABELS } from "../constants/yer.ui";

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const PropertyTable = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Obyektlar topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2px] border bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b bg-zinc-50/60">
          <tr>
            <Th>Kadastr raqami</Th>
            <Th>Tur</Th>
            <Th>Manzil</Th>
            <Th className="text-right">Maydon</Th>
            <Th className="text-right">Qiymat</Th>
            <Th>Egalik</Th>
            <Th>Holat</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((p) => (
            <tr key={p._id} className="hover:bg-zinc-50/60">
              <Td className="font-medium tabular-nums">{p.cadastreNumber}</Td>
              <Td>{PROPERTY_TYPE_LABELS[p.type] || p.type}</Td>
              <Td>
                <span className="text-zinc-900">{p.region}</span>
                <span className="block text-xs text-zinc-400">{p.district}</span>
              </Td>
              <Td className="text-right tabular-nums">{p.areaM2} m²</Td>
              <Td className="text-right tabular-nums">{formatMoney(p.valueUzs)}</Td>
              <Td>{OWNERSHIP_TYPE_LABELS[p.ownershipType] || p.ownershipType}</Td>
              <Td>
                <StatusBadge status={p.status} kind="property" />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTable;
