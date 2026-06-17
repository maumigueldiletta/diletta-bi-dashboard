import { cn } from "@/lib/utils";

export function DataTable({ columns, rows, highlightRow }: {
  columns: { key: string; label: string; align?: "left" | "right" | "center"; width?: string }[];
  rows: any[];
  highlightRow?: (row: any) => boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-diletta-line bg-diletta-bg2">
      <table className="w-full text-sm">
        <thead className="bg-diletta-bg3 text-xs uppercase tracking-widest text-diletta-text3">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-4 py-3 font-semibold",
                  c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                )}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-t border-diletta-line",
                highlightRow?.(row) && "bg-diletta-red/5"
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "px-4 py-3 text-diletta-text1",
                    c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                  )}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
