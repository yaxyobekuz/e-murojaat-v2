import { cn } from "@/shared/utils/cn";
import EmptyState from "@/shared/components/ui/table/EmptyState";

// Izchil jadval. columns: [{ key, header, render?(row), className?, align? }]
const DataTable = ({
  columns = [],
  rows = [],
  isLoading = false,
  getKey,
  onRowClick,
  emptyText = "Ma'lumot yo'q",
}) => {
  if (!isLoading && rows.length === 0) return <EmptyState text={emptyText} />;

  return (
    <div className="overflow-x-auto border rounded-[2px] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-zinc-50">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-3 py-2.5 font-medium text-zinc-600 text-left whitespace-nowrap",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-3">
                      <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row, i) => (
                <tr
                  key={getKey ? getKey(row, i) : row._id || row.id || i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-b last:border-0 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-zinc-50",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-3 py-3 text-zinc-800 whitespace-nowrap tabular-nums",
                        c.align === "right" && "text-right",
                        c.align === "center" && "text-center",
                        c.cellClassName,
                      )}
                    >
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
