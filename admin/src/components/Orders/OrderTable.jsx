import Table from "../Common/Table";
import OrderRow from "./OrderRow";
import "./Orders.css";

const COLUMNS = [
  { key: "id", label: "Order" },
  { key: "customer_name", label: "Customer" },
  { key: "total", label: "Total" },
  { key: "order_status", label: "Status" },
];

export default function OrderTable({ orders, onStatusChange }) {
  return (
    <Table
      title="Orders"
      columns={COLUMNS}
      rows={orders}
      renderRow={(order) => (
        <OrderRow
          key={order.id}
          order={order}
          onStatusChange={onStatusChange}
        />
      )}
    />
  );
}
