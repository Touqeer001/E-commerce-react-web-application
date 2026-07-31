import { FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderTracking from "../../components/OrderTracking/OrderTracking";
import { getOrderById } from "../../Services/api";
import "./orderDetails.css";

const REFRESH_INTERVAL = 30000;

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrder = useCallback(async ({ redirectOnError = false } = {}) => {
    try {
      const response = await getOrderById(orderId);
      if (!response.data.success) throw new Error("Order not found");
      setOrder({ ...response.data.order, items: response.data.items || [] });
    } catch {
      if (redirectOnError) navigate("/account/orders", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate, orderId]);

  useEffect(() => {
    fetchOrder({ redirectOnError: true });
    const refresh = () => fetchOrder();
    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
    };
  }, [fetchOrder]);

  if (loading) return <main className="order-details-page" />;
  if (!order) return null;

  return (
    <main className="order-details-page">
      <div className="order-container">
        <header className="tracking-order-header">
          <div>
            <p>Order #{order.id}</p>
            <h1>Your order details</h1>
          </div>
          <button onClick={() => navigate("/account/orders")}>Back to orders</button>
        </header>

        <OrderTracking status={order.order_status} />

        <div className="order-grid">
          <section className="card order-items">
            <h2>Order items</h2>
            {order.items.map((item) => (
              <div className="product" key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>Size: {item.sizes || "—"}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <strong>₹{item.price}</strong>
              </div>
            ))}
          </section>

          <section className="card">
            <h2><FaMapMarkerAlt /> Delivery address</h2>
            <p>{[order.first_name, order.last_name].filter(Boolean).join(" ")}</p>
            <p>{order.city}, {order.state} {order.pincode}</p>
            <p>{order.country}</p>
            <p>{order.phone}</p>
          </section>

          <section className="card">
            <h2><FaCreditCard /> Payment details</h2>
            <p>Status: <span className="paid">{order.payment_status || "Paid"}</span></p>
            <div className="price-row"><span>Subtotal</span><strong>₹{order.subtotal}</strong></div>
            <div className="price-row"><span>Shipping</span><strong>₹{order.shipping}</strong></div>
            <div className="price-row"><span>Tax</span><strong>₹{order.tax}</strong></div>
            <hr />
            <div className="price-row total"><span>Total paid</span><strong>₹{order.total}</strong></div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
