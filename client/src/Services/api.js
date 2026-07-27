import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});


// 👇 NEW MockAPI instance
const mockApi = axios.create({
  baseURL: "https://6a61ddf0da10c59c1809ef61.mockapi.io",
});


export const getAllProducts = () => mockApi.get("/products");

export const getProductById = (id) => mockApi.get(`/products/${id}`);
// Local mock-backend fallback used by features (such as Wishlist) that store
// product IDs through the same backend data flow as Cart.
export const getLocalProductById = (id) => api.get(`/products/${id}`);

export const getAllBanners = () => mockApi.get("/banners");
export const getAllCategories = () => mockApi.get("/categories");

export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");

export const getOrders = () => api.get("/orders");
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

export const getClientToken = () => api.get("/payment/token");

export const processPayment = ({ nonce, amount }) =>
  api.post("/payment/checkout", {
    nonce,
    amount,
  }) 

  //Search
  export const searchProducts = (query) =>
  api.get(`/search?q=${query}`);


export const API_BASE_URL = BASE_URL;

export default api;
