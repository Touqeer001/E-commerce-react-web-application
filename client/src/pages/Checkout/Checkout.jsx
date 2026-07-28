// import { Link } from "react-router-dom";
import { FaCheckCircle, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import "./Checkout.css";
import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";
import { createOrder, getClientToken, processPayment, saveAddress } from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  

  const [address, setAddress] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
});

  // const addressRes = saveAddress({
  //   user_id: user.id,
  //   first_name: address.firstName,
  //   last_name: address.lastName,
  //   email: address.email,
  //   phone: address.phone,
  //   city: address.city,
  //   state: address.state,
  //   pincode: address.pincode,
  //   country: address.country,
  // });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const dropinContainer = useRef(null);
  useEffect(() => {
    const loadToken = async () => {
      const res = await getClientToken();
      setClientToken(res.data.clientToken);
    };

    loadToken();
  }, []);

  useEffect(() => {
    console.log("Client Token:", clientToken);
    if (!clientToken || !dropinContainer.current) return;

    let dropinInstance;

    dropin.create(
      {
        authorization: clientToken,
        container: dropinContainer.current,
      },
      (error, createdInstance) => {
        if (error) {
          console.error(error);
          return;
        }

        dropinInstance = createdInstance;
        setInstance(createdInstance);
      },
    );

    return () => {
      if (dropinInstance) {
        dropinInstance.teardown();
      }
    };
  }, [clientToken]);



  const handlePayment = async () => {
  if (!instance) {
    toast.error("Payment UI is still loading.");
    return;
  }

  try {
    const { nonce } = await instance.requestPaymentMethod();

    const paymentRes = await processPayment({
      nonce,
      amount: cart.total,
    });

    if (!paymentRes.data.success) {
      toast.error("Payment Failed");
      return;
    }

    // Save Address
    const addressRes = await saveAddress({
      user_id:1, 
      first_name: address.firstName,
      last_name: address.lastName,
      email: address.email,
      phone: address.phone,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    });

    // Create Order
    const orderRes = await createOrder({
      user_id: 1,
      address_id: addressRes.data.addressId,
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
      payment_status: "Paid",
      order_status: "Paid",
      items: cart.items,
    });


    // Clear Cart
  

    toast.success("Order Placed Successfully");

   navigate(`/order-success/${orderRes.data.orderId}`);
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};
  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <span>
          <FaCheckCircle />
          Logged in
        </span>
        <h1>Checkout</h1>
        <p>
          Welcome {user?.name || "there"}, your account is ready for the next
          step.
        </p>
      </section>

      <section className="checkout-grid">
        <div className="checkout-section">
          <h2>
            <FaMapMarkerAlt />
            Delivery Address
          </h2>

          <form className="address-form">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={address.firstName}
              onChange={handleChange}
            />

            <input type="text" name="lastName" placeholder="Last Name" value={address.lastName}
              onChange={handleChange} />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={address.email}
              onChange={handleChange}
            />

            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
            />



            <input type="text" name="city" placeholder="City" value={address.city}
              onChange={handleChange} />

            <input type="text" name="state" placeholder="State" value={address.state}
              onChange={handleChange} />

            <input type="text" name="pincode" placeholder="Pincode" value={address.pincode}
              onChange={handleChange} />

            <input type="text" name="country" placeholder="Country" value={address.country}
              onChange={handleChange} />
          </form>
        </div>

        <div className="checkout-section">
          <aside className="checkout-summary">
            <h2>Order total</h2>
            <div>
              <span>Subtotal</span>
              <strong>₹{cart.subtotal}</strong>
            </div>
            <div>
              <span>Tax</span>
              <strong>₹{cart.tax}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>₹{cart.shipping}</strong>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <strong>₹{cart.total}</strong>
            </div>
          </aside>
          <h2>
            <FaCreditCard />
            Payment
          </h2>
          <div ref={dropinContainer}></div>

          <button
            className="place-order-btn"
            onClick={handlePayment}
            disabled={!instance}
          >
            Place Order
          </button>
        </div>


      </section>
    </main>
  );
};

export default Checkout;
