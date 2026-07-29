import { useEffect, useState } from "react";
import api from "../services/api";
export default function Dashboard() {
  const [d, setD] = useState();
  useEffect(() => {
    api
      .get("/dashboard")
      .then((r) => setD(r.data))
      .catch(() => {});
  }, []);
  if (!d) return <div className="center">Loading dashboard…</div>;
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        {[
          ["Products", d.stats.products],
          ["Categories", d.stats.categories],
          ["Orders", d.stats.orders],
          ["Customers", d.stats.customers],
        ].map((x) => (
          <article key={x[0]}>
            <span>{x[0]}</span>
            <strong>{x[1]}</strong>
          </article>
        ))}
      </div>
      <div className="grid">
        <Table
          title="Recent orders"
          rows={d.recentOrders}
          cols={[
            ["id", "Order"],
            ["customer_name", "Customer"],
            ["total", "Total"],
            ["order_status", "Status"],
          ]}
        />
        <Table
          title="Low stock products"
          rows={d.lowStock}
          cols={[
            ["name", "Product"],
            ["category", "Category"],
            ["stock", "In stock"],
          ]}
        />
      </div>
    </>
  );
}
export function Table({ title, rows, cols }) {
  return (
    <article className="panel">
      <h2>{title}</h2>
      <div className="table">
        <table>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c[0]}>{c[1]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows.map((row, i) => (
                <tr key={row.id || i}>
                  {cols.map((c) => (
                    <td key={c[0]}>
                      {c[0] === "total" ? `₹${row[c[0]]}` : row[c[0]] || "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={cols.length}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </article>
  );
}
