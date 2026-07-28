import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import CartContext from "./CartContext";

import {
  getCart,
  addToCart as addCartAPI,
  updateCartQuantity,
  removeCartItem,
  clearCart as clearCartAPI,
} from "../services/cartService";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });

  // Loading when opening Cart Page
  const [pageLoading, setPageLoading] = useState(false);

  // Loading for Add / Remove / Update / Clear
  const [actionLoading, setActionLoading] = useState(false);
  const addToCartLockRef = useRef(null);

  // Fetch Cart
  const fetchCart = async () => {
    setPageLoading(true);

    try {
      const response = await getCart();

      setCart(response.data.data);
    } catch (err) {
      console.error(err);

      toast.error("Unable to load cart.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Add To Cart
  const addToCart = async (item) => {
    const lockKey = JSON.stringify(item);

    if (addToCartLockRef.current === lockKey) {
      return;
    }

    addToCartLockRef.current = lockKey;
    setActionLoading(true);

    try {
      const response = await addCartAPI(item);

      await fetchCart();

      toast.success(
        response?.data?.message || "Product added to cart."
      );
      return true;
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to add product."
      );
      return false;
    } finally {
      addToCartLockRef.current = null;
      setActionLoading(false);
    }
  };

  // Update Quantity
  const updateQuantity = async (cartId, quantity) => {
    setActionLoading(true);

    try {
      const response = await updateCartQuantity(cartId, quantity);

      await fetchCart();

      toast.success(
        response?.data?.message || "Quantity updated."
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to update quantity."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Item
  const removeItem = async (cartId) => {
    setActionLoading(true);

    try {
      const response = await removeCartItem(cartId);

      await fetchCart();

      toast.success(
        response?.data?.message || "Item removed."
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to remove item."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    setActionLoading(true);

    try {
      const response = await clearCartAPI();

      await fetchCart();

      toast.success(
        response?.data?.message || "Cart cleared."
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Failed to clear cart."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,

        pageLoading,
        actionLoading,

        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
