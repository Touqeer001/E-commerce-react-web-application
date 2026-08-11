import { useEffect, useState } from "react";
import { listCustomers } from "../services/customerService";
import { notifyError } from "../utils/notify";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);

  const load = () =>
    listCustomers()
      .then((r) => setCustomers(r.data.data))
      .catch(notifyError);

  useEffect(() => {
    load();
  }, []);

  return { customers, load };
}
