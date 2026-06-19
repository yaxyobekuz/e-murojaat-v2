import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatDateUz } from "@/shared/utils/formatDate";
import StatusBadge from "./StatusBadge";
import { CATEGORY_LABELS } from "../constants/murojaat.ui";

const OPEN = ["yangi", "korib_chiqilmoqda", "yonaltirildi"];
const isOverdue = (r) =>
  OPEN.includes(r.status) && r.deadline && new Date(r.deadline) < new Date();

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const AppealTable = ({ items = [] }) => {
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Murojaatlar topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2px] border bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b bg-zinc-50/60">
          <tr>
            <Th>Murojaat №</Th>
            <Th>Mavzu</Th>
            <Th>Soha</Th>
            <Th>Arizachi</Th>
            <Th>Holat</Th>
            <Th>Muddat</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((r) => {
            const overdue = isOverdue(r);
            return (
              <tr
                key={r._id}
                onClick={() => navigate(`/owner/murojaat/inbox/${r._id}`)}
                className="cursor-pointer hover:bg-zinc-50/60"
              >
                <Td className="font-medium tabular-nums">{r.appealNumber}</Td>
                <Td className="max-w-64 truncate">{r.subject}</Td>
                <Td>{CATEGORY_LABELS[r.category] || r.category}</Td>
                <Td>
                  <span className="text-zinc-900">{r.applicantName || "-"}</span>
                  <span className="block text-xs text-zinc-400 tabular-nums">
                    {r.applicantJshshir}
                  </span>
                </Td>
                <Td>
                  <StatusBadge status={r.status} />
                </Td>
                <Td className="tabular-nums">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      overdue && "font-medium text-rose-600",
                    )}
                  >
                    {overdue && <AlertTriangle className="size-3.5" />}
                    {formatDateUz(r.deadline)}
                  </span>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppealTable;
