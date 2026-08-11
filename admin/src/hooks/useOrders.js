import { useEffect, useState } from "react";
import {
  listOrders,
  updateOrderStatus,
} from "../services/orderService";
import { notifyError, notifySuccess } from "../utils/notify";

export default function useOrders() {
  const [orders, setOrders] = useState([]);

  
  const load = () =>
    listOrders()
      .then((r) => setOrders(r.data.data))
      .catch(notifyError);

  useEffect(() => {
    load();
  }, []);

  const update = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      notifySuccess("Order updated");
      load();
    } catch (e) {
      notifyError(e);
    }
  };

  return { orders, load, update };
}
