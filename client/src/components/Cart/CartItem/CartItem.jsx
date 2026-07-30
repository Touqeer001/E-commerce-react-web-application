import "./CartItem.css";

import useCart from "../../../hooks/useCart";
import { getImageUrl } from "../../../utils/imageHelper";

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item">
      <img src={getImageUrl(item.image)} alt={item.name} />

      <div className="cart-info">
        <h3>{item.name}</h3>

        <p>
          Size :<strong>{item.size}</strong>
        </p>

        <p>
          Color :<strong>{item.color}</strong>
        </p>

        <h2>₹{item.price}</h2>
      </div>

      <div className="qty-box">
        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}>
          -
        </button>

        <span>{item.quantity}</span>

        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}>
          +
        </button>
      </div>

      <button className="remove-btn" onClick={() => removeItem(item.cartId)}>
        Remove
      </button>
    </div>
  );
};

export default CartItem;
