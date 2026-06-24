// Arizalar jadvali — qatorni bosish tafsilot modalini ochadi.
import { Star } from "lucide-react";

import DataTable from "@/shared/components/ui/table/DataTable";
import GlassStatusBadge from "@/shared/components/ui/glass/GlassStatusBadge";
import { formatDateUz } from "@/shared/utils/formatDate";
import { CAT, STATUS, GENDER } from "../mock/msk.data";

const CategoryChip = ({ catKey }) => {
  const c = CAT[catKey];
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px]">
      <span className="size-2.5 rounded-sm" style={{ background: c.color }} />
      {c.label}
    </span>
  );
};

const AppealsTable = ({ rows = [], isLoading, onRowClick }) => {
  const columns = [
    { key: "appealNumber", header: "Ariza №", render: (r) => <span className="font-mono text-xs text-foreground/70">{r.appealNumber}</span> },
    { key: "createdAt", header: "Sana", render: (r) => formatDateUz(r.createdAt) },
    { key: "category", header: "Xizmat", render: (r) => <CategoryChip catKey={r.category} /> },
    {
      key: "applicant",
      header: "Arizachi",
      render: (r) => (
        <div className="leading-tight">
          <div className="font-medium">{r.applicant.name}</div>
          <div className="text-[11px] text-foreground/45">{GENDER[r.applicant.gender]} · {r.applicant.age} yosh</div>
        </div>
      ),
    },
    { key: "address", header: "Manzil", render: (r) => <span className="text-foreground/70">{r.address.street}, {r.address.house}</span> },
    { key: "worker", header: "Mas'ul xodim", render: (r) => r.assignedWorker?.name || <span className="text-foreground/35">—</span> },
    { key: "status", header: "Holat", render: (r) => <GlassStatusBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</GlassStatusBadge> },
    {
      key: "deadline",
      header: "Ijro muddati",
      render: (r) =>
        r.deadline ? (
          <span className={r.status === "kechikkan" ? "font-medium text-rose-500" : "text-foreground/70"}>{formatDateUz(r.deadline)}</span>
        ) : <span className="text-foreground/35">—</span>,
    },
    {
      key: "rating",
      header: "Baho",
      align: "right",
      render: (r) =>
        r.rating ? (
          <span className="inline-flex items-center gap-1 tabular-nums"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {r.rating}</span>
        ) : <span className="text-foreground/35">—</span>,
    },
  ];

  return (
    <DataTable
      variant="glass"
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      getKey={(r) => r.id}
      onRowClick={onRowClick}
      emptyText="Ariza topilmadi"
    />
  );
};

export default AppealsTable;
