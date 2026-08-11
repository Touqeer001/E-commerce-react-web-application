import Table from "../Common/Table";

const COLUMNS = [
  { key: "id", label: "Order" },
  { key: "customer_name", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "order_status", label: "Status" },
];

export default function RecentOrders({ orders }) {
  return <Table title="Recent orders" columns={COLUMNS} rows={orders} />;
}
