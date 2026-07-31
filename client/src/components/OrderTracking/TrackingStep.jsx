import { FaBoxOpen, FaCheck, FaClipboardCheck, FaTruck, FaWarehouse } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";

const icons = {
  Pending: FaClipboardCheck,
  Confirmed: FaCheck,
  Packed: FaBoxOpen,
  Shipped: MdLocalShipping,
  Delivered: FaTruck,
  Cancelled: FaWarehouse,
};

const TrackingStep = ({ status, state, isLast }) => {
  const Icon = icons[status] || FaClipboardCheck;

  return (
    <li className={`order-tracking-step order-tracking-step--${state}`}>
      <div className="order-tracking-step__rail" aria-hidden="true" />
      <div className="order-tracking-step__icon" aria-hidden="true">
        <Icon />
      </div>
      <div className="order-tracking-step__content">
        <strong>{status}</strong>
        {state === "current" && <span>Current status</span>}
        {state === "complete" && <span>Completed</span>}
      </div>
      {!isLast && <div className="order-tracking-step__connector" aria-hidden="true" />}
    </li>
  );
};

export default TrackingStep;
