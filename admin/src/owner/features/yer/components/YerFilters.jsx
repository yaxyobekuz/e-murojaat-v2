// Filter row — region/type/status selects. Caller owns state via useObjectState.
import Select from "@/shared/components/ui/select/Select";
import { REGIONS, TYPE_LABELS, PROPERTY_TYPES } from "../mock/yer.data";

const triggerClass =
  "h-10 rounded-full border-[rgb(var(--card-border))] !bg-card/60 text-sm text-foreground";

const regionOptions = [
  { value: "", label: "Barcha viloyatlar" },
  ...REGIONS.map((r) => ({ value: r, label: r })),
];

const typeOptions = [
  { value: "", label: "Barcha turlar" },
  ...PROPERTY_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] })),
];

const YerFilters = ({ value, onChange, statusOptions, children }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Select
      placeholder="Viloyat"
      value={value.region}
      onChange={(v) => onChange("region", v)}
      options={regionOptions}
      triggerClassName={triggerClass}
    />
    {!statusOptions && (
      <Select
        placeholder="Turi"
        value={value.type}
        onChange={(v) => onChange("type", v)}
        options={typeOptions}
        triggerClassName={triggerClass}
      />
    )}
    {statusOptions && (
      <Select
        placeholder="Holati"
        value={value.status}
        onChange={(v) => onChange("status", v)}
        options={statusOptions}
        triggerClassName={triggerClass}
      />
    )}
    {children}
  </div>
);

export default YerFilters;
