import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import OrderTimeline from "./OrderTimeline";
import StatusBadge from "./StatusBadge";
import { getTimelineSteps } from "./trackingConfig";
import "./OrderTracking.css";

const OrderTracking = ({ status }) => {
  const steps = getTimelineSteps(status);
  const statusIndex = steps.indexOf(status);
  const progress = statusIndex < 0 ? 0 : Math.round(((statusIndex + 1) / steps.length) * 100);
  const isDelivered = status === "Delivered";
  const isCancelled = status === "Cancelled";

  return (
    <section className="order-tracking-card" aria-label="Order tracking">
      <div className="order-tracking-card__heading">
        <div>
          <p className="order-tracking-card__eyebrow">Order tracking</p>
          <h2>Current Status</h2>
        </div>
        <StatusBadge status={status} />
      </div>

      {(isDelivered || isCancelled) && (
        <div className={`order-tracking-message order-tracking-message--${isCancelled ? "cancelled" : "delivered"}`}>
          {isCancelled ? <FaTimesCircle /> : <FaCheckCircle />}
          <span>{isCancelled ? "Order Cancelled" : "Order Delivered Successfully"}</span>
        </div>
      )}

      <div className="order-tracking-progress" aria-label={`Estimated progress: ${progress}%`}>
        <div className="order-tracking-progress__labels">
          <span>Estimated Progress</span>
          <strong>{progress}%</strong>
        </div>
        <div className="order-tracking-progress__bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <OrderTimeline status={status} />
    </section>
  );
};

export default OrderTracking;
