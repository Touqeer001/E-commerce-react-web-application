import axios from "axios";

const BASE_URL = "http://localhost:5000/wishlist";

export const getWishlist = () => axios.get(BASE_URL);
// Keep the exact product selected in the listing. The backend stores this mock
// payload today; a future SQL implementation can keep the same API contract.
export const addToWishlist = (product) => axios.post(BASE_URL, {
  productId: product.id,
  product,
});
export const removeWishlistItem = (wishlistId) => axios.delete(`${BASE_URL}/${wishlistId}`);
