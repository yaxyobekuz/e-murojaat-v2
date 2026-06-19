import { formatMoney } from "@/shared/utils/formatMoney";
import { formatDateUz } from "@/shared/utils/formatDate";
import { PAYMENT_METHOD_LABELS } from "../constants/gaz.ui";

const Th = ({ children, className = "" }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-zinc-500 ${className}`}>
    {children}
  </th>
);
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 ${className}`}>{children}</td>
);

const PaymentTable = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        To'lovlar topilmadi
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
            <Th>Usul</Th>
            <Th className="text-right">Summa</Th>
            <Th>Sana</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((p) => (
            <tr key={p._id} className="hover:bg-zinc-50/60">
              <Td className="font-medium tabular-nums">
                {p.subscriberId?.accountNumber || "-"}
              </Td>
              <Td className="text-zinc-900">{p.subscriberId?.fullName || "-"}</Td>
              <Td>{PAYMENT_METHOD_LABELS[p.method] || p.method}</Td>
              <Td className="text-right tabular-nums text-emerald-600">
                {formatMoney(p.amountUzs)}
              </Td>
              <Td className="tabular-nums">{formatDateUz(p.paidAt)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
