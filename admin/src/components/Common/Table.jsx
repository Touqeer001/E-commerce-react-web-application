import EmptyState from "./EmptyState";
import "./Common.css";

export default function Table({
  title,
  columns,
  rows,
  renderRow,
  emptyText = "No records found.",
}) {
  const hasRows = rows?.length > 0;
  return (
    <article className="panel">
      {title && <h2>{title}</h2>}
      <div className="table">
        <table>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasRows ? (
              renderRow ? (
                rows.map((row) => renderRow(row))
              ) : (
                rows.map((row, i) => (
                  <tr key={row.id || i}>
                    {columns.map((c) => (
                      <td key={c.key}>
                        {c.render
                          ? c.render(row)
                          : c.key === "total"
                            ? `₹${row[c.key]}`
                            : row[c.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))
              )
            ) : (
              <EmptyState colSpan={columns.length}>{emptyText}</EmptyState>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
