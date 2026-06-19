import Select from "@/shared/components/ui/select/Select";
import Input from "@/shared/components/ui/input/Input";
import { REGION_OPTIONS } from "../constants/murojaat.ui";

// Generic filter bar; pass the option sets relevant to the page via `filters`
const MurojaatFilterBar = ({ value, onChange, filters = [] }) => {
  const set = (key) => (v) => onChange({ ...value, [key]: v, page: 1 });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Raqam yoki mavzu bo'yicha qidirish..."
        value={value.search || ""}
        onChange={(e) => set("search")(e.target.value)}
        className="w-full max-w-72"
      />

      {filters.includes("region") && (
        <Select
          value={value.region || ""}
          onChange={set("region")}
          placeholder="Viloyat"
          triggerClassName="w-44"
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
            triggerClassName="w-44"
            options={[{ value: "", label: f.allLabel }, ...f.options]}
          />
        ) : null,
      )}
    </div>
  );
};

export default MurojaatFilterBar;
