import SelectField from "@/shared/components/ui/select/SelectField";
import InputField from "@/shared/components/ui/input/InputField";
import { regionOptions } from "@/shared/data/regions";

// Dashboard va ro'yxatlar uchun umumiy filtr paneli.
// Faqat kerakli filtrlar `show` orqali ko'rsatiladi.
const SoliqFilterBar = ({ filters, setField, show = ["region"], children }) => (
  <div className="flex flex-wrap items-end gap-3 bg-white border rounded-[2px] p-3 xs:p-4">
    {show.includes("region") && (
      <SelectField
        label="Viloyat"
        name="region"
        className="min-w-[180px]"
        value={filters.region ?? ""}
        options={regionOptions}
        onChange={(v) => setField("region", v)}
      />
    )}
    {show.includes("search") && (
      <InputField
        type="search"
        label="Qidiruv"
        name="search"
        className="min-w-[200px]"
        placeholder="STIR, ism..."
        value={filters.search ?? ""}
        onChange={(e) => setField("search", e.target.value)}
      />
    )}
    {children}
  </div>
);

export default SoliqFilterBar;
