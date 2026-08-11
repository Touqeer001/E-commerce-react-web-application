import { useEffect, useState } from "react";
import { listInventory } from "../services/inventoryService";
import { notifyError } from "../utils/notify";

export default function useInventory() {
  const [items, setItems] = useState([]);

  const load = () =>
    listInventory()
      .then((r) => setItems(r.data.data))
      .catch(notifyError);

  useEffect(() => {
    load();
  }, []);

  return { items, load };
}
