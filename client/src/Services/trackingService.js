import axios from "axios";

const BASE_URL = "http://localhost:5000/tracking";
export const getOrderTracking = (orderId) => axios.get(`${BASE_URL}/${orderId}`);
