// Xarita editorining o'ng paneli — tanlangan uy uchun keng imkonli tahrirlash formasi.
import { useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Layers, MousePointerClick, Ruler, Save, Trash2 } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import { qk } from "@/shared/lib/query/keys";
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";
import Button from "@/shared/components/ui/button/Button";
import { useHouseQuery, useHouseMutation, housesAPI } from "@/owner/features/asosiy";
import {
  EXT_NUM_KEYS, EXT_STR_KEYS, EXT_BOOL_KEYS,
  MurojaatSection, XizmatSection, TomorqaSection,
} from "./HouseEditorExtraSections";
import HouseResidentsSection from "./HouseResidentsSection";

const OWNERSHIP_OPTIONS = [
  { value: "Xususiy", label: "Xususiy" },
  { value: "Davlat", label: "Davlat" },
  { value: "Yuridik shaxs", label: "Yuridik shaxs" },
];

const UTIL_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "bor", label: "Bor" },
  { value: "yoq", label: "Yo'q" },
];
const UTILS = [
  { key: "utilGas", label: "Gaz" },
  { key: "utilElectric", label: "Elektr" },
  { key: "utilWater", label: "Suv" },
  { key: "utilInternet", label: "Internet" },
];

// bo'lim sarlavhasi
const SectionCap = ({ children }) => (
  <p className="mt-2 border-b border-[rgb(var(--card-border))] pb-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/45">
    {children}
  </p>
);

// tahrirlash tablari — DetailPanel tablariga mos
const EDIT_TABS = [
  { key: "umumiy", label: "Umumiy" },
  { key: "murojaat", label: "Murojaat" },
  { key: "xizmat", label: "Xizmat" },
  { key: "tomorqa", label: "Tomorqa" },
];

const toUtil = (v) => (v === "" || v == null ? null : v === "bor");
const fromUtil = (v) => (v == null ? "" : v ? "bor" : "yoq");
const numOrNull = (v) => (v === "" || v == null ? null : Number(v));

// qo'shimcha bo'limlar (tab) kalitlari — forma/serverga avtomatik konvertatsiya
const extInitial = Object.fromEntries([...EXT_NUM_KEYS, ...EXT_STR_KEYS, ...EXT_BOOL_KEYS].map((k) => [k, ""]));
const extFromHouse = (house) => ({
  ...Object.fromEntries([...EXT_NUM_KEYS, ...EXT_STR_KEYS].map((k) => [k, house?.[k] ?? ""])),
  ...Object.fromEntries(EXT_BOOL_KEYS.map((k) => [k, fromUtil(house?.[k])])),
});
const extToBody = (state) => ({
  ...Object.fromEntries(EXT_NUM_KEYS.map((k) => [k, numOrNull(state[k])])),
  ...Object.fromEntries(EXT_BOOL_KEYS.map((k) => [k, toUtil(state[k])])),
});

const FieldRow = ({ label, children }) => (
  <div>
    <p className="mb-1.5 text-xs font-medium text-foreground/55">{label}</p>
    {children}
  </div>
);

const Meta = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-[rgb(var(--card-border))] bg-card/40 px-2.5 py-2">
    <div className="flex items-center gap-1.5 text-[10px] text-foreground/45">
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
    <p className="mt-0.5 whitespace-nowrap text-[13px] font-semibold tabular-nums">{value}</p>
  </div>
);

const errMsg = (err) =>
  err?.response?.status === 401
    ? "Sessiya tugagan — qayta kiring"
    : err?.response?.data?.message || "Amalni bajarib bo'lmadi";

