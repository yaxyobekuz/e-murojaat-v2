import { useNavigate } from "react-router-dom";
import { formatDateUz } from "@/shared/utils/formatDate";
import StatusBadge from "./StatusBadge";
import { SERVICE_TYPE_LABELS } from "../constants/yer.ui";

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const RequestTable = ({ items = [] }) => {
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Arizalar topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2px] border bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b bg-zinc-50/60">
          <tr>
            <Th>Ariza №</Th>
            <Th>Xizmat turi</Th>
            <Th>Arizachi</Th>
            <Th>Viloyat</Th>
            <Th>Holat</Th>
            <Th>Sana</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((r) => (
            <tr
              key={r._id}
              onClick={() => navigate(`/owner/soliq/yer/arizalar/${r._id}`)}
              className="cursor-pointer hover:bg-zinc-50/60"
            >
              <Td className="font-medium tabular-nums">{r.requestNumber}</Td>
              <Td>{SERVICE_TYPE_LABELS[r.serviceType] || r.serviceType}</Td>
              <Td>
                <span className="text-zinc-900">{r.applicantName || "-"}</span>
                <span className="block text-xs text-zinc-400 tabular-nums">
                  {r.applicantJshshir}
                </span>
              </Td>
              <Td>{r.region || "-"}</Td>
              <Td>
                <StatusBadge status={r.status} />
              </Td>
              <Td className="tabular-nums">{formatDateUz(r.createdAt)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
