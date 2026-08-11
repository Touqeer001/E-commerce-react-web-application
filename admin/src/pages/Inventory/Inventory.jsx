import useInventory from "../../hooks/useInventory";
import InventoryTable from "../../components/Inventory/InventoryTable";

export default function Inventory() {
  const { items } = useInventory();
  return (
    <>
      <h1>Inventory</h1>
      <InventoryTable items={items} />
    </>
  );
}
