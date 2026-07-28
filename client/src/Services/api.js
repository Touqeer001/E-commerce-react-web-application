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


export const getAllProducts = () => api.get("/products");

export const getProductById = (id) => api.get(`/products/${id}`);

export const getAllBanners = () => api.get("/banners");
export const getAllCategories = () => mockApi.get("/categories");

export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");
export const getLocalProductById = (id) => api.get(`/products/${id}`);

export const getOrders = () => api.get("/orders");

export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

export const saveAddress = (data) =>
  api.post("/address", data);

export const createOrder = (data) =>
  api.post("/orders", data);

export const getClientToken = () => api.get("/payment/token");

export const processPayment = ({ nonce, amount }) =>
  api.post("/payment/checkout", {
    nonce,
    amount,
  }) 

  //Search
  export const searchProducts = (query) =>
  api.get(`/search?q=${query}`);

  export const getOrdersByUser = (userId) =>
  api.get(`/orders/user/${userId}`);

export const API_BASE_URL = BASE_URL;

export default api;