const HouseEditorPanel = ({ element, onClear }) => {
  const osmId = element?.osmId || null;
  const { data: house } = useHouseQuery(osmId);
  const mutation = useHouseMutation();
  const queryClient = useQueryClient();
  const { state, setFields, setField } = useObjectState({
    tab: "umumiy",
    name: "", owner: "", phone: "", members: "", ownership: "Xususiy", address: "", notes: "",
    kind: "", area: "", floors: "", heightM: "", value: "",
    taxAnnual: "", taxDebt: "", mibDebt: "",
    officerName: "", officerTitle: "", officerPhone: "", officerSector: "",
    utilGas: "", utilElectric: "", utilWater: "", utilInternet: "",
    ...extInitial,
  });

  // uy almashganda yoki server yozuvi kelganda formani yangilaymiz
  useEffect(() => {
    setFields({
      name: house?.name ?? element?.name ?? "",
      owner: house?.owner ?? "",
      phone: house?.phone ?? "",
      members: house?.members ?? "",
      ownership: house?.ownership || "Xususiy",
      address: house?.address ?? "",
      notes: house?.notes ?? "",
      kind: house?.kind ?? "",
      area: house?.area ?? "",
      floors: house?.floors ?? element?.levels ?? "",
      heightM: house?.heightM ?? "",
      value: house?.value ?? "",
      taxAnnual: house?.taxAnnual ?? "",
      taxDebt: house?.taxDebt ?? "",
      mibDebt: house?.mibDebt ?? "",
      officerName: house?.officerName ?? "",
      officerTitle: house?.officerTitle ?? "",
      officerPhone: house?.officerPhone ?? "",
      officerSector: house?.officerSector ?? "",
      utilGas: fromUtil(house?.utilGas),
      utilElectric: fromUtil(house?.utilElectric),
      utilWater: fromUtil(house?.utilWater),
      utilInternet: fromUtil(house?.utilInternet),
      ...extFromHouse(house),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [osmId, house]);

  const removeMutation = useMutation({
    mutationFn: () => housesAPI.remove(osmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.houses.all() });
      queryClient.removeQueries({ queryKey: qk.houses.one(osmId) });
      toast.success("Yozuv o'chirildi");
    },
    onError: (err) => toast.error(errMsg(err)),
  });

  if (!element)
    return (
      <div className="grid h-full place-items-center px-8 text-center text-foreground/45">
        <div className="flex flex-col items-center gap-3">
          <MousePointerClick className="size-8 text-foreground/25" />
          <p className="text-sm font-medium">Xaritadan uyni tanlang</p>
          <p className="text-xs leading-relaxed">
            Oltin — ma'lumoti kiritilgan, yashil — hali kiritilmagan uylar.
            Uyni bosib, ma'lumotlarini shu yerda tahrirlaysiz.
          </p>
        </div>
      </div>
    );

  if (!osmId)
    return (
      <div className="grid h-full place-items-center px-8 text-center text-foreground/45">
        <p className="text-sm">Faqat binolar tahrirlanadi — xaritadan uy tanlang</p>
      </div>
    );

  const onSave = () =>
    mutation.mutate(
      {
        osmId,
        body: {
          ...state,
          members: numOrNull(state.members),
          area: numOrNull(state.area),
          floors: numOrNull(state.floors),
          heightM: numOrNull(state.heightM),
          value: numOrNull(state.value),
          taxAnnual: numOrNull(state.taxAnnual),
          taxDebt: numOrNull(state.taxDebt),
          mibDebt: numOrNull(state.mibDebt),
          utilGas: toUtil(state.utilGas),
          utilElectric: toUtil(state.utilElectric),
          utilWater: toUtil(state.utilWater),
          utilInternet: toUtil(state.utilInternet),
          ...extToBody(state),
        },
      },
      { onSuccess: () => toast.success("Saqlandi"), onError: (err) => toast.error(errMsg(err)) },
    );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold leading-tight">{element.name || "Nomsiz bino"}</h2>
            {house ? (
              <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-1.5 py-px text-[10px] font-bold text-amber-400">KIRITILGAN</span>
            ) : (
              <span className="rounded-md border border-zinc-400/30 bg-zinc-400/10 px-1.5 py-px text-[10px] font-medium text-foreground/45">KIRITILMAGAN</span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-foreground/40">OSM {osmId}</p>
        </div>
        <button type="button" onClick={onClear} className="text-xs text-foreground/45 hover:text-foreground">Tozalash</button>
      </div>

      {/* OSM'dan kelgan texnik ma'lumot */}
      <div className="grid grid-cols-3 gap-1.5">
        <Meta icon={Layers} label="Qavat" value={element.levels ?? "—"} />
        <Meta icon={Ruler} label="Balandlik" value={`${element.height} m`} />
        <Meta icon={Building2} label="Maydon" value={`${element.area} m²`} />
      </div>

      {/* tab bar — DetailPanel bilan bir xil bo'limlar */}
      <div className="flex gap-1 rounded-xl border border-[rgb(var(--card-border))] bg-card/40 p-1">
        {EDIT_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setField("tab", t.key)}
            className={
              state.tab === t.key
                ? "flex-1 rounded-lg bg-foreground/10 px-1 py-1.5 text-[11px] font-semibold text-foreground"
                : "flex-1 rounded-lg px-1 py-1.5 text-[11px] font-medium text-foreground/45 transition-colors hover:text-foreground/75"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {state.tab === "umumiy" && (
      <div className="flex flex-col gap-3">
        <FieldRow label="Xonadon nomi">
          <Input value={state.name} onChange={(e) => setField("name", e.target.value)} placeholder="Masalan: ABDUSAMAT xonodoni" />
        </FieldRow>
        <FieldRow label="Egasi (F.I.O.)">
          <Input value={state.owner} onChange={(e) => setField("owner", e.target.value)} placeholder="Familiya I." />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Telefon">
            <Input value={state.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+998 90 123-45-67" />
          </FieldRow>
          <FieldRow label="A'zolar soni">
            <Input type="number" min="0" value={state.members} onChange={(e) => setField("members", e.target.value)} placeholder="0" />
          </FieldRow>
        </div>
        <FieldRow label="Mulkchilik">
          <Select value={state.ownership} onChange={(v) => setField("ownership", v)} options={OWNERSHIP_OPTIONS} />
        </FieldRow>
        <FieldRow label="Manzil">
          <Input value={state.address} onChange={(e) => setField("address", e.target.value)} placeholder="Ko'cha, uy raqami" />
        </FieldRow>

        <SectionCap>Reyestr ma'lumotlari</SectionCap>
        <FieldRow label="Turi">
          <Input value={state.kind} onChange={(e) => setField("kind", e.target.value)} placeholder="Yakka tartibdagi uy / Ko'p qavatli..." />
        </FieldRow>
        <div className="grid grid-cols-3 gap-3">
          <FieldRow label="Maydon (m²)">
            <Input type="number" min="0" value={state.area} onChange={(e) => setField("area", e.target.value)} placeholder="—" />
          </FieldRow>
          <FieldRow label="Qavatlar">
            <Input type="number" min="0" value={state.floors} onChange={(e) => setField("floors", e.target.value)} placeholder="—" />
          </FieldRow>
          <FieldRow label="Balandlik (m)">
            <Input type="number" min="0" value={state.heightM} onChange={(e) => setField("heightM", e.target.value)} placeholder="—" />
          </FieldRow>
        </div>
        <FieldRow label="Qiymati (so'm)">
          <Input type="number" min="0" value={state.value} onChange={(e) => setField("value", e.target.value)} placeholder="—" />
        </FieldRow>

        <SectionCap>Soliq holati</SectionCap>
        <FieldRow label="Yillik soliq summasi (so'm)">
          <Input type="number" min="0" value={state.taxAnnual} onChange={(e) => setField("taxAnnual", e.target.value)} placeholder="—" />
        </FieldRow>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="Soliq qarzdorligi (so'm)">
            <Input type="number" min="0" value={state.taxDebt} onChange={(e) => setField("taxDebt", e.target.value)} placeholder="—" />
          </FieldRow>
          <FieldRow label="MIB qarzdorligi (so'm)">
            <Input type="number" min="0" value={state.mibDebt} onChange={(e) => setField("mibDebt", e.target.value)} placeholder="—" />
          </FieldRow>
        </div>

        <SectionCap>Biriktirilgan xodim (soliq)</SectionCap>
        <div className="grid grid-cols-2 gap-3">
          <FieldRow label="F.I.O.">
            <Input value={state.officerName} onChange={(e) => setField("officerName", e.target.value)} placeholder="Aliyev D." />
          </FieldRow>
          <FieldRow label="Lavozimi">
            <Input value={state.officerTitle} onChange={(e) => setField("officerTitle", e.target.value)} placeholder="Soliq inspektori" />
          </FieldRow>
          <FieldRow label="Telefon">
            <Input value={state.officerPhone} onChange={(e) => setField("officerPhone", e.target.value)} placeholder="+998 ..." />
          </FieldRow>
          <FieldRow label="Sektor">
            <Input value={state.officerSector} onChange={(e) => setField("officerSector", e.target.value)} placeholder="6-sektor" />
          </FieldRow>
        </div>

        <SectionCap>Qo'shimcha</SectionCap>
        <FieldRow label="Izoh">
          <textarea
            value={state.notes}
            onChange={(e) => setField("notes", e.target.value)}
            rows={4}
            placeholder="Qo'shimcha ma'lumot..."
            className="w-full resize-none rounded-lg border border-[rgb(var(--card-border))] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-foreground/35 focus:border-foreground/30"
          />
        </FieldRow>
      </div>
      )}

      {state.tab === "murojaat" && (
        <div className="flex flex-col gap-3">
          <HouseResidentsSection osmId={osmId} onFillCounts={(d) => setFields(d)} />
          <MurojaatSection state={state} setField={setField} />
        </div>
      )}

      {state.tab === "xizmat" && (
        <div className="flex flex-col gap-3">
          <SectionCap>Kommunal ta'minot</SectionCap>
          <div className="grid grid-cols-2 gap-3">
            {UTILS.map((u) => (
              <FieldRow key={u.key} label={u.label}>
                <Select value={state[u.key]} onChange={(v) => setField(u.key, v)} options={UTIL_OPTIONS} />
              </FieldRow>
            ))}
          </div>
          <XizmatSection state={state} setField={setField} />
        </div>
      )}

      {state.tab === "tomorqa" && <TomorqaSection state={state} setField={setField} />}

      <div className="flex items-center gap-2 pt-1">
        <Button onClick={onSave} disabled={mutation.isPending} className="flex-1">
          <Save className="size-4" /> {mutation.isPending ? "Saqlanmoqda…" : "Saqlash"}
        </Button>
        {house && (
          <Button variant="outline" onClick={() => removeMutation.mutate()} disabled={removeMutation.isPending} title="Yozuvni o'chirish">
            <Trash2 className="size-4 text-red-400" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HouseEditorPanel;
