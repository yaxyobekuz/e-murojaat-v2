// DetailPanel tablariga mos qo'shimcha tahrirlash bo'limlari (Murojaat / Xizmat / Tomorqa).
import Input from "@/shared/components/ui/input/Input";
import Select from "@/shared/components/ui/select/Select";

// forma kalitlari — HouseEditorPanel saqlashda shu ro'yxatlar bo'yicha konvertatsiya qiladi
export const EXT_NUM_KEYS = [
  "familiesCount", "residentsCount", "womenCount", "menCount", "youthLedger", "womenLedger",
  "employedCount", "unemployedCount", "gasCylinderFamilies",
  "internetSpeed", "internetQuality",
  "gasMonthly", "gasLimit", "gasYearly",
  "elecMonthly", "elecNorm",
  "trashBins", "fireRiskPct",
  "harvestsPerYear", "gardenArea", "cropYieldKg", "cropPriceUzs",
  "livestockCattle", "livestockSheep", "livestockPoultry",
];
export const EXT_STR_KEYS = [
  "appealOfficerName", "appealOfficerTitle", "appealOfficerSector", "appealOfficerPhone",
  "medicName", "medicTitle", "medicFacility", "medicPhone",
  "internetProvider", "internetTech",
  "gasType", "gasMeter", "gasPressure",
  "trashLastPickup", "trashSchedule",
  "fireFindings", "fireInspection",
  "fireOfficerName", "fireOfficerTitle", "fireOfficerDept", "fireOfficerPhone",
  "crimeNote", "crimeOfficerName", "crimeOfficerTitle", "crimeOfficerPhone",
  "cropName",
];
export const EXT_BOOL_KEYS = ["internetConnected", "solarInstalled", "crimeClean"];

const INTERNET_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "bor", label: "Ulangan" },
  { value: "yoq", label: "Ulanmagan" },
];
const SOLAR_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "bor", label: "O'rnatilgan" },
  { value: "yoq", label: "Yo'q" },
];
const CRIME_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "bor", label: "Toza" },
  { value: "yoq", label: "Holat qayd etilgan" },
];
const GAS_TYPE_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "natural", label: "Tabiiy gaz" },
  { value: "lpg", label: "Suyultirilgan gaz (ballon)" },
];
const GAS_PRESSURE_OPTIONS = [
  { value: "", label: "Belgilanmagan" },
  { value: "Normal", label: "Normal" },
  { value: "Past", label: "Past" },
  { value: "Yuqori", label: "Yuqori" },
];

// tab ichida oddiy ochiq guruh (avvalgi collapse o'rniga)
const Fold = ({ children }) => <div className="flex flex-col gap-3">{children}</div>;

const Sub = ({ children }) => (
  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-foreground/40">{children}</p>
);

const Field = ({ label, children }) => (
  <div>
    <p className="mb-1.5 text-xs font-medium text-foreground/55">{label}</p>
    {children}
  </div>
);

const Num = ({ state, setField, k, label, placeholder = "—" }) => (
  <Field label={label}>
    <Input type="number" min="0" value={state[k]} onChange={(e) => setField(k, e.target.value)} placeholder={placeholder} />
  </Field>
);

const Txt = ({ state, setField, k, label, placeholder = "" }) => (
  <Field label={label}>
    <Input value={state[k]} onChange={(e) => setField(k, e.target.value)} placeholder={placeholder} />
  </Field>
);

const Sel = ({ state, setField, k, label, options }) => (
  <Field label={label}>
    <Select value={state[k]} onChange={(v) => setField(k, v)} options={options} />
  </Field>
);

export const MurojaatSection = ({ state, setField }) => {
  const p = { state, setField };
  return (
    <Fold title="Murojaat tabi — demografiya va xodimlar">
      <Sub>Xonadon demografiyasi</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="familiesCount" label="Oilalar soni" />
        <Num {...p} k="residentsCount" label="Fuqarolar soni" />
        <Num {...p} k="womenCount" label="Ayollar" />
        <Num {...p} k="menCount" label="Erkaklar" />
        <Num {...p} k="youthLedger" label="Yoshlar daftari" />
        <Num {...p} k="womenLedger" label="Ayollar daftari" />
        <Num {...p} k="employedCount" label="Ishli" />
        <Num {...p} k="unemployedCount" label="Ishsiz" />
      </div>
      <Num {...p} k="gasCylinderFamilies" label="Gaz balloni bilan ta'minlangan oilalar" />

      <Sub>Murojaatlar bo'yicha xodim</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Txt {...p} k="appealOfficerName" label="F.I.O." placeholder="Aliyev D." />
        <Txt {...p} k="appealOfficerTitle" label="Lavozimi" placeholder="Sektor rahbari" />
        <Txt {...p} k="appealOfficerSector" label="Sektor" placeholder="6-sektor" />
        <Txt {...p} k="appealOfficerPhone" label="Telefon" placeholder="+998 ..." />
      </div>

      <Sub>Biriktirilgan tibbiyot xodimi</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Txt {...p} k="medicName" label="F.I.O." placeholder="Karimova N." />
        <Txt {...p} k="medicTitle" label="Lavozimi" placeholder="Oilaviy shifokor" />
        <Txt {...p} k="medicFacility" label="Muassasa" placeholder="12-son oilaviy poliklinika" />
        <Txt {...p} k="medicPhone" label="Telefon" placeholder="+998 ..." />
      </div>
    </Fold>
  );
};

