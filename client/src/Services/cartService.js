import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/cart`;
const DUPLICATE_POST_WINDOW = 1200;
const addToCartRequests = new Map();

const getCartItemKey = (cartItem) => {
  return [
    cartItem.productId,
    cartItem.quantity,
    cartItem.size || "",
    cartItem.color || "",
  ].join("|");
};

// Get Cart
export const getCart = () => {
  return axios.get(BASE_URL);
};

// Add To Cart
export const addToCart = (cartItem) => {
  const requestKey = getCartItemKey(cartItem);
  const existingRequest = addToCartRequests.get(requestKey);
  const now = Date.now();

  if (existingRequest && now - existingRequest.startedAt < DUPLICATE_POST_WINDOW) {
    return existingRequest.promise;
  }

  const promise = axios.post(BASE_URL, cartItem).finally(() => {
    setTimeout(() => {
      const latestRequest = addToCartRequests.get(requestKey);

      if (latestRequest?.promise === promise) {
        addToCartRequests.delete(requestKey);
      }
    }, DUPLICATE_POST_WINDOW);
  });

  addToCartRequests.set(requestKey, {
    promise,
    startedAt: now,
  });

  return promise;
};

// Update Quantity
export const updateCartQuantity = (cartId, quantity) => {
  return axios.put(`${BASE_URL}/${cartId}`, {
    quantity,
  });
};

// Remove Item
export const removeCartItem = (cartId) => {
  return axios.delete(`${BASE_URL}/${cartId}`);
};

// Clear Cart
export const clearCart = () => {
  return axios.delete(BASE_URL);
};
