// Konfiguratsiyaga asoslangan bitta forma maydoni — Aholi va Yettilik formalarida qayta ishlatiladi.
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";

const FormField = ({ field, value, onChange }) => (
  <div className={field.full ? "col-span-2" : ""}>
    <p className="mb-1.5 text-xs font-medium text-foreground/55">
      {field.label} {field.required && <span className="text-red-400">*</span>}
    </p>
    {field.type === "textarea" ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={field.placeholder}
        className="w-full resize-none rounded-lg border border-[rgb(var(--card-border))] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/35 focus:border-foreground/30"
      />
    ) : field.type === "select" || field.type === "bool" ? (
      <Select value={value} onChange={onChange} options={field.options} placeholder="Belgilanmagan" />
    ) : (
      <Input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        min={field.type === "number" ? "0" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    )}
  </div>
);

export default FormField;