export const XizmatSection = ({ state, setField }) => {
  const p = { state, setField };
  return (
    <Fold title="Xizmat tabi — internet / gaz / elektr / axlat / xavfsizlik">
      <Sub>Internet</Sub>
      <Sel {...p} k="internetConnected" label="Ulanish holati" options={INTERNET_OPTIONS} />
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="internetSpeed" label="Tezlik (Mbit/s)" />
        <Num {...p} k="internetQuality" label="Aloqa sifati (%)" />
        <Txt {...p} k="internetProvider" label="Provayder" placeholder="Uztelecom" />
        <Txt {...p} k="internetTech" label="Texnologiya" placeholder="GPON / 4G..." />
      </div>

      <Sub>Gaz ta'minoti</Sub>
      <Sel {...p} k="gasType" label="Gaz turi" options={GAS_TYPE_OPTIONS} />
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="gasMonthly" label="Oylik sarf (m³)" />
        <Txt {...p} k="gasMeter" label="Hisoblagich raqami" placeholder="GM-123456" />
        <Sel {...p} k="gasPressure" label="Bosim holati" options={GAS_PRESSURE_OPTIONS} />
        <Num {...p} k="gasLimit" label="Yillik limit (m³)" placeholder="500" />
      </div>
      <Num {...p} k="gasYearly" label="Yillik sarf (m³)" />

      <Sub>Elektr energiya</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="elecMonthly" label="Oylik sarf (kVt·soat)" />
        <Num {...p} k="elecNorm" label="Ijtimoiy norma (kVt)" placeholder="200" />
      </div>
      <Sel {...p} k="solarInstalled" label="Quyosh paneli" options={SOLAR_OPTIONS} />

      <Sub>Axlat (obodonlashtirish)</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Txt {...p} k="trashLastPickup" label="Oxirgi olib ketilgan sana" placeholder="01 iyun 2026" />
        <Num {...p} k="trashBins" label="Konteynerlar soni" />
      </div>
      <Txt {...p} k="trashSchedule" label="Jadval" placeholder="Dush/Chor/Shan" />

      <Sub>Yong'in xavfsizligi</Sub>
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="fireRiskPct" label="Yong'in ehtimoli (%)" />
        <Txt {...p} k="fireInspection" label="Tekshiruv sanasi" placeholder="15 may 2026" />
      </div>
      <Txt {...p} k="fireFindings" label="Inspektor xulosasi" placeholder="Muammo aniqlanmadi..." />
      <div className="grid grid-cols-2 gap-3">
        <Txt {...p} k="fireOfficerName" label="FVV xodimi F.I.O." placeholder="Rasulov B." />
        <Txt {...p} k="fireOfficerTitle" label="Lavozimi" placeholder="FVV inspektori" />
        <Txt {...p} k="fireOfficerDept" label="Bo'lim" placeholder="3-son FVV bo'limi" />
        <Txt {...p} k="fireOfficerPhone" label="Telefon" placeholder="+998 ..." />
      </div>

      <Sub>Jamoat xavfsizligi</Sub>
      <Sel {...p} k="crimeClean" label="Holat" options={CRIME_OPTIONS} />
      <Txt {...p} k="crimeNote" label="Holat izohi" placeholder="Maishiy nizo..." />
      <div className="grid grid-cols-2 gap-3">
        <Txt {...p} k="crimeOfficerName" label="Profilaktika inspektori F.I.O." placeholder="Saidov A." />
        <Txt {...p} k="crimeOfficerTitle" label="Lavozimi" placeholder="Mahalla profilaktika inspektori" />
      </div>
      <Txt {...p} k="crimeOfficerPhone" label="Inspektor telefoni" placeholder="+998 ..." />
    </Fold>
  );
};

export const TomorqaSection = ({ state, setField }) => {
  const p = { state, setField };
  return (
    <Fold title="Tomorqa tabi — hosil va chorvachilik">
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="harvestsPerYear" label="Yiliga hosil soni" />
        <Num {...p} k="gardenArea" label="Maydon (sotix)" />
      </div>
      <Txt {...p} k="cropName" label="Asosiy ekin nomi" placeholder="Kartoshka" />
      <div className="grid grid-cols-2 gap-3">
        <Num {...p} k="cropYieldKg" label="Hosil (kg)" />
        <Num {...p} k="cropPriceUzs" label="Narx (so'm/kg)" />
      </div>
      <p className="text-[10px] text-foreground/40">Daromad avtomatik hisoblanadi: hosil (kg) × narx (so'm/kg).</p>
      <div className="grid grid-cols-3 gap-3">
        <Num {...p} k="livestockCattle" label="Yirik shox (qoramol)" />
        <Num {...p} k="livestockSheep" label="Qo'y / echki" />
        <Num {...p} k="livestockPoultry" label="Parranda" />
      </div>
    </Fold>
  );
};
