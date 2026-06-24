// Global filtr — ko'cha / ta'minot turi / holat / yetarlilik (mix).
import Select from "@/shared/components/ui/select/Select";
import { STREETS, SUPPLY, STATUS, ADEQUACY } from "../mock/gaz.data";

const triggerClass = "h-10 rounded-full border-[rgb(var(--card-border))] !bg-card/60 text-sm text-foreground";

const streetOpts = [{ value: "", label: "Barcha ko'chalar" }, ...STREETS.map((s) => ({ value: s.id, label: `${s.name} ko'chasi` }))];
const supplyOpts = [{ value: "", label: "Ta'minot turi (barchasi)" }, ...Object.keys(SUPPLY).map((k) => ({ value: k, label: SUPPLY[k].label }))];
const statusOpts = [{ value: "", label: "Barcha holatlar" }, ...Object.keys(STATUS).map((k) => ({ value: k, label: STATUS[k].label }))];
const adeqOpts = [{ value: "", label: "Yetarlilik (barchasi)" }, ...Object.keys(ADEQUACY).map((k) => ({ value: k, label: ADEQUACY[k] }))];

const GazFilters = ({ value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Select placeholder="Ko'cha" value={value.street} onChange={(v) => onChange("street", v)} options={streetOpts} triggerClassName={triggerClass} />
    <Select placeholder="Ta'minot turi" value={value.supplyType} onChange={(v) => onChange("supplyType", v)} options={supplyOpts} triggerClassName={triggerClass} />
    <Select placeholder="Holat" value={value.status} onChange={(v) => onChange("status", v)} options={statusOpts} triggerClassName={triggerClass} />
    <Select placeholder="Yetarlilik" value={value.adequacy} onChange={(v) => onChange("adequacy", v)} options={adeqOpts} triggerClassName={triggerClass} />
  </div>
);

export default GazFilters;
