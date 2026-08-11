import api from "./api";

export const listOrders = () => api.get("/orders");
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status });
