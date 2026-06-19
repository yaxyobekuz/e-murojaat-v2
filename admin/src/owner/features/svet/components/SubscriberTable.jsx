import { useNavigate } from "react-router-dom";
import { formatMoney } from "@/shared/utils/formatMoney";
import StatusBadge from "./StatusBadge";
import { SUBSCRIBER_TYPE_LABELS } from "../constants/svet.ui";

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const SubscriberTable = ({ items = [] }) => {
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Abonentlar topilmadi
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[2px] border bg-white">
      <table className="w-full border-collapse">
        <thead className="border-b bg-zinc-50/60">
          <tr>
            <Th>Hisob raqami</Th>
            <Th>Abonent</Th>
            <Th>Tur</Th>
            <Th>Hudud</Th>
            <Th className="text-right">Qarzdorlik</Th>
            <Th>Holat</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((s) => (
            <tr
              key={s._id}
              onClick={() => navigate(`/owner/soliq/elektr/abonentlar/${s._id}`)}
              className="cursor-pointer hover:bg-zinc-50/60"
            >
              <Td className="font-medium tabular-nums">{s.accountNumber}</Td>
              <Td>
                <span className="text-zinc-900">{s.fullName || "-"}</span>
                <span className="block text-xs text-zinc-400 tabular-nums">
                  {s.subscriberJshshir}
                </span>
              </Td>
              <Td>{SUBSCRIBER_TYPE_LABELS[s.type] || s.type}</Td>
              <Td>
                <span className="text-zinc-900">{s.region}</span>
                <span className="block text-xs text-zinc-400">{s.district}</span>
              </Td>
              <Td
                className={`text-right tabular-nums ${
                  s.debtUzs > 0 ? "text-rose-600 font-medium" : ""
                }`}
              >
                {formatMoney(s.debtUzs)}
              </Td>
              <Td>
                <StatusBadge status={s.status} kind="subscriber" />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriberTable;
