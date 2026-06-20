import { cn } from "@/shared/utils/cn";
import EmptyState from "@/shared/components/ui/table/EmptyState";

// Izchil jadval. columns: [{ key, header, render?(row), className?, align? }]
// variant="glass" -> dark/ice-aware (used inside surface cards via .glass-table).
const DataTable = ({
  columns = [],
  rows = [],
  isLoading = false,
  getKey,
  onRowClick,
  emptyText = "Ma'lumot yo'q",
  variant = "default",
  wrapperClassName = "",
}) => {
  if (!isLoading && rows.length === 0) return <EmptyState text={emptyText} />;

  const glass = variant === "glass";

  return (
    <div
      className={cn(
        "overflow-x-auto",
        glass ? "glass-table" : "border rounded-[2px] bg-white",
        wrapperClassName,
      )}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className={cn("border-b", glass ? "border-[rgb(var(--card-border))]" : "bg-zinc-50")}>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-3 py-2.5 font-medium text-left whitespace-nowrap",
                  glass ? "text-foreground/55" : "text-zinc-600",
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
                <tr key={i} className={cn("border-b", glass && "border-[rgb(var(--card-border))]")}>
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-3">
                      <div className={cn("h-4 rounded animate-pulse", glass ? "bg-foreground/10" : "bg-zinc-100")} />
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
                    glass && "border-[rgb(var(--card-border))]",
                    onRowClick && "cursor-pointer",
                    onRowClick && (glass ? "hover:bg-muted/50" : "hover:bg-zinc-50"),
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-3 py-3 whitespace-nowrap tabular-nums",
                        glass ? "text-foreground/85" : "text-zinc-800",
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
