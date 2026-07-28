import { FaBox, FaCheckCircle, FaClipboardCheck, FaCreditCard, FaMapMarkerAlt, FaShippingFast, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useTracking from "../../hooks/useTracking";
import "./orderDetails.css";
import { getOrderById } from "../../Services/api";

const stepIcons = [FaClipboardCheck, FaBox, FaShippingFast, FaTruck, FaCheckCircle];

const formatDateTime = (value) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { tracking, trackingLoading, fetchTracking } = useTracking();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);

        if (!res.data.success) {
          navigate("/account/orders");
          return;
        }

        setOrder({
          ...res.data.order,
          items: res.data.items,
        });

        fetchTracking(orderId).catch(() =>
          toast.error("Unable to load tracking updates.")
        );
      } catch (error) {
        console.error(error);
        navigate("/account/orders");
      }
    };

    fetchOrder();
  }, [orderId, navigate, fetchTracking]);



  if (!order) return null;

  return <main className="order-details-page">
    <div className="order-container">
      <header className="tracking-order-header">
        <div><p>Order #{order.orderId}</p><h1>{tracking?.currentStatus || "Preparing your order"}</h1><span>{tracking?.estimatedDelivery || "Fetching delivery estimate…"}</span></div>
        <button onClick={() => navigate("/account/orders")}>Back to orders</button>
      </header>

      <section className="tracking-card" aria-busy={trackingLoading}>
        <div className="tracking-meta"><div><span>Courier</span><strong>{tracking?.courierName || "Loading…"}</strong></div><div><span>Tracking ID</span><strong>{tracking?.trackingId || "Loading…"}</strong></div></div>
        <div className="tracking-progress">{tracking?.steps.map((step, index) => { const Icon = stepIcons[index]; return <div className={`tracking-step ${step.completed ? "complete" : ""}`} key={step.status}><div className="step-marker"><Icon /></div><p>{step.status}</p></div>; })}</div>
      </section>

      <div className="order-grid">
        <section className="card tracking-history">
          <h2>Tracking history</h2>
          {trackingLoading && <p>Loading tracking updates…</p>}
          {tracking?.history.slice().reverse().map((event) => <div className="history-event" key={event.status}>
          <div className="history-dot" />
          <div><h3>{event.status}</h3>
          <p>{event.location}</p>
          <small>{formatDateTime(event.dateTime)} · {event.courierName}</small>
          </div></div>)}</section>

        <section className="card"><h2><FaMapMarkerAlt /> Delivery address</h2><p>{order.first_name}{order.last_name}</p><p>{order.address?.street}</p><p>{order.city}, {order.state} {order.pincode}</p><p>{order.country}</p><p>{order.phone}</p></section>
        <section className="card order-items"><h2>Order items</h2>{order.items.map((item) => <div className="product" key={item.id}><img src={item.image} alt={item.name} /><div className="product-info"><h3>{item.name}</h3><h3>Size: {item.sizes || "—"} ·</h3><p>Qty: {item.quantity}</p></div><strong>₹{item.price}</strong></div>)}</section>
        <section className="card"><h2><FaCreditCard /> Payment details</h2><p>Status: <span className="paid">{order.paymentStatus || "Paid"}</span></p><div className="price-row"><span>Subtotal</span><strong>₹{order.subtotal}</strong></div><div className="price-row"><span>Shipping</span><strong>₹{order.shipping}</strong></div><div className="price-row"><span>Tax</span><strong>₹{order.tax}</strong></div><hr /><div className="price-row total"><span>Total paid</span><strong>₹{order.total}</strong></div></section>
      </div>
    </div>
  </main>;
};

export default OrderDetails;
