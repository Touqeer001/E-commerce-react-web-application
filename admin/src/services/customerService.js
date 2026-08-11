import api from "./api";

export const listCustomers = () => api.get("/customers");
