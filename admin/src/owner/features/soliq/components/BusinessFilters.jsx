// Ko'rsatish filtri — checkboxlar (Barcha / Yirik to'lovchilar / Qarzdorlar / Yangi ochilganlar).
// "Barcha" yoqilsa boshqalari o'chadi; bittasi tanlansa "Barcha" avtomatik o'chadi.
import { Check } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const Box = ({ label, checked, onClick, danger = false }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-2 rounded-lg px-1 py-1 text-[13px] text-foreground/75 transition-colors hover:text-foreground"
    aria-pressed={checked}
  >
    <span
      className={cn(
        "grid size-4 place-items-center rounded-[5px] border transition-colors",
        checked
          ? danger
            ? "border-rose-500 bg-rose-500 text-white"
            : "border-blue-500 bg-blue-500 text-white"
          : "border-foreground/30",
      )}
    >
      {checked && <Check className="size-3" strokeWidth={3} />}
    </span>
    {label}
  </button>
);

const BusinessFilters = ({ filters, onChange }) => {
  const allOn = !filters.large && !filters.debtor && !filters.isNew;

  const toggle = (key) => {
    if (key === "all") {
      onChange({ large: false, debtor: false, isNew: false });
      return;
    }
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="surface-overlay flex flex-wrap items-center gap-4 rounded-xl px-3 py-2">
      <span className="text-[12px] font-medium text-foreground/50">Ko'rsatish:</span>
      <Box label="Barcha bizneslar" checked={allOn} onClick={() => toggle("all")} />
      <Box label="Yirik soliq to'lovchilar" checked={!!filters.large} onClick={() => toggle("large")} />
      <Box label="Qarzdorlar" checked={!!filters.debtor} onClick={() => toggle("debtor")} danger />
      <Box label="Yangi ochilganlar" checked={!!filters.isNew} onClick={() => toggle("isNew")} />
    </div>
  );
};

export default BusinessFilters;
