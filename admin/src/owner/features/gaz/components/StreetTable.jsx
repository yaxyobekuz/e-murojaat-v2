// Ko'chalar reyestri jadvali — qatorni bosish tafsilot modalini ochadi.
import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { SUPPLY, STATUS } from "../mock/gaz.data";

const dash = (v) => (v == null ? "—" : v);
const num = (v) => (v == null ? "—" : v.toLocaleString("uz-UZ"));

const StreetTable = ({ rows = [], isLoading, onRowClick }) => {
  const columns = [
    { key: "name", header: "Ko'cha", render: (r) => <span className="font-medium">{r.name}</span> },
    {
      key: "supplyType", header: "Ta'minot",
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px]">
          <span className="size-2.5 rounded-sm" style={{ background: SUPPLY[r.supplyType].color }} /> {SUPPLY[r.supplyType].label}
        </span>
      ),
    },
    { key: "status", header: "Holat", render: (r) => <GlassStatusBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</GlassStatusBadge> },
    { key: "households", header: "Xonadon", align: "right", render: (r) => num(r.households) },
    { key: "cylindersPerMonth", header: "Oylik balon", align: "right", render: (r) => num(r.cylindersPerMonth) },
    { key: "coveragePct", header: "Ta'minot %", align: "right", render: (r) => (r.coveragePct == null ? "—" : `${r.coveragePct}%`) },
    { key: "deliveryCycleDays", header: "O'rt. davr", align: "right", render: (r) => (r.deliveryCycleDays ? `${r.deliveryCycleDays} kun` : "—") },
    { key: "longestGapDays", header: "Eng uzoq uzilish", align: "right", render: (r) => (r.longestGapDays ? `${r.longestGapDays} kun` : "—") },
    { key: "gasifiedPct", header: "Gazlashtirish %", align: "right", render: (r) => `${r.gasifiedPct}%` },
    { key: "openIncidents", header: "Ochiq muammo", align: "right", render: (r) => dash(r.openIncidents) },
    { key: "uptimePct", header: "Uptime %", align: "right", render: (r) => (r.uptimePct == null ? "—" : `${r.uptimePct}%`) },
  ];

  return (
    <DataTable variant="glass" columns={columns} rows={rows} isLoading={isLoading} getKey={(r) => r.id} onRowClick={onRowClick} emptyText="Ko'cha topilmadi" />
  );
};

export default StreetTable;
