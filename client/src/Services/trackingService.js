import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/tracking`;
export const getOrderTracking = (orderId) => axios.get(`${BASE_URL}/${orderId}`);
