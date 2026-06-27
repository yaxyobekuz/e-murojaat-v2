// Filtr — ko'cha tanlash.
import Select from "@/shared/components/ui/select/Select";
import { STREETS } from "../mock/suyuqGaz.data";

const triggerClass =
  "h-10 rounded-full border-[rgb(var(--card-border))] !bg-card/60 text-sm text-foreground";

const options = [
  { value: "", label: "Barcha ko'chalar" },
  ...STREETS.map((s) => ({ value: s.id, label: s.label })),
];

const SuyuqGazFilters = ({ value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Select
      placeholder="Ko'cha"
      value={value.streetId}
      onChange={(v) => onChange("streetId", v)}
      options={options}
      triggerClassName={triggerClass}
    />
  </div>
);

export default SuyuqGazFilters;
