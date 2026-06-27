// Mahalla kesimida to'liq ko'rsatkichlar jadvali. Qatorni bosish — filtr tanlash.
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { HEALTH } from "../mock/elektr.data";

const voltColor = (v) => (v < 200 ? "#ef4444" : v < 215 ? "#f59e0b" : "#10b981");

const num = (v) => (v == null ? "—" : v.toLocaleString("uz-UZ"));

const MahallaTable = ({ rows = [], selectedId, onSelect }) => {
  const columns = [
    {
      key: "label",
      header: "Ko'cha",
      render: (r) => (
        <span className={selectedId === r.id ? "font-semibold text-brand-yellow" : "font-medium"}>
          {r.label}
        </span>
      ),
    },
    {
      key: "load",
      header: "Yuklama",
      align: "right",
      render: (r) => (
        <span className="font-semibold tabular-nums" style={{ color: HEALTH[r.status].color }}>
          {r.load}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Holat",
      render: (r) => <GlassStatusBadge tone={HEALTH[r.status].tone}>{HEALTH[r.status].label}</GlassStatusBadge>,
    },
    { key: "transformers", header: "TP", align: "right", render: (r) => r.transformers },
    { key: "households", header: "Xonadon", align: "right", render: (r) => num(r.households) },
    {
      key: "voltage",
      header: "Kuchlanish",
      align: "right",
      render: (r) => (
        <span className="tabular-nums" style={{ color: voltColor(r.voltage) }}>{r.voltage} V</span>
      ),
    },
    { key: "askue", header: "ASKUE", align: "right", render: (r) => `${r.askue}%` },
    { key: "losses", header: "Yo'qotish", align: "right", render: (r) => `${r.losses}%` },
    { key: "consumption", header: "Iste'mol (MVt·soat)", align: "right", render: (r) => num(r.consumption) },
    { key: "solarHomes", header: "Quyoshli xonadon", align: "right", render: (r) => num(r.solarHomes) },
    { key: "outages", header: "Uzilish", align: "right", render: (r) => r.outages },
    { key: "mttr", header: "MTTR (daq)", align: "right", render: (r) => r.mttr },
  ];

  return (
    <DataTable
      variant="glass"
      columns={columns}
      rows={rows}
      getKey={(r) => r.id}
      onRowClick={(r) => onSelect?.(r.id === selectedId ? "" : r.id)}
    />
  );
};

export default MahallaTable;
