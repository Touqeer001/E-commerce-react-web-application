import { FaBox, FaCheckCircle, FaClipboardCheck, FaCreditCard, FaMapMarkerAlt, FaShippingFast, FaTruck } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useTracking from "../../hooks/useTracking";
import "./orderDetails.css";

const stepIcons = [FaClipboardCheck, FaBox, FaShippingFast, FaTruck, FaCheckCircle];

const formatDateTime = (value) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { tracking, trackingLoading, fetchTracking } = useTracking();

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const currentOrder = orders.find((item) => item.orderId === orderId);
    if (!currentOrder) { navigate("/account/orders"); return; }
    setOrder(currentOrder);
    fetchTracking(orderId).catch(() => toast.error("Unable to load tracking updates."));
  }, [orderId, navigate, fetchTracking]);

  const handleCancelOrder = () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = orders.map((item) => item.orderId === order.orderId ? { ...item, isCancelled: true, cancelledAt: new Date().toLocaleString() } : item);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrder(updatedOrders.find((item) => item.orderId === order.orderId));
    toast.success("Order cancelled successfully!");
  };

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
        <section className="card tracking-history"><h2>Tracking history</h2>{trackingLoading && <p>Loading tracking updates…</p>}{tracking?.history.slice().reverse().map((event) => <div className="history-event" key={event.status}><div className="history-dot" /><div><h3>{event.status}</h3><p>{event.location}</p><small>{formatDateTime(event.dateTime)} · {event.courierName}</small></div></div>)}</section>
        <section className="card"><h2><FaMapMarkerAlt /> Delivery address</h2><p>{order.address?.firstName} {order.address?.lastName}</p><p>{order.address?.street}</p><p>{order.address?.city}, {order.address?.state} {order.address?.pincode}</p><p>{order.address?.country}</p><p>{order.address?.phone}</p></section>
        <section className="card order-items"><h2>Order items</h2>{order.items.map((item) => <div className="product" key={item.cartId}><img src={item.image} alt={item.name} /><div className="product-info"><h3>{item.name}</h3><p>Size: {item.size || "—"} · Colour: {item.color || "—"}</p><p>Qty: {item.quantity}</p></div><strong>₹{item.price}</strong></div>)}</section>
        <section className="card"><h2><FaCreditCard /> Payment details</h2><p>Status: <span className="paid">{order.paymentStatus || "Paid"}</span></p><div className="price-row"><span>Subtotal</span><strong>₹{order.subtotal}</strong></div><div className="price-row"><span>Shipping</span><strong>₹{order.shipping}</strong></div><div className="price-row"><span>Tax</span><strong>₹{order.tax}</strong></div><hr /><div className="price-row total"><span>Total paid</span><strong>₹{order.total}</strong></div></section>
      </div>
      <div className="btns">{order.isCancelled ? <div className="cancel-order-message"><strong>Order cancelled</strong><p>Cancelled on {order.cancelledAt}</p></div> : <button onClick={handleCancelOrder} className="cancel-btn">Cancel order</button>}<button className="continue-btn" onClick={() => navigate("/")}>Continue shopping</button></div>
    </div>
  </main>;
};

export default OrderDetails;
