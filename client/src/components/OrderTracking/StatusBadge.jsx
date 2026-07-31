import "./OrderTracking.css";

const STATUS_CLASS_NAMES = {
  Pending: "pending",
  Confirmed: "confirmed",
  Packed: "packed",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-badge--${STATUS_CLASS_NAMES[status] || "default"}`}>
    {status || "Status unavailable"}
  </span>
);

export default StatusBadge;
