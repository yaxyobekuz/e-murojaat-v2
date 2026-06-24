// Global filtr paneli — barcha grafiklarni mix qiladi. Holatni chaqiruvchi boshqaradi.
import Select from "@/shared/components/ui/select/Select";
import {
  CATEGORIES, STATUS, GENDER, AGE_BUCKETS, STREETS, SOURCE, PRIORITY,
} from "../mock/msk.data";

const triggerClass =
  "h-10 rounded-full border-[rgb(var(--card-border))] !bg-card/60 text-sm text-foreground";

const opt = (all, map, allLabel) => [
  { value: "", label: allLabel },
  ...(Array.isArray(all) ? all : Object.keys(all)).map((k) =>
    map ? { value: k, label: map[k]?.label || map[k] || k } : { value: k, label: k },
  ),
];

const catOpts = [{ value: "", label: "Barcha xizmatlar" }, ...CATEGORIES.map((c) => ({ value: c.key, label: c.label }))];
const statusOpts = opt(STATUS, STATUS, "Barcha holatlar");
const genderOpts = opt(GENDER, GENDER, "Jins (barchasi)");
const ageOpts = [{ value: "", label: "Barcha yoshlar" }, ...AGE_BUCKETS.map((b) => ({ value: b.key, label: `${b.key} yosh` }))];
const streetOpts = opt(STREETS, null, "Barcha ko'chalar").map((o) => (o.value ? { ...o, label: `${o.label} ko'chasi` } : o));
const sourceOpts = opt(SOURCE, SOURCE, "Barcha manbalar");
const prioOpts = opt(PRIORITY, PRIORITY, "Ustuvorlik (barchasi)");

const F = ({ ph, val, k, onChange, options }) => (
  <Select placeholder={ph} value={val} onChange={(v) => onChange(k, v)} options={options} triggerClassName={triggerClass} />
);

const MskFilters = ({ value, onChange }) => (
  <div className="flex flex-wrap items-center gap-2">
    <F ph="Xizmat turi" val={value.category} k="category" onChange={onChange} options={catOpts} />
    <F ph="Holat" val={value.status} k="status" onChange={onChange} options={statusOpts} />
    <F ph="Jins" val={value.gender} k="gender" onChange={onChange} options={genderOpts} />
    <F ph="Yosh" val={value.ageBucket} k="ageBucket" onChange={onChange} options={ageOpts} />
    <F ph="Ko'cha" val={value.street} k="street" onChange={onChange} options={streetOpts} />
    <F ph="Manba" val={value.source} k="source" onChange={onChange} options={sourceOpts} />
    <F ph="Ustuvorlik" val={value.priority} k="priority" onChange={onChange} options={prioOpts} />
  </div>
);

export default MskFilters;
