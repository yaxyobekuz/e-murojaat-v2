// Xodimlar samaradorligi reytingi jadvali.
import { Star } from "lucide-react";

import DataTable from "@/shared/components/ui/table/DataTable";
import { GENDER } from "../mock/msk.data";

const WorkerTable = ({ rows = [] }) => {
  const columns = [
    {
      key: "name",
      header: "Xodim",
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{r.name}</span>
          <span className="rounded-full bg-foreground/8 px-1.5 py-0.5 text-[10px] text-foreground/50">{GENDER[r.gender]}</span>
        </div>
      ),
    },
    { key: "specialties", header: "Yo'nalish", render: (r) => <span className="text-foreground/70">{r.specialties}</span> },
    { key: "assigned", header: "Tayinlangan", align: "right", render: (r) => r.assigned },
    { key: "done", header: "Bajarilgan", align: "right", render: (r) => <span className="font-medium text-emerald-500">{r.done}</span> },
    { key: "avgH", header: "O'rt. vaqt", align: "right", render: (r) => (r.avgH ? `${r.avgH} soat` : "—") },
    {
      key: "avgRating",
      header: "Baho",
      align: "right",
      render: (r) => (
        r.avgRating ? (
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> {r.avgRating}
          </span>
        ) : "—"
      ),
    },
    {
      key: "slaPct",
      header: "SLA",
      align: "right",
      render: (r) => <span style={{ color: r.slaPct >= 75 ? "#10b981" : r.slaPct >= 50 ? "#f59e0b" : "#ef4444" }}>{r.slaPct}%</span>,
    },
  ];

  return <DataTable variant="glass" columns={columns} rows={rows} getKey={(r) => r.id} emptyText="Xodim topilmadi" />;
};

export default WorkerTable;
