import axios from "axios";

const BASE_URL = "http://localhost:5000/wishlist";

export const getWishlist = () => axios.get(BASE_URL);
export const addToWishlist = (productId) => axios.post(BASE_URL, { productId });
export const removeWishlistItem = (wishlistId) => axios.delete(`${BASE_URL}/${wishlistId}`);
