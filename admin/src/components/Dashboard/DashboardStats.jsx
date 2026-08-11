import DashboardCards from "./DashboardCards";

const STAT_DEFS = [
  { label: "Products", key: "products" },
  { label: "Categories", key: "categories" },
  { label: "Orders", key: "orders" },
  { label: "Customers", key: "customers" },
];

export default function DashboardStats({ stats }) {
  const items = STAT_DEFS.map((d) => ({
    label: d.label,
    value: stats[d.key],
  }));
  return <DashboardCards items={items} />;
}
