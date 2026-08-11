import api from "./api";

export const listInventory = () => api.get("/products");
