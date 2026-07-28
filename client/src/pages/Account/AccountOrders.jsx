import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import "./AccountOrder.css";
import { getOrdersByUser } from "../../Services/api";

const AccountOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await getOrdersByUser(1); // baad me user.id kar dena

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error(error);
    }
  };

  fetchOrders();
}, []);

  return (
    <AccountLayout title="My Orders">
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="No Orders"
            />

            <h2>No Orders Yet</h2>

            <p>Looks like you haven't placed any orders yet.</p>

            <Link to="/" className="shop-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const firstItem = order.items?.[0];

            return (
              <Link
                key={order.orderId}
                to={`/account/orders/${order.id}`}
                className="order-card"
              >
                <div className="order-product">
                  <img
                   src={order.image}
                    alt={firstItem?.name}
                    className="order-product-image"
                  />
                </div>

                <div className="order-left">
                  <h3>{order.name}</h3>

                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>

                  <p>
                    <strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Items:</strong> {order.quantity}
                  </p>
                </div>

                <div className="order-right">
                  <span className="order-status">
                    {order.payment_status}
                  </span>

                  <h3>₹{order.total}</h3>

                  <small>{order.paymentMethod}</small>
                </div>
                

              </Link>

            );
          })
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountOrders;