import Select from "@/shared/components/ui/select/Select";
import Input from "@/shared/components/ui/input/Input";
import { REGION_OPTIONS } from "../constants/gaz.ui";

// Generic filter bar; pass the option sets relevant to the page via `filters`
const GazFilterBar = ({ value, onChange, filters = [], searchable = true }) => {
  const set = (key) => (v) => onChange({ ...value, [key]: v, page: 1 });

  return (
    <div className="flex flex-wrap items-center gap-3">
      {searchable && (
        <Input
          placeholder="Qidirish..."
          value={value.search || ""}
          onChange={(e) => set("search")(e.target.value)}
          className="w-full max-w-60"
        />
      )}

      {filters.includes("region") && (
        <Select
          value={value.region || ""}
          onChange={set("region")}
          placeholder="Viloyat"
          triggerClassName="w-48"
          options={[{ value: "", label: "Barcha viloyatlar" }, ...REGION_OPTIONS]}
        />
      )}

      {filters.map((f) =>
        typeof f === "object" ? (
          <Select
            key={f.key}
            value={value[f.key] || ""}
            onChange={set(f.key)}
            placeholder={f.placeholder}
            triggerClassName="w-48"
            options={[{ value: "", label: f.allLabel }, ...f.options]}
          />
        ) : null,
      )}
    </div>
  );
};

export default GazFilterBar;
