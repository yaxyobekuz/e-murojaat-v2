import { cn } from "@/shared/utils/cn";

// Grafiklar uchun yagona qobiq: sarlavha + ostida 1 qatorli insight + grafik.
const ChartCard = ({ title, insight, className = "", children }) => (
  <div className={cn("bg-white border rounded-[2px] p-4 xs:p-5", className)}>
    {title && <h3 className="font-semibold text-gray-900">{title}</h3>}
    {insight && <p className="text-xs text-zinc-500 mt-0.5">{insight}</p>}
    <div className="mt-4">{children}</div>
  </div>
);

export default ChartCard;
