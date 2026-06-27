// Filtr — mahalla tanlash. Holatni chaqiruvchi useObjectState orqali boshqaradi.
import Select from "@/shared/components/ui/select/Select";
import { MAHALLAS } from "../mock/elektr.data";

const triggerClass =
  "h-10 rounded-full border-[rgb(var(--card-border))] !bg-card/60 text-sm text-foreground";

const options = [
  { value: "", label: "Barcha ko'chalar" },
  ...MAHALLAS.map((m) => ({ value: m.id, label: m.label })),
];

const ElektrFilters = ({ value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Select
      placeholder="Ko'cha"
      value={value.mahallaId}
      onChange={(v) => onChange("mahallaId", v)}
      options={options}
      triggerClassName={triggerClass}
    />
  </div>
);

export default ElektrFilters;
