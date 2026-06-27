// Ko'cha kesimida suyultirilgan gaz ko'rsatkichlari jadvali. Qatorni bosish — filtr tanlash.
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { formatMoney } from "@/shared/utils/formatMoney";

const STATUS = {
  yaxshi: { label: "Yaxshi", tone: "success", color: "#10b981" },
  "o'rta": { label: "O'rta", tone: "warning", color: "#f59e0b" },
  kritik: { label: "Kritik", tone: "danger", color: "#ef4444" },
};

const num = (v) => (v == null ? "—" : v.toLocaleString("uz-UZ"));

const StreetTable = ({ rows = [], selectedId, onSelect }) => {
  const columns = [
    {
      key: "label",
      header: "Ko'cha",
      render: (r) => (
        <span className={selectedId === r.id ? "font-semibold text-brand-cyan" : "font-medium"}>
          {r.label}
        </span>
      ),
    },
    {
      key: "fulfillment",
      header: "Talab qondirish",
      align: "right",
      render: (r) => (
        <span className="font-semibold tabular-nums" style={{ color: STATUS[r.status].color }}>
          {r.fulfillment}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Holat",
      render: (r) => <GlassStatusBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</GlassStatusBadge>,
    },
    { key: "households", header: "Xonadon", align: "right", render: (r) => num(r.households) },
    { key: "served", header: "Ulangan", align: "right", render: (r) => num(r.served) },
    { key: "demand", header: "Talab (ballon)", align: "right", render: (r) => num(r.demand) },
    { key: "delivered", header: "Yetkazildi", align: "right", render: (r) => num(r.delivered) },
    { key: "stock", header: "Ombor (ballon)", align: "right", render: (r) => num(r.stock) },
    { key: "debt", header: "Qarzdorlik", align: "right", render: (r) => formatMoney(r.debt) },
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

export default StreetTable;
