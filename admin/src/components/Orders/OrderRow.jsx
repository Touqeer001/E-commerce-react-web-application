const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrderRow({ order, onStatusChange }) {
  return (
    <tr>
      <td>{order.id}</td>
      <td>{order.customer_name}</td>
      <td>₹{order.total}</td>
      <td>
        <select
          className="order-status-select"
          aria-label={`Update status for order ${order.id}`}
          value={order.order_status || "Pending"}
          onChange={(event) => onStatusChange(order.id, event.target.value)}
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
