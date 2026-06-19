import { useLocationsQuery } from "../hooks/useSoliqQueries";
import SelectField from "@/shared/components/ui/select/SelectField";
import { REGIONS } from "@/shared/data/regions";

// Ierarxik (kaskad) hudud filtri: Viloyat → Tuman → Qishloq/Shahar → Mahalla.
// `value` = { region, district, settlement, mahalla }; `onChange(next)` to'liq obyekt qaytaradi.
// Yuqori daraja o'zgarsa, quyi darajalar tozalanadi.
const LocationFilter = ({ value, onChange, showMahalla = true }) => {
  const { region, district, settlement, mahalla } = value;

  // Keyingi darajalar (avvalgisi tanlangan bo'lsa) backend'dan keladi.
  const { data: districtsData } = useLocationsQuery(region ? { region } : null);
  const { data: settlementsData } = useLocationsQuery(
    region && district ? { region, district } : null,
  );
  const { data: mahallasData } = useLocationsQuery(settlement ? { settlement } : null);

  const opt = (items, allLabel) => [
    { label: allLabel, value: "" },
    ...(items || []).map((i) => ({ label: i.label, value: i.key })),
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SelectField
        label="Viloyat"
        name="region"
        className="min-w-[170px]"
        value={region || ""}
        options={opt(REGIONS, "Barcha viloyatlar")}
        onChange={(v) => onChange({ region: v, district: "", settlement: "", mahalla: "" })}
      />

      <SelectField
        label="Tuman / shahar"
        name="district"
        className="min-w-[170px]"
        value={district || ""}
        disabled={!region}
        options={opt(districtsData?.items, "Barcha tumanlar")}
        onChange={(v) => onChange({ region, district: v, settlement: "", mahalla: "" })}
      />

      <SelectField
        label="Qishloq / shahar"
        name="settlement"
        className="min-w-[170px]"
        value={settlement || ""}
        disabled={!district}
        options={opt(settlementsData?.items, "Barchasi")}
        onChange={(v) => onChange({ region, district, settlement: v, mahalla: "" })}
      />

      {showMahalla && (
        <SelectField
          label="Mahalla (MFY)"
          name="mahalla"
          className="min-w-[170px]"
          value={mahalla || ""}
          disabled={!settlement}
          options={opt(mahallasData?.items, "Barcha mahallalar")}
          onChange={(v) => onChange({ region, district, settlement, mahalla: v })}
        />
      )}
    </div>
  );
};

export default LocationFilter;
