import { useEffect, useState } from "react";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../Services/api";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);

        if (res.data.success) {
          setOrder(res.data.order);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (!order) return null;

  return (
    <main className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon">
          <FaCheckCircle />
        </div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for shopping with TinyThreads.
        </p>

        <div className="order-summary">
          <div className="summary-row">
            <span>Order ID</span>
            <strong>{order.id}</strong>
          </div>

          <div className="summary-row">
            <span>Order Date</span>
            <strong>
              {new Date(order.created_at).toLocaleDateString()}
            </strong>
          </div>

          <div className="summary-row">
            <span>Payment Status</span>
            <strong className="paid">
              {order.payment_status}
            </strong>
          </div>
        </div>

        <div className="delivery-box">
          <FaTruck className="truck-icon" />

          <div>
            <h3>Estimated Delivery</h3>
            <p>3 - 5 Business Days</p>
          </div>
        </div>

        <p className="confirmation-text">
          You will receive an email confirmation shortly.
        </p>

        <button
          className="primary-btn"
          onClick={() =>
            navigate(`/account/orders/${order.id}`)
          }
        >
          View Order Details
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/products")}
        >
          Continue Shopping
        </button>
      </div>
    </main>
  );
};

export default OrderSuccess;