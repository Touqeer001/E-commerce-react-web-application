import { toast } from "react-toastify";

export const notifyError = (e) =>
  toast.error(e.response?.data?.message || "Request failed");

export const notifySuccess = (message) => toast.success(message);
