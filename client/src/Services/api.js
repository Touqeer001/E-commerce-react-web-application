import axios from "axios";
import { getToken, clearToken } from "./tokenService";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();

      const url = error.config?.url || "";

      if (!url.includes("/auth/me")) {
        const isLoginPage = window.location.pathname === "/login";

        if (!isLoginPage) {
          const currentPath =
            window.location.pathname + window.location.search;
          window.location.assign(
            `/login?redirect=${encodeURIComponent(currentPath)}`
          );
        }
      }
    }

    return Promise.reject(error);
  }
);


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

export const processPayment = ({ nonce, amount, address }) =>
  api.post("/payment/checkout", {
    nonce,
    amount,
    address,
  }) 

  //Search
  export const searchProducts = (query) =>
  api.get(`/search?q=${query}`);

  export const getOrdersByUser = () =>
  api.get(`/orders/user/me`);

export const API_BASE_URL = BASE_URL;

export default api;
