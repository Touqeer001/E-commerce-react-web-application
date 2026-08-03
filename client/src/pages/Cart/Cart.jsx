import "./Cart.css";

import useCart from "../../hooks/useCart";

import CartItem from "../../components/Cart/CartItem/CartItem";
import CartSummary from "../../components/Cart/CartSummary/CartSummary";
import EmptyCart from "../../components/Cart/EmptyCart/EmptyCart";
import Loader from "../../components/Loader/Loader";

const Cart = () => {

  const { cart, pageLoading } = useCart();

 if (pageLoading) {
  return <Loader />;
}

  if (!cart.items.length) {
    return <EmptyCart />;
  }

  return (

    <div className="cart-page">

      <div className="cart-left">

        <h2 className="cart-title">
          Shopping Cart
        </h2>

        {cart.items.map(item => (

          <CartItem
            key={item.cartId}
            item={item}
          />

        ))}

      </div>

      <div className="cart-right">

        <CartSummary />

      </div>

    </div>

  );

};

export default Cart;