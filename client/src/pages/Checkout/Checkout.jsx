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
  const [errors, setErrors] = useState({});

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

  const validateField = (name, value) => {
    const v = (value || "").trim();

    switch (name) {
      case "firstName":
        if (!v) return "First name is required.";
        if (v.length < 2) return "First name must be at least 2 characters.";
        return "";
      case "lastName":
        if (!v) return "Last name is required.";
        return "";
      case "email":
        if (!v) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return "Please enter a valid email address.";
        return "";
      case "phone":
        if (!v) return "Phone number is required.";
        if (!/^\+?[\d\s-]{7,15}$/.test(v))
          return "Please enter a valid phone number.";
        return "";
      case "city":
        if (!v) return "City is required.";
        return "";
      case "state":
        if (!v) return "State / Province is required.";
        return "";
      case "pincode":
        if (!v) return "Postal code is required.";
        if (!/^\d{4,10}$/.test(v))
          return "Please enter a valid postal code.";
        return "";
      case "country":
        if (!v) return "Country is required.";
        return "";
      default:
        return "";
    }
  };

  const validateAddress = (values) => {
    const fieldErrors = {};

    for (const key of Object.keys(values)) {
      const message = validateField(key, values[key]);
      if (message) fieldErrors[key] = message;
    }

    return fieldErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!(name in prev)) return prev;

      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const message = validateField(name, value);

    setErrors((prev) => {
      const next = { ...prev };

      if (message) {
        next[name] = message;
      } else {
        delete next[name];
      }

      return next;
    });
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
  const fieldErrors = validateAddress(address);

  if (Object.keys(fieldErrors).length > 0) {
    setErrors(fieldErrors);
    toast.error("Please complete all required delivery address fields.");

    const firstField = Object.keys(fieldErrors)[0];
    const firstInput = document.querySelector(`[name="${firstField}"]`);
    firstInput?.focus();
    return;
  }

  if (!instance) {
    toast.error("Payment UI is still loading.");
    return;
  }

  try {
    const { nonce } = await instance.requestPaymentMethod();

    const addressPayload = {
      first_name: address.firstName,
      last_name: address.lastName,
      email: address.email,
      phone: address.phone,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    };

    const paymentRes = await processPayment({
      nonce,
      amount: cart.total,
      address: addressPayload,
    });

    if (!paymentRes.data.success) {
      toast.error("Payment Failed");
      return;
    }

    // Save Address
    const addressRes = await saveAddress(addressPayload);

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

          <form className="address-form" noValidate>
            <div className="form-field">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={address.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.firstName ? "input-error" : ""}
                aria-invalid={Boolean(errors.firstName)}
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName}</span>
              )}
            </div>

            <div className="form-field">
              <input type="text" name="lastName" placeholder="Last Name" value={address.lastName}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.lastName ? "input-error" : ""}
                aria-invalid={Boolean(errors.lastName)} />
              {errors.lastName && (
                <span className="field-error">{errors.lastName}</span>
              )}
            </div>

            <div className="form-field">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={address.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.email ? "input-error" : ""}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>

            <div className="form-field">
              <input
                type="tel"
                placeholder="Phone Number"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.phone ? "input-error" : ""}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>



            <div className="form-field">
              <input type="text" name="city" placeholder="City" value={address.city}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.city ? "input-error" : ""}
                aria-invalid={Boolean(errors.city)} />
              {errors.city && (
                <span className="field-error">{errors.city}</span>
              )}
            </div>

            <div className="form-field">
              <input type="text" name="state" placeholder="State" value={address.state}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.state ? "input-error" : ""}
                aria-invalid={Boolean(errors.state)} />
              {errors.state && (
                <span className="field-error">{errors.state}</span>
              )}
            </div>

            <div className="form-field">
              <input type="text" name="pincode" placeholder="Pincode" value={address.pincode}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.pincode ? "input-error" : ""}
                aria-invalid={Boolean(errors.pincode)} />
              {errors.pincode && (
                <span className="field-error">{errors.pincode}</span>
              )}
            </div>

            <div className="form-field">
              <input type="text" name="country" placeholder="Country" value={address.country}
                onChange={handleChange} onBlur={handleBlur}
                className={errors.country ? "input-error" : ""}
                aria-invalid={Boolean(errors.country)} />
              {errors.country && (
                <span className="field-error">{errors.country}</span>
              )}
            </div>
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
