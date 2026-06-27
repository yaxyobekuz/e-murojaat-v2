// Ko'cha kesimida internet ko'rsatkichlari jadvali. Qatorni bosish — filtr tanlash.
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";

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
      key: "coverage",
      header: "Qamrov",
      align: "right",
      render: (r) => (
        <span className="font-semibold tabular-nums" style={{ color: STATUS[r.status].color }}>
          {r.coverage}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Holat",
      render: (r) => <GlassStatusBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</GlassStatusBadge>,
    },
    { key: "households", header: "Xonadon", align: "right", render: (r) => num(r.households) },
    { key: "covered", header: "Ulangan", align: "right", render: (r) => num(r.covered) },
    { key: "fiber", header: "Optik (FTTH)", align: "right", render: (r) => num(r.fiber) },
    { key: "speed", header: "Tezlik (Mbit/s)", align: "right", render: (r) => r.speed },
    { key: "uptime", header: "Uptime", align: "right", render: (r) => `${r.uptime}%` },
    { key: "complaints", header: "Shikoyat", align: "right", render: (r) => r.complaints },
    { key: "outages", header: "Uzilish", align: "right", render: (r) => r.outages },
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
